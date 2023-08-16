
import haxe.Json;
import sys.io.File;
import sys.FileSystem;
import js.node.Http as ServerHttp;
import haxe.Http;



/*
	start server
	------------
 */
		var endIt=110;
class Main {
	static function main2(){
		fetch('https://decentral-nodejs.tomzcn.repl.co/api','{"message":"ping"}',log_it);
	}
	static function main(){
		trace(endIt);
		trace(server_exist('https://decentral-nodejs.tomzcn.repl.co/api'));
	}
	static function main1() {
		file_init();
		final port = 8001;
		final ip = '0.0.0.0';
		var server = ServerHttp.createServer(function(request, response) {
			if (request.url == '/') {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end("<h1>root<h1>\n");
			} else if (request.url == '/test') {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end("<h1>test<h1>\n");
			} else if (request.url == '/list-servers') {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end(restful_list_servers());
			} else if (request.url == '/read-article') {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end(filedb_get("article", "main"));
			} else if (request.url == '/api') {
				if (request.method == 'POST') {
					var body = '';
					request.on('data', (chunk) -> {
						body += Std.string(chunk);
					});
					request.on('end', (chunk) -> {
						response.writeHead(200, {"Content-Type": "application/json"});
						response.end(api(body));
					});
				}
			} else {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end("<h1>else<h1>\n");
			};
		});

		server.listen(port);

		trace('Server running at $ip : $port');
	}
}

/*

	diffrerent to python version.
 */
// api function
//----------------
function api(request:String):String {
	trace('api request');
	trace(request);
	var request_json = haxe.Json.parse(request);
	var result = {'message': ''};
	var result_string = '{"message": "completed"}';

	// pingpong
	if (request_json.message == 'ping') {
		result.message = 'pong';
		result_string = haxe.Json.stringify(result);
		return result_string;
	};

	// add server
	if (request_json.message == 'add_server') {
		// trace('----add server----');
		var server_url = request_json.server_url;
		var my_url = request_json.my_url;

		// exist?
		fetch(server_url, '{"message":"ping"}', function(data) {
			trace(data);
		});
		fetch(server_url, '{"message":"ping"}', function(data) {
			if (data != '{"message":"pong"}') {
				throw 'server not exist. so stop.';
			}
		});

		// exist in file?
		if (filedb_has('servers', server_url)) {
			throw 'has exist in db.';
		}

		// add server url to file
		filedb_set('servers', server_url, 1);

		// tell to servers
		var servers_object = filedb1_get('server');
		var servers = Reflect.fields(servers_object);
		for (url in servers) {
			say(url, '{"message":"broadcast_add_server","server_url":"$url"}', function(data) {});
		}

		// tell to the server
		say(server_url, '{"message":"broadcast_add_server","server_url":"$my_url"}', function(data) {});
	}

	// broadcast add server
	else if (request_json.message == 'broadcast_add_server') {
		var server_url = request_json.server_url;

		// exist in file?
		if (filedb_has('servers', server_url)) {
			throw 'has exist in db.';
		}

		// add server url to file
		filedb_set('servers', server_url, 1);
	}

	// list server
	else if (request_json.message == 'list_servers') {
		var result = restful_list_servers();
		result_string = '{"message":"$result"}';
	};

	// article
	else if (request_json.message == 'article') {
		var article = request_json.article;
		filedb_set("article", "main", article);

		// tell to servers
		var servers_object = filedb1_get('server');
		var servers = Reflect.fields(servers_object);
		for (url in servers) {
			say(url, '{"message":"broadcast_article","article":"$article"}', function(data) {});
		}
	};

	// broadcast article
	else if (request_json.message == 'broadcast_article') {
		trace('broadcast article');
		trace(request);
		var article = request_json.article;
		filedb_set("article", "main", article);
	};

	// read article
	else if (request_json.message == 'read_article') {
		var article = filedb_get("article", "main");
		result_string = '{"message":"$article"}';
	};

	return result_string;
}

/*
	文件有关函数
 */
final file_name = 'data.json';

function file_init():String {
	if (FileSystem.exists(file_name)) {
		return 'exist';
	} else {
		final content = '{"servers":{},"article":{}}';
		File.saveContent(file_name, content);
		return 'init file';
	}
}

function file_read():String {
	return File.getContent(file_name);
}

function file_write(input:String) {
	File.saveContent(file_name, input);
}

/*
	filedb 
	1 level
 */
function filedb1_get(level1):Dynamic {
	var db = haxe.Json.parse(file_read());
	return Reflect.field(db, level1);
}

function filedb1_get_list(level1):Dynamic {
	var db = haxe.Json.parse(file_read());
	var object1 = Reflect.field(db, level1);
	var list1 = Reflect.fields(object1);
	return list1;
}

/*
	filedb 
	2 level
 */
function filedb_has(level1, level2) {
	var db = haxe.Json.parse(file_read());
	trace(db);
	var db1 = Reflect.field(db, level1);
	trace(db1);
	return Reflect.hasField(db1, level2);
}

function filedb_set(level1, level2, value) {
	var db = haxe.Json.parse(file_read());
	var db1 = Reflect.field(db, level1);
	Reflect.setField(db1, level2, value);
	Reflect.setField(db, level1, db1);
	var db_string = haxe.Json.stringify(db);
	file_write(db_string);
}

function filedb_get(level1, level2) {
	var db = haxe.Json.parse(file_read());
	var db1 = Reflect.field(db, level1);
	return Reflect.field(db1, level2);
}

function filedb_del(level1, level2) {
	var db = haxe.Json.parse(file_read());
	var db1 = Reflect.field(db, level1);
	Reflect.deleteField(db1, level2);
	Reflect.setField(db, level1, db1);
	var db_string = haxe.Json.stringify(db);
	file_write(db_string);
}

/*
	网络有关函数
 */
final fetch = function(url, post_data:String, end):Void {
	var http = new Http(url);
	http.setPostData(post_data);
	http.addHeader('Content-Type', 'application/json');
	http.onData = function(data) {
		end(data);
	}
	http.onError = function(data) {
		end('{"message":"error"}');
	}
	sys.NodeSync.callVoid(function(){http.request.sync(null);});
}

function say(url, message, end) {
	if (server_exist(url)) {
		fetch(url, message, function(data) {
			end(data);
		});
	} else {
		filedb_del('servers', url);
		end('del');
	}
}

function server_exist(url) {
	var message = '{"message":"ping"}';
	var result='rrr';
	endIt=5;
	fetch(url, message, function(data) {
		endIt=0;
		result=data;
		trace(result);
		trace('d');
	});
	trace(result);
	if (result=='{"message":"pong"}'){
		return true;
	}else{return false;}
}

// restful
// ---------

function restful_list_servers() {
	var servers = filedb1_get_list('servers');
	var result_string = haxe.Json.stringify(servers);
	return result_string;
}

// other function
	//null function
	function nullF(){}

function log_it(data){
	trace(data);
}