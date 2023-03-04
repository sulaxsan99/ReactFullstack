const express = require('express');
const User = require('../Model/user')
const router = express.Router();
const jwt = require('jsonwebtoken')
const { Register, Login, getUser, UpdateUser,VerifyUser ,GenerateOTP,VerifyOTP,createResetSession,resetPassword} = require('../Controller/appController')
const {Auth,  localVaribale} = require('../middleware/auth');
const {registerMail}= require('../Controller/mailer')
require('dotenv').config();
//get method
// router.route('/').get((req, res) => {
//     res.send("helo i am get metthod")
// })
router.route('/user/:username')
    .get(getUser)
router.route('/generateOtp')
    .get(VerifyUser,localVaribale,GenerateOTP)
router.route('/verifyOtp')
    .get(VerifyUser,VerifyOTP)
router.route('/createResetSession')
    .get(createResetSession)

//post method
router.route('/register')
    .post(Register)

router.route('/registerMail')
    .post(registerMail)
router.route('/authenticate')
    .post(VerifyUser,(req,res)=>res.end())//authenticate user
router.route('/login')
    .post(VerifyUser,Login)



//put method
router.route('/updateuser').put(Auth,UpdateUser )
router.route('/resetPassword').put(VerifyUser,resetPassword)

module.exports = router