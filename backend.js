var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express');
server.listen(9000);
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));
var players = [];
var whiteTaken = false;
var blackTaken = false;

app.get('/', function(req, res){
	res.render('index.html');
});

io.on('connection', handleIO);

function handleIO(socket){
	console.log('Client connected...');

	socket.on('playerJoining', function(){
		var player = new Object();
		if (!whiteTaken){
			player.playerId = 1;
			player.socketId = socket.id;
			whiteTaken = true;
		} else if (!blackTaken){
			player.playerId = 2;
			player.socketId = socket.id;
			blackTaken = true;
		} else {
			player.playerId = 0;
			player.socketId = socket.id;
		}
		players.push(player);
		socket.emit('joined', player.playerId);
	});
	
	socket.on('move', function(data){
		socket.broadcast.emit('moveMade', data);
	});
	
	socket.on('disconnect', function(){
		for (var i=0; i<players.length; i++){
			var c = players[i];
			if (c.socketId == socket.id){
				if (c.playerId == 1) whiteTaken = false;
				if (c.playerId == 2) blackTaken = false;
				players.splice(i, 1);
				break;
			}
		}
	});
};