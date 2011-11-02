/* pegs.js
Pegs is a game, based on the classic solitaire (aka. 'peg solitaire'). This program implements the Enlgish version in HTML Canvas + JS. 

The board looks like this: 

   ***
   ***
*********
****0****
*********
   ***
   ***

Where the *s represent initial peg positions, and the 0 an initial hole. The only legal move is to jump one peg over another, with it ending in an empty hole. It can only ever clear one peg at a time, and cannot move diagonally. 
When a peg is jumped, it is removed from the game. 

The goal is to end up with all but one peg gone, with the final peg in the initial hole. 

Data: 

A grid is a two dimensional array, such that: 

	var grid = [[hole,hole,hole,hole,hole,hole,hole]];

represents the top row of the board. 

A hole is an object, such that: 

	function Hole() {
		hasPeg? 
		inPlay?
	};

where hasPeg? is a boolean value describing whether a peg is currently in that position; inPlay? is a boolean specifying whether this hole is part of the playable board or not.  

Flow of the program: 

	* make the grid
	* draw the grid
	* get the user's clicks
	* process the user's clicks
	* redraw the grid
	* return to step 3
		
*/

var pegs = (function () {

	function Hole(hasPeg, inPlay, x, y) {

		this.peg = hasPeg;
		this.play = inPlay;
		this.x = x;
		this.y = y;

	}

	function makeGrid(xsize, ysize) {
		//begin with an empty array. 
		var grid = [];

		function inPlay(x, y) {
			/*
			A piece is not in play for: 
				x = 0, y = 0; 
				x = 1, y = 0;
				x = 5, y = 0;
				x = 6, y = 0;
			The same x values are not in play for values of y = 1, 5, 6. 
			This function checks to see if a hole will be in play or not. 
			It returns true if in play, false if not. 
			*/

			if (((x === 0) || (x === 1) || (x === 5) || (x === 6)) && 
			((y === 0) || (y === 1) || (y === 5) || (y === 6))) {
				return false;
			} else {
				return true;
			};
		}

		//then fill it with xsize subarrays, i.e. the columns.
		for (var x = 0; x < xsize; x++) {
			grid[x] = [];

			//then fill each column with ysize Holes.
			for (var y = 0; y < ysize; y++) {
				
				//if it's the middle piece, it's empty but in play 
				//FIXME: midpoint shouldn't be hardcoded. 
				if ((x === 3) && (y === 3)) {
					grid[x][y] = new Hole(false, true, x, y);
				
				//if it's inPlay but not the middle, it's full but in play
				} else if (inPlay(x, y)) {
					grid[x][y] = new Hole(true, true, x, y);

				//if it's not in play, it's empty and not in play
				} else {
					grid[x][y] = new Hole(false, false, x, y);
				};
			
			};
		};

		return grid;
	}

	function drawGrid(grid) {

		function drawPiece(x, y, peg) {
			//get the canvas + context for drawing the pieces.  
			var canvas = document.getElementById('grid');
			var context = canvas.getContext('2d');

			//figure out the width of each hole on the canvas. 
			//grid.length is the x length, grid[0].length the y.
			var width = canvas.width / grid.length;
			var height = canvas.width / grid[0].length;

			//the radius of a piece should be less than the width of the hole
			//padding is important!
			var radius = (width / 2) - 5;
		
			//the x & y values passed in are positions in the array. 
			//need to translate them in to positions on the canvas. 
			//the radius must be added on to get the midpoint, not the top-left corner.
			//5 must also be added back on, otherwise don't get the midpoint of the hole. 
			var midx = (x * width) + radius + 5;
			var midy = (y * height) + radius + 5;	

			//draw a circle
			context.beginPath();
			context.arc(midx, midy, radius, 0, Math.PI * 2, false);
			context.closePath();
			context.strokeStyle = '#AAB3AB'; 
			context.stroke();
			
			//if the hole being draw has a peg, fill it in
			if (peg) {
				context.fillStyle = '#AAB3AB';
				context.fill();
			};

		}

		//iterate over each element in the grid 
		for (var x = 0; x < grid.length; x++) {
			for (var y = 0; y < grid[x].length; y++) {

				//if the element in question is in play and has a peg, 
				if ((grid[x][y].play === true) && (grid[x][y].peg === true)) {
					//draw it filled in
					drawPiece(x, y, true);
				}; 
				
				//if the element in question is in play but doesn't have a peg
				if ((grid[x][y].play === true) && (grid[x][y].peg === false)) {
					//draw it hollow
					drawPiece(x, y, false);
				};
			};
		};
	}

	function clearGrid() {

		var canvas = document.getElementById('grid');
		var context = canvas.getContext('2d');

		context.clearRect(0,0,canvas.width,canvas.height);

	};

	function makeMove(hole1, hole2, grid) {

		function checkLegal() {
			/*a move is legal in peg solitaire if:
			hole1 and hole2 are in the same row or column
			hole1 and hole2 are one place removed within the column. 
			hole1 has a peg and hole2 is empty. 
			the hole in between the two holes has a peg. 
			*/

			var xdif = Math.abs(hole1.x - hole2.x);
			var ydif = Math.abs(hole1.y - hole2.y);

			//if hole1 and hole2 are in the same row and one removed:
			if ((hole1.x === hole2.x) && 
			(ydif === 2) && (hole2.peg === false)) {

				//allow us to find the middle hole, if moving up or down.
				if (hole1.y > hole2.y) {
					var tempy = hole1.y - 1;

					//if the middle hole has a peg, can do the move.
					if (grid[hole1.x][tempy].peg === true) {
						return grid[hole1.x][tempy];
					} else {
						return false;
					};
				} else {
					var tempy = hole1.y + 1; 

					//if the middle hole has a peg, can do the move. 
					if (grid[hole1.x][tempy].peg === true) {
						return grid[hole1.x][tempy];
					} else {
						return false;
					};
				};

			//if hole1 and hole2 are in the same column and one removed:
			} else if ((hole1.y === hole2.y) && 
			(xdif === 2) && (hole2.peg === false)) {
				
				//allow us to find the middle hole, if moving left or right
				if (hole1.x > hole2.x) {
					var tempx = hole1.x - 1;
					
					//if the middle hole has a peg, can do the move. 
					if (grid[tempx][hole1.y].peg === true) {
						return grid[tempx][hole1.y];
					} else {
						return false;
					}; 
				} else {
					var tempx = hole1.x + 1; 

					//if the middle hole has a peg, can do the move.
					if (grid[tempx][hole1.y].peg === true) {
						return grid[tempx][hole1.y];
					} else {
						return false;
					};
				};

			} else {
				return false;
			};

		}

		function updateGrid() {

			function illegalMove() {

				//a silly function for now, but in the future I plan to:
				//make a nicer looking error message than alert();
				alert('Illegal Move');

			}

			var midPeg = checkLegal();

			if (checkLegal() != false) {
				hole1.peg = false;
				hole2.peg = true;
				midPeg.peg = false;
			} else {
				illegalMove();
			};
		}

		updateGrid();
		clearGrid();
		drawGrid(grid);

	}

	var run = function () { 
		var canvas = document.getElementById('grid')
		var xsize = 7;
		var ysize = 7;
		var grid = makeGrid(xsize, ysize);
		
		var controlClick = (function () {
		//this function records two click events and finds the clicked holes. 
		//needed for carrying out a user's move. 

			//need to keep track of first, second hole, how many clicks
			var count = 0;
			var hole1;
			var hole2; 

			function controlClick(event) {

				function getClickedHole(event) {
					//thanks to Dive Into HTML5 for the click code
					var x; 
					var y;

					var width = canvas.width / grid.length;
					var height = canvas.height / grid[0].length;

					//hole element which needs to be returned for further processing. 
					var hole;

					if ((event.pageX != undefined) && (event.pageY != undefined)) {
						x = event.pageX;
						y = event.pageY;
					} else {
						x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
						y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
					};

					x -= canvas.offsetLeft;
					y -= canvas.offsetTop;

					x = Math.floor(x/width);
					y = Math.floor(y/height);

					hole = grid[x][y];
					return hole;

				}

				//if this the first click, record the piece in hole1
				if (count === 0) {
					count += 1;
					hole1 = getClickedHole(event); 
				
				//if this is the second click, record the piece in hole2,
				//run the code to make a move on these two holes
				} else {
					count = 0; 
					hole2 = getClickedHole(event);
					makeMove(hole1, hole2, grid);
				};

			}

			return controlClick;
		})();

		//draw the grid, with it's initial values
		drawGrid(grid);

		//assign an event listener.
		//hand game control to this listener for the remainder. 
		canvas.addEventListener('click', controlClick, false);

	}

	return run;
})();
