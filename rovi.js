var md5 = require("./md5_2");
var request = require("request");
var secrets = require("./secrets")
var apikey = secrets.rovi.key;
var secret = secrets.rovi.secret;

// this API gets influences

// have to sign all request with a signature comprised of hash of current unix time concatenated to shared secret
function genSig() {
	var curdate = new Date();
	var gmtstring = curdate.toGMTString();
	var utc = Date.parse(gmtstring) / 1000;
	var md5hash = md5.hex_md5(apikey + secret + utc);
	return md5hash;
}

function getArtistParents(name, callback) {
	console.log("getArtistParents");
	var hash = genSig();
	var parents = [];
	request('http://api.rovicorp.com/data/v1.1/name/influencers?apikey='+apikey+'&sig='+hash+'&name='+name, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			var obj = JSON.parse(body);
			for (var i=0; i < obj.influencers.length; i++) {
				if (obj.influencers.length>0) parents.push(obj.influencers[i].name);
			}
			callback(null, parents);
		} else {
			console.log(error);
			callback(null, []);
		}
	});
}

function getArtistChildren(name, callback) {
	console.log("getArtistChildren");
	var hash = genSig();
	var children = [];
	request('http://api.rovicorp.com/data/v1.1/name/followers?apikey='+apikey+'&sig='+hash+'&name='+name, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			var obj = JSON.parse(body);
			for (var j=0; j < obj.followers.length; j++) {
				if (obj.followers.length>0) children.push(obj.followers[j].name);
			}
			callback(null, children);
		} else {
			console.log(res.statusCode);
			callback(null, []);
		}
	});
}


exports.getArtistParents = getArtistParents;
exports.getArtistChildren = getArtistChildren;