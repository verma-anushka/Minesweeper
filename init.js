// VARIABLE DECLARATION

var canvas = document.getElementById("game"); // element
var ctx = canvas.getContext("2d"); // object

var time = 0; // time elapsed
var lastFrameTime = 0; // the time the game update function last ran 
var currentSecond = 0, frameCount = 0, framesLastSecond = 0; // frame rate

var offsetX = 0, offsetY = 0; // top left position of game board
var grid = []; // number of cells in the game board

var mouseState = {
	x: 0, y: 0, // current cursor position
	click: null // coordinates of the last click 
};

var gameState = {
	level       : 'easy',   // current difficulty level
	screen      : 'menu',   // current screen visible to player
	newBest     : false,    // whether high score achieved (boolean)
	timeTaken   : 0,        // game time for current level (millisec)
	cellWidth   : 20,       // width of one cell (px)
	cellHeight  : 20        // height of one cell (px)
};

// Difficulty Levels
var levels = {

	easy: {
		name		: "Easy",   // type
		numCols		: 10,       // total number of columns
		numRows		: 10,       // total number of rows
		mines		: 10,       // number of mines
		bestTime	: 0,        // high score
		menuBox		: [0,0]     // position of levels on the menu
	},
    
    medium: {
		name		: "Medium", // type
		numCols		: 12,       // total number of columns
		numRows		: 12,       // total number of rows
		mines		: 20,       // number of mines
		bestTime	: 0,        // high score
		menuBox		: [0,0]
	},
    
    hard: {
		name		: "Hard",   // type
		numCols		: 15,       // total number of columns
		numRows		: 15,       // total number of rows
		mines		: 50,       // number of mines
		bestTime	: 0,        // high score
		menuBox		: [0,0]
	}
};

