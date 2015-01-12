var mysql = require("mysql");
var spotify = require("./spotify");
var async = require("async");
var databasepass = require("./secrets").database.password;

//Inserts into the DB all artists contained in the JSON object

function db_addArtist(artistObjs, mode, callback) {
	var db = db_start();
	db.connect();
	if(mode) {
		var id = artistObjs[0].id;
		db_artistHasRelations(id, function(status) {
			if(status) {
				var url = artistObjs[0].images.length > 1 ? artistObjs[0].images[1].url : 'NULL';
				var qString = 'INSERT IGNORE INTO Artists(id, image_url, popularity, name, viewed) VALUES ('+
								artistObjs[0].id+', '+url+', '+artistObjs[0].popularity+', '+artistObjs[0].name+', 1)';
				db.query(qString, [list], function(err, results, fields) {
					if (err) {console.log(err);}
					callback(null);
				});
				db.end();
			} else {
				db.query('UPDATE Artists SET viewed=1 WHERE id="'+id+'"', function(err) {
					if (err) {console.log(err);}
					callback(null);
				});
				db.end()
			}
		});
	} else {
		var list = [];
		async.each(artistObjs, function(artistObj, callback2) {
			var id = artistObj.id;
			var name = artistObj.name;
			var pop = artistObj.popularity;
			var url = artistObj.images.length > 1 ? artistObj.images[1].url : 'NULL';
			list.push([id, url, pop, name, mode]);
			callback2();
		}, function(err) {
			if (err) console.log(err);
			var qString = 'INSERT IGNORE INTO Artists(id, image_url, popularity, name, viewed) VALUES ?';
			console.log(qString+JSON.stringify(list));
			db.query(qString, [list], function(err, results, fields) {
				if (err) {
						console.log(err);
				}
				callback(null);
			});
			db.end();
		})
	}
	
}

//Add Album to db
function db_addAlbum(albumObjs, callback) {
	console.log("db_addAlbum");
	var list = [];
	async.each(albumObjs, function(albumObj, callback2) {
		var url = albumObj.images.length > 1 ? albumObj.images[1].url : 'NULL';
	list.push([albumObj.id, url, albumObj.popularity, albumObj.name, albumObj.release_date]);
		callback2();
	}, function(err) {
		var qString = 'INSERT IGNORE INTO Albums (aid, image_url, popularity, title, release_date) VALUES ?';
		var db = db_start();
		db.connect();
		db.query(qString, [list], function(err, result) {
			if (err) {
				console.log(err);
			}
			callback(null);
		});
		db.end();
		if (err) console.log(err);
	})
}

//Add track from object
function db_addTrack(trackObjs, callback) {
	var list = [];
	async.each(trackObjs, function(trackObj, callback2) {
		list.push([trackObj.id, trackObj.popularity, trackObj.name, trackObj.album.id]);
		callback2();
	}, function(err) {
		var qString = 'INSERT IGNORE INTO Tracks (tid, popularity, name, aid) VALUES ?';
		var db = db_start();
		db.connect();
		db.query(qString, [list], function(err, result) {
			if (err) console.log(err);
			callback(null);
		});
		db.end();
		if (err) console.log(err);
	})
}

//Add to Releases table
function db_addRelease(trackObjs, callback) {
	var list = [];
	async.each(trackObjs, function(trackObj, callback2) {
		async.each(trackObj.artists, function(artistObj, callback3) {
		list.push([artistObj.id, trackObj.id]);
			callback3();
		}, function(err) {
			if (err) console.log(err);
			callback2();
		})
	}, function(err) {
		var db = db_start();
		db.connect();
		var qString = 'INSERT IGNORE INTO Releases (id, tid) VALUES ?';
		db.query(qString, [list], function(err, result) {
			if (err) {
				console.log(err);
			}
			callback(null);
		});
		db.end();
		if (err) console.log(err);
	})
}

//Add Influence
function db_addInfluences(artistIds, id, relationship, callback) {
	console.log("db_addInfluences");
	var list = [];
	async.each(artistIds, function(artistId, callback2) {
		list.push([((relationship=="parent") ? artistId : id), ((relationship=="parent") ? id : artistId)]);
		callback2();
	}, function(err) {
		var qString = 'INSERT IGNORE INTO Influences (pid, cid) VALUES ?';
		var db = db_start();
		db.connect();
		db.query(qString, [list], function(err, results) {
			if (err) console.log(err);
			callback(null);
		});
		db.end();
		if (err) console.log(err);
	})
}

//Retrieve artist
function db_getArtist(artist, output) { //artist id
	var db = db_start();
	db.connect();
	var qString = 'SELECT * from Artists WHERE id = "'+artist+'"';
	db.query(qString, function(err, results) {
		if (err) output(err+' on '+err.index);
		if(results.length == 0) {
			output(false);
		} else {
			output(results);
		}
	});
	db.end();
}

//Get frontend content
function db_getMap(id, callback) { //data=id string
	console.log("db_getMap");
	var db = db_start();
	db.connect();
	//Get base info
	var qString = 'SELECT a.id, a.name, a.image_url, a.popularity FROM Artists a WHERE a.id = \''+id+'\' ;'+
	//Get collaborations
	'SELECT s.name, s.id, s.image_url as url1, t.aid, t.name as tname, r.tid, a.title, a.image_url as url2, a.popularity FROM Artists s INNER JOIN Releases r ON s.id = r.id INNER JOIN Tracks t ON t.tid=r.tid INNER JOIN Albums a ON a.aid=t.aid WHERE r.tid IN (SELECT tid FROM Releases WHERE id="'+id+'") AND r.id != "'+id+'" ORDER BY s.id DESC, t.aid, r.tid;'+
 	//Get parents
	'SELECT a.id, a.name, a.image_url FROM Artists a INNER JOIN Influences i ON i.pid = a.id WHERE i.cid = \''+id+'\' ;'+
	//Get children
	'SELECT a.id, a.name, a.image_url FROM Artists a INNER JOIN Influences i ON i.cid = a.id WHERE i.pid = \''+id+'\';';
	db.query(qString, function(err, results) {
		if (err) console.log(err);
		if (results.length == 0) {
			callback(null, {id:"no results"});
		} else {
			var collab = [];
			for(var i in results[1]) {
				if (collab.map(function(x){return x.id;}).indexOf(results[1][i].id) < 0) {
					collab.push({id:results[1][i].id, name:results[1][i].name, image_url:results[1][i].url1, albums:[]});
				}
			}
			for(var i in collab) {
				var l = 0;
				for(var j = results[1].map(function(x){return x.id;}).indexOf(collab[i].id); results[1][j] != undefined && results[1][j].id == collab[i].id; j++) {
					if (collab[i].albums.map(function(x){return x.id;}).indexOf(results[1][j].aid) < 0) {
						collab[i].albums.push({id:results[1][j].aid, title:results[1][j].title, image_url:results[1][j].url2, popularity:results[1][j].popularity, tracks:[]});
						var block = results[1].filter(function(val){return val.id == collab[i].id;});
						for(var k = block.map(function(x){return x.aid;}).indexOf(collab[i].albums[l].id); block[k] != undefined && block[k].aid == collab[i].albums[l].id && block[k].id == collab[i].id; k++) {
							collab[i].albums[l].tracks.push({id:block[k].tid, name:block[k].tname});
						}
					l++;
					}
				}
			}
			//console.log(JSON.stringify(collab, null, 3));
			var frontend = {artist:results[0], collaborations:collab, parents:results[2], children:results[3]};
			callback(null, frontend);
		}
		db.end();
	});
}

//Check if artist has collaborations and relations
function db_artistHasRelations(id, callback) {
	console.log("db_artistHasRelations");
	var db = db_start();
	db.connect();
	var qString = 'SELECT * FROM Artists WHERE viewed=1 AND id="'+id+'"';
// 	var qString = 'SELECT * FROM Influences WHERE pid="'+id+'";'+
// 					'SELECT * FROM Influences WHERE cid="'+id+'";'+
// 					'SELECT * FROM Releases WHERE id="'+id+'";'
	db.query(qString, function(err, results) {
		if (err) console.log(err);
		if (results.length > 0) {// && results[1].length > 0 && results[2].length > 0)
			callback(true);
		} else {
			callback(false);
		}
	});
	db.end();
}

function db_start() { 
	return mysql.createConnection(
		{
		  host     : 'localhost',
		  user     : 'root',
		  password : databasepass,
		  database : 'musicDB',
		  multipleStatements : true
		}
	);
}

exports.db_addArtist = db_addArtist;
exports.db_addAlbum = db_addAlbum;
exports.db_addTrack = db_addTrack;
exports.db_addRelease = db_addRelease;
exports.db_getMap = db_getMap;
exports.db_artistHasRelations = db_artistHasRelations;
exports.db_getArtist = db_getArtist;
exports.db_addInfluences = db_addInfluences;