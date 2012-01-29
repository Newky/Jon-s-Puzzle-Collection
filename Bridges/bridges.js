var Coord = function (x, y) {
    this.x = x; 
    this.y = y;
};
/* This is the islands in bridge.
 * simple x and y coordinate.
 * with a num bridge count.
 * This will need a certain number as well surely??
 */
var Island = function (coord, num) { 
    this.x = coord.x;
    this.y = coord.y;
    this.numBridges = 0;
    this.num = num;

    this.valid = function() { return (this.numBridges == this.num;) };
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
 * Like (0, 1, 2, 3)
 * Would signify 0 connections above.
 * 1 Connections below.
 * 2 Connections to the right.
 * 3 Connections to the left.
 * Building from this to query how many connections we count our own connections.
 * so we go connections[ourx][oury].
 * sum(0, 1, 2, 3) = 6 if our num is 6 then Yay. else Awww..
 * I think this is the easiest way to represent the problem.
 */

var grid = function (size) {
    var grid = [];
    for (var x = 0; x < size; x++) {
        grid[x] = [];
        for (var y = 0; y < size; y++) {
           grid[x][y] = undefined;
        }
    }
    return grid;
};

var board = grid(5); 

//wrapper function
var setGrid = function (board, numIslands) {

    var coordIterator = function (object) {
    //create an iterator of all possible island positions, 
    //given either an empty board or a previously placed island. 
    //returns an array of coords. 
        var poss = [];
        if (object instanceof Coord) { 
            for (var x = (object.x + 1); x < board.length; x++) {
                poss.push(new Coord(x, object.y)); 
            }
            for (var x = 0; x < object.x; x++) {
                poss.push(new Coord(x, object.y));
            }
            for (var y = (object.y + 1); y < board.length; y++) { 
                poss.push(new Coord(object.x, y));
            }
            for (var y = 0; y < object.y; y++) {
                poss.push(new Coord(object.x, y));
            }
        } else {
            for (var x = 0; x < board.length; x++) {
                for (var y = 0; y < board.length; y++) {
                    poss.push(new Coord(x, y));
                }
            }
        }

        var iterator = {
            next: function () {
                if (poss) {
                    var x = Math.floor(Math.random() * poss.length);
                    var splice = poss.splice(x, 1)[0];
                    return splice;
                } else {
                    return false;
                }
            }
        }
        return iterator; 
    };

    var isSafe = function (next, previous) { 
    //TODO: create checks to ensure islands are placed correctly
    //islands can't be placed next to each other. 
    //bridges can't cross over one another. 
    //islands can connect to existing islands
        return true;
    };

    var placeIsland = function (coord) {
    //TODO: need to add connection tracking code
        board[coord.x][coord.y] = new Island(coord); 
    };

    var removeIsland = function (coord) {
    //TODO: add connectino tracking code
        board[coord.x][coord.y] = undefined;
    };

    var setGridInternal = function (previous, numIslands) {
        var poss = coordIterator(previous);
        var next = poss.next();
        numIslands--;
        console.log(next);

        if (numIslands <= 0) return true;

        while (next) {
            if (isSafe(next, previous)) { //TODO
                placeIsland(next);
                if (setGridInternal(next, numIslands)) return true;
                removeIsland(next);
            }
            next = poss.next();
        }
        return false;
    };  
    
    var poss = coordIterator(board);
    var next = poss.next();

    while (next) {
        placeIsland(next); 
        if (setGridInternal(next, numIslands)) return true;
        removeIsland(next); 
        next = poss.next();
    }
    return false;
};

var drawGrid = function (board) {

    var canvas = document.getElementById('board');
    var context = canvas.getContext('2d');

    for (var x = 0; x < board.length; x += 30) {
        for (var y = 0; y < board[x].length; y += 30) {
            context.beginPath

    }
}
