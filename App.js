settings = {
    easy: 9,
    hard: 16
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
        mainElement[i].appendChild(element);
    }

}
generatingElements(settings.easy);

const whichItemIsFree = () => {
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
            console.log("wolne id " + item)
        }
    })
}
whichItemIsFree();

const drawNumbers = () => {
    const puzzle = document.querySelectorAll('#puzzle-piece');
    const values = [];
    for (let i = 1; i <= puzzle.length; i++ ) {
        drawn = 0;
        a = true;
        while (a) {
            drawn = Number((Math.random() * 7 + 1).toFixed(0));
            if (!values.includes(drawn)) {
                values.push(drawn);
                a = false;
            }
        }
    }

    puzzle.forEach((item, i) => {
        item.textContent = values[i];
        item.dataset.value = values[i];
    })
}
drawNumbers();



