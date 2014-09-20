var app = require("./app");
var router = require("./router");
var requestHandlers = require("./requestHandlers")

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;

app.start(router.route, handle);