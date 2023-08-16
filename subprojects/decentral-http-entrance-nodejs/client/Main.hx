
import haxe.Http;

/*
	start server
	------------
 */
class Main {
	// static function main(){
	// 	fetch_html('https://www.tomzheng.com/','',log_it);
	// }
	// static function main(){
	// 	fetch('https://decentral-nodejs.tomzcn.repl.co/api','{"message":"ping"}',log_it);
	// }
	// static function main(){
	// 	fetch('https://haxe.tomzcn.repl.co/api','{"message":"ping"}',log_it);
	// }
	// static function main(){
	// 	fetch('https://haxe.tomzcn.repl.co/api','{"message":"broadcast_article","article":"content"}',log_it);
	// }
	// static function main(){
	// 	fetch('https://haxe.tomzcn.repl.co/api','{"message":"read_article"}',log_it);
	// }
// 	static function main(){
// fetch('https://haxe.tomzcn.repl.co/api','{"message":"broadcast_add_server","server_url":"https://decentral-nodejs.tomzcn.repl.co/api1"}',log_it);
// 	}


  //add server
// 	static function main(){
// fetch('https://haxe.tomzcn.repl.co/api','{"my_url":"https://haxe.tomzcn.repl.co/api","message":"add_server","server_url":"https://decentral-nodejs.tomzcn.repl.co/api"}',log_it);
// 	}

// 	static function main(){
// fetch('https://haxe.tomzcn.repl.co/api','{"my_url":"https://haxe.tomzcn.repl.co/api","message":"add_server","server_url":"https://nodejs.tomzcn.repl.co/api"}',log_it);
// 	}

  // article
	static function main(){
fetch('https://haxe.tomzcn.repl.co/api','{"message":"article","article":"aaabbb8<br><h1>8</h1>"}',log_it);
	}


  
// 	static function main(){
// fetch('https://haxe.tomzcn.repl.co/api','{"my_url":"https://haxe.tomzcn.repl.co/api","message":"add_server","server_url":"https://nodejs.tomzcn.repl.co/api"}',log_it);
// 	}
	// static function main(){
	// 	fetch('https://haxe.tomzcn.repl.co/api','{"message":"list_servers"}',log_it);
	// }
	
 
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
	//sys.NodeSync.callVoid(function(){http.request.sync(null);});
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
	//sys.NodeSync.callVoid(function(){http.request.sync(null);});
}

function log_it(data){
	trace(data);
}
