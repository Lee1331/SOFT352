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
//console.log(redSlider.value);

//store current shape in variable;
//when a shape button is pushed, update the variable
//then emit the variable in mouseDragged, and mosueClicked somehow (using a function would result in constant function calls)


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
        draw();
        //fill(r, g, b);
        //fill(0, 0, 100);
        ellipse(data.x, data.y, 36, 36);
    });

    socket.on('square', function(data){
        //draw AT the location of the data object -  data.x and y
        noStroke();
        draw();
        //fill(r, g, b);
        //fill(0, 0, 100);

        rect(data.x, data.y, 36, 36);
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
    ellipse(mouseX, mouseY, 36, 36);
    //rect(mouseX, mouseY, 36, 36);

    //SENDING DATA ON THE CLIENT END
    //when we want to send a message, we create a js object which contains the data we want to send
    let data = {
        x: mouseX,
        y: mouseY
    }
    //then we emit the data, and inlcude a name for the message ('mouse' in this case)
    socket.emit('mouse', data);
    //console.log(`Sending : ${mouseX}, ${mouseY} from socket ${socket.id}`);

    socket.emit('square', data);
}

function mousePressed(){
    ellipse(mouseX, mouseY, 36, 36);
    //fill(r, g, b);
}

function windowResized() {
    //resizeCanvas(windowWidth, windowHeight);
    resizeCanvas(canvasWidth, canvasHeight);
}

function brushRed(){
    //fill(244, 67, 54);
    fill(255, 0, 0);
}

function brushSquare(){
    //fill(244, 67, 54);
    fill(255, 0, 0);
    //socket.emit('square', data);
}

function draw(){
    fill(r, g, b);
    
}

function randomColour(){
    r = random(255);
    g = random(255);
    b = random(255);

}