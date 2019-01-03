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

let tmUsers = [];
let socketConnections = [];
let cameras = [];

//if a user connects to the server...
    //handle 'chat', 'typing', 'mouse', events 
io.on('connection', function(socket){
    
    //replace 'user []' with 'cameras []'
    socket.emit('cameraId', cameras.length);
	//console.log(cameras);
	cameras.push(cameras.length);
    io.emit('getCameras', cameras);
    
	
	socket.on('updateUser', function(data){
        socket.broadcast.emit('updateUser', data);
        //socket.emit('updateUser', data);
    });

	socket.on('part', function(data){
		socket.emit('part', data);
	});

	socket.on('updateImage', function(data){
		socket.broadcast.emit('updateImage',data);
		//socket.emit('updateImage',data);
	});

    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socketConnections.push(socket);
    console.log('Connected, there are ' + tmUsers.length + ' users connected');
    console.log('Connected, there are ' + socketConnections.length + ' sockets connected');
    console.log('Connected, there are ' + cameras.length + ' cameras connected');

    socket.on('disconnect', function(data){
        //usernames
        tmUsers.splice(tmUsers.indexOf(socket.username), 1);
        updateUsernames();
        console.log('Disconnected, there are ' + tmUsers.length + ' users connected');
        //sockets
        socketConnections.splice(socketConnections.indexOf(socket), 1);
        console.log('Disconnected, there are ' + socketConnections.length + ' sockets connected');
        //cameras
        cameras.splice(cameras.indexOf(socket), 1);
        console.log('Disconnected, there are ' + cameras.length + ' cameras connected');

    });

    socket.on('new user', function (data, callback) {
        callback(true);
        //take the data thats passed into 'new user' when it's emitted and set it as the socket username
        socket.username = data;
        console.log('data = ' + data);
        //prints username
        console.log('socket.username = ' + socket.username);
        
        tmUsers.push(socket.username);
        updateUsernames();
        //updateCameras();
        console.log('users after "new user" is emittted = ' + tmUsers);
    });

    function updateUsernames(){
        //socket.emit('getUsers', users);

        //add from camera implementation - socket.on('updateUser', function (data){ $('#'+data.id).attr('src', data.capture); });
        //$('#'+data.id).attr('src', data.capture);

        io.sockets.emit('getUsers', tmUsers);
        console.log('updated users: ' + tmUsers);

        
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
});