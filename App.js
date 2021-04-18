const settings = {
    easy: 9,
    hard: 16 
}

const values = {
    numberOfChanges: 0,
}

const combinations = {
    easy: {
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
    hard: {
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
    const singlePuzzle = document.querySelectorAll('#puzzle-piece').forEach(item => item.addEventListener('click', movingElements));
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
    
}
generatingElements(settings.easy);

const toTheFreeElement = (value, inWhatElement) => {
    const blankItem = document.querySelectorAll('#space-for-a-puzzle');
    const allId = [];
    const busyId = [];
    blankItem.forEach(item => { allId.push(Number(item.dataset.id)); })
    blankItem.forEach(item => {
        if (item.children["puzzle-piece"]) {
            busyId.push(Number(item.dataset.id))
        }
    })
    allId.forEach(item => {
        if(!busyId.includes(item)) {
            possibilityOfShifint(item, value, inWhatElement);
            // iluminationOfElements(item)
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
drawNumbers();

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
    // iluminationOfElements();
}

const movingElements = (e) => {
    toTheFreeElement(e.currentTarget.dataset.value, e.target.dataset.inWhichElement);
}
possibilityOfSliding();

const possibilityOfShifint = (freeSpace, whichElement, inWhatElement) => {
    if (combinations.easy[freeSpace].includes(Number(inWhatElement))) {
        document.querySelector(`[data-in-which-element="${inWhatElement}"`).remove();
        generatingASingleElement(freeSpace, whichElement);
        values.numberOfChanges = values.numberOfChanges + 1;
    }
}
