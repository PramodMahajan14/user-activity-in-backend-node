const path = require("path");
require('dotenv').config({path:path.join(__dirname,'../.env')});
const express = require("express");
const app = express();
const route = require('../Routes/rout')
const port = process.env.PORT || 8081;
const hbs = require("hbs");
const cookieparser = require("cookie-parser");
const User = require("./model/schema");
require("./db/conn");



//app.use(express.static(path.join(__dirname, '../public')));
app.use('/scss',express.static(path.join(__dirname,'../public/scss')));
app.set('view engine','hbs');
app.use(cookieparser());

hbs.registerPartials(path.join(__dirname,"../views/props"))
app.set('views',path.join(__dirname,'../views'))


app.use(express.urlencoded({extended:false}));
app.use('/',route);





app.listen(port,()=>console.log(`server is runing ${process.env.PORT}`));