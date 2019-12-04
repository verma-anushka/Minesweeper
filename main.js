window.onload = function(){
    
	// Event listeners
	canvas.addEventListener('click', function(e) {
		var pos = getCoordinates(e.pageX, e.pageY);
		mouseState.click = [pos[0], pos[1], 1];
    });
    
	canvas.addEventListener('mousemove', function(e) {
		var pos = getCoordinates(e.pageX, e.pageY);
		mouseState.x = pos[0];
		mouseState.y = pos[1];
	});
	
	canvas.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		var pos = getCoordinates(e.pageX, e.pageY);
		mouseState.click = [pos[0], pos[1], 2];
		return false;
	});
	
	requestAnimationFrame(drawGame);
};

// Function to check for level up
function checkState(){

    // base condition
	for(var i in grid){ // iterate over all the cells in the grid array
        if(grid[i].hasMine == false && grid[i].currentState != 'visible') 
			return; // return if a cell with no mine is hidden
	}
    
    // update variables
	var currentLevel = levels[gameState.level];
	gameState.timeTaken = time;
	
	if(currentLevel.bestTime == 0 || time < currentLevel.bestTime){
		gameState.newBest = true;
		currentLevel.bestTime = time;
	}
	gameState.screen = 'won'; // level up screen
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

	var currentLevel = levels[level];
    canvas.width = currentLevel.numCols*gameState.cellWidth + 100;
	canvas.height = currentLevel.numRows*gameState.cellHeight + 100;

    // Calculate the start position of the game board
	offsetX = Math.floor((canvas.width - (currentLevel.numCols * gameState.cellWidth)) / 2);
	offsetY = Math.floor((canvas.height - (currentLevel.numRows * gameState.cellHeight)) / 2);
    
    // Creat and add cells to grid
	for(var j = 0; j < currentLevel.numRows; j++){
		for(var i = 0; i < currentLevel.numCols; i++){
			var idx = ((j * currentLevel.numCols) + i);
			grid.push(new Cell(i, j));
		}
	}
	
	addMines(currentLevel);
}

// Function to add mines to random positions
function addMines(currentLevel){
    
    var minesAdded = 0;
	while(minesAdded < currentLevel.mines){

		var idx = Math.floor(Math.random() * grid.length); // randonly generated index
		
        if( grid[idx].hasMine )
            continue; // if chosen cell has mine
		
		grid[idx].hasMine = true; // add mine
		minesAdded++; // update variable
	}
	
	// Calculate number of neighbouring cell mines for all cells
	for(var i in grid){ 
        grid[i].getNumMines(); 
    }
}

// Function to update the game board
function updateGame(){

	if(gameState.screen == 'menu'){ // game start screen

		if(mouseState.click != null){ // mouse click event

			for(var i in levels){

				if(mouseState.y >= levels[i].menuBox[0] && mouseState.y <= levels[i].menuBox[1]){ // condition to begin new level 
					startLevel(i);
					break;
				}
			}
			mouseState.click = null; // update mouse click event
		}
	} else if(gameState.screen=='won' || gameState.screen=='lost'){ // game over screen

		if(mouseState.click != null){ // mouse click event
			gameState.screen = 'menu'; // display start game screen
			mouseState.click = null; // update mouse click event
		}
	} else{ // game level screen (playing)
		
		if(mouseState.click!=null){

			var currentLevel = levels[gameState.level];
			
			// game board click 
			if(mouseState.click[0]>=offsetX &&
				mouseState.click[1]>=offsetY &&
				mouseState.click[0]<(offsetX + (currentLevel.numCols * gameState.cellWidth)) &&
				mouseState.click[1]<(offsetY + (currentLevel.numRows * gameState.cellHeight))
			){
				var cell = [ // position of selected cell
					Math.floor((mouseState.click[0]-offsetX)/gameState.cellWidth),
					Math.floor((mouseState.click[1]-offsetY)/gameState.cellHeight)
				];
				
				if(mouseState.click[2] == 1){ // left mouse click 
					grid[((cell[1] * currentLevel.numCols) + cell[0])].showCell(); // display cell
				}
				else{ // right mouse click
					grid[((cell[1] * currentLevel.numCols) + cell[0])].flag(); // display flag
				}

			}else if(mouseState.click[1]>=380){ // return to menu screen
				gameState.screen = 'menu';
			}
			
			mouseState.click = null; // update mouse click event
		}
	}
}

// Function to draw menu screen
function drawMenu(){

	ctx.textAlign = 'center';
	ctx.font = "bold 24pt sans-serif";
	ctx.fillStyle = "#FFFFFF";
	
	var y = canvas.height/3 - 25;

	console.log(y);
	for(var d in levels){

		var mouseOver = (mouseState.y>=(y-10) && mouseState.y<=(y+10));
		
		if(mouseOver){ 
			ctx.fillStyle = "#0000EE"; 
		}
		
		levels[d].menuBox = [y-20, y+10];
		ctx.fillText(levels[d].name, 150, y);
		y+= 70;
		
		if(mouseOver){ 
			ctx.fillStyle = "#FFFFFF"; 
		}
	}
	
	// var y = 120;
	// ctx.font = "italic 12pt sans-serif";
	
	// for(var d in levels){

	// 	if(levels[d].bestTime==0){
	// 		ctx.fillText("No best time", 150, y);
	// 	}
	// 	else{
	// 		var t = levels[d].bestTime;
	// 		var bestTime = "";
	// 		if( (t/1000) >= 60 ){
	// 			bestTime = Math.floor( (t/1000)/60 ) + ":";
	// 			t = t % (60000);
	// 		}
	// 		bestTime += Math.floor(t/1000) + ":" + (t%1000);
	// 		ctx.fillText("Best time   " + bestTime, 150, y);
	// 	}
	// 	y+= 80;
	// }
}

// Function to draw play game state
function drawPlaying(){

	var halfCellWidth = gameState.cellWidth / 2;
	var halfCellHeight = gameState.cellHeight / 2;
	
	var currentLevel = levels[gameState.level];
	
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "18px sans-serif";
	ctx.shadowBlur = 0;
	ctx.fillText(currentLevel.name, canvas.width/2, 20);
	
	ctx.fillText("Return to menu", canvas.width/2, canvas.height-20);
	
	if(gameState.screen != 'lost'){

		ctx.beginPath();
		ctx.rect(50, 20, 70, 35);
		ctx.fillStyle = '#DDD';
		ctx.shadowColor = '#999';
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.textAlign = "left";
		ctx.fillText(currentLevel.mines, 50, 40);
		ctx.closePath();
	
		var whichT = (gameState.screen == 'won' ? gameState.timeTaken : time);
		var t = '';
		if((time / 1000) > 60){
			t = Math.floor((whichT / 1000) / 60) + ':';
		}
		var s = Math.floor((whichT / 1000) % 60);
		t += (s > 9 ? s : '0' + s);
	
		// ctx.textAlign = "right";
		// ctx.fillText("Time: " + t, canvas.width - 50, 40);

		ctx.beginPath();
		ctx.rect(canvas.width - 120, 20, 70, 35);
		ctx.fillStyle = '#DDD';
		ctx.shadowColor = '#999';
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.textAlign = "right";
		ctx.fillText(t, canvas.width - 50, 40);
		ctx.closePath();
	}
	
	if(gameState.screen == 'lost' || gameState.screen == 'won'){ // display game over message
		ctx.textAlign = "center";
		ctx.font = "bold 20px sans-serif";
		ctx.shadowBlur = 0;
		ctx.fillText(
			(gameState.screen == 'lost' ? "Game Over" : "Cleared!"), canvas.width/2, offsetY - 5);
	}
	
	ctx.strokeStyle = "#999999";
	ctx.strokeRect(offsetX, offsetY, (currentLevel.numCols * gameState.cellWidth), (currentLevel.numRows * gameState.cellHeight));
	
	ctx.font = "bold 14px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	
	for(var i in grid){
		var px = offsetX + (grid[i].x * gameState.cellWidth);
		var py = offsetY + (grid[i].y * gameState.cellHeight);
		
		if(gameState.screen == 'lost' && grid[i].hasMine){ // display mine
			ctx.fillStyle = "#ff0000";
			ctx.fillRect(px, py, gameState.cellWidth, gameState.cellHeight);
			ctx.fillStyle = "#000000";
			ctx.fillText("x", px + halfCellWidth, py + halfCellHeight);
		}
		else if(grid[i].currentState == 'visible'){ // display number of mines in neighbouring cells
			ctx.fillStyle = "#ff0000";
			// ctx.shadowBlur = 2;
			if(grid[i].numMines){
				ctx.fillStyle = "#000000";
				ctx.fillText(grid[i].numMines, px + halfCellWidth, py + halfCellHeight);
			}
		}
		else{ // display flag
			ctx.fillStyle = "#cccccc";
			// ctx.shadowBlur = 0;
			ctx.fillRect(px, py, gameState.cellWidth, gameState.cellHeight);
			ctx.strokeRect(px, py, gameState.cellWidth, gameState.cellHeight);
			if(grid[i].currentState == 'flagged'){
				ctx.fillStyle = "#0000cc";
				ctx.fillText("F", px + halfCellWidth, py + halfCellHeight);
			}
		}
	}
}

// Function to draw the game screen
function drawGame(){

	// if(ctx==null) {  // base case condition
		// return; 
	// }
	
	// Frame & update related timing
	var currentFrameTime = Date.now();
	if(lastFrameTime==0) { 
		lastFrameTime = currentFrameTime; 
	}
	var timeElapsed = currentFrameTime - lastFrameTime;
	time += timeElapsed;
	
	updateGame(); // update game

	// Frame count
	var sec = Math.floor(Date.now()/1000);
	if(sec != currentSecond){
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}else{ 
		frameCount++; 
	}
	
	// Clear canvas
	ctx.fillStyle = "transparent";
	ctx.fillRect(0, 0, 800, 600);
	
	if(gameState.screen == 'menu'){ 
		drawMenu(); 
	}
	else{ 
		drawPlaying(); 
	}
	
	// // Draw the frame count
	// ctx.textAlign = "left";
	// ctx.font = "10pt sans-serif";
	// ctx.fillStyle = "#000000";
	// ctx.fillText("Frames: " + framesLastSecond, 5, 15);
	
	lastFrameTime = currentFrameTime; // update the lastFrameTime
	requestAnimationFrame(drawGame); // recursive call
}

// Function to obtain the mouse position
function getCoordinates(x, y){

	var canvasElement = canvas;	
	do {
		x -= canvasElement.offsetLeft;
		y -= canvasElement.offsetTop;
		canvasElement = canvasElement.offsetParent;
	} while(canvasElement != null);
	
	return [x, y];
}

// Game Over
function gameOver(){
	gameState.screen = 'lost';
}
