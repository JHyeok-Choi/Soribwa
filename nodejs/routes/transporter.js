const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'naver',  // service name
    host: 'smtp.naver.com',  // SMTP server name
    port: 465, // SMTP port
    auth: {
        user: process.env.NAVER_USER,  // naver id
        pass: process.env.NAVER_PASS   // naver gen pass
    },
})

module.exports = transporter