var http = require('http'),
    fs = require('fs');

try {
	fs.readFile('./src/index.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }       
	    http.createServer(function(request, response) {  
	        response.writeHeader(200, {"Content-Type": "text/html"});  
	        response.write(html);  
	        response.end();  
	    }).listen(process.env.PORT || 8080);
	});
} catch (e) {
	console.log(e)
}
