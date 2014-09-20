var app = require("./app");
var router = require("./router");
var requestHandlers = require("./requestHandlers")

var handle = {};
handle["/"] = requestHandlers.testmongo;
handle["/search"] = requestHandlers.search;
handle["/testmongo"] = requestHandlers.testmongo;
handle["/results"] = requestHandlers.results;

app.start(router.route, handle);