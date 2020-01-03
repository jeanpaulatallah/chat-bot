'use strict'

const express = require('express')
const bodyParser = require ('body-parser')
const request = require('request')

const bot = express()

//Set the PORT
bot.set('port', (process.env.PORT || 5000))

//Process Data
bot.use(bodyParser.urlencoded({extended: false}))
bot.use(bodyParser.json())

//Routes (Here used in order to check if i have succesfully wrote to the server)
bot.get('/', function(req, res) {
    res.send("Hi, I am a chatbot")
    
})

//Facebook Route

bot.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === "jeanpaul") {
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

// App goes to fb, receives and send back messages
bot.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) { //lets the bot goes through every message sent if sent fast.
        let event = messaging_events[i]
        let sender = event.sender.id // retrieve sebder id
        if (event.message && event.message.text) {
            let text = event.message.text

            if (text.includes("Hello "))
            sendText(sender, "Hello " )

            if (text.includes("Help"))
            sendText(sender, "Kindly contact us at atallahjeanpaul@gmail.com")

        }
    }
    res.sendStatus(200)
})
//Identify Token.
let token = "EAAlu4mDoXgwBALHta1vgV2EFzzHnnY7D53Cu7Np5tjeGbU87JIauPZAb9v2nlSiA00a0kZB2NPCER0idsjwHaaa6HZBEb97UBMNJHBuHgG8r0FZAgB4iPVGNbV7ufIK01qqSwbwyz0ltOBIHWsNxjH7tIbTRmTQM3lXexaa0GVEiJaigtb2sG5ZA7YzpSlRwZD"


function sendText(sender, text) {
    let messageData = {text: text}
    request({
        url: "https://graph.facebook.com/v5.0/205970396239421/conversations/",
        qs : {access_token : token },
        method: "POST",
        json: {
            receipient: {id: sender},
            message : messageData,
        }
    }, function(error, response, body) { //check if there's an error
        if (error) {
            console.log("sending error")
        } else if (response.body.error) {
            console.log("response body error")
        }
    })
}
//Start listening to start the server
bot.listen(bot.get('port'), function() {
    console.log("running: port")
})