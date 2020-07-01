const express = require('express')
const bodyParser = require("body-parser")
const model = require("./model")

// Инициализируем "God object".
model.init()

const app = express()
var JSONparser = bodyParser.json()

// Обрабатывает запросы от серверов 1С.
app.post('/', JSONparser, (req, res) => {
  model.handleRequest(req.body)
  res.status(200)
})

// Отправляет тестовое письмо.
app.post('/mailtest', JSONparser, (req, res) => {
  model.sendAlert({description: "Это просто тест"})
  res.status(200)
})

// Возвращает отладочную информацию в формате JSON.
app.get('/getState', function (req, res) {
  var state = model.serializeState() 
  res.send(state)
})

// Проверка работы, возвращающая код 200.
app.get('/healthcheck', function (req, res) { 
  res.status(200)
})

app.listen(8080)

// Запускаем обработчик ожидания
model.startSchedule()