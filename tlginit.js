const fs = require('fs')
const JSON5 = require('json5')
const { Client } = require('tlg')

var configString = fs.readFileSync("./config.json5", "utf8")
var config = JSON5.parse(configString)

main()

async function main() {
	const client = new Client({
		apiId: config.telegram.apiId, 
		apiHash: config.telegram.apiHash
	})

	try {
		await client.connect('user', config.telegram.phone)
        // console.log(config.telegram.chatId)
		// await client.sendMessage(-503357490, 'Test')
        await client.sendMessage(config.telegram.chatId, 'Test')
        
        // var chats = await client.getChats()
		// for (chatid of chats.chat_ids) {
			
		// 	chat = await client.getChat(chatid)
		// 	console.log(chat.id, chat.title)
        //     console.log(typeof chat.id)
		// }
        // console.log(chats)
		// await client.close()
		
        
        client.on('__updateMessageSendSucceeded', client.close)
	} catch(e) {
		console.error('ERROR', e)
	}
}