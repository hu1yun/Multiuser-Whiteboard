var ws = new WebSocket('ws://' + location.hostname + ':8080');
ws.onmessage = function (ev) {
	console.log(ev);
}
var canvas;
function initializeDrawTool() {
	ctx = canvas.getContext('2d');
	ctx.strokestyle = '#000000';
	ctx.lineWidth = 5;
}
function goToLocation(x, y){
	ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.moveTo(x, y);
}
function drawLineTo(x, y){
	ctx = canvas.getContext('2d');
	ctx.lineTo(x, y);
	ctx.stroke();
}
var mouseDown=false;
function initializeMousehandlers() {
	$('#owo-board').mousedown((e) => {
		mouseDown = true;
	//	console.log('mouse is down');
		goToLocation(e.clientX,e.clientY);
	});
	$('#owo-board').mouseup((e) => {
		mouseDown = false;
	//	console.log('mouse is up');
	});
	$('#owo-board').mousemove((e) => {
	//	console.log('Coords: (x: ' + e.clientX + ', y: ' + e.clientY + ' )');
		if(mouseDown){
			drawLineTo(e.clientX,e.clientY);
		}
	});
	$('#owo-board').dblclick((e) => {
		console.log('double click');
		$(initializeDrawTool).hide();
	
	});
}


$(document).ready(() => {
	console.log ('ready');
	initializeMousehandlers();
	canvas = document.getElementById('owo-board');
	initializeDrawTool();
	document.getElementById("owo-board").width = window.innerWidth;
    document.getElementById("owo-board").height = window.innerHeight;
    $(window).resize(() => {
        document.getElementById("owo-board").width = window.innerWidth;
        document.getElementById("owo-board").height = window.innerHeight;
    });
});