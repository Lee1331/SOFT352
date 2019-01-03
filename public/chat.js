//create connection

let username = document.getElementById('username');
let message = document.getElementById('message');
let output = document.getElementById('output');
let feedback = document.getElementById('feedback');
let btn = document.getElementById('sendMessage');

let userForm = document.getElementById('userForm');
let userFormArea = document.getElementById('userFormArea');
let tmUsers = document.getElementById('tmUsers');
let usernameFormValue = document.getElementById('usernameFormValue');

userForm.addEventListener("submit", function(event){
    event.preventDefault();
    
    socket.emit('new user', usernameFormValue.value, function(data){
        if(data){
            userFormArea.style.display = 'none';

        }
    });
    
    usernameFormValue.value;
    console.log('usernameFormValue.value = ' + usernameFormValue.value);

});

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

//----listen for events on the front end that are coming from the server----//

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
    }
});

//listen for the 'typing' event
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' : is typing...</em></p>';
});

//listen for the 'getUsers' event
socket.on('getUsers', function(data) {
    let li = document.createElement('li');
    console.log('getUsers called, data = ' + data);
    for(i = 0; i < data.length; i++){
        //the names dont get removed when the leave the session
        let addUsername = document.createTextNode(data[i]);
        console.log('addUsername data[i] = ' + data[i]);
        li.appendChild(addUsername);
        console.log('addUsername = ' + addUsername);
        tmUsers.appendChild(li);
    }

    
});
