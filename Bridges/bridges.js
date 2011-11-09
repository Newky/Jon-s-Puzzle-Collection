bridges = {};

bridges.getContext = function () {

	var canvas = document.getElementById('grid');
	var context = canvas.getContext('2d');

	return context;

};

bridges.getCanvas = function () {

	var canvas = document.getElementById('grid');
	return canvas;

};

bridges.drawGrid = function () {

	var canvas = bridges.getCanvas();
	var context = bridges.getContext(); 
	context.strokeStyle = '#eee';
	var width = canvas.width;
	var height = canvas.height;

	for (var x = 40.5; x < canvas.width; x += 40) {

		context.moveTo(x, 0);
		context.lineTo(x, height);

	}

	for (var y = 40.5; y < canvas.height; y += 40) {

		context.moveTo(0, y);
		context.lineTo(width, y);

	}

	context.stroke();
	
};

bridges.drawIsland = function (x, y) {

	var context = bridges.getContext();
	context.beginPath();
	var radius = 15;

	var cx = x + 20;
	var cy = y + 20;

	context.arc(cx, cy, radius, 0, Math.PI * 2, false);
	context.closePath();
	context.strokeStyle = '#000';
	context.stroke();

};

bridges.pickSpot = function () {

	var canvas = bridges.getCanvas();
	var x = (Math.floor((Math.ceil(250 * Math.random()))/40) * 40);
	var y = (Math.floor((Math.ceil(250 * Math.random()))/40) * 40);

	return x;
};
