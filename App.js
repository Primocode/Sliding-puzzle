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
}

drawNumbers();



