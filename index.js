var app = require("./app");
var router = require("./router");
var requestHandlers = require("./requestHandlers")

var handle = {};
handle["/"] = requestHandlers.testmongo;
handle["/search"] = requestHandlers.search;
handle["/testmongo"] = requestHandlers.testmongo;

app.start(router.route, handle);