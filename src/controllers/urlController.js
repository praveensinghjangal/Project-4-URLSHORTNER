const urlModel=require("../models/urlModel")
const shortId=require("shortid")
const redis = require("redis");

// Here we create radis server and connect to radis cach memory to use cashing in this code.
const { promisify } = require("util");
const {REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, SERVER_URL} = process.env

const redisClient = redis.createClient(
    REDIS_PORT,
    REDIS_HOST,
    { no_ready_check: true }
);
redisClient.auth(REDIS_PASSWORD, function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});


const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const rexURL = /^(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)$/
const coderegex =/^[A-Za-z0-9 _\-]{7,14}$/

function isValid(value) {
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  }

const createURL=async(req,res)=>{
    try{

        let {longUrl,...rest}=req.body;
        
//-----------------------------VALIDATION STARTS------------------------------//
        if(Object.keys(rest).length>0)return res.status(400).send({ status: false,message:"Invalid attributes"})        
        if(!isValid(longUrl))return res.status(400).send({ status: false,message:"long url should be present"})  
        if(!longUrl.match(rexURL))return res.status(400).send({ status: false,message:"URL not a Valid "})  
        const checkURL=await urlModel.findOne({longUrl}).select({__v:0,_id:0})
        if (checkURL) {
            return res.status(200).send({ status: true, msg: "Data already exists in DB", urlDetails: checkURL})
        }
//--------------------------------------------------------------------------------// 
        const urlCode=shortId.generate().toLowerCase()
        const baseURL= SERVER_URL
        const shortUrl=`${baseURL}/${urlCode}`
        const result={longUrl,shortUrl,urlCode} 
        const newResult=await urlModel.create(result)
        const data = {longUrl:newResult.longUrl,shortUrl:newResult.shortUrl,urlCode:newResult.urlCode}

        return res.status(201).send({ status: true,data: data})
    }catch(error){
        return res.status(500).send({ status: false,message: error.message})
    }
}

const getByID=async(req,res)=>{
    try{
        let urlCode=req.params.urlCode;
        if(!urlCode.match(coderegex)) return res.status(400).send({status :false , message : " Invalid urlcode "})
        let cahcedProfileData = await GET_ASYNC(`${urlCode}`)
        let parseData = JSON.parse(cahcedProfileData)
        if(cahcedProfileData){ return res.status(302).redirect(parseData.longUrl)
        }else{
            const result=await urlModel.findOne({urlCode})
            if(!result)return res.status(404).send({status:false,message:" urlcode Not Found"})  
            await SET_ASYNC(`${urlCode}`,JSON.stringify(result))
            return res.status(302).redirect(result.longUrl)
        }}
    catch(error){
        return res.status(500).send({ status: false,message: error.message})
    }
}

module.exports={createURL,getByID}
