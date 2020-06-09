// В этом файле логика программы
const fs = require('fs')
const nodemailer = require("nodemailer")

const model = {}

// Настройки программы
model.config = {}

// Ключ соответствия - идентификатор информационной базы.
// Значение - объект
//    description - текстовое представление базы
//    lastRequestTime - время последнего запроса
model.bases = new Map()

// Инициализация.
model.init = function () {
    // Сначала просто читаем файл в объект.
    var configString = fs.readFileSync("./config.json", "utf8")
    this.config = JSON.parse(configString)
    // А потом заполняем ассоциативный массив баз, чтобы легче искать было при запросах.
    var rightBases = this.config.bases
    for (var baseInfo of rightBases) {
        model.bases.set(rightBases.id, {
            description: baseInfo.description
        })
    }

    // Транспортер для почты
    model.transporter = nodemailer.createTransport(model.config.mail)

}

// Обрабатываем пингующий запрос.
model.handleRequest = function (body) {
    var baseData = this.bases.get(body.baseId)
    if (baseData !== undefined) {
        var lastRequestTime = baseData.lastRequestTime
        var currentDate = new Date()
        // Если дата последнего зарпоса не инициализирована, то при первом обращении ставим текущую.
        if (lastRequestTime === undefined) {
            baseData.lastRequestTime = currentDate
            this.bases.set(body.baseId, baseData)
        }
        // А это уже проверка на таймаут.
        if (currentDate - lastRequestTime > model.config.timeOut) {
            // Регистрируем ошибку.
            this.sendAlert(baseData)
        } else {
            // Регистрируем запрос.
            baseData.lastRequestTime = currentDate
            this.bases.set(body.baseId, baseData)
        }
    } else {
        // База не зарегистрирована, но шлет регламентные запросы. Какого хрена? В следующей версии.

    }
}

// Обработка превышения допустимого таймаута опредленной базой.
model.sendAlert = function (baseData) {

    this.transporter.sendMail({
        from: model.config.emailFrom,
        to: model.config.emailRecepients,
        subject: "Возможно, сломались регламентные задания 1С",
        html: `<p>Да, уже давно не подает сигналов база ${baseData.description}</p>`,

    }, function (baseData) {
        console.log(baseData)
        console.log("Тут надо зарегистрировать, что сообщение было отправлено, чтобы повторно не отправлять")
    })

}

module.exports = model