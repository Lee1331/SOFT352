//create connection

//socket running on the front end
//socket = io.connect('http://localhost:5500');

//let userNameTest = window.prompt('Enter Username');

let username = document.getElementById('username');
let message = document.getElementById('message');
let output = document.getElementById('output');
let feedback = document.getElementById('feedback');
let btn = document.getElementById('sendMessage');


//room
//let roomNumberDiv = document.getElementById('roomNumber');

let tmUserForm = document.getElementById('tmUserForm');
let tmUserFormArea = document.getElementById('tmUserFormArea');
let tmUsers = document.getElementById('tmUsers');
let tmUsername = document.getElementById('tmUsername');

//tmUserForm.on('submit',function(event){
tmUserForm.addEventListener("submit", function(event){
    event.preventDefault();
    socket.emit('new user', tmUsername.value, function(data){
        if(data){
            tmUserFormArea.style.display = 'none';

        }
    });
    
    //let li = document.createElement("LI");
    //li.append('a');
    //tmUsers.appendChild(li);

    tmUsername.value;
    console.log('tmUsername.value = ' + tmUsername.value);
});
//});

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
    if(username.value){
        //emit message to server
            ///tell the server that someone is typing
                //send the users name to the server
        socket.emit('typing', username.value);
    }
});

//listen for events on the front end that are coming from the server
    //listen for the server 'chat' event
socket.on('chat', function(data){
    //set feedback.innerHTML = empty so that the 'is typing message disapears'
    feedback.innerHTML = "";

    if( data.username == '' || data.message == ''){
        alert('Enter a name and message');
    }
    else {   
        //output data to DOM via the output DOM element
        output.innerHTML += '<p><strong>'+ data.username +': </strong>' + data.message + '</p>';
        //console.log(data.message);
    }
});

//listen for the 'typing' message
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' : is typing...</em></p>';
});

socket.on('connectToRoom',function(data) {
    //roomNumberDiv.innerHTML = data;
    //document.body.innerHTML = '';
    //document.write(data);
});

socket.on('get users', function(data) {
    let li = document.createElement('li');
        
    //console.log('get users called')
    //console.log('data =' + data);
    //console.log('data length = ' + data.length);
    
    for(i = 0; i < data.length; i++){
        let newContent = document.createTextNode(data[i]);
        li.appendChild(newContent);
        tmUsers.appendChild(li);
    }

});
