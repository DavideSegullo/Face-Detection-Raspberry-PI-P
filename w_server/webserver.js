var fs = require('fs');

var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();

const options = {
  key: privateKey,
  cert: certificate
};

var  http = require('https').createServer(options, handler),
  io = require('socket.io')(http),
  cv = require('opencv4nodejs');

var fr = require('face-recognition').withCv(cv);

//var privateKey = fs.readFileSync('privatekey.pem').toString();
//var certificate = fs.readFileSync('certificate.pem').toString();

http.listen(8080);


function handler (req, res) {
  console.log('Incoming request');
  if (req.url.indexOf('polling') !== -1) { 
	fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
  } else {
    fs.readFile('.' + req.url, function (err, file) {
    //console.log(req.url);
    var type = "";

    type = req.url.match("(?<=\.)[^.]*$")[0];

    console.log(type);

    if (type == "js") {
      type = "javascript";
    }
  
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end('File not found');
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/' + type
      });
      res.end(file);
    }
  });
  }
}

const pngPrefix = 'data:image/png;base64,';
const jpgPrefix = 'data:image/jpeg;base64,';

io.sockets.on('connection', function(socket) {
  socket.on('rawVideo', function(data) {
    console.log("Frame Ricevuto");
    //socket.emit('rawVideo', data);
    //console.log(data);
    const base64data = data.split(',')[1];
    const buffer = Buffer.from(base64data, 'base64');
    //CV MAT
    const img = cv.imdecode(buffer);
    console.log(img);
    //CV IMG
    const cvImg = fr.CvImage(img);
    const detector = fr.FaceDetector();
    const faceRects = detector.locateFaces(cvImg);

    const faces = faceRects.map(mmodRect => fr.toCvRect(mmodRect.rect))
	.map(cvRect => img.getRegion(cvRect).copy());
   
    console.log(faces.length);
  });
});

/*
io.sockets.on('connection', function (socket) {// WebSocket Connection
  var lightvalue = 0; //static variable for current status
  socket.on('light', function(data) { //get light switch status from client
    lightvalue = data;
    //if (lightvalue) {
      console.log(lightvalue); //turn LED on or off, for now we will just show it in console.log
    //}
  });
});*/

/*
// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 30;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          face = faces[i];
          im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        }

        socket.emit('frame', { buffer: im.toBuffer() });
      });
    });
  }, camInterval);
};
*/
