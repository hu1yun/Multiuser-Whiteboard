var ws = new WebSocket('ws://' + location.hostname + ':8080');
var lineCollection = {};
var selecting = true;
var color = '#000000';
var width = 4;
var colorSelecting = false;
var widthSelecting = false;


ws.onmessage = function (ev) {
	var cmd = ev.data.substring(0, ev.data.indexOf(' '));
	var object = ev.data.substring(ev.data.indexOf(' ')+1);
	if (cmd == '/line') {
		var line = JSON.parse(object);
		lineCollection[line.id] = line; 
		drawLine(line);
	}
	else if (cmd == '/lineCollection') {
		lineCollection = JSON.parse(object);
		Object.keys(lineCollection).forEach((lineKey) => {
			var coords = lineCollection[lineKey].coords;
			drawLine(lineCollection[lineKey]);
		});
		reselectColor();
	}
}
function sendLineToServer(linepoints){
	var line= {
		id: null,
		coords: linepoints,
		color: color,
		width: width
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
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(x, y);
}
function drawLineTo(x, y){
	ctx = canvas.getContext('2d');
	ctx.lineTo(x, y);
	// ctx.strokeStyle = '#000000';
	ctx.lineWidth = width;
	ctx.stroke();
}
// function drawLine(linepoints){
// 	ctx = canvas.getContext('2d');
// 	ctx.beginPath();
// 	ctx.moveTo(linepoints[0].x, linepoints[0].y); 
// 	for(let i=1; i<linepoints.length; i++){
// 		ctx.lineTo(linepoints[i].x, linepoints[i].y);
// 	}
// 	ctx.strokeStyle = '#000000';
// 	ctx.lineWidth = 4;
// 	ctx.stroke();
// }
function reselectColor(){
	ctx = canvas.getContext('2d');
	ctx.strokeStyle = color;
}
function drawLine(line){
	ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.moveTo(line.coords[0].x, line.coords[0].y); 
	for(let i=1; i<line.coords.length; i++){
		ctx.lineTo(line.coords[i].x, line.coords[i].y);
	}
	ctx.strokeStyle = line.color;
	ctx.lineWidth = line.width;
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
		if(selecting){
			return;
		}
		mouseDown = true;
		previouscords = {x:e.clientX, y:e.clientY};
		line = [previouscords];
		goToLocation(e.clientX,e.clientY);
	});
	$('#owo-board').mouseup((e) => {
		if(selecting){
			return;
		}
		mouseDown = false;
		sendLineToServer(line);
	});
	$('#owo-board').mousemove((e) => {
		if(selecting){
			return;
		}
		if(mouseDown && getDistance(previouscords,{x:e.clientX, y:e.clientY})>=20){
			drawLineTo(e.clientX,e.clientY);
			previouscords = {x:e.clientX, y:e.clientY};
			line.push(previouscords);
		}
	});
	$('#owo-board').dblclick((e) => {
		//console.log('double click');
		//$(initializeDrawTool).hide();
	
	});
}

function initializeToolBar(){
	$('#selector').click((e) => {
		selecting = true;
	});
	$('#draw-tool').click((e) => {
		selecting = false;
	});
	$('#color-selector').click((e) => {
		if(colorSelecting==true){
			$('#color-selection').css('display','none');
			colorSelecting = false;
		}
		else{
			$('#color-selection').css('display','block');
			colorSelecting = true;
		}
	});
	$('#color-red').click((e) => {
		color = '#ff0000';
	});
	$('#color-orange').click((e) => {
		color = '#ff9933';
	});
	$('#color-yellow').click((e) => {
		color = '#ffff66';
	});
	$('#color-green').click((e) => {
		color = '#009900';
	});
	$('#color-blue').click((e) => {
		color = '#0000ff';
	});
	$('#color-purple').click((e) => {
		color = '#660066';
	});
	$('#color-pink').click((e) => {
		color = '#ff6699';
	});
	$('#color-lime').click((e) => {
		color = '#00ff00';
	});
	$('#color-cyan').click((e) => {
		color = '#00ffff';
	});
	$('#color-black').click((e) => {
		color = '#000000';
	});
	$('#color-white').click((e) => {
		color = '#ffffff';
	});
	$('#color-gray').click((e) => {
		color = '#444444';
	});
	$('#width-selector').click((e) => {
		if(widthSelecting==true){
			$('#width-selection').css('display','none');
			widthSelecting = false;
		}
		else{
			$('#width-selection').css('display','block');
			widthSelecting = true;
		}
	});
	$('#width-inc').click((e) => {
		width++;
		$('#width-display').html(width);
	});
	$('#width-dec').click((e) => {
		if(width <= 1){
			return;
		}
		width--;
		$('#width-display').html(width);
	});
}
$(document).ready(() => {
	console.log ('ready');
	initializeMousehandlers();
	initializeToolBar();
	canvas = document.getElementById('owo-board');
	//initializeDrawTool();
	document.getElementById("owo-board").width = window.innerWidth;
    document.getElementById("owo-board").height = window.innerHeight;
    $(window).resize(() => {
        document.getElementById("owo-board").width = window.innerWidth;
		document.getElementById("owo-board").height = window.innerHeight;
		Object.keys(lineCollection).forEach((lineKey) => {
			var coords = lineCollection[lineKey].coords;
			drawLine(lineCollection[lineKey]);
		});
		reselectColor();
	});
});