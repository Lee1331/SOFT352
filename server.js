let express = require('express');
let socket = require('socket.io');

//create an express app/instance
let app = express();

let users = [];
let connections = [];

let server = app.listen(5500, function(){
    console.log('server started, and listening to requests on port 5500');
});

//Serve the static files in the public folder to the browser, these are the files that the users will see
app.use(express.static('public'));

//create a socket on this server
let io = socket(server);

//if a user connects to the server...
    //handle 'chat', 'typing', 'mouse', events 
io.on('connection', function(socket){


    socket.on('chat',function(data){
        io.sockets.emit('chat', data);
    });

    
    //listen for the 'typing' message - which we created and are using for whenever the user types into the fields
    //data is the users handle
    socket.on('typing', function(data){
        //broadcase the messsage to every other socket - that isnt this one/the one typing
            //emit the 'typing' message, and the data
        socket.broadcast.emit('typing', data);
    });

    //recieving data on the server end
    //if there's a message called 'mo   use', trigger this function
    socket.on('mouse', function(data){  

        //call the 'broadcast.emit' function to send a message back out to all other sockets outside of the one sendning the message
        socket.broadcast.emit('mouse', data);

        //print the data from the 'mouse' message we created
        //console.log('Recieving data' + data + 'from socket' + socket.id);
        console.log(data);
    });
});