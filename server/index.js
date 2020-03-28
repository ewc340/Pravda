var http = require('http');

http.createServer(function (req, res) {
  console.log("Accepted request, responding to query...\n")
  res.write('Hello World!\n'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
