var cluster = require('cluster');
var childScript = __dirname + '/bot_prj.js';
sockets = [];
const { spawn } = require('child_process');
const redisClient = require('./redisClient');


let frequency = process.argv[2]
let num_bots = process.argv[3]
let time = process.argv[4]



for(let i=1;i<=num_bots;i++){
    redisClient.setData(i+3000+"_mysrverid",(i+3000));
}

for(let i=1;i<=num_bots;i++){
    try{
        const child = spawn('node',['./bot_prj.js',i+3000,frequency,num_bots,time],{stdio: 'inherit'});
        sockets.push(child); 
    }
    catch(err){
        console.log(err);
    }
}


setTimeout(async() => {
    for(let i=1;i<=num_bots;i++){
         let queryPort = (i+3000).toString();
        let child = sockets[i];
        let data = await redisClient.getRedisGET(queryPort);
        if(data){
                var result = data.split(',');
                console.log("message for Port-"+queryPort);
                console.log(JSON.stringify(result));
        }
        else
        {
            console.log("message for Port-"+queryPort);
            console.log("no message");
        }
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