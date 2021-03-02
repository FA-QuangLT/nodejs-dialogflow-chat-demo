const env = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// create express app
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var bot = require('./botDialogFlow');
var botExcute = bot.excute;
// Setup server port
const port = process.env.PORT || 5000;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())
//Set view engine to ejs
app.set("view engine", "ejs");
//Tell Express where we keep our index.ejs
app.set("views", __dirname + "/views");

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index', { title: 'chat bot' });
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('sendMessage', function(message) {
        const projectId = 'quanglt-chat-bot';
        const languageCode = 'en';
        const sessionId = '123456';
        const queries = [
            message
        ];
        botExcute(projectId, sessionId, queries, languageCode).then((value) => {
            socket.emit('incomingMessage', value);
        });
    });
});

// listen for requests
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });
http.listen(port, function(){
    console.log(`listening on ${port}`);
});
