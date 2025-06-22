const dicePics = new Map();

for (let i = 0; i < 6; i++) {
    dicePics.set(i, `<img src="images/${i + 1}.png" alt="Die showing ${i + 1}" `);
}

let kept = new Array(6).fill(false);
let keptFromPrev = new Array(6).fill(false);

let diceText = new Array(6).fill("");
let diceValues = new Array(6).fill(0);
let totalScore = 0;
let score = 0;

const OR = (arr1, arr2) => {
    return arr1.map((value, index) => value || arr2[index]);
}

// rolls six dicePics and returns their values as an array
const rollDice = () => {
    // if all dice are kept when the dice are rolled, keep the current score as baseline
    if (OR(kept, keptFromPrev).every(value => value)) {
        totalScore += score;
        for (let i = 0; i < 6; i++) {
            kept[i] = false;
            keptFromPrev[i] = false;
            document.getElementById("dice" + i).checked = false;
            document.getElementById("dice" + i).disabled = false;
        }
    }
    keptFromPrev = OR(kept, keptFromPrev);
    kept = new Array(6).fill(false);
    for (let i = 0; i < 6; i++) {
        let die;
        if (keptFromPrev[i]) {
            die = diceText[i];
            document.getElementById("dice" + i).disabled = true;
        } else {
            let value = Math.floor(Math.random() * 6)
            die = dicePics.get(value) + `onclick="clickDie(${i})">`;
            diceValues[i] = value;
        }
        diceText[i] = die;
    }
    document.getElementById("dice").innerHTML = diceText.join("");
    document.getElementById("rollButton").disabled = true;
    totalScore += score;
    score = 0;
}

// keep the value of the parameter die
const keep = (number) => {
    kept[number] = !kept[number];
    countScore();
}

// transfer click event from image to checkbox
const clickDie = (number) => {
    if (document.getElementById("dice" + number).disabled) return;
    if (kept[number]) {
        document.getElementById("dice" + number).checked = false;
    } else {
        document.getElementById("dice" + number).checked = true;
    }
    keep(number);
}

// reset the dice
const reset = () => {
    for (let i = 0; i < 6; i++) {
        kept[i] = false;
        keptFromPrev[i] = false;
        document.getElementById("dice" + i).checked = false;
        document.getElementById("dice" + i).disabled = false;
    }
    totalScore = score = 0;
    document.getElementById("score").innerText = "Score: 0";
    rollDice();
}

const isFlush = () => {
    // sort a copy of the dice values
    let sortedValues = [...diceValues].sort((a, b) => a - b);
    return OR(kept, keptFromPrev).every((value, index) => value && sortedValues[index] === index);
}

// count current score and display it on the screen
const countScore = () => {
    score = 0;
    // if all dice are kept and contain values 1, 2, 3, 4, 5 and 6, the score is 1500
    if (isFlush()) {
        score = 1500;
        document.getElementById("score").innerText = "Score: " + score;
        return;
    }
    // count the number of same values kept
    let counts = new Array(6).fill(0);
    for (let i = 0; i < 6; i++) {
        if (kept[i]) {
            counts[diceValues[i]]++;
        }
    }
    // calculate the amount of points
    for (let value = 0; value < 6; value++) {
        let count = counts[value];
        if (count >= 3) {
            // handle three or more of a kind
            if (value === 0) {
                score -= 200;
                score += 1000 * (count - 2); // 3 ones = 1000, 4 = 2000, etc.
            } else {
                if (value === 4) score -= 100;
                score += (value + 1) * 100 * (count - 2);
            }
            // Remove the counted dice from further single scoring
            count -= (count - 2);
        }
        // Score single 1s and 5s left
        if (value === 0 && count > 0) score += 100 * count;
        if (value === 4 && count > 0) score += 50 * count;
    }
    document.getElementById("rollButton").disabled = (score === 0);
    document.getElementById("score").innerText = "Score: " + (score + totalScore);
}