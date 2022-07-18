const urlModel=require("../models/urlModel")

const createURL=async(req,res)=>{
    try{
        let data=req.body;
        
    }catch(error){
        return res.status(500).send({ status: false,message: error.message})
    }
}

module.exports={createURL}