var Coord = function (x, y) {
    this.x = x; 
    this.y = y;
};

var Island = function (coord) { 
    this.x = coord.x;
    this.y = coord.y;
    this.numBridges = 0;
};

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
