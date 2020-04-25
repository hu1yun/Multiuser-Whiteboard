var ws = new WebSocket('ws://' + location.hostname + ':8080');
var lineCollection = {};
ws.onmessage = function (ev) {
	var cmd = ev.data.substring(0, ev.data.indexOf(' '));
	var object = ev.data.substring(ev.data.indexOf(' ')+1);
	if (cmd == '/line') {
		var line = JSON.parse(object);
		lineCollection[line.id] = line; 
		drawLine(line.coords);
	}
	else if (cmd == '/lineCollection') {
		lineCollection = JSON.parse(object);
		Object.keys(lineCollection).forEach((lineKey) => {
			var coords = lineCollection[lineKey].coords;
			drawLine(coords);
		});
	}
}
function sendLineToServer(linepoints){
	var line= {
		id: null,
		coords: linepoints
	};
	ws.send(JSON.stringify(line));
}
var canvas;
// function initializeDrawTool() {
// 	ctx = canvas.getContext('2d');
// 	ctx.strokeStyle = '#00ff00';
// 	ctx.lineWidth = 10;
// }
function goToLocation(x, y){
	ctx = canvas.getContext('2d');
	ctx.strokeStyle = '#00ff00';
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(x, y);
}
function drawLineTo(x, y){
	ctx = canvas.getContext('2d');
	ctx.lineTo(x, y);
	ctx.strokeStyle = '#00ff00';
	ctx.lineWidth = 4;
	ctx.stroke();
}
function drawLine(linepoints){
	ctx = canvas.getContext('2d');
	ctx.moveTo(linepoints[0].x+20, linepoints[0].y+20); 
	ctx.beginPath();
	for(let i=1; i<linepoints.length; i++){
		ctx.lineTo(linepoints[i].x+20, linepoints[i].y+20);
	}
	ctx.strokeStyle = '#ff0000';
	ctx.lineWidth = 20;
	ctx.stroke();
}
function getDistance(coords1, coords2) {
	return Math.sqrt(Math.pow(coords1.x - coords2.x, 2) + Math.pow(coords1.y - coords2.y, 2));
}
var line = null;
var previouscords=null; 

var mouseDown=false;
function initializeMousehandlers() {
	$('#owo-board').mousedown((e) => {
		mouseDown = true;
		previouscords = {x:e.clientX, y:e.clientY};
		line = [previouscords];
		goToLocation(e.clientX,e.clientY);
	});
	$('#owo-board').mouseup((e) => {
		mouseDown = false;
		sendLineToServer(line);
	});
	$('#owo-board').mousemove((e) => {
	//	console.log('Coords: (x: ' + e.clientX + ', y: ' + e.clientY + ' )');
		if(mouseDown && getDistance(previouscords,{x:e.clientX, y:e.clientY})>=20){
			drawLineTo(e.clientX,e.clientY);
			previouscords = {x:e.clientX, y:e.clientY};
			line.push(previouscords);
		}
	});
	$('#owo-board').dblclick((e) => {
		console.log('double click');
		//$(initializeDrawTool).hide();
	
	});
}


$(document).ready(() => {
	console.log ('ready');
	initializeMousehandlers();
	canvas = document.getElementById('owo-board');
	//initializeDrawTool();
	document.getElementById("owo-board").width = window.innerWidth;
    document.getElementById("owo-board").height = window.innerHeight;
    $(window).resize(() => {
        document.getElementById("owo-board").width = window.innerWidth;
		document.getElementById("owo-board").height = window.innerHeight;
		Object.keys(lineCollection).forEach((lineKey) => {
			var coords = lineCollection[lineKey].coords;
			drawLine(coords);
		});
    });
});