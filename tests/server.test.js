const http = require('http');
const ioClientEnd = require('socket.io-client'); 
const ioServerEnd = require('socket.io');

let socket;
let httpServer;
let httpServerAddress;
let ioServer;

//at the start of the all the tests
beforeAll((done) => {
  //set up the servers
  httpServer = http.createServer().listen();
  httpServerAddress = httpServer.listen().address();
  ioServer = ioServerEnd(httpServer);
  //ends function
  done();
});
//before each test runs
beforeEach((done) => {
  //connect socket, make sures theres no delay on connecting opening, and force a connection. use websockets are the method of transport 
  socket = ioClientEnd.connect(`http://[${httpServerAddress.address}]:${httpServerAddress.port}`, {
  'reconnection delay': 0,
  'reopen delay': 0,
  'force new connection': true,
  transports: ['websocket']
});
socket.on('connect', () => {
  //ends function
  done();
});
});
///after each test
afterEach((done) => {
    //disconnect the socket if it's still connected
    if (socket.connected) {
        socket.disconnect();
    }
    //ends function
    done();
});

//once all the tests have run
afterAll((done) => {
  //close the servers
  ioServer.close();
  httpServer.close();
  //ends function
  done();
});

describe('test that socket.io works', () => {
  test('test messages can be emitted and then handled, and socket existance', (done) => {
    //when the server has connected, emit and pass it 'now connected'
    ioServer.emit('connected', 'now connected');
    //once the 'connected' emit has been recieved
    socket.once('connected', (message) => {
      //see if the message matches the one we emitted, this being 'connected' 
      expect(message).toBe('now connected');
      //ends function
      done();
    });
    //when the server connects to a socket
    ioServer.on('connection', (createdSocket) => {
      //the socket should exist
      expect(createdSocket).toBeDefined();
    });
    //when the server disconnects from a socket
    ioServer.on('disconnection', (createdSocket) => {
      //the socket shouldn't exist
      expect(createdSocket).toBeUndefined();
    });
  });

});