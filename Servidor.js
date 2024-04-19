var http = require('http');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function (request, response) {
    console.log('request', request.url);

    var filePath = '.' + request.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    var extname = String(path.extname(filePath)).toLowerCase();
    let contentType = 'text/html';
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };
    contentType = mimeTypes[extname] || 'application/octet-stream';

  
    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, Check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});
//-----------------------------------
//var express = require('express');
//var app = express();

// Define la ruta de la carpeta que contiene los archivos estáticos (por ejemplo, CSS, imágenes, etc.)
//var staticPath = path.join(__dirname, 'Web_Server');

// Configura express para servir archivos estáticos
//app.use(express.static(staticPath));

//----------------------------------
server.listen(3000, function () {
    console.log('Server running at http://dhoubuntu.fullstack.com.mx:3002/');
});