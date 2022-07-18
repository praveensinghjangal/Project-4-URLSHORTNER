const urlModel=require("../models/urlModel")
const shortId=require("shortid")
const validURL=require("valid-url");


function isValid(value) {
    if (typeof value === "undefined" || typeof value === "null") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  }

const createURL=async(req,res)=>{
    try{
        let {longUrl}=req.body;
//----------------------------VALIDATION STARTS------------------------//
        if(!isValid(longUrl))return res.status(400).send({ status: false,message:"Please provide URL"})  
        if(!validURL.isUri(longUrl))return res.status(400).send({ status: false,message:`URL is not a Valid URL`}) 
        const checkURL=await urlModel.findOne({longUrl}).select({__v:0,_id:0})
        if(checkURL)return res.status(200).send({ status: true, data :checkURL}) 
//---------------------------------------------------------------------//
        const urlCode=shortId.generate().toLowerCase()
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
        const result=await urlModel.findOne({urlCode}).select({longUrl:1,_id:0})
        if(!result)return res.status(404).send({status:false,message:"Not Found"})  
        return res.status(302).redirect(result.longUrl)
    }catch(error){
        return res.status(500).send({ status: false,message: error.message})
    }
}

module.exports={createURL,getByID}