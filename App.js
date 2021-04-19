const settings = {
    col3: 9,
    col4: 16 
}

let capabilities = [];

const values = {
    numberOfChanges: 0,
    selectedMode: null,
    seconds: 0,
    pause: false
}

const combinations = {
    "col3": {
        9: [8,6],
        8: [7,9,5],
        7: [8,4],
        6: [3,5,9],
        5: [2,4,6,8],
        4: [1,5,7],
        3: [2,6],
        2: [1,3,5],
        1: [2,4],
        "spaceForItems": "puzzle-9",
    },
    "col4": {
        16: [12,15],
        15: [14,11,16],
        14: [13,10,15],
        13: [9,14],
        12: [16,11,8],
        11: [7,10,12,15],
        10: [6,9,11,14],
        9: [5,10,13],
        8: [4,7,12],
        7: [3,6,11,8],
        6: [2,5,10,7],
        5: [1,6,9],
        4: [3,8],
        3: [7,4,2],
        2: [1,6,3],
        1: [2,5],
        "spaceForItems": "puzzle-16",
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
    } 
    const mainElement = document.querySelectorAll('#space-for-a-puzzle') 

    for (let i = 0; i < mainElement.length - 1; i++) {
        const element = document.createElement('div');
        element.className = "puzzle-piece";
        element.id = "puzzle-piece";
        element.dataset.inWhichElement = mainElement[i].dataset.id
        mainElement[i].appendChild(element);
    }
    drawNumbers();
    givePossibilityToMove();
}

const checkFreeItem = (puzzleNumber, inWhichElement) => {
    const allComponents = document.querySelectorAll('#space-for-a-puzzle')
    allComponents.forEach(element => {
        if (!document.querySelector(`#puzzle-piece[data-in-which-element="${element.dataset.id}"]`)) {
            possibilityOfShifting(element.dataset.id, puzzleNumber, inWhichElement);
        }
    })
}

const drawNumbers = () => {
    const puzzle = document.querySelectorAll('#puzzle-piece');
    const values = [];
    for (let i = 1; i <= puzzle.length; i++ ) {
        drawn = 0;
        grow = true;
        while (grow) {
            drawn = Number((Math.random() * (puzzle.length - 1) + 1).toFixed(0));
            if (!values.includes(drawn)) {
                values.push(drawn);
                grow = false;
            }
        }
    }
    puzzle.forEach((item, i) => {
        item.textContent = values[i];
        item.dataset.value = values[i];
    })
    validation();
}

const generatingASingleElement = (id, value) => {
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
}

const movingElements = (e) => checkFreeItem(e.currentTarget.dataset.value, e.target.dataset.inWhichElement);


const possibilityOfShifting = (freeSpace, whichElement, inWhatElement) => {
    const actualMode = values.selectedMode;
    console.log(actualMode);
    if (combinations[actualMode][freeSpace].includes(Number(inWhatElement))) {
        document.querySelector(`[data-in-which-element="${inWhatElement}"`).remove();
        generatingASingleElement(freeSpace, whichElement);
        nextMove();
    }
}

const nextMove = () => document.querySelector('#number-of-shifts').textContent = ++values.numberOfChanges;

const modeSelection = (e) => {
    document.querySelectorAll('.mode-selection').forEach(item => item.classList.remove('mode-selection-active'))
    e.currentTarget.classList.add('mode-selection-active')
    values.selectedMode = e.target.dataset.mode
}

document.querySelectorAll('.mode-selection').forEach(item => item.addEventListener('click', modeSelection))

let counting;
const countingTime = (perform) => {
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
    if (values.selectedMode == null) console.log("wybierz tryb")
     
    else {
        document.querySelector('#puzzle-container').classList.remove('puzzle-9')
        document.querySelector('#puzzle-container').classList.remove('puzzle-16')
        document.querySelector('#puzzle-container').classList.add(combinations[values.selectedMode]["spaceForItems"])
        generatingElements(settings[values.selectedMode]);
        countingTime("cout");
        document.querySelector('#game-menu').classList.remove('active-game-menu')
    }
}

document.querySelector('#start-the-game').addEventListener('click', startTheGame)

const pauseOn = () => {
    document.querySelector('#pause-game').classList.add('pause-game-active');
    countingTime("stop");
    values.pause = true;
}
document.querySelector('#pauza').addEventListener('click', pauseOn)

const pauseOff = () => {
    document.querySelector('#pause-game').classList.remove('pause-game-active');
    countingTime("cout");
    values.pause = false;
}
document.querySelector('#pause-game-off').addEventListener('click', pauseOff)

const resetGame = () => {
    if (values.pause == false) {
        countingTime("reset");
        generatingElements(settings[values.selectedMode]);
        values.numberOfChanges = 0;
        document.querySelector('#number-of-shifts').textContent = values.numberOfChanges;
    }
    else {
        console.log("gra jest zapauzowana")
    }
}

document.querySelector('#start').addEventListener('click', resetGame)

const availablePuzzleForClick = (col, idEmpty) => {
    capabilities = [];
    const puzzleQuantity = col * col

    const puzzleLeft = [];
    const puzzleRight = [];

    let r = 1;
    for (let i = 0; i < (col -2); i++) {
        puzzleRight.push(r += col);
        puzzleLeft.push(col += col);
        
    }

    console.log(puzzleRight);

    console.log(puzzleLeft)

    if ((puzzleRight.includes(idEmpty)) || (puzzleLeft.includes(idEmpty)) || (idEmpty > col && idEmpty < (puzzleQuantity - col) && idEmpty )) {
        capabilities.push(idEmpty - col);
        capabilities.push(idEmpty + col);
        console.log("prawo albo lewo")
        if (puzzleRight.includes(idEmpty)) {
            capabilities.push(idEmpty + 1);
            console.log("prawo")
        }
        if (puzzleLeft.includes(idEmpty)) {
            capabilities.push(idEmpty - 1);
            console.log("lewo")
        }

        // if (idEmpty > col && idEmpty < (puzzleQuantity - col) && idEmpty && !puzzleLeft.includes(idEmpty) && !puzzleRight.includes(idEmpty)) {
        //     capabilities.push(idEmpty - 1);
        //     capabilities.push(idEmpty + 1);
        //     console.log("śroek")
        // }
    }

    // if ((idEmpty > 1 && idEmpty < col) || (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity)) {
    //     capabilities.push(idEmpty + 1);

    //     capabilities.push(idEmpty - 1);

    //     if (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity) capabilities.push(idEmpty - col);
        
    //     if (idEmpty > 1 && idEmpty < col) capabilities.push(idEmpty + col);
    // }

    // if ((idEmpty === 1) || (idEmpty === col)) {
    //     capabilities.push(idEmpty + col);

    //     if (idEmpty === 1) capabilities.push(idEmpty + 1 );

    //     if (idEmpty === col) capabilities.push(idEmpty - 1 );
    // }

    // if ((idEmpty === (puzzleQuantity - (col - 1 ))) || (puzzleQuantity === idEmpty)) {
    //     capabilities.push(idEmpty - col);

    //     if (idEmpty === (puzzleQuantity - (col - 1 ))) capabilities.push(idEmpty + 1 );  
        
    //     if (puzzleQuantity === idEmpty) capabilities.push(idEmpty - 1);
    // }
    console.log(capabilities)
}

availablePuzzleForClick(6, 19) //7//14//19



