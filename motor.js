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
    var ledYellow = new five.Led(11);
    var ledBlue = new five.Led(9);
    var motor = new five.Pin({
    pin: 5,
    mode: 1
    });
    commands = null;
    ledYellow.off();
    ledBlue.off();
    var blink = true;
    io.on('connection', function(socket) {
        socket.on('yellow', function() {
            ledYellow.on();
            ledBlue.off();
        });
        socket.on('blue', function() {
            ledYellow.off();
            ledBlue.on();
        });
        socket.on('motor', function() {
            motor.high();
        });
        socket.on('off', function() {
            ledYellow.stop().off(); // to shut it off (stop doesn't mean "off")
            ledBlue.stop().off();
        });
        socket.on('on', function() {
            ledYellow.on(); // to turn on, but not blink
            ledBlue.on();
        });
    });
});