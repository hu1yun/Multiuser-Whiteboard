import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as path from 'path';
import * as http from 'http';
import * as WebSocket from 'ws';
import * as sio from 'socket.io';
import {CONFIG} from './config';
import {
    Line,
    LinesManager
} from './lines-manager';


var app = express();
app.use(serveStatic(path.resolve(__dirname, 'public')));
var server = http.createServer(app);
var io = sio(server, {
    pingTimeout: 600000
});

console.log('owo');

console.log('Server is online!');


var lineMgr: LinesManager = new LinesManager();

io.on('connection',(socket) => {
    lineMgr.addNewUser(socket.id);
    socket.emit('config',CONFIG);
    socket.emit('lineCollection', lineMgr.allLinesCollection);
    socket.on('line', (line: Line) => {
        if (line.coords == null){
            return;
        }
        line = lineMgr.addLine(socket.id, line);
        socket.broadcast.emit('line', line);
        socket.emit('line', line);
    });
    socket.on('undo', () => {
        lineMgr.undoLine(socket.id);
        socket.broadcast.emit('lineCollection', lineMgr.allLinesCollection);
        socket.emit('lineCollection', lineMgr.allLinesCollection);
    });
    socket.on('redo', () => {
        lineMgr.redoLine(socket.id);
        socket.broadcast.emit('lineCollection', lineMgr.allLinesCollection);
        socket.emit('lineCollection', lineMgr.allLinesCollection);
    });
});
server.listen(8000);