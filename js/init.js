// --------------------------------------- VARIABLE DECLARATION --------------------------------------- //

var canvas = document.getElementById("game"); 					// element
var ctx = canvas.getContext("2d");								// object

var time = 0; 													// time elapsed
var lastFrameTime = 0; 											// the time the game update function last ran 
var currentSecond = 0, frameCount = 0, framesLastSecond = 0; 	// frame rate

var offsetX = 0, offsetY = 0; 									// top left position of game board
var grid = []; 													// number of cells in the game board
var minesLeft;

// Load Images
var mine = new Image(); 										// mine image
mine.src = 'images/mine.png'; 

var flag = new Image(); 										// flag image
flag.src = 'images/flag.jpg';

var cell = new Image(); 										// tile image
cell.src = 'images/cell.jpg';

var clock = new Image(); 										// clock image
clock.src = 'images/clock.jpg';

var mouseState = {
	x: 0, y: 0, 												// current cursor position
	click: null 												// coordinates of the last click 
};

var gameState = {

	level       : 'easy',   									// current difficulty level
	screen      : 'menu',  										// current screen visible to player
	newBest     : false,    									// whether high score achieved (boolean)
	timeTaken   : 0,        									// game time for current level (millisec)
	cellWidth   : 20,       									// width of one cell (px)
	cellHeight  : 20        									// height of one cell (px)
	
};

var levels = { 													// Difficulty Levels

	easy: {
		name		: "Easy",									// type
		numCols		: 9,										// total number of columns
		numRows		: 9,										// total number of rows
		mines		: 10,										// number of mines
		menuBox		: [0,0]										// position of levels on the menu
	},
    
    intermediate: {
		name		: "Intermediate", 							// type
		numCols		: 16,       								// total number of columns
		numRows		: 16,       								// total number of rows
		mines		: 40,       								// number of mines
		menuBox		: [0,0]										// position of levels on the menu
	},
    
    expert: {
		name		: "Expert",   								// type
		numCols		: 30,      									// total number of columns
		numRows		: 16,      									// total number of rows
		mines		: 99,       								// number of mines
		menuBox		: [0,0]										// position of levels on the menu
	}

};

