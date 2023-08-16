// Generated by Haxe 4.2.1
(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	Main_file_init();
	var port = 8001;
	var ip = "0.0.0.0";
	var server = js_node_Http.createServer(function(request,response) {
		if(request.url == "/") {
			response.writeHead(200,{ "Content-Type" : "text/html"});
			response.end("<h1>root</h1>\n<p><a href=\"/read-article\">article</a></p>\n<p><a href=\"/list-servers\">servers</a></p>\n<p><a href=\"/article\">write article</a></p>\n<p><a href=\"/add-server\">add server</a></p>\n");
		} else if(request.url == "/test") {
			response.writeHead(200,{ "Content-Type" : "text/html"});
			response.end("<h1>test<h1>\n");
		} else if(request.url == "/add-server") {
			response.writeHead(200,{ "Content-Type" : "text/html"});
			response.end("\n                     \n<form id=\"formElem\">\nthe server url: <input type=\"text\" name=\"server_url\" value=\"\"><br>\nthis server url: <input type=\"text\" name=\"myurl\" value=\"https://decentral-nodejs.tomzcn.repl.co/api\"><br>\n<input type=\"submit\">\n</form>\n<a href=\"/\">homepage</a>\n<div id=\"output\"></div>\n\n<script>\n  formElem.onsubmit = async (e) => {\n    e.preventDefault();\nformData=new FormData(formElem)\nlet message = {\n  message: \"add_server\",\n  server_url: formData.get(\"server_url\"),\n  my_url: formData.get(\"myurl\"),\n};\nconsole.log(message);\nfetch_data={\n    method: \"POST\",\n    headers: {\"Content-Type\": \"application/json;charset=utf-8\"},\n    body: JSON.stringify(message)\n}\nconsole.log(fetch_data);\nlet response = await fetch(\"/api\", fetch_data);\nconsole.log(response);\nlet result = await response.json();\noutput.innerHTML=(result.message);\n};\n</script>\n\n");
		} else if(request.url == "/article") {
			response.writeHead(200,{ "Content-Type" : "text/html"});
			response.end("\n<form id=\"formElem\">\narticle:<br>\n<textarea name=\"article\" rows=10 cols=30></textarea><br>\n<input type=\"submit\">\n</form>\n<a href=\"/\">homepage</a>\n<div id=\"output\"></div>\n\n<script>\n  read = async () => {\n    let message = {message: \"read_article\"};\n    let response = await fetch(\"/api\", {\n    method: \"POST\",\n    headers: {\n        \"Content-Type\": \"application/json;charset=utf-8\"\n    },\n        body: JSON.stringify(message)\n        });\n        let result = await response.json();\n        //console.log(result);\n        formElem.article.innerHTML=result.message;\n  };\n  //console.log(read);\n  read();\n  formElem.onsubmit = async (e) => {\n        e.preventDefault();\n    formData=new FormData(formElem)\n    let message = {\n    message: \"article\",\n    article: formData.get(\"article\")\n    };\n        let response = await fetch(\"/api\", {\n        method: \"POST\",\n    headers: {\n        \"Content-Type\": \"application/json;charset=utf-8\"\n    },\n        body: JSON.stringify(message)\n        });\n        let result = await response.json();\n        output.innerHTML=result.message;\n  };\n</script>                     \n\n");
		} else if(request.url == "/list-servers") {
			response.writeHead(200,{ "Content-Type" : "text/plain"});
			response.end(Main_restful_list_servers());
		} else if(request.url == "/read-article") {
			response.writeHead(200,{ "Content-Type" : "text/plain"});
			response.end(Main_filedb_get("article","main"));
		} else if(request.url == "/api") {
			if(request.method == "POST") {
				var body = "";
				request.on("data",function(chunk) {
					body += Std.string(chunk);
					return body;
				});
				request.on("end",function() {
					console.log("Main.hx:143:","api request");
					console.log("Main.hx:144:",body);
					var request_json = JSON.parse(body);
					response.writeHead(200,{ "Content-Type" : "application/json"});
					if(request_json.message == "add_server") {
						var server_url = request_json.server_url;
						var my_url = request_json.my_url;
						var result_string = "{\"message\":\"await\"}";
						Main_server_exist(server_url,function(data) {
							console.log("Main.hx:155:",data);
							if(data) {
								if(Main_filedb_has("servers",server_url)) {
									result_string = "{\"message\":\"server already exist.\"}";
									response.end(result_string);
								} else {
									Main_filedb_set("servers",server_url,1);
									var servers_object = Main_filedb1_get("servers");
									var servers = Reflect.fields(servers_object);
									HxOverrides.remove(servers,server_url);
									var series = null;
									series = function(url) {
										if(url != null) {
											Main_say(url,"{\"message\":\"broadcast_add_server\",\"server_url\":\"" + server_url + "\"}",function(data) {
												console.log("Main.hx:173:","add " + server_url + " to " + url);
												Main_say(server_url,"{\"message\":\"broadcast_add_server\",\"server_url\":\"" + url + "\"}",function(data) {
													console.log("Main.hx:175:","add " + url + " to " + server_url);
												});
												series(servers.shift());
											});
										} else {
											Main_say(server_url,"{\"message\":\"broadcast_add_server\",\"server_url\":\"" + my_url + "\"}",function(data) {
												result_string = "{\"message\":\"add server successfully.\"}";
												response.end(result_string);
											});
										}
									};
									series(servers.shift());
								}
							} else {
								result_string = "{\"message\":\"server not exist.\"}";
								response.end(result_string);
							}
						});
					} else if(request_json.message == "article") {
						console.log("Main.hx:196:","article");
						var article = request_json.article;
						Main_filedb_set("article","main",article);
						var servers_object = Main_filedb1_get("servers");
						console.log("Main.hx:203:",servers_object);
						var servers = Reflect.fields(servers_object);
						console.log("Main.hx:205:",servers);
						var series = null;
						series = function(url) {
							if(url != null) {
								Main_say(url,"{\"message\":\"broadcast_article\",\"article\":\"" + article + "\"}",function(data) {
									console.log("Main.hx:215:",url);
									series(servers.shift());
								});
							} else {
								console.log("Main.hx:219:","esle");
								var result_string = "{\"message\":\"add article seccessfully.\"}";
								response.end(result_string);
							}
						};
						series(servers.shift());
					} else {
						response.end(Main_api(body));
					}
				});
			}
		} else {
			response.writeHead(200,{ "Content-Type" : "text/html"});
			response.end("<h1>else<h1>\n");
		}
	});
	server.listen(port);
	console.log("Main.hx:238:","Server running at " + ip + " : " + port);
};
function Main_api_branch(request_json,response) {
}
function Main_api(request_string) {
	var request_json = JSON.parse(request_string);
	var result = { "message" : ""};
	var result_string = "{\"message\":\"completed\"}";
	if(request_json.message == "ping") {
		result.message = "pong";
		result_string = JSON.stringify(result);
		return result_string;
	} else if(request_json.message == "broadcast_add_server") {
		var server_url = request_json.server_url;
		if(!Main_filedb_has("servers",server_url)) {
			Main_filedb_set("servers",server_url,1);
		}
	} else if(request_json.message == "list_servers") {
		var result = Main_restful_list_servers();
		result_string = "{\"message\":\"" + result + "\"}";
	} else if(request_json.message == "broadcast_article") {
		console.log("Main.hx:335:","broadcast article");
		var article = request_json.article;
		Main_filedb_set("article","main",article);
	} else if(request_json.message == "read_article") {
		var article = Main_filedb_get("article","main");
		result_string = "{\"message\":\"" + article + "\"}";
	}
	return result_string;
}
function Main_file_init() {
	if(sys_FileSystem.exists(Main_file_name)) {
		return "exist";
	} else {
		var content = "{\"servers\":{},\"article\":{}}";
		js_node_Fs.writeFileSync(Main_file_name,content);
		return "init file";
	}
}
function Main_file_read() {
	return js_node_Fs.readFileSync(Main_file_name,{ encoding : "utf8"});
}
function Main_file_write(input) {
	js_node_Fs.writeFileSync(Main_file_name,input);
}
function Main_filedb1_get(level1) {
	var db = JSON.parse(Main_file_read());
	return Reflect.field(db,level1);
}
function Main_filedb1_get_list(level1) {
	var db = JSON.parse(Main_file_read());
	var object1 = Reflect.field(db,level1);
	var list1 = Reflect.fields(object1);
	return list1;
}
function Main_filedb_has(level1,level2) {
	console.log("Main.hx:393:","filedb has");
	var db = JSON.parse(Main_file_read());
	console.log("Main.hx:395:",db);
	var db1 = Reflect.field(db,level1);
	console.log("Main.hx:397:",db1);
	return Object.prototype.hasOwnProperty.call(db1,level2);
}
function Main_filedb_set(level1,level2,value) {
	var db = JSON.parse(Main_file_read());
	var db1 = Reflect.field(db,level1);
	db1[level2] = value;
	db[level1] = db1;
	var db_string = JSON.stringify(db);
	Main_file_write(db_string);
}
function Main_filedb_get(level1,level2) {
	var db = JSON.parse(Main_file_read());
	var db1 = Reflect.field(db,level1);
	return Reflect.field(db1,level2);
}
function Main_filedb_del(level1,level2) {
	var db = JSON.parse(Main_file_read());
	var db1 = Reflect.field(db,level1);
	Reflect.deleteField(db1,level2);
	db[level1] = db1;
	var db_string = JSON.stringify(db);
	Main_file_write(db_string);
}
function Main_fetch(url,post_data,callback) {
	var http = new haxe_http_HttpNodeJs(url);
	http.setPostData(post_data);
	http.addHeader("Content-Type","application/json");
	http.onData = function(data) {
		callback(data);
	};
	http.onError = function(data) {
		callback("{\"message\":\"error\"}");
	};
	http.request();
}
function Main_fetch_html(url,post_data,end) {
	var http = new haxe_http_HttpNodeJs(url);
	http.setPostData(post_data);
	http.addHeader("Content-Type","application/html");
	http.onData = function(data) {
		end(data);
	};
	http.onError = function(data) {
		end("{\"message\":\"error\"}");
	};
	http.request();
}
function Main_server_exist(url,callback) {
	var message = "{\"message\":\"ping\"}";
	Main_fetch(url,message,function(data) {
		console.log("Main.hx:461:",data);
		if(data == "{\"message\":\"pong\"}") {
			callback(true);
		} else {
			callback(false);
		}
	});
}
function Main_say(url,message,callback) {
	Main_server_exist(url,function(data) {
		if(data) {
			Main_fetch(url,message,function(data) {
				callback(data);
			});
		} else {
			Main_filedb_del("servers",url);
			callback("del");
		}
	});
}
function Main_restful_list_servers() {
	var servers = Main_filedb1_get_list("servers");
	var result_string = JSON.stringify(servers);
	return result_string;
}
function Main_log_it(data) {
	console.log("Main.hx:497:",data);
}
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) {
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		return false;
	}
	if(f1.scope == f2.scope && f1.method == f2.method) {
		return f1.method != null;
	} else {
		return false;
	}
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) {
		return false;
	}
	delete(o[field]);
	return true;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
	,get_native: function() {
		return this.__nativeException;
	}
});
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
});
var haxe_http_HttpBase = function(url) {
	this.url = url;
	this.headers = [];
	this.params = [];
	this.emptyOnData = $bind(this,this.onData);
};
haxe_http_HttpBase.__name__ = true;
haxe_http_HttpBase.prototype = {
	addHeader: function(header,value) {
		this.headers.push({ name : header, value : value});
	}
	,setPostData: function(data) {
		this.postData = data;
		this.postBytes = null;
	}
	,onData: function(data) {
	}
	,onBytes: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,hasOnData: function() {
		return !Reflect.compareMethods($bind(this,this.onData),this.emptyOnData);
	}
	,success: function(data) {
		this.responseBytes = data;
		this.responseAsString = null;
		if(this.hasOnData()) {
			this.onData(this.get_responseData());
		}
		this.onBytes(this.responseBytes);
	}
	,get_responseData: function() {
		if(this.responseAsString == null && this.responseBytes != null) {
			this.responseAsString = this.responseBytes.getString(0,this.responseBytes.length,haxe_io_Encoding.UTF8);
		}
		return this.responseAsString;
	}
};
var haxe_http_HttpNodeJs = function(url) {
	haxe_http_HttpBase.call(this,url);
};
haxe_http_HttpNodeJs.__name__ = true;
haxe_http_HttpNodeJs.__super__ = haxe_http_HttpBase;
haxe_http_HttpNodeJs.prototype = $extend(haxe_http_HttpBase.prototype,{
	request: function(post) {
		var _gthis = this;
		this.responseAsString = null;
		this.responseBytes = null;
		var parsedUrl = new js_node_url_URL(this.url);
		var secure = parsedUrl.protocol == "https:";
		var host = parsedUrl.hostname;
		var path = parsedUrl.pathname;
		var port = parsedUrl.port != null ? Std.parseInt(parsedUrl.port) : secure ? 443 : 80;
		var h = { };
		var _g = 0;
		var _g1 = this.headers;
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			var arr = Reflect.field(h,i.name);
			if(arr == null) {
				arr = [];
				h[i.name] = arr;
			}
			arr.push(i.value);
		}
		if(this.postData != null || this.postBytes != null) {
			post = true;
		}
		var uri = null;
		var _g = 0;
		var _g1 = this.params;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(uri == null) {
				uri = "";
			} else {
				uri += "&";
			}
			var s = p.name;
			var uri1 = encodeURIComponent(s) + "=";
			var s1 = p.value;
			uri += uri1 + encodeURIComponent(s1);
		}
		var question = path.split("?").length <= 1;
		if(uri != null) {
			path += (question ? "?" : "&") + uri;
		}
		var opts = { protocol : parsedUrl.protocol, hostname : host, port : port, method : post ? "POST" : "GET", path : path, headers : h};
		var httpResponse = function(res) {
			res.setEncoding("binary");
			var s = res.statusCode;
			if(s != null) {
				_gthis.onStatus(s);
			}
			var data = [];
			res.on("data",function(chunk) {
				data.push(js_node_buffer_Buffer.from(chunk,"binary"));
			});
			res.on("end",function(_) {
				var buf = data.length == 1 ? data[0] : js_node_buffer_Buffer.concat(data);
				var httpResponse = buf.buffer.slice(buf.byteOffset,buf.byteOffset + buf.byteLength);
				_gthis.responseBytes = haxe_io_Bytes.ofData(httpResponse);
				_gthis.req = null;
				if(s != null && s >= 200 && s < 400) {
					_gthis.success(_gthis.responseBytes);
				} else {
					_gthis.onError("Http Error #" + s);
				}
			});
		};
		this.req = secure ? js_node_Https.request(opts,httpResponse) : js_node_Http.request(opts,httpResponse);
		if(post) {
			if(this.postData != null) {
				this.req.write(this.postData);
			} else if(this.postBytes != null) {
				this.req.setHeader("Content-Length","" + this.postBytes.length);
				this.req.write(js_node_buffer_Buffer.from(this.postBytes.b.bufferValue));
			}
		}
		this.req.end();
	}
});
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) {
		return hb;
	}
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.prototype = {
	getString: function(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		var s = "";
		var b = this.b;
		var i = pos;
		var max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			var debug = pos > 0;
			while(i < max) {
				var c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					var code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					var c2 = b[i++];
					var code1 = (c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code1);
				} else {
					var c21 = b[i++];
					var c3 = b[i++];
					var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				var c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_io_Eof = function() {
};
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:true,__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
var haxe_io_Input = function() { };
haxe_io_Input.__name__ = true;
var haxe_io_Output = function() { };
haxe_io_Output.__name__ = true;
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var js_lib__$ArrayBuffer_ArrayBufferCompat = function() { };
js_lib__$ArrayBuffer_ArrayBufferCompat.__name__ = true;
js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null ? null : end - begin);
	var resultArray = new Uint8Array(u.byteLength);
	resultArray.set(u);
	return resultArray.buffer;
};
var js_node_Fs = require("fs");
var js_node_Http = require("http");
var js_node_Https = require("https");
var js_node_KeyValue = {};
js_node_KeyValue.get_key = function(this1) {
	return this1[0];
};
js_node_KeyValue.get_value = function(this1) {
	return this1[1];
};
var js_node_buffer_Buffer = require("buffer").Buffer;
var js_node_stream_WritableNewOptionsAdapter = {};
js_node_stream_WritableNewOptionsAdapter.from = function(options) {
	if(!Object.prototype.hasOwnProperty.call(options,"final")) {
		Object.defineProperty(options,"final",{ get : function() {
			return options.final_;
		}});
	}
	return options;
};
var js_node_url_URL = require("url").URL;
var js_node_url_URLSearchParamsEntry = {};
js_node_url_URLSearchParamsEntry._new = function(name,value) {
	var this1 = [name,value];
	return this1;
};
js_node_url_URLSearchParamsEntry.get_name = function(this1) {
	return this1[0];
};
js_node_url_URLSearchParamsEntry.get_value = function(this1) {
	return this1[1];
};
var sys_FileSystem = function() { };
sys_FileSystem.__name__ = true;
sys_FileSystem.exists = function(path) {
	try {
		js_node_Fs.accessSync(path);
		return true;
	} catch( _g ) {
		return false;
	}
};
var sys_io_FileInput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileInput.__name__ = true;
sys_io_FileInput.__super__ = haxe_io_Input;
sys_io_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	readByte: function() {
		var buf = js_node_buffer_Buffer.alloc(1);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,0,1,this.pos);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos++;
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,pos,len,this.pos);
		} catch( _g ) {
			var e = haxe_Exception.caught(_g).unwrap();
			if(e.code == "EOF") {
				throw haxe_Exception.thrown(new haxe_io_Eof());
			} else {
				throw haxe_Exception.thrown(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw haxe_Exception.thrown(new haxe_io_Eof());
		}
		this.pos += bytesRead;
		return bytesRead;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,eof: function() {
		return this.pos >= js_node_Fs.fstatSync(this.fd).size;
	}
});
var sys_io_FileOutput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileOutput.__name__ = true;
sys_io_FileOutput.__super__ = haxe_io_Output;
sys_io_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	writeByte: function(b) {
		var buf = js_node_buffer_Buffer.alloc(1);
		buf[0] = b;
		js_node_Fs.writeSync(this.fd,buf,0,1,this.pos);
		this.pos++;
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var wrote = js_node_Fs.writeSync(this.fd,buf,pos,len,this.pos);
		this.pos += wrote;
		return wrote;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos._hx_index) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
});
var sys_io_FileSeek = $hxEnums["sys.io.FileSeek"] = { __ename__:true,__constructs__:null
	,SeekBegin: {_hx_name:"SeekBegin",_hx_index:0,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekCur: {_hx_name:"SeekCur",_hx_index:1,__enum__:"sys.io.FileSeek",toString:$estr}
	,SeekEnd: {_hx_name:"SeekEnd",_hx_index:2,__enum__:"sys.io.FileSeek",toString:$estr}
};
sys_io_FileSeek.__constructs__ = [sys_io_FileSeek.SeekBegin,sys_io_FileSeek.SeekCur,sys_io_FileSeek.SeekEnd];
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
if(ArrayBuffer.prototype.slice == null) {
	ArrayBuffer.prototype.slice = js_lib__$ArrayBuffer_ArrayBufferCompat.sliceImpl;
}
var Main_file_name = "data.json";
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
