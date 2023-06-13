var cluster = require('cluster');
var childScript = __dirname + '/newSocket.js';
sockets = [];
const { spawn } = require('child_process');
const redisClient = require('./redisClient');


let frequency = process.argv[2]
let num_bots = process.argv[3]
let time = process.argv[4]

console.log("num_bots--"+num_bots)
for(let i=1;i<=num_bots;i++){
    try{
        const child = spawn('node',['./newSocket.js',i+8000,frequency,num_bots,time],{stdio: 'inherit'});
        sockets.push(child)
    }
    catch(err){
        console.log(err);
    }
}

setTimeout(async() => {
    for(let i=1;i<=num_bots;i++){
         let queryPort = (i+8000).toString();
        let child = sockets[i];
        let data = await redisClient.getRedisGET(queryPort);
        var result = data.split(',');
        console.log("message for Port-"+queryPort);
        console.log(JSON.stringify(result));
        try{
            child.kill(9)
        }
        catch(err){

        }
    }
  }, time);

  process.on('uncaughtException', function (err) {
    console.log(err);
  });