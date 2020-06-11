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
//    inactive - база уже не шлет уведомления, о чем уже было отправлено письмо.
model.bases = new Map()

// Инициализация.
model.init = function () {
    // Сначала просто читаем файл в объект.
    var configString = fs.readFileSync("./config.json", "utf8")
    this.config = JSON.parse(configString)
    // При инициализации программы запишем в массив базе текущие даты. Как будто в момент инициализации поступил запрос.
    // Если база лежит, то предупреждение возникнет через время таймаута.
    var currentDate = new Date()
    // А потом заполняем ассоциативный массив баз, чтобы легче искать было при запросах.
    var rightBases = this.config.bases
    for (var baseInfo of rightBases) {
        model.bases.set(rightBases.id, {
            description: baseInfo.description,
            lastRequestTime: currentDate, // инициализация, всё-таки.
            inactive: false // сначала все базы рабочие.
        })
    }

    // Транспортер для почты
    model.transporter = nodemailer.createTransport(model.config.mail)

}

// Обрабатываем пингующий запрос.
model.handleRequest = function (body) {
    var baseData = this.bases.get(body.baseId)
    console.log(baseData)
    // Если найдена зарегистрированная база.
    if (baseData !== undefined) {
        var lastRequestTime = baseData.lastRequestTime
        var currentDate = new Date()
        // Если дата последнего зарпоса не инициализирована, то при первом обращении ставим текущую.
        if (lastRequestTime === undefined) {
            baseData.lastRequestTime = currentDate
            this.bases.set(body.baseId, baseData)
        }
        // Регистрируем запрос.
        baseData.lastRequestTime = currentDate
        baseData.inactive = false
        this.bases.set(body.baseId, baseData)
        console.log("Зарегистирован запрос")
    } else {
        // База не зарегистрирована, но шлет регламентные запросы. Какого хрена? В следующей версии.
        console.log("Запрос из незарегистрированной базы")
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

// Периодическая проверка отвалившихся баз.
model.checkTimeOut = function () {
    for (var [baseId, baseData] of model.bases) {
        var lastRequestTime = baseData.lastRequestTime
        var currentDate = new Date()
        // Если дата последнего зарпоса не инициализирована, то при первом обращении ставим текущую.
        if (lastRequestTime === undefined) {
            baseData.lastRequestTime = currentDate
            this.bases.set(baseId, baseData)
        }
        // А это уже проверка на таймаут.
        if (currentDate - lastRequestTime > model.config.timeOut) {
            console.log("Есть таймаут")
            // Проверим, может база уже давно висит, и мы уже отправляли по ней уведомление.
            if (!baseData.inactive) {
                // Регистрируем ошибку.
                this.sendAlert(baseData)
                // А после регистрации ошибки отмечаем, что по этой базе письмо уже было отправлено.
                baseData.inactive = true
                this.basyes.set(baseId, baseData)
            }
        }
    }
}

// Запускаем регламентное задание.
model.startSchedule = function () {
    setInterval(this.checkTimeOut, this.config.timeOut)
}

module.exports = model