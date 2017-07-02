var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(8081));
var five = require('johnny-five');
app.use(express.static(__dirname + '/app'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
var board = new five.Board();
board.on('ready', function() {
    var speed, commands, motors;
    var ledYellow = new five.Led(11);
    var ledGreen = new five.Led(10);
    var ledBlue = new five.Led(9);
    commands = null;
    ledYellow.off();
    ledGreen.off();
    ledBlue.off();
    var blink = true;
    io.on('connection', function(socket) {
        socket.on('green', function() {
            ledGreen.on();
            ledYellow.off();
            ledBlue.off();
        });
        socket.on('yellow', function() {
            ledYellow.on();
            ledGreen.off();
            ledBlue.off();
        });
        socket.on('blue', function() {
            ledGreen.off();
            ledYellow.off();
            ledBlue.on();
        });
        socket.on('blink', function() {
            ledYellow.pulse();
            ledGreen.pulse();
            ledBlue.pulse();
        });
        socket.on('off', function() {
            ledYellow.stop().off(); // to shut it off (stop doesn't mean "off")
            ledGreen.stop().off();
            ledBlue.stop().off();
        });
        socket.on('on', function() {
            ledYellow.on(); // to turn on, but not blink
            ledGreen.on();
            ledBlue.on();
        });
    });
});
