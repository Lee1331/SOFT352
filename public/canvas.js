//window.onload=function(){ //needed for testing to prevent 'TypeError: Cannot read property 'addEventListener' of null' error, disabled for the actual app
p5.disableFriendlyErrors = true; // disables the p5 Friendly Error System (FES) - performance increase

//used to keep track of the uses camera
let cameraId;

//Set users camera ID
socket.on('cameraId', function (updatedCameraId) {
    cameraId = updatedCameraId;
    //console.log('cameraId = ' + cameraId);

});
//update and insert users camera into the DOM
socket.on('getCameras', function (camera) {
    let cameraCanvasDiv = document.getElementById('cameraCanvas');

    //remove the hidden camera p5 creates - (the same one we are hiding in cameraSketch)
    $('img').remove();

    //for each camera, if the camera doesnt match the camera id, then insert/update the cameraElement so that the correct camera is displayed 
    $.each(camera, function(index, cameraElement){
        if(cameraElement != cameraId){
            cameraCanvasDiv.insertAdjacentHTML('beforeend', '<img id='+cameraElement+'>');
            console.log('camera = ' + camera);
        }
    });
});
//stream camera data
socket.on('updateCameras', function (data) {
    $('#'+data.id).attr('src', data.capture);
    //console.log(data.id);
});

//here we are using 'instance mode' instead of 'global  mode' https://github.com/processing/p5.js/wiki/Global-and-instance-mode
    //p5 doesn't allow for multiple global canvases, so instead we are using objects
let canvasSketch = function(canvas) {
    
    //using default .js 'Math' functions as p5's 'random()' has more overhead
    canvas.randNum = function() {
        return Math.floor(Math.random() * 256);
    }
    //set size
    canvas.canvasDiv = document.getElementById('canvas');
    canvas.canvasWidth = canvas.canvasDiv.offsetWidth; 
    canvas.canvasHeight = canvas.canvasDiv.offsetHeight; 
    //console.log(canvas.canvasWidth, canvas.canvasHeight);

    //set colours - storing in varaibles as otherwise every mark the user makes will be a different colour
    canvas.r = canvas.randNum();
    canvas.g = canvas.randNum();
    canvas.b = canvas.randNum();
    canvas.backgroundColour = canvas.randNum();
    //set peer colours
    canvas.pr = canvas.randNum();
    canvas.pg = canvas.randNum();
    canvas.pb = canvas.randNum();

    //default p5 function/reserved keyword
    canvas.setup = function() {
        canvas.createCanvas(canvas.canvasWidth, canvas.canvasHeight);
        canvas.background(canvas.backgroundColour);
    }
    //default p5 function/reserved keyword
    canvas.draw = function(){
        canvas.fill(canvas.r, canvas.g, canvas.b);
        
    }
    //my function - used to draw peer users marks
    canvas.peerDraw = function(){
        canvas.fill(canvas.pr, canvas.pg, canvas.pb);

    }
    //default p5 function/reserved keyword
    canvas.mousePressed = function(){
        canvas.noStroke();
        canvas.ellipse(canvas.mouseX, canvas.mouseY, 18, 18);
        //used for peer users
        let data = {
            x: canvas.mouseX,
            y: canvas.mouseY
        }
        socket.emit('mouse', data);
    }
    //default p5 function/reserved keyword
    canvas.windowResized = function() {
        canvas.resizeCanvas(canvas.canvasWidth, canvas.canvasHeight);
    }
    //default p5 function/reserved keyword
    canvas.mouseDragged = function(){
        canvas.noStroke();
        canvas.draw();
        //used for peer users
        let data = {
            x: canvas.mouseX,
            y: canvas.mouseY
        }
        canvas.ellipse(canvas.mouseX, canvas.mouseY, 18, 18);
        //emit whenever a peer user is drawning on the canvas
        socket.emit('mouse', data);
    }
    //draw the peer users data
    socket.on('mouse', function(data){
        //draw the peer users data on the canvas
        canvas.noStroke();
        canvas.peerDraw();
        canvas.ellipse(data.x, data.y, 18, 18);
    });
}
//create canvas object set canvasSketchs parent to be 'canvas'
let p5_CanvasSketch = new p5(canvasSketch, 'canvas');

//camera canvas
let cameraSketch = function(canvas) {
    //set size
    canvas.canvasWidth = 320; 
    canvas.canvasHeight = 240; 
    //camera setup
    canvas.video;
    canvas.fps; 
    //console.log(`canvasWidth = ${canvas.canvasWidth}, canvasHeight = ${canvas.canvasHeight}`);
    
    canvas.setup = function() {
        canvas.createCanvas(canvas.canvasWidth, canvas.canvasHeight);
        //cap the framerate to improve performance
        canvas.video = canvas.frameRate(30);
        canvas.video = canvas.createCapture(canvas.VIDEO);
        canvas.video.size(canvas.canvasWidth, canvas.canvasHeight);
        //hide original video/DOM element - p5 also shows the capture feed, 'hide()' hides it
        canvas.video.hide();
    }
    canvas.draw = function() {
        //draw/display camera feed
        canvas.image(canvas.video, 0, 0, canvas.canvasWidth, canvas.canvasHeight);
        //canvas.text(canvas.fps.toFixed(2) + " FPS", 10, 10);
        //console.log('fps = ' + canvas.frameRate());

        //if a camera exists, emit updateCameras and pass it the cameras data feed/stream
        if (cameraId != null){
            socket.emit('updateCameras', {id:cameraId, capture:canvas.canvas.toDataURL()});
        }

    }

}
//create camera object set canvasSketchs parent to be 'cameraCanvas'
let p5_CameraSketch = new p5(cameraSketch, 'cameraCanvas');
//module.exports = canvas;
//}