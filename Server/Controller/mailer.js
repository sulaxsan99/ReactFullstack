const nodemailer = require('nodemailer')
require('dotenv').config();
const Mailgen = require('mailgen');

// create reusable transporter object using the default SMTP transport
let nodeconfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user:process.env.email, // generated ethereal user
        pass: process.env.password, // generated ethereal password
    },
};

let transporter = nodemailer.createTransport(nodeconfig)

let mailgenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

const registerMail = async (req, res) => {
    const { username, useremail, text, subject } = req.body;

    var email = {
        body: {
            name: username,
            intro: text || 'welcome to my college  there will your future will so exited',
            outro: 'jhv jrgirg he wjrhgbrwgrwgew heg ehew grwf gr g',
        }
    }

    var emailBody = mailgenerator.generate(email)

    let message = {
        from: process.env.email,
        to: useremail,
        subject: subject || "signup successfull ",
        html: emailBody
    }

    transporter.sendMail(message)
        .then(() => {
            res.status(200).send({ msg: "you should receive an email form us" })
        })
        .catch(error => res.status(400).send({error:error,msg:"not send"}))
}

module.exports = { registerMail }