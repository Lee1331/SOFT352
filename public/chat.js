//create connection

//socket running on the front end
socket = io.connect('http://localhost:5500');

let username = document.getElementById('username');
let message = document.getElementById('message');
let output = document.getElementById('output')
let feedback = document.getElementById('feedback');
let btn = document.getElementById('sendMessage');

btn.addEventListener('click', function(){
    //send a message down the web socket
    //p1 = message name
    //p2 = the meesage/data we want to send - an object
    socket.emit('chat', {
        //get value field of the message input field
        message: message.value,
        //get value field of the username input field
        username: username.value
    });
});

//Typing, and displaying user chat messages
message.addEventListener('keypress', function(){
    //emit message to server
        ///tell the server that someone is typing
            //send the users name to the server
    socket.emit('typing', username.value);
});

//listen for events on the front end that are coming from the server
    //listen for the server 'chat' event
socket.on('chat', function(data){
    //set feedback.innerHTML = empty so that the 'is typing message disapears'
    feedback.innerHTML = "";
    //output data to DOM via the output DOM element
    output.innerHTML += '<p><strong>'+ data.username +': </strong>' + data.message + '</p>';
});

//listen for the 'typing' message
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' : is typing...</em></p>';
});