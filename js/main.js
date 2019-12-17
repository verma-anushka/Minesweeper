// --------------------------------------- GAME LOGIC --------------------------------------- //


// Function to check for level up
function checkState(){

    // base condition
	for(var i in grid){ 														// iterate over all the cells in the grid array

        if(grid[i].hasMine == false && grid[i].currentState != 'visible') 
			return; 															// return if a cell with no mine is hidden
	}

	gameState.timeTaken = time;													// update game time
	gameState.screen = 'won'; 													// update level cleared screen
}


// Function to initiate a level on start
function startLevel(level){

    // Update variables
    time		            = 0;
	lastFrameTime		    = 0;
	grid.length		        = 0;
    gameState.newBest       = false;
	gameState.timeTaken     = 0;
    gameState.level	        = level;
	gameState.screen	    = 'playing';

	var currentLevel = levels[level];																	// chosen difficulty level
	minesLeft				= currentLevel.mines;	

    canvas.width = currentLevel.numCols*gameState.cellWidth + 100;										// update canvas width
	canvas.height = currentLevel.numRows*gameState.cellHeight + 100;									// update canvas height

    // Calculate the start position of the game board
	offsetX = Math.floor((canvas.width - (currentLevel.numCols * gameState.cellWidth)) / 2);
	offsetY = Math.floor((canvas.height - (currentLevel.numRows * gameState.cellHeight)) / 2);
    
    // Create and add cells to grid
	for(var j = 0; j < currentLevel.numRows; j++){														// iterate over all rows
		for(var i = 0; i < currentLevel.numCols; i++){													// iterate over all cols
			grid.push(new Cell(i, j));																	// add cell to grid array
		}
	}
	
	addMines(currentLevel);																				// call function to add mines
}


// Function to add mines to random positions
function addMines(currentLevel){
    
    var minesAdded = 0;													// number of mines added
	while(minesAdded < currentLevel.mines){

		var idx = Math.floor(Math.random() * grid.length); 				// randonly generated index
		
        if( grid[idx].hasMine )
            continue; 													// if chosen cell already containes a mine
		
		grid[idx].hasMine = true; 										// add mine
		minesAdded++; 													// update number of mines variable
	}
	
	// Calculate number of neighbouring cell mines for all cells
	for(var i in grid){ 
        grid[i].getNumMines(); 
    }
}


// Function to update the game board
function updateGame(){

	if(gameState.screen == 'menu'){ 																// game start screen

		if(mouseState.click != null){ 																// check mouse click event

			for(var i in levels){																	// iterate over all the levels
				if(mouseState.y >= levels[i].menuBox[0] && mouseState.y <= levels[i].menuBox[1]){ 	// condition to begin new level 
					startLevel(i);																	// start new level
					break;
				}
			}
			mouseState.click = null; 																// update mouse click event

		}
	} else if(gameState.screen == 'won' || gameState.screen == 'lost'){ 							// game over screen

		if(mouseState.click != null){ 																// check mouse click event
			gameState.screen = 'menu'; 																// update game screen
			mouseState.click = null; 																// update mouse click event
		}

	} else{ 																						// game level screen (playing)
		
		if(mouseState.click != null){																// check mouse click event

			var currentLevel = levels[gameState.level];												// chosen difficulty level
			
			// game board click 
			if( mouseState.click[0] >= offsetX &&
				mouseState.click[1] >= offsetY &&
				mouseState.click[0] < (offsetX + (currentLevel.numCols * gameState.cellWidth)) &&
				mouseState.click[1] < (offsetY + (currentLevel.numRows * gameState.cellHeight))
			){
				var cell = [ 																		// position of selected cell
					Math.floor((mouseState.click[0] - offsetX) / gameState.cellWidth),
					Math.floor((mouseState.click[1] - offsetY) / gameState.cellHeight)
				];
				
				if(mouseState.click[2] == 1){ 														// left mouse click 
					grid[((cell[1] * currentLevel.numCols) + cell[0])].showCell(); 					// display cell
				}
				else{ 																				// right mouse click
					grid[((cell[1] * currentLevel.numCols) + cell[0])].flag(); 						// display flag
				}

			}else if(mouseState.click[1] >= canvas.height - 35 ){ 									// return to menu screen
				gameState.screen = 'menu';															// update game screen
			}
			
			mouseState.click = null; 																// update mouse click event
		}
	}
}


// Function to draw menu screen
function drawMenu(){

	ctx.clearRect(0, 0, canvas.width, canvas.height);							// clear canvas

	// Draw on canvas settings
	ctx.textAlign 	 = "center";
	ctx.textBaseline = "bottom";
	ctx.fillStyle 	 = "#FFF";

	ctx.font 		 = "18px sans-serif";
	ctx.fillText("Choose a difficulty level", canvas.width/2, 20);				// display text on canvas

	ctx.font 		 = "bold 24pt sans-serif";
	var y = canvas.height/3 ;

	for(var d in levels){														// iterate over all the levels

		var mouseOver = (mouseState.y >= (y-20) && mouseState.y <= (y+10));
		if(mouseOver)
			ctx.fillStyle = "#001";												// color change on hover
		
		levels[d].menuBox = [y-20, y+10];
		ctx.fillText(levels[d].name, canvas.width/2, y);						// display text on canvas
		y+= 70;
		
		if(mouseOver)
			ctx.fillStyle = "#FFF";												// color change on hover

	}
}


// Function to draw play game state
function drawPlaying(){

	var halfCellWidth = gameState.cellWidth / 2;												// cell mid coordinates
	var halfCellHeight = gameState.cellHeight / 2;												// cell mid coordinates
	var currentLevel = levels[gameState.level];													// chosen difficulty level
	
	// Draw on canvas settings
	ctx.beginPath();
	ctx.textAlign 		= "center";
	ctx.textBaseline 	= "bottom";
	ctx.fillStyle 		= "#FFFFFF";
	ctx.font 			= "18px sans-serif";
	ctx.fillText(currentLevel.name, canvas.width/2, 20);										// display current difficulty
	ctx.fillText("Difficulty", canvas.width/2, canvas.height-10);								// display return to menu
	ctx.closePath();
	
	if(gameState.screen != 'lost'){

		// Draw on canvas settings- total mines box
		ctx.beginPath();
		ctx.fillStyle = '#DDD';
		ctx.shadowColor = '#999';
		ctx.rect(50, 20, 55, 35);
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.textAlign = "left";
		// for(var i in grid){
		// 	if(grid[i].currentState == 'flagged') { 											
		// 		console.log(grid[i]);
		// 		minesLeft -= 1;
		// 		break;
		// 	}
		// 	ctx.fillText(minesLeft, 80, 45);														// display total number of mines
		// }
		ctx.drawImage(mine, 55, 25, 20, 20); 													// display mine image
		ctx.fillText(minesLeft, 80, 45);														// display total number of mines
		ctx.closePath();
	
		var whichT = (gameState.screen == 'won' ? gameState.timeTaken : time);					// update time
		var t = '';
		if((time / 1000) > 60){
			t = Math.floor((whichT / 1000) / 60) + ':';
		}
		var s = Math.floor((whichT / 1000) % 60);
		t += (s > 9 ? s : '0' + s);

		// Draw on canvas settings- time box
		ctx.beginPath();
		ctx.fillStyle = '#DDD';
		ctx.shadowColor = '#999';
		ctx.rect(canvas.width - 122, 20, 72, 35);
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.textAlign = "right";
		ctx.drawImage(clock, canvas.width - 117, 25, 20, 20); 									// display clock image
		ctx.fillText(t, canvas.width - 55, 45);													// display time 
		ctx.closePath();
		
	}
	
	ctx.strokeStyle = "#999";																	// give border to game board
	ctx.strokeRect(offsetX, offsetY, (currentLevel.numCols * gameState.cellWidth), (currentLevel.numRows * gameState.cellHeight));
	
	// Draw on canvas settings
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "bold 14px monospace";
	
	for(var i in grid){																			// iterate over all the cells in the grid

		var px = offsetX + (grid[i].x * gameState.cellWidth);									// x coordinate of the cell
		var py = offsetY + (grid[i].y * gameState.cellHeight);									// y coordinate of the cell
		
		if(gameState.screen == 'lost' && grid[i].hasMine) { 									// display mine

			ctx.beginPath();
			ctx.fillStyle = '#DDD';
			ctx.rect(px, py, gameState.cellWidth, gameState.cellHeight);
			ctx.fill();
			ctx.drawImage(mine, px+1, py+1, gameState.cellWidth-2, gameState.cellHeight-2); 
			ctx.closePath();

		} else if(grid[i].currentState == 'visible') { 											// display cell content

			ctx.beginPath();
			ctx.rect(px, py, gameState.cellWidth, gameState.cellHeight);
			ctx.fillStyle = '#DDD';
			ctx.fill();
			ctx.strokeStyle = "#999";
			ctx.strokeRect(px, py, gameState.cellWidth, gameState.cellHeight);
			ctx.closePath();

			if(grid[i].numMines){																// display number of mines in neighbouring cells
				ctx.font = "bold 18px monospace";
				ctx.fillStyle = grid[i].getMinesColor(grid[i].numMines);
				ctx.fillText(grid[i].numMines, px + halfCellWidth, py + halfCellHeight);
			}

		}
		else{ 
			ctx.drawImage(cell, px, py, 20, 20); 												// display cell
			if(grid[i].currentState == 'flagged') { 											// display flag
				// minesLeft -= 1;
				ctx.drawImage(flag, px, py, gameState.cellWidth, gameState.cellHeight); 
				// break;
			}
		}
	}

	if(gameState.screen == 'lost' || gameState.screen == 'won'){ 								// display game over message
		
		ctx.beginPath();
		ctx.textAlign = "center";
		ctx.fillStyle = '#000';
		ctx.font = "bold 48px sans-serif";
		if(gameState.screen == 'lost'){
			ctx.fillText( "Game Over!", canvas.width/2, canvas.height/2 );
		}else if(gameState.screen == 'won'){

			for(var i in grid){ 																// iterate over all the cells in the grid array

				var px = offsetX + (grid[i].x * gameState.cellWidth);							// x coordinate of the cell
				var py = offsetY + (grid[i].y * gameState.cellHeight);							// y coordinate of the cell

				if(grid[i].hasMine == true && grid[i].currentState != 'visible') {
					ctx.drawImage(flag, px, py, gameState.cellWidth, gameState.cellHeight); 
				}
			}
			ctx.fillText( "Cleared!", canvas.width/2, canvas.height/2 );

		}
		// ctx.fillText( (gameState.screen == 'lost' ? "Game Over!" : "Cleared!"), canvas.width/2, canvas.height/2 );
		ctx.closePath();

	}
}


// Function to draw the game screen
function drawGame(){

	// if(ctx==null) {  									// base case condition
		// return; 
	// }
	
	// Update frame and timer
	var currentFrameTime = Date.now();
	if(lastFrameTime == 0)
		lastFrameTime = currentFrameTime; 					// update frame

	var timeElapsed = currentFrameTime - lastFrameTime;		
	time += timeElapsed;									// update time
	
	updateGame(); 											// update game

	// Frame count
	var sec = Math.floor(Date.now()/1000);
	if(sec != currentSecond){
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;										// update frame count
	}else{ 
		frameCount++;										// update frame count
	}
	
	ctx.fillStyle = "transparent";							// set color
	ctx.fillRect(0, 0, canvas.width, canvas.height);		// draw canvas
	
	if(gameState.screen == 'menu')
		drawMenu(); 										// draw menu screen
	else
		drawPlaying(); 										// draw game screen
	
	lastFrameTime = currentFrameTime; 						// update the lastFrameTime
	requestAnimationFrame(drawGame); 						// recursive call

}


// Function to obtain the mouse position
function getCoordinates(x, y){

	var canvasElement = canvas;							// get canvas element reference
	do {
		x -= canvasElement.offsetLeft; 					// subtract the left offset from the x position
		y -= canvasElement.offsetTop;					// subtract the top offset from the y position
		canvasElement = canvasElement.offsetParent;		// update canvas
	} while(canvasElement != null);
	
	return [x, y];										// return the coordinates
}


// Function for game Over
function gameOver(){
	gameState.screen = 'lost'; 							// update game screen		
}

// Onload...
window.onload = function(){
	
	var currentLevel = levels[gameState.level];  						// default difficulty level
	canvas.width = currentLevel.numCols*gameState.cellWidth + 100; 		// set canvas width
	canvas.height = currentLevel.numRows*gameState.cellHeight + 100; 	// set canvas height
    
	// EVENT LISTENERS
	canvas.addEventListener('click', function(e) { 						// left mouse press
		var pos = getCoordinates(e.pageX, e.pageY); 					// obtain coordinates
		mouseState.click = [pos[0], pos[1], 1]; 						// update click coordinates
    });
    
	canvas.addEventListener('mousemove', function(e) { 					// mouse move
		var pos = getCoordinates(e.pageX, e.pageY); 					// obtain coordinates
		mouseState.x = pos[0];											// update x coordinate
		mouseState.y = pos[1];											// update y coordinate
	});
	
	canvas.addEventListener('contextmenu', function(e) { 				// right mouse press
		e.preventDefault(); 											// prevent default action
		var pos = getCoordinates(e.pageX, e.pageY);						// obtain coordinates
		mouseState.click = [pos[0], pos[1], 2];							// update click coordinates
		return false;
	});
	
	requestAnimationFrame(drawGame);									// call to draw game function
};

