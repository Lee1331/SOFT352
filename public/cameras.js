'use strict';

//initilaise room creation
let isInitiator;

//step 5 - Googles public STUN server
var pcConfig = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }]
};

//set the element that will display the local users webcam stream
let localVideo = document.getElementById("localVideo");
//set the variable that will store the local users webcam stream
let localStream;

//set the element that will display the remote users webcam stream
let remoteVideo = document.getElementById("remoteVideo");
//set the variable that will store the remote users webcam stream
let remoteStream;

/*
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
    console.log('Room ' + room + ' is full');
});

//log the servers IP address
socket.on('ipaddr', function(ipaddr) {
    console.log('Message from client: Server IP address is ' + ipaddr);
});

//on user joining a room
socket.on('joined', function(room, clientId) {
    isInitiator = false;
});
*/
//set WebRTC constraints, we are only using video for now
const mediaStreamConstraints = {
    video: true,
};

//adds the MediaStream to the 'localVideo' div.
function gotLocalMediaStream(mediaStream) {
    console.log('Adding local stream.');
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;

    //added in here quickly as step 5 adds 'sendMessage' in here
    socket.emit('message', message);
}

//display a message in the event of an error.
function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

//disaply user webcam stream
function webCamVideo(){
// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints).then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
}

webCamVideo();

function start(){
    console.log('creating peer connection');
    createPeerConnection();
    pc.addStream(localStream);
}
function createPeerConnection(){
    pc = new RTCPeerConnection(null);
    //we need to handle three events, these being...
    pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;
    console.log('Created RTCPeerConnnection');
}

function handleIceCandidate(event){
    console.log('icecandidate event: ', event);
    if(event.candidate){
        sendMessage({
            'candidate': event.candidate
        });
    } 
    else {
        console.log('End of candidates.');
    }
}

function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
}

function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
}

