window.onload=function(){
p5.disableFriendlyErrors = true; // disables the p5 Friendly Error System (FES) - performance increase

//used to keep track of the uses camera
let cameraId;

//Client Side Canvas/Camera sockets
socket.on('cameraId', function (updatedCameraId) {
    cameraId = updatedCameraId;
    //console.log('cameraId = ' + cameraId);

});

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

socket.on('updateUser', function (data) {
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
    canvas.backgroundColour = canvas.randNum()
    
    //default p5 functions
    canvas.setup = function() {
        canvas.createCanvas(canvas.canvasWidth, canvas.canvasHeight);
        canvas.background(canvas.backgroundColour);
    }
    canvas.draw = function(){
        canvas.fill(canvas.r, canvas.g, canvas.b);
        
    }
    canvas.peerDraw = function(){
        canvas.fill(canvas.r, canvas.g, canvas.b);

    }
    canvas.mousePressed = function(){
        canvas.noStroke();
        canvas.ellipse(canvas.mouseX, canvas.mouseY, 18, 18);
        let data = {
            x: canvas.mouseX,
            y: canvas.mouseY
        }
        socket.emit('mouse', data);
    }
    
    canvas.windowResized = function() {
        canvas.resizeCanvas(canvas.canvasWidth, canvas.canvasHeight);
    }
    
    canvas.mouseDragged = function(){
        canvas.noStroke();
        canvas.draw();
        let data = {
            x: canvas.mouseX,
            y: canvas.mouseY
        }
        
        canvas.ellipse(canvas.mouseX, canvas.mouseY, 18, 18);
        
        //then we emit the data, and inlcude a name for the message ('mouse' in this case)
        socket.emit('mouse', data);

    }
    
    
    socket.on('mouse', function(data){
        //draw AT the location of the data object -  data.x and y
        canvas.noStroke();
        canvas.peerDraw();
        canvas.ellipse(data.x, data.y, 18, 18);
    });
}
//craete canvas object set canvasSketchs parent to be 'canvas'
let p5_CanvasSketch = new p5(canvasSketch, 'canvas');

//Sketch 1
let cameraSketch = function(canvas) {
    //canvas.cameraCanvasDiv = document.getElementById('cameraCanvas');
    //canvas.canvasWidth = canvas.cameraCanvasDiv.offsetWidth; 
    //canvas.canvasHeight = canvas.cameraCanvasDiv.offsetHeight; 
    //canvas.x = 320;
    //canvas.y = 480;
    
    //canvas.cameraCanvas; 
    let cameraCanvas;

    let cameraCanvasDiv = document.getElementById('cameraCanvas');
    //console.log('cameraCanvasDiv = ' + cameraCanvasDiv.offsetWidth)
    //let canvasWidth = cameraCanvasDiv.offsetWidth; 
    //let canvasHeight = cameraCanvasDiv.offsetHeight; 
    let canvasWidth = 320; 
    let canvasHeight = 240;
    //let canvasWidth = cameraCanvasDiv.clientWidth; 
    //let canvasHeight = cameraCanvasDiv.clientHeight; 
    
    canvas.video;
    canvas.fps = canvas.frameRate();
    console.log(`canvasWidth = ${canvasWidth}, canvasHeight = ${canvasHeight}`);
    canvas.setup = function() {
        canvas.createCanvas(canvasWidth, canvasHeight);
        canvas.video = canvas.createCapture(canvas.VIDEO);
        canvas.video.size(canvasWidth, canvasHeight);
        //hide original video/DOM element - p5 also shows the capture feed, 'hide()' hides it
        canvas.video.hide();
    }
    canvas.draw = function() {
        //draw/display camera feed
        canvas.image(canvas.video, 0, 0, canvasWidth, canvasHeight);
        canvas.text(canvas.fps.toFixed(2) + " FPS", 10, 10);
        //console.log('fps = ' + canvas.frameRate());
        //if a camera exists, emit updateUser and pass it the cameras data feed/stream 
        //if (canvas.frameRate() > 55 && cameraId != null){
        if (cameraId != null){
            //socket.emit('updateUser', {id:id, capture:cameraCanvas.canvas.toDataURL()});
            socket.emit('updateUser', {id:cameraId, capture:canvas.canvas.toDataURL()});
        }

    }
    canvas.mousePressed = function() {
        canvas.video.remove;
    }
}
//craete camera object set canvasSketchs parent to be 'cameraCanvas'
let p5_CameraSketch = new p5(cameraSketch, 'cameraCanvas');
module.exports = canvas;
}