//Nathaniel Salami && Temitayo Oyelowo

var http = require('http');
//npm modules (need to install these first)
var WebSocketServer = require('ws').Server; //provides web sockets
var ecStatic = require('ecstatic');  //provides static file server service
var port = process.env.PORT || 3000;

//module containing useful methods
var color = require('./assignID');

//static file server
var server = http.createServer(ecStatic({root: __dirname + '/www'}));

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  console.log('Client connected');

  ws.on('message', function(msg) {
	   //This is the arr
	   var boardLocation = msg;
     broadcast(boardLocation);
  });

  ws.id = color.assignID(wss.clients.length);

  var playeColor = JSON.stringify(ws.id);

  ws.send(playeColor);
});

function broadcast(msg) {
  wss.clients.forEach(function(client) {
    client.send(msg);
  });
}

server.listen(port);
