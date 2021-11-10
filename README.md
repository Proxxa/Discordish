# Discordish

A terrible Node.JS wrapper for the Discord API.

## Creating a Bot
Creating a bot is simple. The following snippet will create a bot and connect to Discord, given you replace the text "`Your token here`" with your bot's token.
```js
const { Client } = require("discordish")
const client = new Client()
client.login("Your token here")
```
Creating a simple "Ping/Pong" bot is easy.

```js
const { Client } = require("discordish")
const client = new Client()

client.on("ready", () => {
    console.log("Bot is ready!") // Send a message to the console when the bot connects
})

client.on("message", message => {
    if (message.content.toLowerCase().startsWith("ping"))
        message.channel.send("Pong!") // If the message starts with "Ping" capitalized any way, send a message saying "Pong!"
})

client.login("Bot Token")
```


## Contributions

Feel free to make a PR, I'll probably forget about this in no time, though.
