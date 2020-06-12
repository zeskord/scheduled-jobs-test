const fs = require('fs')
const nodemailer = require("nodemailer")

var configString = fs.readFileSync("./config.json", "utf8")
var config = JSON.parse(configString)
var transporter = nodemailer.createTransport(config.mail)

transporter.sendMail({
    from: config.emailFrom,
    to: config.emailRecepients,
    subject: "Тест",
    html: `<p>Тест отправки почты</p>`,

}, function (baseData) {
    console.log(baseData)
    console.log("Тут надо зарегистрировать, что сообщение было отправлено, чтобы повторно не отправлять")
})
