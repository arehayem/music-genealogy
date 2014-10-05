var exec = require("child_process").exec;
var querystring = require("querystring");
var request = require("request");

function search(response, postData) {
	console.log("Request handler 'search' was called.")

	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/results" method="post">'+
		'<textarea name="text" rows="2" cols="60"></textarea>'+
		'<input type="submit" value="Submit text" />'+
		'</form>'+
		'</body>'+
		'</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function results(response, postData) {
	console.log("Request handler 'results' was called.");
	response.writeHead(200, {"Content-Type": "text/plain"});
	request('http://api.spotify.com/v1/search?q='+querystring.parse(postData).text+'&type=artist', function (error, res, body) {
		if (!error && res.statusCode == 200) {
			console.log("Request to Spotify's API succeeded.");
			var obj = JSON.parse(body);
			var final_list = JSON.stringify(obj.artists.items[0].name);
			response.write(final_list);
			response.end();
		} else {
			console.log("Request to Spotify's API failed.");
			response.end();
		}

	})
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
exports.results = results;
