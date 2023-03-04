// http://localhost:5000/api/user/register
const CryptoJS = require('crypto-js');
const User = require('../Model/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const otp=require('otp-generator')

/** middleware for verify user */
async function VerifyUser(req,res,next) {

    try {
        const { username } = req.method == "GET" ? req.query:req.body ;
        let exist = await User.findOne({ username });
        if (!exist) return res.status(400).send({ error: "Can't find User!" });
        next();

    } catch (error) {
        return res.status(400).send({ error: "Authentication Error"});
    }
}


async function Register(req, res) {

    try {
        const { username, password, profile, email } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) res.send("Username  is already tehere")

        const existingemail = await User.findOne({ email });
        if (existingemail) res.status(400).send("User email is already tehere")

        var ciphertext = CryptoJS.AES.encrypt(password, process.env.SEC_KEY).toString();
        const newuser = new User({
            username: username,
            password: ciphertext,
            profile: profile,
            email: email
        })
        const savedUser = await newuser.save();
        if (savedUser) res.status(200).send("User registred successfully")

    } catch (error) {
        console.log(error)
        // return res.status(400).send({ error })
    }

}
async function Login(req, res) {
    try {

        const { username, password } = req.body;
        const checkUsername = await User.findOne({ username})
        // const checkPassword = await User.find({ password })
        if (checkUsername) {
            var bytes = CryptoJS.AES.decrypt(checkUsername.password, process.env.SEC_KEY);
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            if (password == decryptedData) {
                const Token = jwt.sign({ id: checkUsername._id }, process.env.SEC_KEY, { expiresIn: "24h" })

                res.status(200).send({ msg: "login successful",user:checkUsername, "accessToken": Token })
            } else {
                res.status(400).send({ err: "wrong password " })
            }
        } else {
            res.status(400).send({ err: "wrong username" })
        }
    } catch (error) {
        console.log(error)
    }
}


/** GET: http://localhost:8080/api/user/example123 */
async function getUser(req, res) {

    try {
        const { username } = req.params;
        console.log(username)
        const finduser = await User.findOne({ username });
    
        if (finduser) {
            const { password, ...rest } = Object.assign({}, finduser.toJSON());
            return res.status(201).send(rest);
        } res.status(400).send({ err: "username not find" })
    } catch (error) {
        console.log(error)
        res.status(400).send({err:"username not find"})
    }

}


async function UpdateUser(req, res){
    try {
        // const id = req.query.id;
const {id }=req.user;
        if (id) {
            const body = req.body;
            console.log(body.profile)
             const updateuser= await User.findByIdAndUpdate({_id:id},{
                
            profile:body.profile
                
             })
             res.status(200).send({updateuser:updateuser,"message":"user data updated successfully"})
          
        }else{
            res.status(400).send({ err: "user id not found" })

        }
    } catch (error) {
     console.log(error)
    }
}

async function GenerateOTP(req,res){

    req.app.locals.OTP = await otp.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets: false, });
res.status(200).send({code: req.app.locals.OTP})

}
async function VerifyOTP(req,res) {
    const {code} =req.query;
    if(parseInt(  req.app.locals.OTP)=== parseInt(code)){
        req.app.locals.OTP=null;//resetotp value
        req.app.locals.resetSession=true;//verifu start sesion 
        return res.status(200).send({msg:"verify successfully "})
    }return res.status(400).send({error:"invalid otp"})
}
async function createResetSession(req,res){
    if(req.app.locals.resetSession){
         return res.status(201).send({ flag : req.app.locals.resetSession})
    }
    return res.status(440).send({error : "Session expired!"})
 }


async function resetPassword(req, res) {
    if (!req.app.locals.resetSession) return res.status(400).send({ error: "Session expired!" });

    try {
        const { username, password } = req.body
        const resetPass = await User.findOne({username})
        if (!resetPass) return res.status(400).send("username not find")
        
        var ciphertext = CryptoJS.AES.encrypt(password, process.env.SEC_KEY).toString();
        if (resetPass) {
            const resetPassWord = await User.updateOne({username:resetPass.username},{ password: ciphertext });
            req.app.locals.resetSession = false; // reset session
            if (resetPassWord) return res.status(200).send("pssword updated successfully")
        }return res.status(400).send("password updated failed")


    } catch (error) {
        res.status(400).send(error)
    }

 }
module.exports = { Register, Login, getUser,UpdateUser,VerifyUser,GenerateOTP,VerifyOTP,VerifyOTP ,createResetSession,resetPassword}