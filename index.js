const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_mangement_system");

const express = require("express");
const app = express();


//for user routes
const userRoute = require('./routes/userRouter');

app.use('/',userRoute);

//for admin routes
const adminRoute = require('./routes/adminRoute');

app.use('/admin',adminRoute);




app.listen(3000,()=>console.log("Click here to go to the login page: http://localhost:3000"))

