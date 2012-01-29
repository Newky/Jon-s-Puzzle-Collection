var Coord = function (x, y) {
    this.x = x; 
    this.y = y;
};
/* This is the islands in bridge.
 * simple x and y coordinate.
 * with a num bridge count.
 * This will need a certain number as well surely??
 */
var Island = function (num) { 
    this.numBridges = 0;
    this.num = num;
    /*Connections array which stands for up,down,left,right*/
    this.connections = [0,0,0,0];
    this.valid = function() { return (this.numBridges == this.num); };
};

/*
 *
 *
 */
exports.game = (function(size, islands) {
	//Default variable. I've set it to 5 but there maybe some thing
	//where only a certain number is actually possible
	//COMEBACK.
	var islands = islands || 5;
	var size = size || 7;
	var grid = new Array(size); 

	return {
		"init": function() {
			console.log("Size:"+size);
			for(var i=0;i<size;i++)
				grid[i] = new Array(size);
			//Code to place the islands.
			//Hardcoded Example for now :)
			grid[1][0] = new Island(3);
			grid[4][0] = new Island(4);
			grid[6][0] = new Island(4);
			grid[0][1] = new Island(2);
			grid[5][1] = new Island(2);
			grid[2][2] = new Island(1);
			grid[4][2] = new Island(2);
			grid[1][3] = new Island(4);
			grid[5][3] = new Island(4);
			grid[0][4] = new Island(5);
			grid[6][4] = new Island(3);
			grid[0][6] = new Island(3);
			grid[3][6] = new Island(4);
			grid[6][6] = new Island(2);
			//This is an example grid for the following bridge game:
			//http://imagebin.org/196247
		},
		"move": function(i0, j0, i1, j1) {
			//Move from (i0, j0) to (i1, j1)
			//Returning null for error state at the moment :)
			if((grid[i0][j0] == undefined) || (grid[i1][j1] == undefined)){
				console.log("Coordinates do not point to islands")
				return null;
			}
			//Make sure that the move makes sense can only be horizontal or vertical not diagonal
			if(Math.abs(i0 - i1) != 0 && Math.abs(j0-j1) != 0){
				console.log("Must be a horizontal or vertical move");
				return null;
			}
			//Make sure its not the same island.
			if(Math.abs(i0 - i1) == 0 && Math.abs(j0-j1) == 0){
				console.log("Same island.");
				return null;
			}
			//Work out orientation of bridge.
			//orientation: 1=vertical,0=horizontal
			var orientation = null;
			//Vertical
			if(Math.abs(i0 - i1) == 0)
				orientation = 1;
			//Horizontal
			else
				orientation = 0;
			if(orientation == 0) {
				var lesser, greater;
				if(i0 < i1){
					lesser = i0;greater = i1;
				}else{
					lesser = i1;greater = i0;
				}
				for(var i=lesser+1;i<greater;i++){
					var j = j0;
					//Increment up the column till u find an island.
					while(grid[i][j] == undefined && j >= 0) {
						j--;
					}
					//If we found an island.
					if(j >=0){
						// If a downward bridge. Panic. Error.
						if(grid[i][j].connections[1] > 0){
							console.log("Bridge Crossing!");
							return null;
						}
					}
					console.log("\n");
				}
				//Got here and no problems all is ok :)
				//We can apply the move.
				grid[lesser][j0].connections[2]++;
				grid[greater][j0].connections[3]++;
			}else {
				//Vertical
				var lesser, greater;
				if(j0 < j1){
					lesser = j0;greater = j1;
				}else{
					lesser = j1;greater = j0;
				}
				for(var j=lesser+1;j<greater;j++){
					var i = i0;
					//Increment down the row till u find an island.
					while(grid[i][j] == undefined && i >= 0) {
						i--;
					}
					//If we found an island.
					if(i >=0){
						// If a right bridge. Panic. Error.
						if(grid[i][j].connections[2] > 0){
							console.log("Bridge Crossing!");
							return null;
						}
					}
				}
				//Got here and no problems all is ok :)
				//We can apply the move.
				grid[i0][lesser].connections[1] ++;
				grid[i0][greater].connections[0] ++;
			}
		},
		"print": function() {
			/*"Pretty" Print the grid for testing purposes.*/
			for(var i=0;i<grid.length;i++){
				for(var j=0;j<grid[i].length;j++){
					if(grid[i][j] != undefined)
						console.log(i+"."+j+":"+grid[i][j].connections[0]+","+grid[i][j].connections[1]+","
							+grid[i][j].connections[3]+","+grid[i][j].connections[3]+"\n")
					else
						console.log("Blank\n");
				}
			}
		}
	}
})(7);

exports.test = function(game) {
	game.init();
	game.move(1,0,1,3);
	game.move(0,1,5,1);
};
/* For a grid of size 5 x 5
 * you have a grid that looks like.
 * x	x	x	x	x
 * x	x	x	x	x
 * x	x	x	x	x
 * x	x	x	x	x
 * I.e thats is a [5][5] Array
 * The easiest way to show the connections is to have a grid which is 4 times as big i.e
 * each node has 4 connection ways.
 *    ^
 * <- x  ->
 *    v
 * So we need another 5x5 array with a Connection object.
 * which is just a quad of Numbers (0, 1, 2)
 * Like (0, 1, 2, 2)
 * Would signify 0 connections above.
 * 1 Connections below.
 * 2 Connections to the right.
 * 2 Connections to the left.
 * Building from this to query how many connections we count our own connections.
 * so we go connections[ourx][oury].
 * sum(0, 1, 2, 3) = 6 if our num is 6 then Yay. else Awww..
 * I think this is the easiest way to represent the problem.
 */

/*var grid = function (size) {*/
/*var grid = [];*/
/*for (var x = 0; x < size; x++) {*/
/*grid[x] = [];*/
/*for (var y = 0; y < size; y++) {*/
/*grid[x][y] = undefined;*/
/*}*/
/*}*/
/*return grid;*/
/*};*/

/*var board = grid(5); */

/*//wrapper function*/
/*var setGrid = function (board, numIslands) {*/

/*var coordIterator = function (object) {*/
/*//create an iterator of all possible island positions, */
/*//given either an empty board or a previously placed island. */
/*//returns an array of coords. */
/*var poss = [];*/
/*if (object instanceof Coord) { */
/*for (var x = (object.x + 1); x < board.length; x++) {*/
/*poss.push(new Coord(x, object.y)); */
/*}*/
/*for (var x = 0; x < object.x; x++) {*/
/*poss.push(new Coord(x, object.y));*/
/*}*/
/*for (var y = (object.y + 1); y < board.length; y++) { */
/*poss.push(new Coord(object.x, y));*/
/*}*/
/*for (var y = 0; y < object.y; y++) {*/
/*poss.push(new Coord(object.x, y));*/
/*}*/
/*} else {*/
/*for (var x = 0; x < board.length; x++) {*/
/*for (var y = 0; y < board.length; y++) {*/
/*poss.push(new Coord(x, y));*/
/*}*/
/*}*/
/*}*/

/*var iterator = {*/
/*next: function () {*/
/*if (poss) {*/
/*var x = Math.floor(Math.random() * poss.length);*/
/*var splice = poss.splice(x, 1)[0];*/
/*return splice;*/
/*} else {*/
/*return false;*/
/*}*/
/*}*/
/*}*/
/*return iterator; */
/*};*/

/*var isSafe = function (next, previous) { */
/*//TODO: create checks to ensure islands are placed correctly*/
/*//islands can't be placed next to each other. */
/*//bridges can't cross over one another. */
/*//islands can connect to existing islands*/
/*return true;*/
/*};*/

/*var placeIsland = function (coord) {*/
/*//TODO: need to add connection tracking code*/
/*board[coord.x][coord.y] = new Island(coord); */
/*};*/

/*var removeIsland = function (coord) {*/
/*//TODO: add connectino tracking code*/
/*board[coord.x][coord.y] = undefined;*/
/*};*/

/*var setGridInternal = function (previous, numIslands) {*/
/*var poss = coordIterator(previous);*/
/*var next = poss.next();*/
/*numIslands--;*/
/*console.log(next);*/

/*if (numIslands <= 0) return true;*/

/*while (next) {*/
/*if (isSafe(next, previous)) { //TODO*/
/*placeIsland(next);*/
/*if (setGridInternal(next, numIslands)) return true;*/
/*removeIsland(next);*/
/*}*/
/*next = poss.next();*/
/*}*/
/*return false;*/
/*};  */

/*var poss = coordIterator(board);*/
/*var next = poss.next();*/

/*while (next) {*/
/*placeIsland(next); */
/*if (setGridInternal(next, numIslands)) return true;*/
/*removeIsland(next); */
/*next = poss.next();*/
/*}*/
/*return false;*/
/*};*/

/*var drawGrid = function (board) {*/

/*var canvas = document.getElementById('board');*/
/*var context = canvas.getContext('2d');*/

/*for (var x = 0; x < board.length; x += 30) {*/
/*for (var y = 0; y < board[x].length; y += 30) {*/
/*context.beginPath*/

/*}*/
/*}*/
