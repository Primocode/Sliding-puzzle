const settings = {
    easy: 9,
    hard: 16 
}

const values = {
    numberOfChanges: 0,
    selectedMode: null,
    // selectedMode: "easy",
}

const combinations = {
    "easy": {
        9: [8,6],
        8: [7,9,5],
        7: [8,4],
        6: [3,5,9],
        5: [2,4,6,8],
        4: [1,5,7],
        3: [2,6],
        2: [1,3,5],
        1: [2,4],
    },
    "hard": {
        9: [],
        8: [],
        7: [],
        6: [],
        5: [],
        4: [],
        3: [],
        2: [],
        1: [],
    }
}

const validation = () => {
    const inTheElement = document.querySelectorAll('#puzzle-piece');
    inTheElement.forEach(item => {
        if (item.dataset.value === item.dataset.inWhichElement) {
            item.classList.add("puzzle-piece-correct");
        }
    })
}

const possibilityOfSliding = () => {
     document.querySelectorAll('#puzzle-piece').forEach(item => item.addEventListener('click', movingElements));
}

const generatingElements = (level) => {
    const spaceForAPuzzle = document.querySelector('#puzzle-container');

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
}


const toTheFreeElement = (value, inWhatElement) => {
    const allComponents = document.querySelectorAll('#space-for-a-puzzle')
    allComponents.forEach(element => {
        if (!document.querySelector(`#puzzle-piece[data-in-which-element="${element.dataset.id}"]`)) {
            possibilityOfShifint(element.dataset.id, value, inWhatElement);
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

    possibilityOfSliding();
    validation();
}

const movingElements = (e) => {
    toTheFreeElement(e.currentTarget.dataset.value, e.target.dataset.inWhichElement);
}

const possibilityOfShifint = (freeSpace, whichElement, inWhatElement) => {
    if (combinations.easy[freeSpace].includes(Number(inWhatElement))) {
        document.querySelector(`[data-in-which-element="${inWhatElement}"`).remove();
        generatingASingleElement(freeSpace, whichElement);
        nextMove();
    }
}

const nextMove = () => {
    document.querySelector('#number-of-shifts').textContent = ++values.numberOfChanges;
}

const modeSelection = (e) => {
    document.querySelectorAll('.mode-selection').forEach(item => {
        item.classList.remove('mode-selection-active')
    })
    e.currentTarget.classList.add('mode-selection-active')
    values.selectedMode = e.target.dataset.mode
}

document.querySelectorAll('.mode-selection').forEach(item => item.addEventListener('click', modeSelection))

const startTheGame = () => {
    if (values.selectedMode == null) {
        console.log("wybierz tryb")
    } 
    else {
        generatingElements(settings[values.selectedMode]);
        document.querySelector('#game-menu').classList.remove('active-game-menu')
    }

}

document.querySelector('#start-the-game').addEventListener('click', startTheGame)

window.onload = () => {
    possibilityOfSliding();
}
    
