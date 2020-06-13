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

app.post('/mailtest', urlencodedParser, (req, res) => {
  model.sendAlert({description: "Это просто тест"})
  res.send("OK")
})

app.get('/getState', function (req, res) {
  var state = model.serializeState() 
  res.send(state)
})

app.listen(8080)

// Запускаем обработчик ожидания
model.startSchedule()