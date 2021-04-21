const fs = require('fs')
const JSON5 = require('json5')
const { Client } = require('tlg')

var configString = fs.readFileSync("./config.json5", "utf8")
var config = JSON5.parse(configString)

var client
initClient(client)

async function initClient(client) {
	var client = new Client({
		apiId: config.telegram.apiId, 
		apiHash: config.telegram.apiHash
	})
	await client.connect('user', config.telegram.phone)
	// return client
}

module.exports.telclient = client
module.exports.telsend = async function main(client, baseDescription) {

	try {
		
		await client.sendMessage(config.telegram.chatId, `${config.ru.subject} ${config.ru.body} ${baseDescription}`)
        // var chats = await client.getChats()
		// for (chatid of chats.chat_ids) {
			
		// 	chat = await client.getChat(chatid)
		// 	console.log(chat.id, chat.title)
		// }
        // console.log(chats)
		// await client.close()
		client.on('__updateMessageSendSucceeded',  console.log("Сообщение в телеграм отправлено."))
	} catch(e) {
		console.error('ERROR', e)
	}
}
