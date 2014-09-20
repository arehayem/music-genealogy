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
		'<textarea name="text" rows="20" cols="60"></textarea>'+
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
//	response.write("You've sent: " +
//	querystring.parse(postData).text);
	request('http://api.spotify.com/v1/search?q='+querystring.parse(postData).text+'&type=artist', function (error, res, body) {
		if (!error && res.statusCode == 200) {
			console.log("Request to Spotify's API succeeded.");
			console.log(body);
		} else {
			console.log("Request to Spotify's API failed.");
		}
	})

	response.end();
}

exports.search = search;
exports.results = results;