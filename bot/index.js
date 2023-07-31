require('dotenv').config();

const { Client } = require('discord.js');
const express = require('express')
var bodyParser = require('body-parser');


const PORT = parseInt(process.env.PORT)
const CHANNEL_ID = process.env.CHANNEL_ID // discord server channel id
const CLIENT = new Client()
var gitChannel;



const EXPRESS = express()
EXPRESS.use(bodyParser.urlencoded({
    extended: true
}));
EXPRESS.use(bodyParser.json());

CLIENT.login(process.env.CLIENT_TOKEN)



CLIENT.once('ready', () => {
    console.log(`Logged in as ${CLIENT.user.tag}`);
    gitChannel = CLIENT.channels.cache.get(CHANNEL_ID);

    // log
    EXPRESS.use((req, res, next) => {
        var date
        if(req.body.data.datetime) {
            date = new Date(req.body.data.datetime + "Z").toLocaleString('en-AU', {timeZone: 'Australia/Adelaide'});
            req.body.data.date = date;
        }
        console.log(`Recieved request time: ${date}`);
        if(req.body.data) {
            console.log(req.body.data);
            next();
        } else {
            res.sendStatus(400)
        }
    })


    // setup query handlers
    EXPRESS.post('/success', (req, res) => {
        res.sendStatus(200);
        if(req.body.data) {
            gitChannel.send(`✅ Successful push, no errors.\nAuthor: ${req.body.data.actor}\nTimestamp: ${req.body.data.date}\nRun number: ${req.body.data.runNumber}`);
        }
    })
    EXPRESS.post('/fail', (req, res) => {
        res.sendStatus(200);
        if(req.body.data) {
            gitChannel.send(`❌ Build unsucessful.\nAuthor: ${req.body.data.actor}\nTimestamp: ${req.body.data.date}\nRun number: ${req.body.data.runNumber}`);
        }
    })
    EXPRESS.post('/warn', (req, res) => {
        res.sendStatus(200);
        if(req.body.data) {
            gitChannel.send(`⚠️ Warning, build complete but lint failed.\nAuthor: ${req.body.data.actor}\nTimestamp: ${req.body.data.date}\nRun number: ${req.body.data.runNumber}`);
        }
    })
    EXPRESS.listen(PORT, () => {
        console.log(`Discord bot server listening on port ${PORT}`)
    })
});





process.on('beforeExit', () => {
    // Log out the bot before the process exits
    CLIENT.destroy()
      .then(() => console.log('Bot logged out gracefully'))
      .catch(console.error);
});
process.on('exit', () => {
    // Log out the bot before the process exits
    CLIENT.destroy()
      .then(() => console.log('Bot logged out gracefully'))
      .catch(console.error);
});
