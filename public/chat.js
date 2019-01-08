//window.onload=function(){ //needed for testing to prevent 'TypeError: Cannot read property 'addEventListener' of null' error, disabled for the actual app
    //Dom
    let username = document.getElementById('username');
    let message = document.getElementById('message');
    let output = document.getElementById('output');
    let feedback = document.getElementById('feedback');
    let btn = document.getElementById('sendMessage');

    let userForm = document.getElementById('userForm');
    let userFormArea = document.getElementById('userFormArea');
    let users = document.getElementById('users');
    let usernameFormValue = document.getElementById('usernameFormValue');

    userForm.addEventListener("submit", function(event){
        event.preventDefault();
        
        socket.emit('newUser', usernameFormValue.value, function(data){
            if(data){
                userFormArea.style.display = 'none';

            }
        });
        
        usernameFormValue.value;
        //console.log('usernameFormValue.value = ' + usernameFormValue.value);

    });

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

    //listen for the server 'chat' event
    socket.on('chat', chat);

    function chat(data){
        //set feedback.innerHTML = empty so that the 'is typing message disapears'
        feedback.innerHTML = "";

        if(data.username == '' || data.message == ''){
            alert('Enter a name and message');
        }
        else {   
            //output data to DOM via the output DOM element
            output.innerHTML += '<p><strong>'+ data.username +': </strong>' + data.message + '</p>';
        }
    }

    //listen for the 'typing' event
    socket.on('typing', function(data){
        feedback.innerHTML = '<p><em>' + data + ' : is typing...</em></p>';
    });

    //listen for the 'getUsers' event
    socket.on('getUsers', function(data) {
        let li = document.createElement('li');
        //console.log('getUsers called, data = ' + data);
        /*for(i = 0; i < data.length; i++){
            //the names dont get removed when the leave the session
            let addUsername = document.createTextNode(data[i]);
            console.log('addUsername data[i] = ' + data[i]);
            li.appendChild(addUsername);
            console.log('addUsername = ' + addUsername);
            users.appendChild(li);
        }*/
        /*for(user in data){
            let addUsername = document.createTextNode(data[user]);
            console.log(user);
            li.appendChild(addUsername);
            console.log('addUsername = ' + addUsername);
            users.appendChild(li);
        }*/
        /*for(user in data){
            //the names dont get removed when users leave the session
            let addUsername = document.createTextNode(data[user]);
            console.log('addUsername data[i] = ' + data[user]);
            li.appendChild(addUsername);
            console.log('addUsername = ' + addUsername);
            users.appendChild(li);
        }*/
        //let test = document.getElementById('test');
        //having to use jQuery as regular .js isnt behaving correctly, and it allows us to user the 'html()' function
        let usersDiv = $('#users');
        let usernames = '';
        //output data to DOM via the output DOM element
        for (user in data){
                //test.innerHTML += '<p><strong>'+ data[user] +'</p>';
                usernames += '<p><strong>'+ data[user] +'</p>';
            
        }
        //usersDiv.innerHTML = usernames;
        usersDiv.html(usernames);
    });

    socket.on('greetUser', function(data) {
        alert('Welcome ' + data);
    })
    socket.on('farewellUser', function(data) {
        alert(data + ' has left');
    })
    
    //module.exports = chat;
//}
