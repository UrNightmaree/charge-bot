local jsext = require "jsext"
local to_jsarray,to_jsobject = jsext.to_jsarray,jsext.to_jsobject

require 'dotenv'.config()
local Eris = require "eris"

local client = New(Eris,process.env.TOKEN,to_jsobject{
	intents = to_jsarray{"guildMessages"}
})


client:on("ready",function()
	print("Bot Ready!")
	print("Logged in as "..client.user.username.."#"..client.user.discriminator)
end)

client:connect()
