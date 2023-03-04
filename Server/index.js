const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const DbConnection = require('./Database/conn');
require('dotenv').config();

const userRoute= require('./router/route')
const app =express();
app.use(express.json())
app.use(morgan())


app.use('/api',userRoute)

app.get('/',(req,res)=>{
    res.send("hello")
})


DbConnection();
app.listen(process.env.PORT || 5000 ,()=>{
    console.log("server is running")
})