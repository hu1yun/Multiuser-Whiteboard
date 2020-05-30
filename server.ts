import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import * as http from 'http';
import * as WebSocket from 'ws';
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



const server = http.createServer();
const wss = new WebSocket.Server({ port: 8080 });

console.log('owo');

var app = express();
//app.use(express.static('public'));
app.use(serveStatic(path.resolve(__dirname, 'public')));
server.on('request', app);


console.log('Server is online!');
wss.on('connection', (ws) => {
    ws.send('/config '+JSON.stringify(CONFIG));
    ws.send('/lineCollection '+JSON.stringify(lineCollection));
    ws.on('message', (message: any) =>{
        var line: Line = JSON.parse(message);
        line.id = 'line'+lineCount;
        lineCollection['line'+lineCount] = line;
        lineCount++;
        wss.clients.forEach((client)=> {
            client.send('/line '+JSON.stringify(line));


        });
	});
});
app.listen(8000);