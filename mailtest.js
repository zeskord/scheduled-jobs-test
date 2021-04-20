const fs = require('fs')
const JSON5 = require('json5')
const nodemailer = require("nodemailer")

var configString = fs.readFileSync("./config.json5", "utf8")
var config = JSON5.parse(configString)
var transporter = nodemailer.createTransport(config.mail.mailconfig)

transporter.sendMail({
    from: config.mail.emailFrom,
    to: config.mail.emailRecepients,
    subject: "Тест",
    html: `<p>Тест отправки почты</p>`,

}, function (baseData) {
    console.log(baseData)
    console.log("Сообщение не было отправлено из-за ошибки.")
})
