import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import * as http from 'http';
const server = http.createServer();

console.log('Starting server...');

var app = express();
app.use(express.static('public'));
app.use(serveStatic(path.resolve(__dirname, 'public')));
server.on('request', app);

console.log('Server is online!');
app.listen(8000);