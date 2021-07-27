
const mongoose= require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const schemauser = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email id alredy exist"],
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid mail");
            }
        }
    },
    phone:{
        type:Number,
        min:10,
        
        required:true,
        unique:true
    },
   gender:{
        type:String,
        required:true,
        enum:['male','female']
    },
    password:{
        required:true,
        type:String
    },
    confirmpassword:{ required:true,
        type:String},
        tokens:[{
            token:{
                type:String,
                require:true
            }
        }]
})
//generating token for Authentication purpose =>jsonwebtoken
schemauser.methods.generateAuthToken= async function(){
   try{                                           //#++++++++++++++++++++++++++++++++++++++# =>token
    const token= jwt.sign({_id:this._id.toString()},process.env.Token_KEY);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;

   }catch(err){
       res.send(err)
   }
}
//applying hashing algorithm for security purpose=>bcryptjs
schemauser.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword =await bcrypt.hash(this.confirmpassword,10);
    }
    next();
})

const User = new mongoose.model("User",schemauser);
module.exports = User;
