const express = require('express');
const axios = require('axios');
var needle = require('needle');
const bodyParser = require('body-parser')
const redisClient = require('./redisClient');


let port = process.argv[2]
let freq = process.argv[3]
let num_bots = process.argv[4]

const app = express();
app.use(bodyParser.json())
app.post('/message',async (req, res) => {
  await redisClient.pushData(port, JSON.stringify(req.body))
  res.send('Chatbot message received');
});


setInterval(async() => {
    let server = between(1,num_bots);
    let serverPort = await redisClient.getData(server+3000+"_mysrverid")  
    let data = { serverName: "server---"+(port-3000),message: 'sending message'};

    needle.post("http://localhost:"+serverPort+"/message", data, { json: true })
}, freq);


function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}


app.listen(port, () => {
  console.log('Chatbot 1 is running on port '+port);
});