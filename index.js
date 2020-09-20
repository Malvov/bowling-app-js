var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

global.uid = require('./vendor/getUuid.js');
global.CONFIG = JSON.parse(fs.readFileSync('./config/bowling.json'));
require('./game.js');

app.use(bodyParser.json());
app.get('/newGame', Game.newGame);
app.post('/shoot', bodyParser.json(), Game.validateGame);
app.listen(3000, function () {
     console.log('Listening on port 3000');
});

process.on('uncaughtException', function uncaughtException (error) {
    console.log(error);
});
