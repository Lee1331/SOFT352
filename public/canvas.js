let r, g, b;
let canvasDiv = document.getElementById('canvas');
let canvasWidth = canvasDiv.offsetWidth; 
let canvasHeight = canvasDiv.offsetHeight; 

function setup(){

    let canvas = createCanvas(canvasWidth, canvasHeight); 

    //move the canvas into the 'canvas' div
    canvas.parent('canvas');
    background(0);
    socket = io.connect('http://localhost:5500');

    //test -  assign other users brush colour randomly
    r = random(255);
    g = random(255);
    b = random(255);

    //if this socket recives a message called 'mouse'
    socket.on('mouse', function(data){
        //draw AT the location of the data object -  data.x and y
        noStroke();
        fill(r, g, b);
        //fill(0, 0, 100);
        ellipse(data.x, data.y, 36, 36);
    });
    
}

//'mousedDragged' is a reserved p5 name
    //only triggers when the mouse is dragged and held down     
function mouseDragged(){
    
    //removes outline from brush
    noStroke();

    fill(255);

    //draw an ellipse
    ellipse(mouseX, mouseY, 36, 36);

    //SENDING DATA ON THE CLIENT END
    //when we want to send a message, we create a js object which contains the data we want to send
    let data = {
        x: mouseX,
        y: mouseY
    }
    //then we emit the data, and inlcude a name for the message ('mouse' in this case)
    socket.emit('mouse', data);
    //console.log(`Sending : ${mouseX}, ${mouseY} from socket ${socket.id}`);
}

function mousePressed(){
    ellipse(mouseX, mouseY, 36, 36);
    //fill(r, g, b);
}

function windowResized() {
    //resizeCanvas(windowWidth, windowHeight);
    resizeCanvas(canvasWidth, canvasHeight);
}