const fs = require('fs')
const JSON5 = require('json5')
const { Client } = require('tlg')

var configString = fs.readFileSync("./config.json5", "utf8")
var config = JSON5.parse(configString)

// main()

var send = async function main(baseDescription) {
	const client = new Client({
		apiId: config.telegram.apiId, 
		apiHash: config.telegram.apiHash
	})

	try {
		await client.connect('user', config.telegram.phone)
		await client.sendMessage(config.telegram.chatId, `${model.config.ru.subject} ${model.config.ru.body} ${baseDescription}`)
        // var chats = await client.getChats()
		// for (chatid of chats.chat_ids) {
			
		// 	chat = await client.getChat(chatid)
		// 	console.log(chat.id, chat.title)
		// }
        // console.log(chats)
		// await client.close()
		client.on('__updateMessageSendSucceeded', client.close)
	} catch(e) {
		console.error('ERROR', e)
	}
}

module.exports = send