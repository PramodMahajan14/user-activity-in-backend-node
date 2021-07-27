const express = require('express')
const path = require('path');
const User = require('../src/model/schema');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken');
const auth = require("../src/middleware/auth")

router.get('/',(req,res)=>{
  
  res.render('home',{user:"Login"});
});

router.get('/homesecret',auth,(req,res)=>{
  
      res.render('homesecret',{user:auth.name});
 });
//logout implimation
router.get("/logout",auth, async(req,res)=>{
     try{
    // logout for single device                                            // =>  |
           //  req.user.tokens = req.user.tokens.filter((currentElement)=>{ //    |This operation perform ,
           // return currentElement.token !== req.token;                    //    | particular device logout
            // });                                                           // =>|
    // logout for all device
    req.user.tokens = [];
           res.clearCookie("jwt");
//console.log("logourt successfully");
          await req.user.save();
          res.render("login")                
      }catch(err){
         res.status(500).send(err);
  }
})

router.get('/registration',(req,res)=>{
  res.render('registration');
});

router.get('/login',(req,res)=>{
  res.render('login');
});
router.post('/registration',async(req,res)=>{
  try{
    const password = req.body.password;
    const cpassword = req.body.confirmpass;
    if(password ===cpassword){
     const userdata = new User({
       name:req.body.username,
       email:req.body.email,
       phone:req.body.phone,
       gender:req.body.gender,
       password:req.body.password,
       confirmpassword:cpassword
     });
     
     const token = await userdata.generateAuthToken();   //this midleware to generate token
     
     res.cookie("jwt",token,{                     // create cookies
       expires:new Date(Date.now() + 70000),
       httpOnly:true
     });
 
     const result = await userdata.save();
   
     res.render("login");
    }else{
      res.send("password is not same")
    }

  }catch(err){
    res.send("sorry");
  }
});
  
router.post('/login',async(req,res)=>{
 try{
 const email = req.body.email;
 const pass = req.body.password;
 const result = await User.findOne({email:email});
 //applying hashing algorithm for security purpose

 const ismatch = await bcrypt.compare(pass,result.password);
 
 const token = await result.generateAuthToken(); 
 // create cookies
 res.cookie("jwt",token,{                                      
  expires:new Date(Date.now() + 60000),
  httpOnly:true                      
});
 
 if(ismatch ){
   res.render("home",{user:result.name});
 }else{
   res.send("invalid user")
 }
 }catch(err){
   res.send(err);
 }
});




module.exports = router;