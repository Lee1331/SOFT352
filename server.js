let express = require('express');
let socket = require('socket.io');
let os = require('os');

//create an express app/instance
let app = express();

let server = app.listen(5500, function(){
    console.log('server started, and listening to requests on port 5500');
});

//serve the static files in the public folder to the browser, these are the files that the users will see
app.use(express.static('public'));

//create a socket on this server
let io = socket(server);

//roomNumber
let roomNumber = 1;

let tmUsers = [];
let tmConnections = [];
//if a user connects to the server...
    //handle 'chat', 'typing', 'mouse', events 
io.on('connection', function(socket){
    
    /*if(io.nsps['/'].adapter.rooms["room-"+roomNumber] && io.nsps['/'].adapter.rooms["room-"+roomNumber].length > 1) roomNumber++;
    socket.join("room-"+roomNumber);

    io.sockets.in("room-"+roomNumber).emit('connectToRoom', "You are in room "+roomNumber);*/

    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    tmConnections.push(socket);
    console.log("Connected: %s sockets connected", tmConnections.length);

    socket.on('disconnect', function(data){
        //if(!socket.username) return;
        tmUsers.splice(tmUsers.indexOf(socket.username), 1);
        updateUsernames();
        tmConnections.splice(tmConnections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", tmConnections.length);
    });

    socket.on('new user', function (data, callback) {
        callback(true);
        //take the data thats passed into 'new user' when it's emitted and set it as the socket username
        socket.username = data;
        //prints username
        console.log('socket.username = ' + socket.username);
        
        tmUsers.push(socket.username);
        updateUsernames();
        console.log('tmUsers after "new user" is emittted = ' + tmUsers);
    });

    function updateUsernames(){
        //socket.emit('get users', tmUsers);
        io.sockets.emit('get users', tmUsers);
        console.log('updated tmUsers: ' + tmUsers);
    }

    //listen for the 'typing' message - which we created and are using for whenever the user types into the fields
    //data is the users handle
    socket.on('typing', function(data){
        //broadcase the messsage to every other socket - that isnt this one/the one typing
            //emit the 'typing' message, and the data
        socket.broadcast.emit('typing', data);
    });

    //recieving data on the server end
    //if there's a message called 'mouse', trigger this function
    socket.on('mouse', function(data){  

        //call the 'broadcast.emit' function to send a message back out to all other sockets outside of the one sendning the message
        //socket.broadcast.emit('mouse', data);
        socket.broadcast.emit('mouse', data);

        //print the data from the 'mouse' message we created
        //console.log('Recieving data' + data + 'from socket' + socket.id);
        //console.log(data);
    });

    socket.on('message', function(message) {
        //console.log('Client received message:', message);
        //start();
    });
});