const express = require("express");
const router=express.Router();

const urlController=require("../controllers/urlController");

router.post("/url/shorten",urlController.createURL);

router.get("/:urlCode",urlController.getByID);

router.all("/*",(req,res)=>{
    return res.status(400).send({status:false,message:"Please Enter correct URL"})
});


module.exports=router