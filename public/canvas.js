/*
let r, g, b;
let canvasDiv = document.getElementById('canvas');
let canvasWidth = canvasDiv.offsetWidth; 
let canvasHeight = canvasDiv.offsetHeight; 

let redBtn = document.getElementById("redBtn");
let greenBtn = document.getElementById("greenBtn");
let blueBtn = document.getElementById("blueBtn");

let redSlider = document.getElementById("redSlider");
let greenSlider = document.getElementById("greenSlider");
let blueSlider = document.getElementById("blueSlider");




//store current shape in variable;
//when a shape button is pushed, update the variable
//then emit the variable in mouseDragged, and mosueClicked somehow (using a function would result in constant function calls)

//runs at the beginning of a P5 sketch
function setup(){

    let canvas = createCanvas(canvasWidth, canvasHeight); 


    //move the canvas into the 'canvas' div
    canvas.parent('canvas');
    background(51);

    socket = io.connect('http://localhost:5500');

    //test -  assign other users brush colour randomly
    r = random(255);
    g = random(255);
    b = random(255);

    //if this socket recives a message called 'mouse'
    socket.on('mouse', function(data){
        //draw AT the location of the data object -  data.x and y
        noStroke();
        //draw();
        peerDraw();


        //fill(r, g, b);
        //fill(0, 0, 100);
        //ellipse(data.x, data.y, 36, 36);
        ellipse(data.x, data.y,(random([0], [1])*100) , (random([0], [1])*100));
    });

}

//'mousedDragged' is a reserved p5 name
    //only triggers when the mouse is dragged and held down     
function mouseDragged(){
    
    //removes outline from brush
    noStroke();

    draw();
    //fill(255);

    //draw an ellipse
    //ellipse(mouseX, mouseY, 36, 36);

    //rect(mouseX, mouseY, 36, 36);

    //SENDING DATA ON THE CLIENT END
    //when we want to send a message, we create a js object which contains the data we want to send
    let data = {
        x: mouseX,
        y: mouseY
    }
    
    ellipse(data.x, data.y,(random([0], [1])*100) , (random([0], [1])*100));


    //then we emit the data, and inlcude a name for the message ('mouse' in this case)
    socket.emit('mouse', data);
    //console.log(`Sending : ${mouseX}, ${mouseY} from socket ${socket.id}`);

    //socket.emit('square', data);

    //testing cameras
    //createCapture(VIDEO);
    //capture = createCapture(VIDEO);
    //capture.size(320, 240);
}

function mousePressed(){
    ellipse(mouseX, mouseY, 36, 36);
    //fill(r, g, b);
}

function windowResized() {
    //resizeCanvas(windowWidth, windowHeight);
    resizeCanvas(canvasWidth, canvasHeight);
}

function draw(){
    fill(r, g, b);
    
}

function peerDraw(){

    fill(r, g, b);
}

function randomColour(){
    r = random(255);
    g = random(255);
    b = random(255);

}

*/

let cameraCanvasDiv = document.getElementById('cameraCanvas');
let id = null;

socket.on('myId', function (myId) {
    id = myId;
    console.log('myId = ' + myId);

});

socket.on('users', function (user) {
    $('img').remove();

    $.each(user, function(index, val){
        if(val != id){
            //$('cameraCanvas').append('<img id='+val+'>');
            //$('cameraWindow').append('<img id='+val+'>');
            cameraCanvasDiv.insertAdjacentHTML('beforeend', '<img id='+val+'>');

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
        canvas.video.hide();
    }
    canvas.draw = function() {
        canvas.image(canvas.video, 0, 0, canvasWidth, canvasHeight);

        if (canvas.frameRate() > 55 && id != null){
            //socket.emit('updateUser', {id:id, capture:cameraCanvas.canvas.toDataURL()});
            socket.emit('updateUser', {id:id, capture:canvas.canvas.toDataURL()});
        }

    }
}
let p5_CameraSketch = new p5(cameraSketch, 'cameraCanvas');

