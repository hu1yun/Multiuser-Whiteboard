import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import * as http from 'http';
import * as WebSocket from 'ws';
const server = http.createServer();
const wss = new WebSocket.Server({ port: 8080 });

console.log('owo');

var app = express();
//app.use(express.static('public'));
app.use(serveStatic(path.resolve(__dirname, 'public')));
server.on('request', app);

console.log('Server is online!');
wss.on('connection', (ws) => {
	ws.on('message', (message) =>{
		console.log('we receive message:',message);
	});
});
app.listen(8000);


