
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});
app.use(express.static(path.join(__dirname, './client')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

require("./config/mongoose.js");
const socket = require('socket.io');
const io = socket(server);

io.on("connection", function(socket){
    console.log("made socket connection");
    socket.on('disconnect', function() {
        console.log("Disconnected - Socket ID: ", socket.id);
    })
    socket.on('created_topic', function(data) {
        socket.broadcast.emit('topic_added', data);
    })
});


require("./config/routes.js")(app);

module.exports = app;