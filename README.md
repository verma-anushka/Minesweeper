# Minesweeper :bomb:
A re-creation of the classic game "Minesweeper" using Javascript with no graphics or external JS libraries.

## GETTING STARTED :pencil:
To start playing:
  - Clone the repository 
    - Clone or download the repository **'Minesweeper'** by clicking on the Clone or Download button
    - Open the 'index.html' file and start playing!
    
    **or**

  - Visit the link: https://verma-anushka.github.io/Minesweeper/.

    **or**
  
- You can also find **Minesweeper** and many more cool games at the link: https://verma-anushka.github.io/Gaming-Zone/.


## TO-DO :clipboard:
- [x] Counting Timer
- [x] Set Flags
- [ ] Record high score
- [ ] Mobile friendly
- [ ] Generate hints 
- [ ] Game solver


## HOW TO PLAY? :interrobang:
- Choose a difficulty level
- Click or touch a cell to reveal its contents
- If the cell contains a mine, you lose
- Cells without mines tell you the number of mines next to them
- Right-click a cell to flag a cell as a mine
- Reveal all non-mine tiles to win


## TECHNOLOGIES USED :speech_balloon:

- **HTML5**: 
    - `<canvas>`
        - <canvas> is an HTML element which can be used to draw graphics via scripting (usually JavaScript)
        - The <canvas> element is only a container for graphics. JavaScript is required to actually draw the graphics.

- **VANILLA JS**: 

    - Using the HTML5 **canvas** element
        ```javascript
        const canvas = document.getElementById('gameCanvas')
        const ctx = canvas.getContext('2d')
        ```
        - document.getElementById('gameCanvas') — searches for an HTML element that has the id of gameCanvas. Once it finds the element,          we can then manipulate it with JavaScript.
        
        - canvas.getContext() — context is our toolbox of paintbrushes and shapes. The 2D context contains the set of tools we want. If         you were working with 3D, you would use WebGL instead.
     
     - Using the concept of **classes and objects**
        - A JavaScript class is a type of function. Classes are declared with the class keyword.
        ```javascript
        const y = class {}
        
        // Initialize a constructor from a class
        const constructorFromClass = new y();

        console.log(constructorFromClass);
        ```
        Output:
        ```javascript
        y {}
        constructor: class
        ```

## Game Snapshots :camera:
![Minesweeper](/images/minesweeper.PNG)


## REFERENCES :books:
[Solving Minesweeper with Matrices By Robert Massaioli](https://massaioli.wordpress.com/2013/01/12/solving-minesweeper-with-matricies/): Minesweeper solver algorithm.


## CONTRIBUTE :shipit:
Issues, PRs, and all your suggestions and discussions are very welcome!

