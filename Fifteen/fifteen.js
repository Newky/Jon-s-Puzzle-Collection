/* Fifteen is a puzzle game. It consists of a 4x4 square grid that contains 15 tiles and 1 space. The goal is to arrange the tiles so that they're ascending order. 1 is in the top left, while the highest value, 15, is in the bottom right but one, with space being in the bottom right square. */ 

//MODEL

function Tile(x,y,value) {
	//the tile object constructor. 

	// data that we need to know about each tile. x and y positions reveal which row/column it is in, while value remains constant, the number to be displayed on the tile. 
	this.xpos = x;
	this.ypos = y;
	this.value = value;

	// methods that need to be available for tiles. 
	this.nextSpace = function() {
		//determines whether this tile is next to the space. 
		if ((SPACE.xpos == this.xpos) && (Math.abs(SPACE.ypos - this.ypos) == 1)) {
			return true;
		}
		else if ((SPACE.ypos == this.ypos) && (Math.abs(SPACE.xpos - this.xpos) == 1)) {
			return true; 
		}
		else { 
			return false; 
		}	
	}

	this.move = function(destx, desty) {
		//move this tile to the position given by destx and desty
		this.xpos = destx;
		this.ypos = desty;
	}
}

// this is the grid, the game board. It's an array of Tile objects. The space is designated by a Tile object with a null value. The tile object's position on the grid is not related to their position in the array, so SPACE can point straight to this tile to make referencing easier. 
var grid = [
			new Tile(0,0,1), new Tile(1,0,2), new Tile(2,0,3), new Tile(3,0,4),
			new Tile(0,1,5), new Tile(1,1,6), new Tile(2,1,7), new Tile(3,1,8), 
			new Tile(0,2,9), new Tile(1,2,10), new Tile(2,2,11), new Tile(3,2,12),
			new Tile(0,3,13), new Tile(1,3,14), new Tile(2,3,15), new Tile(3,3,null)		
			];

var SPACE = grid[15];

function getNeighbours(tile) {
	//to find all the neighbours of a particular tile. A tile is a neighbour of another if one of it's x or y co-ordinates is within 1 of the other. 	
	var neighbours = []; 
	for (var i = 0; i < grid.length; i++) {
		if (tile == grid[i]) {
			break;
		}
		else if ((tile.xpos == grid[i].xpos) && (Math.abs(tile.ypos - grid[i].ypos) == 1)) {
			neighbours.push(grid[i]);
		}
		else if ((tile.ypos == grid[i].ypos) && (Math.abs(tile.xpos - grid[i].xpos) == 1)) {
			neighbours.push(grid[i]); 
		}
	}

	return neighbours;
}

function shuffle(SPACE) {
	//shuffle the grid so that it's in a random order at the start. Work backwards from the finished state to make sure the game is completable! 
	var count = 0;
	while (count < 1000) {
	
		var neighbours = getNeighbours(SPACE); 
		var rand = Math.floor(Math.random()*neighbours.length);			
		var target = neighbours[rand];

		var tempx = SPACE.xpos; 
		var	tempy = SPACE.ypos; 
	
		SPACE.move(target.xpos, target.ypos);
		target.move(tempx, tempy);	
		count++;
	};

}
	
//CONTROLLER

function setup() {

	shuffle(SPACE);

	for (var i = 0; i < (grid.length); i++) { 
		drawTile(grid[i]); 
	}

	var canvas = document.getElementById('grid');
	canvas.addEventListener('click', tileClick, false);

}

function tileClick(event) {

	var tile =  coords2Tile(getCursorPos(event));
	if (tile.nextSpace()) { 
		clearTile(tile);
		tempx = tile.xpos;
		tempy = tile.ypos; 
		tile.move(SPACE.xpos, SPACE.ypos);
		drawTile(tile); 
		SPACE.move(tempx, tempy);
		drawTile(SPACE);
	}
}

function coords2Tile(coords) {

	for (var i = 0; i < grid.length; i++) {
		if ((coords[0] == grid[i].xpos) && (coords[1] == grid[i].ypos)) {
			return grid[i];
		}
	}
}

function getCursorPos(event) {
	// Code for determing mouse click relative to canvas from diveintohtml5. 

	var x;
	var y;
 
	if (event.pageX != undefined && event.pageY != undefined) {
		x = event.pageX;
		y = event.pageY;
	}
	else {
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	x -= document.getElementById('grid').offsetLeft;
	y -= document.getElementById('grid').offsetTop;

	var tile = [Math.floor(x/WIDTH), Math.floor(y/HEIGHT)];			
	return tile;

}

//VIEW	

var WIDTH = 75;
var HEIGHT = 75; 

function getContext() {

	var canvas = document.getElementById('grid');
	var context = canvas.getContext('2d'); 
	return context; 

}

function findMiddle(tile) { 

	var x = tile.xpos * WIDTH; 
	var midx = (WIDTH/2) + x;

	var y = tile.ypos * HEIGHT; 
	var midy = (HEIGHT/2) + y;

	var mid = [midx, midy];
	return mid; 

}			

function drawTile(tile) {

	if (tile.value == null) {
		getContext().strokeRect((tile.xpos * WIDTH), (tile.ypos * HEIGHT), WIDTH, HEIGHT);
	}
	else {
		getContext().strokeRect((tile.xpos * WIDTH), (tile.ypos * HEIGHT), WIDTH, HEIGHT);
		getContext().font = 'bold 12px sans-serif';
		getContext().fillText(tile.value, findMiddle(tile)[0], findMiddle(tile)[1]); 
	}

}

function clearTile(tile) {

	getContext().clearRect((tile.xpos * WIDTH), (tile.ypos * HEIGHT), WIDTH, HEIGHT); 

}	
