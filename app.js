const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 3000;
const path = require('path');
const fs = require('fs');
let connectedUsers = 0;
let userArr = [];
app.get('/', function(req, res){ res.sendFile( __dirname + '/public/index.html' ) });
app.use(express.static(path.join( __dirname, 'public' )));
app.use(bodyParser.urlencoded({ extended: true }));
io.on('connection', function(socket) {
    connectedUsers++;
    io.emit('getStatus', connectedUsers);
    socket.on('chat message', function(data) {
        const message = data.message;
        const userId = data.userId;
        const iconBg = data.iconBg;
        const sendTime = data.sendTime;
        const userName = data.userName;
        let li = `
        <li class="${userId}">
            <p>${message}<span class='sendTime'>${sendTime}</span></p>
            <div class="userIcon" style="background-color: ${iconBg};">
                <i class="fa-solid fa-user" style="color: #000000;"></i>
                <div class='userTitle' id='userTitle'>${userName}</div>
            </div>
        </li>`;
        io.emit('chat message', li);
    });
    socket.on('getStatus', function(msg) {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function() {
        connectedUsers--;
        io.emit('getStatus', connectedUsers);
    });
});
http.listen(PORT, function(){ console.log(`Server work on PORT: ${PORT}`) });
app.post('/user-registered', function(req, res){
    let userInfo = { userLogin : req.body.login, userPassword : req.body.password, userIcon: req.body.userIcon, userId : req.body.userId };
    userArr.push(JSON.stringify(userInfo));
    fs.writeFile('./public/js/data.json', `[${userArr}]`, function (error){
        if (error) console.error(error);
        else console.log('Data added successfully');
    });
});