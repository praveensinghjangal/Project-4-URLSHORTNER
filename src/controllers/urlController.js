const urlModel=require("../models/urlModel")
const shortId=require("shortid")


const rexURL = /(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)/
const coderegex =/^[A-Za-z0-9]{7,14}$/

function isValid(value) {
    if (typeof value === "undefined" || typeof value === "null") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  }

const createURL=async(req,res)=>{
    try{

        let {longUrl,...rest}=req.body;
//--------------------------------VALIDATION STARTS-----------------------------//
        if(Object.keys(rest).length>0)return res.status(400).send({ status: false,message:"Invalid attributes"})        
        if(!isValid(longUrl))return res.status(400).send({ status: false,message:"long url should be present"})  
        if(!longUrl.match(rexURL))return res.status(400).send({ status: false,message:"URL not a Valid "})  
        const checkURL=await urlModel.findOne({longUrl}).select({__v:0,_id:0})
        if(checkURL)return res.status(200).send({ status: true, data :checkURL}) 
//------------------------------------------------------------------------------//
        const urlCode=shortId.generate().toLowerCase()
        const checkShortURl=await urlModel.findOne({urlCode})
        if(checkShortURl)return res.status(400).send({ status: false,message:"short URl already taken"})
        const baseURL="http://localhost:3000/"
        const shortUrl=`${baseURL}${urlCode}`
        let result={longUrl,shortUrl,urlCode} 
        const newResult=await urlModel.create(result)
        return res.status(201).send({ status: true,data: newResult})
    }catch(error){
        return res.status(500).send({ status: false,message: error.message})
    }
}

const getByID=async(req,res)=>{
    try{
        let urlCode=req.params.urlCode;
        if(!urlCode.match(coderegex)) return res.status(400).send({status :false , message : " Invalid urlcode "})
        const result=await urlModel.findOne({urlCode}).select({longUrl:1,_id:0})
        if(!result)return res.status(404).send({status:false,message:" urlcode Not Found"})  
        return res.status(302).redirect(result.longUrl)
    }catch(error){
        return res.status(500).send({ status: false,message: error.message})
    }
}

module.exports={createURL,getByID}