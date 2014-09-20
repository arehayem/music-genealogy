var exec = require("child_process").exec;

function search(response) {
	console.log("Request handler 'start' was called.")

	exec("dir", function(error, stdout, stderr) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(stdout);
		response.end();
	});
	
	
}

function testmongo(response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	console.log("Request handler 'testmongo' was called.")
	db.testData.find( {"name": "mongo" }, function(err, testData) {
		if(err || !testData) response.write("No 'x' equal to 3");
		else testData.forEach( function(x) {
			console.log(x);
		} );
	});
	response.write("Hi you're testing mongo");
	response.end();
}

exports.search = search;
exports.testmongo = testmongo;