'use strict';

//set constraints, these being the 'rules' of the app
const mediaStreamConstraints = {
    video: true,
};
//set the parent element where the users camera will be displayed
const localVideo = document.querySelector("video");

//the users stream that will be reproduced on the video
let localStream;

//create function to add the mediaStream to the video element
function gotLocalMediaStream(mediaStream){
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
}

//in the event of an error, display this message
function handleLocalStreamError(error){
    console.log("navigator.getUserMedia error: ", error);
} 

//Init media stream
    //1 - set the constraints
    //2 - then call gotLocalMediaStream so we can display the users stream from their webcam
    //3 - catch any errors and display the message in the console.log 
navigator.mediaDevices.getUserMedia(mediaStreamConstraints).then(gotLocalMediaStream).catch(handleLocalStreamError);