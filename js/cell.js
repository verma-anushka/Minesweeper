// --------------------------------------- GRID CELL --------------------------------------- //

// GridCell Class
class Cell{

    // CONSTRUCTOR
    constructor(x, y){
        this.x			    = x;            // x-coordinate of the cell (px)
        this.y			    = y;            // y-coordinate of the cell (px)
        this.hasMine	    = false;        // whether the cell has a mine (boolean)
        this.numMines	    = 0;            // number of mines in the immediate neighbours
        this.colorMines	    = '#000';       // color of the number of mines in the immediate neighbours
        this.currentState	= 'hidden';     // current state of the cell
    };

    
    // METHODS
    
    // Method to get the color of the number of mines present in the immediate neighbours of the cell
    getMinesColor(num) {

        switch(num){
            
            case 1  : 	this.color = "#0000ff";     // number of neighbours -> 1
        				break;
            case 2  : 	this.color = "#008100";     // number of neighbours -> 2
        				break;
            case 3  : 	this.color = "#ff1300";     // number of neighbours -> 3
        				break;
        	case 4  : 	this.color = "#000083";     // number of neighbours -> 4
        				break;
        	case 5  : 	this.color = "#810500";     // number of neighbours -> 5
        				break;
        	case 6  : 	this.color = "#2a9494"; // number of neighbours -> 6
                        break;
            case 7  : 	this.color = "#000000"; // number of neighbours -> 7
        				break;
        	case 8  : 	this.color = "#808080"; // number of neighbours -> 8
                        break;
            default :   this.color = "#000000"; // default color -> black
                        break;
        }
        return this.color;  

    }


    // Method to calculate the number of mines present in the immediate neighbours of the cell
    getNumMines() {
        
        var currentLevel = levels[gameState.level];                                             // chosen difficulty level

        // iterate over all immediate neighbours
        for(var j = this.y - 1; j <= this.y + 1; j++) {                                         // iterate over all cols
            for(var i = this.x - 1; i <= this.x + 1; i++) {                                     // iterate over all rows
            
                if( i == this.x && j == this.y )                                                // cell whose neighbours to be checked
                    continue;
                
                if( i < 0 || j < 0 || i >= currentLevel.numCols || j >= currentLevel.numRows )  // boundary conditions
                    continue;
                
                if( grid[ ((j*currentLevel.numCols) + i ) ].hasMine )                           // mine found
                    this.numMines++;
            }
        }
    }


    // Method to flag a cell
    flag(){
    
        if(this.currentState == 'hidden')           // allow flag option only if cell is hidden
            this.currentState = 'flagged';

        else if(this.currentState == 'flagged')     // remove flag from cell
            this.currentState = 'hidden';
        
    };


    // Method to display a cell's contents
    showCell(){

        if(this.currentState != 'hidden')           // base condition- if flagged/visible, don't show
            return;
        
        if(this.hasMine)                            // game over check
            gameOver();

        else if(this.numMines > 0)                  // if cell contains a number
            this.currentState = 'visible';          // update current state

        else{                                       // empty cell (numMines == 0)
            this.currentState = 'visible';          // update current state
            this.showNeighbours();                  // recursive method to display all the neighbours of a cell
        }
        checkState();                               // check for game won
    };

    
    // Recursive Method to reveal cell neighbours
    showNeighbours(){

        var currentLevel = levels[gameState.level];                                             // chosen difficulty level
        
        // iterate over all immediate neighbours
        for(var j = this.y - 1; j <= this.y + 1; j++){                                          // iterate over all cols
            for(var i = this.x - 1; i <= this.x + 1; i++){                                      // iterate over all rows
            
                if( i == this.x && j == this.y )                                                // cell whose neighbours to be checked
                    continue;
                
                if( i < 0 || j < 0 || i >= currentLevel.numCols || j >= currentLevel.numRows )  // boundary condition
                    continue;
                
                var idx = ((j * currentLevel.numCols) + i);                                     // current neighbour cell idx                
                if( grid[idx].currentState == 'hidden' ){

                    grid[idx].currentState = 'visible';                                         // update current state
                    if(grid[idx].numMines == 0)
                        grid[idx].showNeighbours();                                             // recursive call

                }
            }
        }
    };

}

