//This file check user is genuine,if user is  not genuine ,them will be show unauthorized pages
const jwt = require("jsonwebtoken");
const userregister = require("../model/schema");
 
const auth = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.Token_KEY);
        const user =  await userregister.findOne({_id:verifyUser._id});
          req.token = token; //logout
          req.user = user; // for logout
         next();

    }catch(err){
        res.status(401).send(err)
    }
}
module.exports = auth;