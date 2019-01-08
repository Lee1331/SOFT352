let express = require('express');
let socket = require('socket.io');
let os = require('os');

//create an express app/instance
let app = express();

let server = app.listen(5500, startServer());

//show that the server is running
function startServer(){
    console.log('server started, and listening to requests on port 5500');
};

//serve the static files in the public folder to the browser, these are the files that the users will see
app.use(express.static('public'));

//create a socket on this server
let io = socket(server);

//arrays
let users = [];
let socketConnections = [];
let cameras = [];

//if a user connects to the server...
    //handle server-side events 
io.on('connection', function(socket){
    
    //grab the users camera feed
    socket.emit('cameraId', cameras.length);
    //look at this - this is probably why multiple img tags are show even when theres less users
    cameras.push(cameras.length);

    io.emit('getCameras', cameras);
    
    //----listen for server end connection events----//
    socketConnections.push(socket);
    console.log('Connected, there are ' + users.length + ' users connected');
    console.log('Connected, there are ' + socketConnections.length + ' sockets connected');
    console.log('Connected, there are ' + cameras.length + ' cameras connected');

    socket.on('newUser', function (data, callback) {
        //'callback()' allows us to pass data to the client-side 'newUser' emit, this is being used on the client to check if a new user has joined
        callback(true);
        //take the data thats passed into 'newUser' when it's emitted and set it as the socket username
        socket.username = data;
        console.log('data = ' + data);
        //prints username
        //console.log('socket.username = ' + socket.username);
        
        users.push(socket.username);
        updateUsernames();
        //console.log('users after "newUser" is emittted = ' + users);
        socket.emit('greetUser', socket.username);
    });

    socket.on('disconnect', function(data){
        //usernames
        users.splice(users.indexOf(socket.username), 1);
        //used to update the 'Online Users' section
        updateUsernames();
        //console.log('Disconnected, there are ' + users.length + ' users connected');
        socket.emit('greetUser', socket.username);

        //sockets
        socketConnections.splice(socketConnections.indexOf(socket), 1);
        //console.log('Disconnected, there are ' + socketConnections.length + ' sockets connected');
    
        //cameras
        cameras.splice(cameras.indexOf(socket), 1);
        //console.log('Disconnected, there are ' + cameras.length + ' cameras connected');
    });

    function updateUsernames(){
        //emit a site wide (not socket wide) message to get the users logged into the site
        io.sockets.emit('getUsers', users);
        //console.log('updated users: ' + users);
    }

    //this probably should be 'updateCameras
        //this is also probably the issue with performance, as this is calling/dealing with the cameras
	socket.on('updateUser', function(data){
        socket.broadcast.emit('updateUser', data);
        //socket.emit('updateUser', data);
    });

	socket.on('updateImage', function(data){
		socket.broadcast.emit('updateImage',data);
	});

    //----listen for server end chat events----//
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    //listen for the 'typing' message - which we created and are using for whenever the user types into the fields
    //data is the users handle
    socket.on('typing', function(data){
        //broadcase the messsage to every other socket - that isnt this one/the one typing
            //emit the 'typing' message, and the data
        socket.broadcast.emit('typing', data);
    });

    socket.on('mouse', function(data){  

        //call the 'broadcast.emit' function to send a message back out to all other sockets outside of the one sendning the message
        socket.broadcast.emit('mouse', data);
        //print the data from the 'mouse' message
        //console.log(data);
    });
});