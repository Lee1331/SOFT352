#Hangouts App
An interactive chatroom featuring a live canvas and camera support. 
This project was built for Plymouth University's SOFT352 module 

##Installing
    1 - Make sure [Node.js](https://nodejs.org/en/) is installed on your local machine
    2 - Clone/Download a copy of the project onto the local machine
    3 - Open up the project in an IDE and run ‘npm install’ to install the dependencies

##Built with:
    ###### This project was built using only Javascript frameworks to satisfy the critera for the SOFT352 module:
    [Node.js](https://nodejs.org/en/) - used to install project dependences, and to create/run the server from the command prompt
    [Express.js](https://expressjs.com/) - used to simplify server creation, and serve the public folder containing the client-side files to the users 
    [Socket.io](https://socket.io/) - handles user events (connecting/disconnecting/drawing etc.), and sends this data to the other connected users
    [P5.js](https://p5js.org/) - provides the interactive canvas and drawing functionality. P5.js is also used to display the users web camera, [WebRTC](https://webrtc.org/) was the inital choice but time constraints prevented its addition to the project   
    [JQuery](https://jquery.com/) - used to shorten/simplify the code in some places, such as adding the users to the ‘Online Users’ section
    [Jest](https://jestjs.io/) and [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Used to test parts of the application (most of the testing was done with white and black box tests)