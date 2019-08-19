//window.onload=function(){ //needed for testing to prevent 'TypeError: Cannot read property 'addEventListener' of null' error, disabled for the actual app
    //Dom
    const DOMStrings = {
        username: 'username',
        message: 'message',
        output: 'output',
        feedback: 'feedback',
        btn: 'sendMessage',
        userForm: 'userForm',
        userFormArea: 'userFormArea',
        users: 'users',
        usernameFormValue: 'usernameFormValue',
    }

    let username = document.getElementById(DOMStrings.username);
    let message = document.getElementById(DOMStrings.message);
    let output = document.getElementById(DOMStrings.output);
    let feedback = document.getElementById(DOMStrings.feedback);
    let btn = document.getElementById(DOMStrings.btn);
    let userForm = document.getElementById(DOMStrings.userForm);
    let userFormArea = document.getElementById(DOMStrings.userFormArea);
    let users = document.getElementById(DOMStrings.users);
    let usernameFormValue = document.getElementById(DOMStrings.usernameFormValue);
    

    //on submit, send the data the user entered
    userForm.addEventListener("submit", function(event){
        event.preventDefault();
        
        socket.emit('newUser', usernameFormValue.value, function(data){
            if(data){
                userFormArea.style.display = 'none';
            }
        });
        
        usernameFormValue.value;
    });
    //on click, send the data the user entered
    btn.addEventListener('click', function(){
        //send a message down the web socket
            //p1 = message name
            //p2 = the meesage/data we want to send
        
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
    //Display the chat messages in the chat section
    socket.on('chat', function (data){
        //set feedback.innerHTML = empty so that the 'is typing message disapears'
        feedback.innerHTML = "";

        if(data.username == '' || data.message == ''){
            alert('Enter a name and message');
        }
        else {   
            //output data to DOM via the output DOM element
            output.innerHTML += '<p><strong>'+ data.username +': </strong>' + data.message + '</p>';
        }
    });
    //show that a user is currently typing a message
    socket.on('typing', function(data){
        feedback.innerHTML = '<p><em>' + data + ' : is typing...</em></p>';
    });
    //display users in Online Users
    socket.on('getUsers', function(data) {
        //having to use jQuery as regular .js isnt behaving correctly, and it allows us to user the 'html()' function
        let usersDiv = $('#users');
        let usernames = '';
        //output data to DOM via the output DOM element
        for (user in data){
                //usernames.innerHTML += '<p><strong>'+ data[user] +'</p>';
                usernames += '<p><strong>'+ data[user] +'</p>';
            
        }
        //usersDiv.innerHTML = usernames;
        usersDiv.html(usernames);
    });
    //greet user
    socket.on('greetUser', function(data) {
        alert('Welcome ' + data);
    });
    //notify others that a user has left
    socket.on('farewellUser', function(data) {
        alert(data + ' has left');
    });
    
    //module.exports = chat;
//}
