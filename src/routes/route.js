const express = require("express");
const router=express.Router();

const urlController=require("../controllers/urlController");

router.post("/url/shorten",urlController.createURL);

router.get("/:urlCode",urlController.getByID);

router.all("/*",(req,res)=>{
    return res.status(404).send({status:false,message:"Url not found"})
});


module.exports=router