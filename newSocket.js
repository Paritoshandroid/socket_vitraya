let port = process.argv[2]
let freq = process.argv[3]
let num_bots = process.argv[4]

const redisClient = require('./redisClient');

const net = require('net');
const server = net.createServer(async(socket) => {
  
    socket.on('data', async(data) => {
      await redisClient.pushData(port, data)
  });
});



server.listen(port, () => {
    console.log('Server 1 listening on port 3000');
});

server.on('error', function (e) {
  server.close();
  process.exit();
});

let recurMessage = ()=>{
  setInterval(() => {

      let server = between(1,num_bots);
      let botPort = 8000+parseInt(server);
      let num_iteration = 1;
      if(botPort==port)
        num_iteration = parseInt(num_bots)
      while(num_iteration>0)
      {
        try{
          botPort = 8000+parseInt(num_iteration);
          if(botPort!=port){
            const destinationPort = botPort; 
            const destinationIP = 'localhost';
            const clientSocket = new net.Socket();

            clientSocket.connect(destinationPort, destinationIP, () => {
              const message = 'Message from socket!---'+port;
              clientSocket.write(message);
            });
            clientSocket.on('error', function(ex) {
                clientSocket.end()
                process.exit();
                return;
              });
              clientSocket.on('end', function(ex) {
                clientSocket.end()
                return;
              });
              clientSocket.on('close', () => {
              });
          }
          num_iteration = parseInt(num_iteration)-1;
        }
        catch(ex){
          console.log(ex);
          num_iteration = parseInt(num_iteration)-1;
        }
      }
  }, freq);
}


function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}
recurMessage();

process.on('uncaughtException', function (err) {
  process.exit();
});