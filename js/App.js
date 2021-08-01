let positionsAndOpportunities = [];
let isMovingElement = false;
let emptyElementId;
let lastElementDrawn;
let counting;

const values = {
    numberOfChanges: 0,
    seconds: 0,
    pause: false,
    menu: true,
    col: null,
}

const validation = () => {
    const inTheElement = document.querySelectorAll('.puzzle-piece');
    inTheElement.forEach(item => {
        const { value, inWhichElement } = item.dataset;
        if (value === inWhichElement) item.classList.add("puzzle-piece-correct"); 
    })
}

const checkYouWon = () => {
    const elements = document.querySelectorAll('.puzzle-piece-correct');

    if (elements.length ===  ((values.col * values.col) - 1)) {
        stopCountTheTime();
        document.querySelector('#win-popup').className = "win-popup";
        const resultText = document.querySelector('#win-text');
        resultText.innerHTML = `Potrzebowałeś <b>${values.seconds} sekund</b> i <b>${values.numberOfChanges} przesunięć</b> by ułożyć puzzle`;
    }
}

const returnToTheMenuAfterWinning = () => {
    document.querySelector('#win-popup').className = "win-popup-unactive";
    backToTheMenu();
}

document.querySelector('#back-to-the-menu').addEventListener('click', returnToTheMenuAfterWinning);

const givePossibilityToMove = () => document.querySelectorAll('.puzzle-piece').forEach(item => item.addEventListener('click', movingElements));

const generatingElements = quantity => {
    const spaceForAPuzzle = document.querySelector('#puzzle-container');

    document.querySelectorAll('.puzzle-piece-container').forEach(item => item.remove());

    for (let i = 0; i < quantity; i++) {
        const mainElement = document.createElement('div');
        mainElement.className = "puzzle-piece-container";
        mainElement.dataset.id = i + 1;
        spaceForAPuzzle.appendChild(mainElement);
    } 
    const mainElement = document.querySelectorAll('.puzzle-piece-container');

    for (let i = 0; i < mainElement.length - 1; i++) {
        const element = document.createElement('div');
        element.className = "puzzle-piece";
        element.textContent = i + 1;
        element.dataset.value = i + 1;
        element.dataset.inWhichElement = mainElement[i].dataset.id;
        mainElement[i].appendChild(element);
    }
    givePossibilityToMove();
    puzzleAvaiableForTransfer();
    for (let i = 0; i < (values.col * 10); i++) {
        translatingPuzzles();
    }
    // checkYouWon();
}

const translatingPuzzles = () => {
    let grow = true;
    let allNumbers = [];
    positionsAndOpportunities.forEach(item => {
        allNumbers.push(item.capabilities)
    })
    while (grow) {
        const puzzleToMoveId = document.querySelector(`.puzzle-piece[data-in-which-element="${allNumbers[Math.floor((Math.random() * (allNumbers.length))).toFixed(0)]}"]`);
        const { value, inWhichElement } = puzzleToMoveId.dataset;
        if (lastElementDrawn != value) {
            grow = false;
            emptyElement();
            generatingASingleElement(emptyElementId, value, inWhichElement, true);
            lastElementDrawn = value;
        }
    }
}

const generatingASingleElement = (id, value, inWhatElement, translating) => {
    const removeAfterSeconds = () => document.querySelector(`[data-in-which-element="${inWhatElement}"`).remove();
    
    const generating = () => {
        const toTheItem = document.querySelector(`.puzzle-piece-container[data-id="${id}"]`);
        const element = document.createElement('div');
        element.dataset.inWhichElement = toTheItem.dataset.id;
        element.className = "puzzle-piece";
        element.id = "puzzle-piece";
        element.textContent = value;
        element.dataset.value = value;
        toTheItem.appendChild(element);
        givePossibilityToMove();
        validation();
        puzzleAvaiableForTransfer();
        checkYouWon();
    }

    if (translating) {
        removeAfterSeconds();
        generating();
    }
    else {
        setTimeout(removeAfterSeconds, 150);
        setTimeout(generating, 150);
    }
}

const movingElements = e => {
    const { inWhichElement, value } = e.target.dataset;
    if (isMovingElement === false) {
        isMovingElement = true;
        setTimeout(() => { isMovingElement = false}, 160);
        emptyElement();
        availablePuzzleForMove(values.col, Number(emptyElementId));

        positionsAndOpportunities.forEach(item => {
            if ([item.capabilities].includes(Number(inWhichElement))) {
                slidingEffect(inWhichElement, item.position);
                generatingASingleElement(emptyElementId, value, inWhichElement, null);
                nextMove();
            }
        })
    }
}

const nextMove = () => document.querySelector('#number-of-shifts').textContent = ++values.numberOfChanges;

const modeSelection = e => {
    document.querySelectorAll('.mode-selection').forEach(item => item.classList.remove('mode-selection-active'));
    e.currentTarget.classList.add('mode-selection-active');
    values.col = Number(e.target.dataset.col);
}
document.querySelectorAll('.mode-selection').forEach(item => item.addEventListener('click', modeSelection));

const countTheTime = () => counting = setInterval(displayCurrentTime, 1000);

const stopCountTheTime = () => window.clearInterval(counting);

const resetCountTheTime = () => {
    window.clearInterval(counting);
    values.seconds = -1;
    countTheTime();
    displayCurrentTime(true);
}

const displayCurrentTime = resetCounter => {
    const counter = document.querySelector('#time');
    values.seconds = ++values.seconds;
    counter.textContent = values.seconds + "s";
    if (resetCounter) counter.textContent = "0s";
}

const startTheGame = () => {
    if (values.col === null) errorMessage("Musisz wybrać wielkość planszy by zacząć grać");
     
    else {
        document.querySelector('#puzzle-container').classList.add(`puzzle-${values.col}`);
        generatingElements(values.col * values.col);
        countTheTime();
        menuOff();
    }
}  
document.querySelector('#start-the-game').addEventListener('click', startTheGame);

const menuOn = () => {
    values.menu = true;
    document.querySelector('#game-menu').classList.add('active-game-menu');
}

const menuOff = () => {
    values.menu = false;
    document.querySelector('#game-menu').classList.remove('active-game-menu');
}

const pauseOn = () => {
    if (values.menu === false) {
        if (values.pause === false) {
            document.querySelector('#pause-game').classList.add('pause-game-active');
            stopCountTheTime();
            values.pause = true;
        }
        else errorMessage("Pauza jest już włączona");
    }
    else errorMessage("Nie możesz włączyć pauzy w menu");
}
document.querySelector('#pauza').addEventListener('click', pauseOn);

const pauseOff = () => {
    console.log("wylacz pauze")
    document.querySelector('#pause-game').classList.remove('pause-game-active');
    countTheTime();
    values.pause = false;
}
document.querySelector('#pause-game-off').addEventListener('click', pauseOff);

const resettingMoves = () => {
    values.numberOfChanges = 0;
    document.querySelector('#number-of-shifts').textContent = values.numberOfChanges;
}

const resetGame = () => {
    if (values.menu === false) {
        if (values.pause === false) {
            resetCountTheTime();
            generatingElements(values.col * values.col);
            resettingMoves();
        }
        else errorMessage("Nie możesz zresetować planszy podczas pauzy");
    }
    else errorMessage("Nie możesz zresetować planszy w menu");
}
document.querySelector('#start').addEventListener('click', resetGame);

const backToTheMenu = () => {
    if (values.pause === false) {
        document.querySelectorAll('.mode-selection').forEach(item => item.classList.remove("mode-selection-active"));
        document.querySelector('.puzzle-container-content-container').classList.remove(`puzzle-${values.col}`);
        document.querySelectorAll('.puzzle-piece-container').forEach(item => item.remove());
        values.col = null;
        resetCountTheTime();
        stopCountTheTime();
        menuOn();
        resettingMoves();
    }
    else errorMessage("Musisz wyłączyć pauze by włączyć menu");
}
document.querySelector('#choose-again').addEventListener('click', backToTheMenu);

const puzzleAvaiableForTransfer = () => {
    document.querySelectorAll('.puzzle-piece').forEach(element => element.classList.remove('puzzle-active-for-move'));

    emptyElement();
    availablePuzzleForMove(values.col, Number(emptyElementId));

    positionsAndOpportunities.forEach(value => {
        document.querySelector(`.puzzle-piece[data-in-which-element="${value.capabilities}"]`).classList.add('puzzle-active-for-move');
    })
}

const availablePuzzleForMove = (col, idEmpty) => {
    positionsAndOpportunities = [];
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
        positionsAndOpportunities.push({ position: "top", capabilities: idEmpty - col});
        positionsAndOpportunities.push({ position: "bottom", capabilities: idEmpty + col});

        if (puzzleRight.includes(idEmpty)) {
            positionsAndOpportunities.push({ position: "right", capabilities: idEmpty + 1});
        }

        if (puzzleLeft.includes(idEmpty)) {
            positionsAndOpportunities.push({ position: "left", capabilities: idEmpty - 1});
        }

        if (idEmpty > col && idEmpty < (puzzleQuantity - col) && idEmpty && !puzzleLeft.includes(idEmpty) && !puzzleRight.includes(idEmpty)) {
            positionsAndOpportunities.push({ position: "left", capabilities: idEmpty - 1});
            positionsAndOpportunities.push({ position: "right", capabilities: idEmpty + 1});
        }
    }

    if ((idEmpty > 1 && idEmpty < col) || (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity)) {
        positionsAndOpportunities.push({ position: "right", capabilities: idEmpty + 1});
        positionsAndOpportunities.push({ position: "left", capabilities: idEmpty - 1});

        if (idEmpty > (puzzleQuantity - (col - 1)) && idEmpty < puzzleQuantity) {
            positionsAndOpportunities.push({ position: "top", capabilities: idEmpty - col});
        }
        
        if (idEmpty > 1 && idEmpty < col) {
            positionsAndOpportunities.push({ position: "bottom", capabilities: idEmpty + col});
        };
    }

    if ((idEmpty === 1) || (idEmpty === col)) {
        positionsAndOpportunities.push({ position: "bottom", capabilities: idEmpty + col});

        if (idEmpty === 1) {
            positionsAndOpportunities.push({ position: "right", capabilities: idEmpty + 1});
        }

        if (idEmpty === col) {
            positionsAndOpportunities.push({ position: "left", capabilities: idEmpty - 1});
        }
    }

    if ((idEmpty === (puzzleQuantity - (col - 1 ))) || (puzzleQuantity === idEmpty)) {
        positionsAndOpportunities.push({ position: "top", capabilities: idEmpty - col});

        if (idEmpty === (puzzleQuantity - (col - 1 ))) {
            positionsAndOpportunities.push({ position: "right", capabilities: idEmpty + 1});
        }
        
        if (puzzleQuantity === idEmpty) {
            positionsAndOpportunities.push({ position: "left", capabilities: idEmpty - 1});
        }
    }
}

window.addEventListener('keydown', e => {
    if (values.pause === false ) {
        if (e.keyCode === 37  || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            if (isMovingElement === false) {
                isMovingElement = true;
                setTimeout(() => { isMovingElement = false}, 160);
                switch (e.keyCode) {
                    case 37: 
                        arrowControl("left");
                    break;
    
                    case 38: 
                        arrowControl("top");
                    break;
    
                    case 39: 
                        arrowControl("right");
                    break;
    
                    case 40:
                        arrowControl("bottom");
                    break;
                }
            }
        }
    }
}, false);

const arrowControl = position => {
    if (positionsAndOpportunities.find(element => element.position === position )) {
        const indexElement = positionsAndOpportunities.findIndex(element => element.position === position )

        const element = document.querySelector(`[data-in-which-element="${positionsAndOpportunities[indexElement].capabilities}"`); 
        const { inWhichElement, value } = element.dataset

        slidingEffect(inWhichElement, positionsAndOpportunities[indexElement].position);
        generatingASingleElement(emptyElementId, value, inWhichElement, null);
        nextMove();
    } 
}

const slidingEffect = (puzzelId, positions) => {
    const sizeItem = document.querySelector(`.puzzle-piece-container`);
    const size = getComputedStyle(sizeItem).height;
    const elementToBeMoved = document.querySelector(`.puzzle-piece[data-in-which-element="${puzzelId}"]`);

    switch (positions) {
        case "top":
            elementToBeMoved.style.transform = `translate(0px, ${size})`;
        break;

        case "bottom":
            elementToBeMoved.style.transform = `translate(0px,-${size})`;
        break;

        case "right":
            elementToBeMoved.style.transform = `translate(-${size},00px)`;
        break;

        case "left":
            elementToBeMoved.style.transform = `translate(${size},00px)`;
        break;
    }
}

const emptyElement = () => {
    const allComponents = document.querySelectorAll('.puzzle-piece-container');
    allComponents.forEach(element => {
        const { id } = element.dataset
        if (!document.querySelector(`.puzzle-piece[data-in-which-element="${id}"]`)) {
            emptyElementId = id;
        }
    })
}

const errorMessage = mess => {
    const messageElement = document.createElement('div');
    messageElement.className = "message";
    document.querySelector('body').before(messageElement);
    messageElement.textContent = mess;
    setTimeout(() => {messageElement.remove()}, 2500)
}
