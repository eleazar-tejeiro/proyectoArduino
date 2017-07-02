var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(8081));
var five = require('johnny-five');
app.use(express.static(__dirname + '/app'));
app.set('port', (process.env.PORT || 8081));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
var board = new five.Board();
board.on('ready', function() {
    var speed, commands, motors;
    var aireUno = new five.Led(12);
    var aireDos = new five.Led(11);
    var luzPatio = new five.Led(8);
    var luzCocina = new five.Led(7);
    var luzSala = new five.Led(10);
    var ventilador = new five.Motor(6);
    commands = null;
    var blink = true;
    io.on('connection', function(socket) {
    	socket.on('aireuno', function() {
            aireUno.on();
        });
        socket.on('airedos', function() {
            aireDos.on();
        });
        socket.on('luzsala', function() {
            luzSala.on();
        });
        socket.on('onall', function() {
           	aireUno.on();
           	aireDos.on();
           	luzSala.on();
           	luzPatio.on();
           	luzCocina.on();
           	ventilador.start(255);
        });
        socket.on('offall', function() {
            aireUno.off();
           	aireDos.off();
           	luzSala.off();
           	luzPatio.off();
           	luzCocina.off();
           	ventilador.stop();
        });
        socket.on('cocina', function() {
            luzCocina.on();
        });
        socket.on('patio', function() {
            luzPatio.on();
        });
        socket.on('ventiladoron', function() {
            ventilador.start(255);
        });
    });
});