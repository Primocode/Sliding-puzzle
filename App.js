let capabilities = [];
let puzzlePosition = [];

const values = {
    numberOfChanges: 1,
    selectedMode: null,
    seconds: 0,
    pause: false,
    menu: true,
    col: null,
}

const settings = {
    "4": {

    }
}

const validation = () => {
    const inTheElement = document.querySelectorAll('#puzzle-piece');
    inTheElement.forEach(item => {
        if (item.dataset.value === item.dataset.inWhichElement) item.classList.add("puzzle-piece-correct"); 
    })
}

const givePossibilityToMove = () => document.querySelectorAll('#puzzle-piece').forEach(item => item.addEventListener('click', movingElements));

const generatingElements = (level) => {
    const spaceForAPuzzle = document.querySelector('#puzzle-container');

    document.querySelectorAll('#space-for-a-puzzle').forEach(item => item.remove())

    for (let i = 0; i < level; i++) {
        const mainElement = document.createElement('div');
        mainElement.className = "puzzle-piece-container";
        mainElement.id = "space-for-a-puzzle";
        mainElement.dataset.id = i + 1;
        spaceForAPuzzle.appendChild(mainElement);
        // giveWidthHeight([mainElement]);
    } 
    const mainElement = document.querySelectorAll('#space-for-a-puzzle') 

    for (let i = 0; i < mainElement.length - 1; i++) {
        const element = document.createElement('div');
        element.className = "puzzle-piece";
        element.id = "puzzle-piece";
        element.textContent = i + 1;
        element.dataset.value = i + 1;
        element.dataset.inWhichElement = mainElement[i].dataset.id
        mainElement[i].appendChild(element);
    }
    
    givePossibilityToMove();
    puzzleAvaiableForTransfer();
    for (let i = 0; i < (values.col * 20); i++) {
        translatingPuzzles();
    }
}

const translatingPuzzles = () => {
    let indexElementDrawn;
    indexElementDrawn = (Math.random() * (capabilities.length -1)).toFixed(0);
    const puzzleToMove = document.querySelector(`#puzzle-piece[data-in-which-element="${capabilities[indexElementDrawn]}"]`)
    emptyElement();
    generatingASingleElement(emptyElementId, puzzleToMove.dataset.value, puzzleToMove.dataset.inWhichElement, true)
}

const generatingASingleElement = (id, value, inWhatElement, translating) => {
    let removeAfterSeconds = () => {
        document.querySelector(`[data-in-which-element="${inWhatElement}"`).remove();
    }
    let generating = () => {
        const toTheItem = document.querySelector(`#space-for-a-puzzle[data-id="${id}"]`)
        const element = document.createElement('div');
        element.dataset.inWhichElement = toTheItem.dataset.id
        element.className = "puzzle-piece";
        element.id = "puzzle-piece";
        element.textContent = value;
        element.dataset.value = value;
        toTheItem.appendChild(element);
    
        givePossibilityToMove();
        validation();
        puzzleAvaiableForTransfer();
    }

    if (translating) {
        document.querySelector(`[data-in-which-element="${inWhatElement}"`).remove();
        generating();
    }
    else {
        setTimeout(removeAfterSeconds, 150)
        setTimeout(generating, 150)
    }
}

let timeLockOnClick = true;

const movingElements = (e) => {
    if (timeLockOnClick) {
        setTimeout(function(){ timeLockOnClick = true; }, 150);
        timeLockOnClick = false;

        emptyElement();
        availablePuzzleForClick(values.col, Number(emptyElementId))
        if(capabilities.includes(Number(e.target.dataset.inWhichElement))) {
            slidingEffect(e.target.dataset.inWhichElement, capabilities, puzzlePosition)
            generatingASingleElement(emptyElementId, e.currentTarget.dataset.value, e.target.dataset.inWhichElement, null);
            nextMove();
        }
        else {
            console.log("nie możesz")
        }
    }
}

const nextMove = () => document.querySelector('#number-of-shifts').textContent = values.numberOfChanges++;

const modeSelection = (e) => {
    document.querySelectorAll('.mode-selection').forEach(item => item.classList.remove('mode-selection-active'))
    e.currentTarget.classList.add('mode-selection-active')
    values.col = Number(e.target.dataset.col)
}

document.querySelectorAll('.mode-selection').forEach(item => item.addEventListener('click', modeSelection))

let counting;
const countingTime = (perform) => {
    window.clearInterval(counting)
    if (perform === "cout") counting = setInterval(countingDown, 1000);
    
    if (perform === "stop") window.clearInterval(counting);
    
    if (perform === "reset") {
        window.clearInterval(counting);
        values.seconds = -1;
        countingDown(true);
        countingTime("cout");
    }
}

const countingDown = (reset) => {
    const counter = document.querySelector('#time');
    values.seconds = ++values.seconds
    counter.textContent = values.seconds + "s"
    if (reset) counter.textContent = "0s";
}

const startTheGame = () => {
    if (values.col == null) console.log("wybierz tryb")
     
    else {
        document.querySelector('#puzzle-container').classList.add("puzzle-" + values.col)
        generatingElements(values.col * values.col);
        countingTime("cout");
        menu(false);
        values.menu = false;
        
    }
}

// const giveWidthHeight = (el) => {
//     console.log(values.col)
//     el.forEach(item => {
//         console.log(item)
//         item.style.height = "200px";
//         item.style.width = "200px";
//     })
//     if (window.innerWidth < 700) {
//         console.log("jest większe od 600")
//     }
// }



document.querySelector('#start-the-game').addEventListener('click', startTheGame)

const menu = (switchMenu) => {
    if (switchMenu) document.querySelector('#game-menu').classList.add('active-game-menu')
    
    else document.querySelector('#game-menu').classList.remove('active-game-menu')
}

const pauseOn = () => {
    if (values.menu !== true) {
        document.querySelector('#pause-game').classList.add('pause-game-active');
        countingTime("stop");
        values.pause = true;
    }
    else {
        console.log("menu jest włączone")
    }
}
document.querySelector('#pauza').addEventListener('click', pauseOn)

const pauseOff = () => {
    document.querySelector('#pause-game').classList.remove('pause-game-active');
    countingTime("cout");
    values.pause = false;
    values.menu = false;
}
document.querySelector('#pause-game-off').addEventListener('click', pauseOff)

const resetGame = () => {
    if (values.menu !== true) {
        if (values.pause == false) {
            countingTime("reset");
            generatingElements(values.col * values.col);
            values.numberOfChanges = 0;
            document.querySelector('#number-of-shifts').textContent = values.numberOfChanges;
        }
        else {
            console.log("gra jest zapauzowana")
        }
    }
    else {
        console.log("menu jest włączone")
    }
}

document.querySelector('#start').addEventListener('click', resetGame)

const backToTheMenu = () => {
    document.querySelectorAll('#space-for-a-puzzle').forEach(item => {
        item.remove();
    })
    pauseOff();
    countingTime("reset");
    countingTime("stop");
    menu(true);
    values.numberOfChanges = 0;
    nextMove();
}

document.querySelector('#choose-again').addEventListener('click', backToTheMenu)

const puzzleAvaiableForTransfer = () => {
    document.querySelectorAll('#puzzle-piece').forEach(element => element.classList.remove('puzzle-active-for-move'))

    emptyElement();
    availablePuzzleForClick(values.col, Number(emptyElementId))

    capabilities.forEach(id => {
        document.querySelector(`#puzzle-piece[data-in-which-element="${id}"]`).classList.add('puzzle-active-for-move');
    })
}

const availablePuzzleForClick = (col, idEmpty) => {
    // console.log(col, idEmpty)
    capabilities = [];
    puzzlePosition = [];
    const puzzleQuantity = col * col

    const puzzleLeft = [];
    const puzzleRight = [];

    let dataRight = 1;
    let dataLeft = col;

    for (let i = 0; i < (col -2); i++) {
        puzzleRight.push(dataRight += col);
        puzzleLeft.push(dataLeft += (col) );
    }

    if ((puzzleRight.includes(idEmpty)) || (puzzleLeft.includes(idEmpty)) || (idEmpty > col && idEmpty < (puzzleQuantity - col) && idEmpty )) {
        capabilities.push(idEmpty - col);
        puzzlePosition.push("top");
        capabilities.push(idEmpty + col);
        puzzlePosition.push("bottom");
        if (puzzleRight.includes(idEmpty)) {
            capabilities.push(idEmpty + 1)
            puzzlePosition.push("right")
        }

        if (puzzleLeft.includes(idEmpty)) {
            capabilities.push(idEmpty - 1);
            puzzlePosition.push("left")
        }

        if (idEmpty > col && idEmpty < (puzzleQuantity - col) && idEmpty && !puzzleLeft.includes(idEmpty) && !puzzleRight.includes(idEmpty)) {
            capabilities.push(idEmpty - 1);
            puzzlePosition.push("left")
            capabilities.push(idEmpty + 1);
            puzzlePosition.push("right");
        }
    }

    if ((idEmpty > 1 && idEmpty < col) || (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity)) {
        capabilities.push(idEmpty + 1);
        puzzlePosition.push("right")

        capabilities.push(idEmpty - 1);
        puzzlePosition.push("left")

        if (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity) {
            capabilities.push(idEmpty - col);
            puzzlePosition.push("top")
        }
        
        if (idEmpty > 1 && idEmpty < col) {
            capabilities.push(idEmpty + col)
            puzzlePosition.push("bottom")   
        };
    }

    if ((idEmpty === 1) || (idEmpty === col)) {
        capabilities.push(idEmpty + col);
        puzzlePosition.push("bottom")

        if (idEmpty === 1) {
            capabilities.push(idEmpty + 1 );
            puzzlePosition.push("right")
        }

        if (idEmpty === col) {
            capabilities.push(idEmpty - 1 );
            puzzlePosition.push("left")
        }
    }

    if ((idEmpty === (puzzleQuantity - (col - 1 ))) || (puzzleQuantity === idEmpty)) {
        capabilities.push(idEmpty - col);
        puzzlePosition.push("top")
        if (idEmpty === (puzzleQuantity - (col - 1 ))) {
            capabilities.push(idEmpty + 1 );  
            puzzlePosition.push("right")
        }
        
        if (puzzleQuantity === idEmpty) {
            capabilities.push(idEmpty - 1);
            puzzlePosition.push("left")
        }
    }
}

let timeLockOnArrows = true;

window.addEventListener('keydown', (e) => {
    if (timeLockOnArrows) {
        setTimeout(function(){ timeLockOnArrows = true; }, 150);
        timeLockOnArrows = false;
        switch (e.keyCode) {
            case 37: 
              arrowControl("left")
            break;
         
            case 38: 
              arrowControl("top")
            break;
         
            case 39: 
              arrowControl("right")
            break;
         
            case 40:
              arrowControl("bottom")
            break;
          }
    }

}, false);

const arrowControl = (position) => {
    if (puzzlePosition.includes(position)) {
        emptyElement();
        
        const indexElement = puzzlePosition.indexOf(position)

        const element = document.querySelector(`[data-in-which-element="${capabilities[indexElement]}"`)

        slidingEffect(element.dataset.inWhichElement, capabilities, puzzlePosition)
        generatingASingleElement(emptyElementId, element.dataset.value, element.dataset.inWhichElement, null)
        nextMove();
    }
    else {
        console.log("nie ma ")
    }
}

const slidingEffect = (puzzelId, capabilities, positions) => {
    const sizeItem = document.querySelector(`.puzzle-piece-container`);

    const size = getComputedStyle(sizeItem).height;

    const elementToBeMoved = document.querySelector(`#puzzle-piece[data-in-which-element="${puzzelId}"]`)
    if (positions[capabilities.indexOf(Number(puzzelId))] === "top") {
        elementToBeMoved.style.transform = `translate(0px, ${size})`
    }
    if (positions[capabilities.indexOf(Number(puzzelId))] === "bottom") {
        elementToBeMoved.style.transform = `translate(0px,-${size})`
    }
    if (positions[capabilities.indexOf(Number(puzzelId))] === "right") {
        elementToBeMoved.style.transform = `translate(-${size},00px)`
    }
    if (positions[capabilities.indexOf(Number(puzzelId))] === "left") {
        elementToBeMoved.style.transform = `translate(${size},00px)`
    }
}

let emptyElementId;
const emptyElement = () => {
    const allComponents = document.querySelectorAll('#space-for-a-puzzle')
    allComponents.forEach(element => {
        if (!document.querySelector(`#puzzle-piece[data-in-which-element="${element.dataset.id}"]`)) {
            emptyElementId = element.dataset.id;
        }
    })
}

