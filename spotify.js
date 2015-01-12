var request = require("request");
var async = require("async");
// first: get spotify artist id for searched artist
// second: get all relevant spotify info from api
// third: write info to DB
// fourth: query DB for chosen artist id
// fifth: return results to user

// these functions talk to Spotify's API

function getArtistIds(artists, callback) {
	console.log("getArtistIds");
	var artistIds = [];
	async.each(artists, function(artist, callback2) { // async here is used to loop serially through a sequence of asynchronous javascript calls
		request('http://api.spotify.com/v1/search?q='+artist+'&type=artist', function (error, res, body) {
			if (!error && res.statusCode == 200) {
				var obj = JSON.parse(body);
				if (obj.artists.items[0]) artistIds.push(obj.artists.items[0].id)
			} else {
			}
			callback2();
		});
	}, function(err) {
		callback(null, artistIds);
	})
}

function getArtistData(artistIds, callback) {
	console.log("getArtistData");
	var artistObjs = [];
	async.each(artistIds, function(artistId, callback2) {
		request('http://api.spotify.com/v1/artists/'+artistId, function (error, res, body) {
			if (!error && res.statusCode == 200) {
				var obj = JSON.parse(body);
				artistObjs.push(obj);
			} else {
			}
			callback2();
		});
	}, function(err) {
		callback(null, artistObjs);
	})
}

function getTrackData(trackIds, callback) {
	console.log("getTrackData");
	var trackObjs = [];
	async.each(trackIds, function(trackId, callback2) {
		request('http://api.spotify.com/v1/tracks/'+trackId, function (error, res, body) {
			if (!error && res.statusCode == 200) {
				var obj = JSON.parse(body);
				trackObjs.push(obj);
			} else {
			}
			callback2();
		});
	}, function(err) {
		callback(null, trackObjs);
	})
}

function getAlbumData(albumIds, callback) {
	console.log("getAlbumData");
	var albumObjs = [];
	var trackIds = [];
	var artistIds = [];
	async.each(albumIds, function(albumId, callback2) {
		request('http://api.spotify.com/v1/albums/'+albumId, function (error, res, body) {
			if (!error && res.statusCode == 200) {
				var obj = JSON.parse(body);
				var use = false;
				for(i=0; i<obj.tracks.items.length; i++) {
					if (obj.tracks.items[i].artists.length > 1) { 
						use = true;
						trackIds.push(obj.tracks.items[i].id);
						for(j=0; j<obj.tracks.items[i].artists.length; j++) {
							artistIds.push(obj.tracks.items[i].artists[j].id);
						}
					}
				}
				if (use) {
					albumObjs.push(obj);
				}
			} else {
			}
			callback2();
		});
	}, function(err) {
		callback(null, albumObjs, trackIds, artistIds);
	})
}

function getAlbumsByArtist(id, callback) {
	console.log("getAlbumsByArtist");
	var albumIds = [];
	request('http://api.spotify.com/v1/artists/'+id+'/albums?album_type=album,single,appears_on&market=US', function (error, res, body) {
		if (!error && res.statusCode == 200) {
			var obj = JSON.parse(body);
			for(i=0; i<obj.items.length; i++) {
				albumIds.push(obj.items[i].id);
			}
		} else {
		}
		callback(null, albumIds);
	})
}

exports.getAlbumsByArtist = getAlbumsByArtist;
exports.getAlbumData = getAlbumData;
exports.getTrackData = getTrackData;
exports.getArtistData = getArtistData;
exports.getArtistIds = getArtistIds;