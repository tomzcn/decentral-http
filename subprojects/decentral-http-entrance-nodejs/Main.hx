import haxe.Json;
import sys.io.File;
import sys.FileSystem;
import js.node.Http as ServerHttp;
import haxe.Http;

/*
	start server
	------------
 */
// var endIt=110;
class Main {
	// static function main(){
	// 	fetch1('https://www.tomzheng.com/','',log_it);
	// }
	// static function main(){
	// 	fetch1('https://decentral-nodejs.tomzcn.repl.co/api','{"message":"ping"}',log_it);
	// }
	// static function main(){
	// 	fetch('https://test-render-com.tomzcn.repl.co/server/post','{"message":"ping"}',log_it);
	// }
	// static function main(){
	// 	server_exist('https://test-render-com.tomzcn.repl.co/server/post',log_it);
	// }
	// static function main(){
	// 	say('https://test-render-com.tomzcn.repl.co/server/post','{"message":"ping"}',log_it);
	// }
	// static function main2(){
	// 	trace(server_exist('https://decentral-nodejs.tomzcn.repl.co/api'));
	// }
	static function main() {
		file_init();
		// trace(file_init());
		final port = 8001;
		final ip = '0.0.0.0';
		var server = ServerHttp.createServer(function(request, response) {
			if (request.url == '/') {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end('<h1>root</h1>\n<p><a href="/read-article">article</a></p>\n<p><a href="/list-servers">servers</a></p>\n<p><a href="/article">write article</a></p>\n<p><a href="/add-server">add server</a></p>\n');
			} 
      else if (request.url == '/test') {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end("<h1>test<h1>\n");
			} 
      else if (request.url == '/add-server') {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end('
                     
<form id="formElem">
the server url: <input type="text" name="server_url" value=""><br>
this server url: <input type="text" name="myurl" value="https://decentral-nodejs.tomzcn.repl.co/api"><br>
<input type="submit">
</form>
<a href="/">homepage</a>
<div id="output"></div>

<script>
  formElem.onsubmit = async (e) => {
    e.preventDefault();
formData=new FormData(formElem)
let message = {
  message: "add_server",
  server_url: formData.get("server_url"),
  my_url: formData.get("myurl"),
};
console.log(message);
fetch_data={
    method: "POST",
    headers: {"Content-Type": "application/json;charset=utf-8"},
    body: JSON.stringify(message)
}
console.log(fetch_data);
let response = await fetch("/api", fetch_data);
console.log(response);
let result = await response.json();
output.innerHTML=(result.message);
};
</script>

');
			} 
      else if (request.url == '/article') {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end('
<form id="formElem">
article:<br>
<textarea name="article" rows=10 cols=30></textarea><br>
<input type="submit">
</form>
<a href="/">homepage</a>
<div id="output"></div>

<script>
  read = async () => {
    let message = {message: "read_article"};
    let response = await fetch("/api", {
    method: "POST",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
        body: JSON.stringify(message)
        });
        let result = await response.json();
        //console.log(result);
        formElem.article.innerHTML=result.message;
  };
  //console.log(read);
  read();
  formElem.onsubmit = async (e) => {
        e.preventDefault();
    formData=new FormData(formElem)
    let message = {
    message: "article",
    article: formData.get("article")
    };
        let response = await fetch("/api", {
        method: "POST",
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },
        body: JSON.stringify(message)
        });
        let result = await response.json();
        output.innerHTML=result.message;
  };
</script>                     

');
			} 
      else if (request.url == '/list-servers') {
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
					request.on('end', () -> {
						trace('api request');
						trace(body);
						var request_json = haxe.Json.parse(body);
						response.writeHead(200, {"Content-Type": "application/json"});
						if (request_json.message == "add_server") {
							// api_callback(body,response.end);
							// var result = {'message':''};
							var server_url = request_json.server_url;
							var my_url = request_json.my_url;
							var result_string = '{"message":"await"}';
							// exist?
							server_exist(server_url, function(data) {
								trace(data);
								if (data) {
									// exist in file?
									if (filedb_has('servers', server_url)) {
										// throw 'has exist in db.';
										result_string = '{"message":"server already exist."}';
										response.end(result_string);
									} else {
										// add server url to file
										filedb_set('servers', server_url, 1);

										// tell to servers
										var servers_object = filedb1_get('servers');
										var servers = Reflect.fields(servers_object);
                    servers.remove(server_url);
										function series(url) {
											if (url != null) {
												say(url, '{"message":"broadcast_add_server","server_url":"$server_url"}', function(data) {
                          trace('add $server_url to $url');
                          say(server_url,'{"message":"broadcast_add_server","server_url":"$url"}', function(data) {
                            trace('add $url to $server_url');
                          });
                          return series(servers.shift());
                        });
											} else {
												// tell to the server
												say(server_url, '{"message":"broadcast_add_server","server_url":"$my_url"}', function(data) {
													result_string = '{"message":"add server successfully."}';
													response.end(result_string);
												});
											}
										}
										series(servers.shift());
									}
								} else {
									result_string = '{"message":"server not exist."}';
									response.end(result_string);
								}
							});
						} else if (request_json.message == "article") {

              trace('article');
							// article
							var article = request_json.article;
							filedb_set("article", "main", article);

							// tell to servers
							var servers_object = filedb1_get('servers');
              trace(servers_object);
							var servers = Reflect.fields(servers_object);
              trace(servers);

              // var l1=[1];
              // trace(l1.shift());
              // trace(l1);
              // trace(l1.shift());

							function series(url) {
								if (url != null) {
									say(url, '{"message":"broadcast_article","article":"$article"}', function(data) {
                    trace(url);
                    return series(servers.shift());
                  });
								} else {
                  trace('esle');
									var result_string = '{"message":"add article seccessfully."}';
									response.end(result_string);
								}
							}
							series(servers.shift());
						} else {
							response.end(api(body));
						}
					});
				}
			} else {
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end("<h1>else<h1>\n");
			}
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

function api_branch(request_json, response) {}

// function api_callback(request_string,response_end){
//   // add server
// 	if (request_json.message == 'add_server') {
// 		// trace('----add server----');
// 		var server_url = request_json.server_url;
// 		var my_url = request_json.my_url;
//     result_string = '{"message":"await"}';
// 		// exist?
// 		server_exist(server_url,function(data){
//       trace(data);
//       if(data){
//     		// exist in file?
//     		if (filedb_has('servers', server_url)) {
//     			// throw 'has exist in db.';
//           result_string = '{"message":"server url exist."}';
//           response_end(result_string);
//     		}else{
//     		// // add server url to file
//     		// filedb_set('servers', server_url, 1);
//     		// // tell to servers
//     		// var servers_object = filedb1_get('server');
//     		// var servers = Reflect.fields(servers_object);
//     		// for (url in servers) {
//     		// 	say(url, '{"message":"broadcast_add_server","server_url":"$url"}', function(data) {});
//     		// }
//     		// // tell to the server
//     		// say(server_url, '{"message":"broadcast_add_server","server_url":"$my_url"}', function(data) {});
//         }
//       }
//       else{
//         result_string = '{"message":"server not exist."}';
//         response_end(result_string);
//       }
//       });
//     // return result_string;
// 	}
// }

function api(request_string):String {
	var request_json = haxe.Json.parse(request_string);
	var result = {'message': ''};
	var result_string = '{"message":"completed"}';

	// pingpong
	if (request_json.message == 'ping') {
		result.message = 'pong';
		result_string = haxe.Json.stringify(result);
		return result_string;
	};

	// broadcast add server
	else if (request_json.message == 'broadcast_add_server') {
		var server_url = request_json.server_url;

		// exist in file?
		if (filedb_has('servers', server_url)) {
			// throw 'has exist in db.';
		} else {
			// add server url to file
			filedb_set('servers', server_url, 1);
		}
	}

	// list server
	else if (request_json.message == 'list_servers') {
		var result = restful_list_servers();
		result_string = '{"message":"$result"}';
	};

		// // article
		// else if (request_json.message == 'article') {
		// 	var article = request_json.article;
		// 	filedb_set("article", "main", article);

		// 	// tell to servers
		// 	var servers_object = filedb1_get('server');
		// 	var servers = Reflect.fields(servers_object);
		// 	for (url in servers) {
		// 		say(url, '{"message":"broadcast_article","article":"$article"}', function(data) {});
		// 	}
		// };

	// broadcast article
	else if (request_json.message == 'broadcast_article') {
		trace('broadcast article');
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
	trace('filedb has');
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
final fetch = function(url, post_data:String, callback):Void {
	var http = new Http(url);
	http.setPostData(post_data);
	http.addHeader('Content-Type', 'application/json');
	http.onData = function(data) {
		callback(data);
	}
	http.onError = function(data) {
		callback('{"message":"error"}');
	}
	http.request();
	// sys.NodeSync.callVoid(function(){http.request.sync(null);});
}

final fetch_html = function(url, post_data:String, end):Void {
	var http = new Http(url);
	http.setPostData(post_data);
	http.addHeader('Content-Type', 'application/html');
	http.onData = function(data) {
		end(data);
	}
	http.onError = function(data) {
		end('{"message":"error"}');
	}
	// var op=new js.node.Http.HttpRequestOptions();
	http.request();
	// sys.NodeSync.callVoid(function(){http.request.sync(null);});
}

function server_exist(url, callback) {
	var message = '{"message":"ping"}';
	fetch(url, message, function(data) {
		// if (data=='{"message":"pong"}'){
		trace(data);
		if (data == '{"message":"pong"}') {
			callback(true);
		} else {
			callback(false);
		}
	});
}

function say(url, message, callback) {
	server_exist(url, function(data) {
		if (data) {
			fetch(url, message, function(data) {
				callback(data);
			});
		} else {
			filedb_del('servers', url);
			callback('del');
		}
	});
}

// restful
// ---------

function restful_list_servers() {
	var servers = filedb1_get_list('servers');
	var result_string = haxe.Json.stringify(servers);
	return result_string;
}

// other function
// null function
// function nullF(){}

function log_it(data) {
	trace(data);
}

// function log_it1(data){
// 	trace(data);
// }
