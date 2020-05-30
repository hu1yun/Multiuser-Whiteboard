import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as sio from 'socket.io';
import {CONFIG} from './config';
interface Line {
    id: string, 
    coords: Point[],
    color: string,
    width: number
}

interface Point {
    x: number,
    y: number
}

var lineCollection: { [key: string]: Line } = {};
var lineCount = 0;


var app = express();
app.use(serveStatic(path.resolve(__dirname, 'public')));
var server = http.createServer(app);
var io = sio(server, {
    pingTimeout: 600000
});
const wss = new WebSocket.Server({ port: 8080 });

console.log('owo');

console.log('Server is online!');
io.on('connection',(socket) => {
    socket.emit('config',CONFIG);
    socket.emit('lineCollection', lineCollection);
    socket.on('line', (line: Line) => {
        if (line.coords == null){
            return;
        }
        line.id = 'line'+lineCount;
        lineCollection['line'+lineCount] = line;
        lineCount++;
        socket.broadcast.emit('line', line);
        socket.emit('line', line);
    });
});
server.listen(8000);