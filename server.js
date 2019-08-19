const express = require('express');
const app = express();
const server = require('http').Server(app);
const socket = require('socket.io');
const os = require('os');

// let server = app.listen(5500, console.log('server started, and listening to requests on port 5500'));
server.listen(5500, console.log('server started, and listening to requests on port 5500'));

//serve the static files in the public folder to the browser, these are the files that the users will see
app.use(express.static('public'));

//create a socket on this server
let io = socket(server);

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

//arrays
let users = [];
let socketConnections = [];
let cameras = [];

//if a user connects to the server... handle server-side events 
io.on('connection', function(socket){
    //set the users camera id
    socket.emit('cameraId', cameras.length);
    //push cameras into array
    cameras.push(cameras.length);
    //grab the users camera feed
    socket.emit('getCameras', cameras);
    
    //----listen for server end connection events----//
    //push connected socket into array
    socketConnections.push(socket);
    console.log('Connected, there are ' + users.length + ' users connected');
    console.log('Connected, there are ' + socketConnections.length + ' sockets connected');
    console.log('Connected, there are ' + cameras.length + ' cameras connected');

    //adds user to array, updates list of connected users
    socket.on('newUser', function (data, callback) {
        //'callback()' allows us to pass data to the client-side 'newUser' emit, this is being used on the client to check if a new user has joined
        callback(true);
        //take the data thats passed into 'newUser' when it's emitted and set it as the socket username
        socket.username = data;
        //prints username
        //console.log('socket.username = ' + socket.username);
        users.push(socket.username);
        //console.log('Connected, there are ' + users.length + ' users connected');
        updateUsernames();
        //console.log('users after "newUser" is emittted = ' + users);
        socket.emit('greetUser', socket.username);
    });
    //removes user data from arrays once they leave
    socket.on('disconnect', function(data){
        //usernames
        socket.emit('farewellUser', socket.username);
        users.splice(users.indexOf(socket.username), 1);
        //used to update the 'Online Users' section
        updateUsernames();
        //console.log('Disconnected, there are ' + users.length + ' users connected');

        //sockets
        socketConnections.splice(socketConnections.indexOf(socket), 1);
        //console.log('Disconnected, there are ' + socketConnections.length + ' sockets connected');

        //cameras
        cameras.splice(cameras.indexOf(socket), 1);
        //console.log('Disconnected, there are ' + cameras.length + ' cameras connected');
    });
    //update the connected users
    function updateUsernames(){
        //emit a site wide (not socket wide) message to get the users logged into the site
        io.sockets.emit('getUsers', users);
        //console.log('updated users: ' + users);
    }
    //update the connected cameras
	socket.on('updateCameras', function(data){
        socket.broadcast.emit('updateCameras', data);
    });
    //listen for server end chat events
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });
    //listen for the 'typing' message
    socket.on('typing', function(data){
        //broadcast the messsage to every other socket - that isnt this one/the one typing
            //emit the 'typing' message, and the data
        socket.broadcast.emit('typing', data);
    });
    //listen for server end mouse events
    socket.on('mouse', function(data){  

        //call the 'broadcast.emit' function to send a message back out to all other sockets outside of the one sendning the message
        socket.broadcast.emit('mouse', data);
        //print the data from the 'mouse' message
        //console.log(data);
    });
});