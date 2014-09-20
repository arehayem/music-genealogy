var http = require("http");
var url = require("url");
var mongojs = require("mongojs");

//establish connection with database
var databaseUrl = "test";
var collections = ["testData"];
db = mongojs.connect(databaseUrl, collections);

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(handle, pathname, response);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
