const express = require('express')
const bodyParser = require("body-parser")
const model = require("./model")

model.init()

const app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/', urlencodedParser, (req, res) => {
  model.handleRequest(req.body)
  res.send("OK")
})

app.listen(8080)

// Запускаем обработчик ожидания
model.startSchedule()