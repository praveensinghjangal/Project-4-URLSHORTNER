const urlModel=require("../models/urlModel")
const shortId=require("shortid")
const validURL=require("valid-url");


function isValid(value) {
    if (typeof value === "undefined" || typeof value === "null") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  }
function isValidBody(body) {return Object.keys(body).length > 0}

const createURL=async(req,res)=>{
    try{
        let {longUrl}=req.body;
//----------------------------VALIDATION STARTS------------------------//
        
//---------------------------------------------------------------------//
        const urlCode=shortId.generate()
        const baseurl="http://localhost:3000";
        const shortUrl=`${baseurl}/${urlCode}`
        let result=new urlModel({longUrl,shortUrl,urlCode})
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
        
        return res.status(200).send({status:true,data:result})
    }catch(error){
        return res.status(500).send({ status: false,message: error.message})
    }
}

module.exports={createURL,getByID}