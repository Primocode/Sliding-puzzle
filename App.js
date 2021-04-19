let capabilities = [];

const values = {
    numberOfChanges: 1,
    selectedMode: null,
    seconds: 0,
    pause: false,
    menu: true,
    col: null,
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
    puzzleAvaiableForTransfer();
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
                puzzle[i - 1].textContent = drawn;
                puzzle[i - 1].dataset.value = drawn
            }
        }
    }
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
    puzzleAvaiableForTransfer();
}

const movingElements = (e) => checkFreeItem(e.currentTarget.dataset.value, e.target.dataset.inWhichElement);

const possibilityOfShifting = (freeSpace, whichElement, inWhatElement) => {
    availablePuzzleForClick(values.col, Number(freeSpace))
    if(capabilities.includes(Number(inWhatElement))) {
        document.querySelector(`[data-in-which-element="${inWhatElement}"`).remove();
        generatingASingleElement(freeSpace, whichElement);
        nextMove();
    }
    else {
        console.log("nie możesz")
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
    document.querySelectorAll('#puzzle-piece').forEach(element => {
        element.classList.remove('puzzle-active-for-move')
    })

    const allComponents = document.querySelectorAll('#space-for-a-puzzle')
    allComponents.forEach(element => {
        if (!document.querySelector(`#puzzle-piece[data-in-which-element="${element.dataset.id}"]`)) {
            availablePuzzleForClick(values.col, Number(element.dataset.id))
        }
    })

    capabilities.forEach(id => {
        document.querySelector(`#puzzle-piece[data-in-which-element="${id}"]`).classList.add('puzzle-active-for-move');
    })
    
}

const availablePuzzleForClick = (col, idEmpty) => {
    console.log(col, idEmpty)
    capabilities = [];
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
        capabilities.push(idEmpty + col);
        if (puzzleRight.includes(idEmpty)) capabilities.push(idEmpty + 1)

        if (puzzleLeft.includes(idEmpty)) capabilities.push(idEmpty - 1);

        if (idEmpty > col && idEmpty < (puzzleQuantity - col) && idEmpty && !puzzleLeft.includes(idEmpty) && !puzzleRight.includes(idEmpty)) {
            capabilities.push(idEmpty - 1);
            capabilities.push(idEmpty + 1);
        }
    }

    if ((idEmpty > 1 && idEmpty < col) || (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity)) {
        capabilities.push(idEmpty + 1);

        capabilities.push(idEmpty - 1);

        if (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity) capabilities.push(idEmpty - col);
        
        if (idEmpty > 1 && idEmpty < col) capabilities.push(idEmpty + col);
    }

    if ((idEmpty === 1) || (idEmpty === col)) {
        capabilities.push(idEmpty + col);

        if (idEmpty === 1) capabilities.push(idEmpty + 1 );

        if (idEmpty === col) capabilities.push(idEmpty - 1 );
    }

    if ((idEmpty === (puzzleQuantity - (col - 1 ))) || (puzzleQuantity === idEmpty)) {
        capabilities.push(idEmpty - col);

        if (idEmpty === (puzzleQuantity - (col - 1 ))) capabilities.push(idEmpty + 1 );  
        
        if (puzzleQuantity === idEmpty) capabilities.push(idEmpty - 1);
    }
}

