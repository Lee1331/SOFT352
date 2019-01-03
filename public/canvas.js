let cameraCanvasDiv = document.getElementById('cameraCanvas');
let cameraId;

socket.on('cameraId', function (updatedCameraId) {
    cameraId = updatedCameraId;
    console.log('cameraId = ' + cameraId);

});

socket.on('getCameras', function (camera) {
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

let canvasSketch = function(canvas) {
    let canvasDiv = document.getElementById('canvas');
    let canvasWidth = canvasDiv.offsetWidth; 
    let canvasHeight = canvasDiv.offsetHeight; 
    canvas.r = canvas.random(255);
    canvas.g = canvas.random(255);
    canvas.b = canvas.random(255);

    canvas.setup = function() {
        canvas.createCanvas(canvasWidth, canvasHeight);
        canvas.background(51);
    }
    canvas.draw = function(){
        canvas.fill(canvas.r, canvas.g, canvas.b);
        
    }
    canvas.peerDraw = function(){
        canvas.fill(canvas.r, canvas.g, canvas.b);
        
    }
    canvas.mousePressed = function(){
        canvas.noStroke();
        canvas.ellipse(canvas.mouseX, canvas.mouseY, 36, 36);
        let data = {
            x: canvas.mouseX,
            y: canvas.mouseY
        }
        socket.emit('mouse', data);
    }
    
    canvas.windowResized = function() {
        //resizeCanvas(windowWidth, windowHeight);
        canvas.resizeCanvas(canvas.canvasWidth, canvas.canvasHeight);
    }
    
    canvas.mouseDragged = function(){
        canvas.noStroke();
        canvas.draw();
        let data = {
            x: canvas.mouseX,
            y: canvas.mouseY
        }
        
        //ellipse(data.x, data.y,(canvas.random([0], [1])*100) , (canvas.random([0], [1])*100));
        canvas.ellipse(canvas.mouseX, canvas.mouseY, 36, 36);
        
        //then we emit the data, and inlcude a name for the message ('mouse' in this case)
        socket.emit('mouse', data);

    }
    
    socket.on('mouse', function(data){
        //draw AT the location of the data object -  data.x and y
        canvas.noStroke();
        canvas.peerDraw();
        canvas.ellipse(data.x, data.y,36, 36);
    });
}

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
    console.log(`canvasWidth = ${canvasWidth}, canvasHeight = ${canvasHeight}`);
    canvas.setup = function() {
        canvas.createCanvas(canvasWidth, canvasHeight);
        canvas.video = canvas.createCapture(canvas.VIDEO);
        canvas.video.size(canvasWidth, canvasHeight);
        //hide original video/DOM element
        canvas.video.hide();
    }
    canvas.draw = function() {
        //draw/display camera feed
        canvas.image(canvas.video, 0, 0, canvasWidth, canvasHeight);

        if (canvas.frameRate() > 55 && cameraId != null){
            //socket.emit('updateUser', {id:id, capture:cameraCanvas.canvas.toDataURL()});
            socket.emit('updateUser', {id:cameraId, capture:canvas.canvas.toDataURL()});
        }

    }
}
let p5_CameraSketch = new p5(cameraSketch, 'cameraCanvas');

