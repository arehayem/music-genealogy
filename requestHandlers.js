var querystring = require("querystring");
var request = require("request");
var database = require("./database");
var spotify = require("./spotify");
var async = require("async");
var rovi = require("./rovi");

var queue = [];
var next = "drake"; // could choose any starting point artist

// spiders through spotifies data from given starting point
function spider(response) {
	results2(response, next, function(artists) {
		for (var i=0;i<artists.length;i++) {
			if (queue.indexOf(artists[i].name) == -1) queue.push(artists[i].name);
		}
		next = queue.shift();
		console.log(next);
		setTimeout(spider(response), 5000);
	});
}

// this was a route just used for testing the influences feature
function influences(response, postData) {
	console.log("Request handler 'influences' was called.");
	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/influences" method="post">'+
		'<input name="text" />'+
		'<input type="submit" value="Submit text" />'+
		'</form>'+
		'</body>'+
		'</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	var text = querystring.parse(postData).text;
	rovi.getArtistRelatives(text, function(parents, children) {
		response.write("influencers:<br>");
		response.write(JSON.stringify(parents));
		response.write("<br><br>influencees<br>");
		response.write(JSON.stringify(children));
		response.end();
	})
}

//this was a route just used for testing the searching feature
function search(response, postData) {
	console.log("Request handler 'search' was called.")
  //var body = '<!DOCTYPE HTML><html manifest="" lang="en-US"><head>    <meta charset="UTF-8">  <title>Music</title>  <style type="text/css">    /**         * Example of an initial loading indicator. * It is recommended to keep this as minimal as possible to provide instant feedback* while other resources are still being loaded for the first time*/html, body {height: 100%;background-color: #1985D0}#appLoadingIndicator {position: absolute;top: 50%;margin-top: -15px;text-align: center;width: 100%;height: 30px;-webkit-animation-name: appLoadingIndicator;-webkit-animation-duration: 0.5s;-webkit-animation-iteration-count: infinite;-webkit-animation-direction: linear;}#appLoadingIndicator > * {background-color: #FFFFFF;display: inline-block;height: 30px;-webkit-border-radius: 15px;margin: 0 5px;width: 30px;opacity: 0.8;}@-webkit-keyframes appLoadingIndicator{0% {opacity: 0.8}50% {opacity: 0}100% {opacity: 0.8}}</style><!-- The line below must be kept intact for Sencha Command to build your application --><script id="microloader" type="text/javascript" src=".sencha/app/microloader/development.js"></script></head><body><div id="appLoadingIndicator"><div></div><div></div><div></div></div></body></html>';

  var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/results" method="post">'+
		'<input name="text" />'+
		'<input type="submit" value="Submit text" />'+
		'</form>'+
		'<form action="/test3" method="post">'+
		'<input name="text" />'+
		'<input type="submit" value="Add track" />'+
		'</form>'+
		'<form action="/test2" method="post">'+
		'<input name="text" />'+
		'<input type="submit" value="Add album" />'+
		'</form>'+
		'<a href=/test>getMapTest</a><br>'+
		'</body>'+
		'</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

// this is the main route of the app, the frontend make a GET request to this route in order to process an artist and retrieve JSON
// postData is from that GET request, needs to be parsed for params
function results(response, postData) {

	console.log("****************");
	console.log("****************");
	console.log("****************");
// first: get spotify artist id for searched artist
// second: get all relevant spotify info from api
// third: write info to DB
// fourth: query DB for chosen artist id
// fifth: return results to user
	console.log("Request handler 'results' was called.");
	console.log(postData);
      var headers = {};
      // IE8 does not allow domains to be specified, just the *
      // headers["Access-Control-Allow-Origin"] = req.headers.origin;
      headers["Content-Type"] = "application/json";
      headers["Access-Control-Allow-Origin"] = "http://localhost:8080"; // these headers are necessary because we are getting a request from a different port than the app is running on
      headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = true;
      headers["Access-Control-Max-Age"] = '86400'; // 24 hours
      headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
      response.writeHead(200, headers);
      if(querystring.parse(postData).mode == 1) { //artist by name
		request('http://api.spotify.com/v1/search?q='+querystring.parse(postData).text+'&type=artist', function (error, res, body) { // make API reqeust
			if (!error && res.statusCode == 200 && (typeof JSON.parse(body).artists.items[0] != "undefined")) {
				console.log("Request to Spotify's API succeeded.");
				var id = JSON.parse(body).artists.items[0].id;
				database.db_artistHasRelations(id, function(status) { // check if already in DB
					if(status == false) {
						processBody(body, response);
					} else {
						database.db_getMap(id, function(err, result) { // if it is, just grab the JSON from our DB
							response.end(JSON.stringify(result));
						});
					}
				});
			} else {
				console.log("FAILED TO GET ARTIST ID "+error);
				response.end();
			}
		});
	  } else { //artist by id
	  	database.db_artistHasRelations(querystring.parse(postData).text, function(status) {
	  		if(status == false) {
	  			console.log("Requesting title...");
	  			request('http://api.spotify.com/v1/artists/'+querystring.parse(postData).text, function (err, resp, body2) { // get name from id
					console.log("Request to Spotify's API succeeded.");
					if (!err && resp.statusCode == 200) {
						request('http://api.spotify.com/v1/search?q='+JSON.parse(body2).name+'&type=artist', function (error, res, body) { // process by name
							console.log("Request to Spotify's API succeeded.");
							if (!error && res.statusCode == 200) {
								processBody(body, response);
							} else {
								console.log("FAILED TO GET ARTIST ID "+error);
								response.end();
							}
						});
					} else {
						console.log("FAILED TO GET ARTIST ID "+err);
						response.end();
					}
				});
	  		} else {
	  			database.db_getMap(querystring.parse(postData).text, function(err, result) {
					response.end(JSON.stringify(result));
				});
	  		}
	  	});
	  }
}

// the main process function
function processBody(body, response) {
	var ARTISTOBJ = JSON.parse(body).artists.items[0];
	var CHILDREN = [];
	var PARENTS = [];
	var PARENTOBJS = [];
	var CHILDRENOBJS = [];
	var PARENTIDS = [];
	var CHILDIDS = [];
	var TRACKIDS = [];
	var ARTISTIDS = [];
	var TRACKOBJS = [];
	async.waterfall([ // this forces a sequence of asynchronous javascript calls to complete serially, passing params to each other
		function(callback) {
			database.db_addArtist([ARTISTOBJ], 1, callback);
			console.log("db_addArtist_primary");
		},
		function(callback) {
			rovi.getArtistChildren(ARTISTOBJ.name, callback);
		},
		function(children, callback) {
			CHILDREN = children;
			rovi.getArtistParents(ARTISTOBJ.name, callback);
		},
		function(parents, callback) {
			spotify.getArtistIds(parents, callback);
		},
		function(artistIds, callback) {
			PARENTIDS = artistIds;
			spotify.getArtistData(artistIds, callback);
		},
		function(artistObjs, callback) {
			PARENTOBJS = artistObjs;
			spotify.getArtistIds(CHILDREN, callback);
		},
		function(artistIds, callback) {
			CHILDIDS = artistIds;
			spotify.getArtistData(artistIds, callback);
		},
		function(artistObjs, callback) {
			CHILDRENOBJS = artistObjs;
			database.db_addArtist(PARENTOBJS, 0, callback);
			console.log("db_addArtist_parents");
		},
		function(callback) {
			database.db_addArtist(CHILDRENOBJS, 0, callback);
		},
		function(callback) {
			database.db_addInfluences(PARENTIDS, ARTISTOBJ.id, "parent", callback);
		},
		function(callback) {
			database.db_addInfluences(CHILDIDS, ARTISTOBJ.id, "child", callback);
		},
		function(callback) {
			spotify.getAlbumsByArtist(ARTISTOBJ.id, callback);
		},
		function(albumIds, callback) {
			spotify.getAlbumData(albumIds, callback);
		},
		function(albumObjs, trackIds, artistIds, callback) {
			TRACKIDS = trackIds;
			ARTISTIDS = artistIds;
			database.db_addAlbum(albumObjs, callback);
		},
		function(callback) {
			spotify.getTrackData(TRACKIDS, callback);
		},
		function(trackObjs, callback) {
			TRACKOBJS = trackObjs;
			database.db_addTrack(trackObjs, callback);
		},
		function(callback) {
			spotify.getArtistData(ARTISTIDS, callback);
		},
		function(artistObjs, callback) {
			database.db_addArtist(artistObjs, 0, callback);
		},
		function(callback) {
			database.db_addRelease(TRACKOBJS, callback);
		},
		function(callback) {
			database.db_getMap(ARTISTOBJ.id, callback);
		}
	], function(err, result) {
		if (err) {
			response.write(err);
			response.end();
		} else {
			response.end(JSON.stringify(result));
		}
	})
}

// modified results function for spider route (this is a function, where 'results' is a route)
function results2(response, postData, callback3) {

	console.log("****************");
	console.log("****************");
	console.log("****************");
// first: get spotify artist id for searched artist
// second: get all relevant spotify info from api
// third: write info to DB
// fourth: query DB for chosen artist id
// fifth: return results to user
	console.log("Request handler 'results' was called.");
	console.log(postData);
      var headers = {};
      // IE8 does not allow domains to be specified, just the *
      // headers["Access-Control-Allow-Origin"] = req.headers.origin;
      headers["Content-Type"] = "application/json";
      headers["Access-Control-Allow-Origin"] = "http://localhost:8080";
      headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = true;
      headers["Access-Control-Max-Age"] = '86400'; // 24 hours
      headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
		request('http://api.spotify.com/v1/search?q='+postData+'&type=artist', function (error, res, body) {
			if (!error && res.statusCode == 200) {
				console.log("Request to Spotify's API succeeded.");
				var id = JSON.parse(body).artists.items[0].id;
				database.db_artistHasRelations(id, function(status) {
					processBody2(body, response, callback3);
				});
			} else {
				console.log("FAILED TO GET ARTIST ID "+error);
				callback3([]);
			}
		});
}

// corresponding altered process function for spider route
function processBody2(body, response, callback3) {
	var ARTISTOBJ = JSON.parse(body).artists.items[0];
	var CHILDREN = [];
	var PARENTS = [];
	var PARENTOBJS = [];
	var CHILDRENOBJS = [];
	var PARENTIDS = [];
	var CHILDIDS = [];
	var TRACKIDS = [];
	var ARTISTIDS = [];
	var TRACKOBJS = [];
	var ARTISTOBJS = [];
	async.waterfall([
		function(callback) {
			database.db_addArtist([ARTISTOBJ], 1, callback);
			console.log("db_addArtist_primary");
		},
		function(callback) {
			rovi.getArtistChildren(ARTISTOBJ.name, callback);
		},
		function(children, callback) {
			CHILDREN = children;
			rovi.getArtistParents(ARTISTOBJ.name, callback);
		},
		function(parents, callback) {
			spotify.getArtistIds(parents, callback);
		},
		function(artistIds, callback) {
			PARENTIDS = artistIds;
			spotify.getArtistData(artistIds, callback);
		},
		function(artistObjs, callback) {
			PARENTOBJS = artistObjs;
			spotify.getArtistIds(CHILDREN, callback);
		},
		function(artistIds, callback) {
			CHILDIDS = artistIds;
			spotify.getArtistData(artistIds, callback);
		},
		function(artistObjs, callback) {
			CHILDRENOBJS = artistObjs;
			database.db_addArtist(PARENTOBJS, 0, callback);
			console.log("db_addArtist_parents");
		},
		function(callback) {
			database.db_addArtist(CHILDRENOBJS, 0, callback);
		},
		function(callback) {
			database.db_addInfluences(PARENTIDS, ARTISTOBJ.id, "parent", callback);
		},
		function(callback) {
			database.db_addInfluences(CHILDIDS, ARTISTOBJ.id, "child", callback);
		},
		function(callback) {
			spotify.getAlbumsByArtist(ARTISTOBJ.id, callback);
		},
		function(albumIds, callback) {
			spotify.getAlbumData(albumIds, callback);
		},
		function(albumObjs, trackIds, artistIds, callback) {
			TRACKIDS = trackIds;
			ARTISTIDS = artistIds;
			database.db_addAlbum(albumObjs, callback);
		},
		function(callback) {
			spotify.getTrackData(TRACKIDS, callback);
		},
		function(trackObjs, callback) {
			TRACKOBJS = trackObjs;
			database.db_addTrack(trackObjs, callback);
		},
		function(callback) {
			spotify.getArtistData(ARTISTIDS, callback);
		},
		function(artistObjs, callback) {
			ARTISTOBJS = artistObjs;
			database.db_addArtist(artistObjs, 0, callback);
		},
		function(callback) {
			database.db_addRelease(TRACKOBJS, callback);
		},
		function(callback) {
			database.db_getMap(ARTISTOBJ.id, callback);
		}
	], function(err, result) {
		callback3(ARTISTOBJS);
		if (err) {
		} else {
		}
	})
}


// a bunch of routes used just for testing
function test(response, postData) {
	console.log("Entered test function.");
	var testdata = require('./nodetofront.json');
	//Get parents and children into json
	database.db_getMap('3PhoLpVuITZKcymswpck5b', function(err, data) {
	//database.db_getArtist('1uNFoZAHBGtllmzznpCI3s', function(data) {
		response.write(JSON.stringify(data, null, 3));
		response.end();
	});
}

function test2(response, postData) {
	console.log("Entered addAlbum test function.");
	//album request believe deluxe edn by justin
	request('https://api.spotify.com/v1/albums/'+querystring.parse(postData).text, function (error, res, body) {
	console.log('https://api.spotify.com/v1/albums/'+querystring.parse(postData).text);
		if (!error && res.statusCode == 200) {
			console.log("Request to Spotify's API succeeded.");
			var obj = JSON.parse(body);
			database.db_addAlbum(obj, function(data) {
				response.write(data);
				response.end();
			});
		} else {
			console.log("Request to Spotify's API failed.");
			response.end();
		}
	});
}

function test3(response, postData) {
	console.log("Entered addTrack test function.");
	//get bieber's All Around the World
	request('https://api.spotify.com/v1/tracks/'+querystring.parse(postData).text, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			console.log("Request to Spotify's API succeeded.");
			var obj = JSON.parse(body);
			database.db_addTrack(obj, function(data) {
				response.write(data);
				response.end();
			});
		} else {
			console.log("Request to Spotify's API failed.");
			response.write("Request to Spotify's API failed.");
			response.end();
		}
	});
}

exports.search = search;
exports.results = results;
exports.test = test;
exports.test2 = test2;
exports.test3 = test3;
exports.influences = influences;
exports.spider = spider;