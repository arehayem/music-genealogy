var app = require("./app");
var router = require("./router");
var requestHandlers = require("./requestHandlers")

var handle = {};
handle["/"] = requestHandlers.search;
handle["/search"] = requestHandlers.search;

app.start(router.route, handle);