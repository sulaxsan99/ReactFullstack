const jwt = require('jsonwebtoken')
require('dotenv').config()

//auth middle ware
async function Auth(req, res, next) {
    try {
        //access authoraized header
        const valid = req.headers.authorization.split(" ")[1];
        //retrive the user deatail to the loggedin user
        const decodedtoken = await jwt.verify(valid, process.env.SEC_KEY)
        req.user = decodedtoken;
        // res.json(decodedtoken)
        //
        next()
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

function localVaribale(req,res,next) {
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next();
}

module.exports = { Auth,localVaribale }