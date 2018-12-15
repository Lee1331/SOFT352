    function setup(){
        //let canvas = createCanvas(200,200);
        let canvas = createCanvas(window.innerWidth / 1.33 , window.innerHeight / 1.33);
        //move the canvas into the 'canvas' div
        canvas.parent('canvas');
        
        background(0);
        socket = io.connect('http://localhost:5500');

        //if this socket recives a message called 'mouse'
        socket.on('mouse', function(data){
            //draw AT the location of the data object -  data.x and y
            noStroke();
            fill(0, 0, 100);
            ellipse(data.x, data.y, 36, 36);
        });
        
    }



    //'mousedDragged' is a reserved p5 name
        //only triggers when the mouse is dragged (and held down i think)
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
