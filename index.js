var app = require("./app");
var router = require("./router");
var requestHandlers = require("./requestHandlers")

var handle = {};
handle["/"] = requestHandlers.search;
handle["/search"] = requestHandlers.search;
handle["/results"] = requestHandlers.results;
handle["/test"] = requestHandlers.test;
handle["/test2"] = requestHandlers.test2;
handle["/test3"] = requestHandlers.test3;
handle["/influences"] = requestHandlers.influences;
handle["/spider"] = requestHandlers.spider;

app.start(router.route, handle);
