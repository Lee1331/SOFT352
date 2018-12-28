'use strict';

//initilaise room creation
let isInitiator;

//set the element that will display the local users webcam stream
let localVideo = document.getElementById("localVideo");

//set the variable that will store the local users webcam stream
let localStream;

//create room object
window.room = prompt("Enter room name:");

//let socket = io.connect();

//if the room is empty
if (room !== "") {
    console.log('Client is asking to join room ' + room);
    //emit the 'create/join message which will create a room for the user to join
    socket.emit('create/join', room);
}
//on room creation
socket.on('createdRoom', function(room, clientId) {
    isInitiator = true;
});

//on a full room
socket.on('fullRoom', function(room) {
    console.log('Message from client: Room ' + room + ' is full :^(');
});

//on user joining a room
socket.on('joined', function(room, clientId) {
    isInitiator = false;
});

//set WebRTC constraints, we are only using video for now
const mediaStreamConstraints = {
    video: true,
};

//adds the MediaStream to the 'localVideo' div.
function gotLocalMediaStream(mediaStream) {
    console.log('Adding local stream.');
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
}

//display a message in the event of an error.
function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints).then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
