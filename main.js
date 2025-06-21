const dicePics = new Map();

dicePics.set(0, '<img src="images/1.png" alt="Die showing 1" ');
dicePics.set(1, '<img src="images/2.png" alt="Die showing 2" ');
dicePics.set(2, '<img src="images/3.png" alt="Die showing 3" ');
dicePics.set(3, '<img src="images/4.png" alt="Die showing 4" ');
dicePics.set(4, '<img src="images/5.png" alt="Die showing 5" ');
dicePics.set(5, '<img src="images/6.png" alt="Die showing 6" ');

let kept = [false, false, false, false, false, false];

let diceText = ["", "", "", "", "", ""];
let diceValues = [0, 0, 0, 0, 0, 0];

// rolls six dicePics and returns their values as an array
const rollDice = () => {
    for (let i = 0; i < 6; i++) {
        let die;
        if (kept[i]) {
            die = diceText[i];
        } else {
            let value = Math.floor(Math.random() * 6)
            die = dicePics.get(value) + `onclick="clickDie(${i})">`;
            console.log(die);
            diceValues[i] = value;
        }
        diceText[i] = die;
    }
    document.getElementById("dice").innerHTML = diceText.join("");
}

// keep the value of the parameter die
const keep = (number) => {
    kept[number] = !kept[number];
    countScore();
}

const clickDie = (number) => {
    if (kept[number]) {
        document.getElementById("dice" + number).checked = false;
    } else {
        document.getElementById("dice" + number).checked = true;
    }
    keep(number);
    countScore();
}

// reset the dice
const reset = () => {
    for (let i = 0; i < 5; i++) {
        kept[i] = false;
        document.getElementById("dice" + i).checked = false;
    }
    document.getElementById("score").innerText = "Score: 0";
}

// count current score and display it on the screen
const countScore = () => {
    let score = 0;
    for (let i = 0; i < 6; i++) {
        if (kept[i] && diceValues[i] === 0) {
            score += 100;
        }
        if (kept[i] && diceValues[i] === 4) {
            score += 50;
        }
    }
    document.getElementById("score").innerText = "Score: " + score;
}