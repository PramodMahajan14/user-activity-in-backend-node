const mongoose = require("mongoose");
 mongoose.connect(process.env.DB_CONNECT,{
     useNewUrlParser:true,
     useCreateIndex:true,
     useUnifiedTopology:true,
     useFindAndModify:false
 }).then(()=>{
     console.log("success");
 }).catch((err)=>{
     console.log("no connection");
 });