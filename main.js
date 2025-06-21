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
    totalScore += score;
    score = 0;
    console.log("total: " + totalScore);
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
    console.log("Counts: " + counts);
    // if three of a kind is kept, add 1000 points for three 1s, 200 points for three 2s, and so on
    // if there are three 1s, add 1000 points, for three 2s, add 200 points, and so on
    // if there are four 1s, add 2000 points, for four 2s, add 400 points, and so on
    // if there are five 1s, add 3000 points, for five 2s, add 600 points, and so on
    // if there are six 1s, add 4000 points, for six 2s, add 800 points, and so on
    for (let i = 0; i < 6; i++) {
        if (keptFromPrev[i]) continue;
        //if (!kept[diceValues[i]]) continue;
        //console.log(`counts for ${i}: ${counts[i]}`);
        //let count = counts[i];
        console.log("index " + i);
        switch (counts[i]) {
            case 0:
                console.log(`case 0`);
                if (kept[i] && diceValues[i] === 0) {
                    score += 100;
                }
                if (kept[i] && diceValues[i] === 4) {
                    score += 50;
                }
                console.log("case 0 Score: " + score);
                continue;
            case 1:
                console.log(`case 1`);
                if (kept[i] && diceValues[i] === 0) {
                    score += 100;
                }
                if (kept[i] && diceValues[i] === 4) {
                    score += 50;
                }
                console.log("Score: " + score);
                continue;
            case 2:
                console.log("case 2");
                if (kept[i] && diceValues[i] === 0) {
                    score += 100;
                }
                if (kept[i] && diceValues[i] === 4) {
                    score += 50;
                }
                console.log("Score: " + score);
                continue;
            case 3:
                console.log("case 3");
                if (i === 0) {
                    score -= 200;
                    score += 1000; // three 1s
                    console.log("score: " + score);
                } else {
                    if (i === 4) score -= 100;
                    score += (i + 1) * 100; // three of any other number
                }
                continue;
            case 4:
                console.log("case 4");
                if (i === 0) {
                    score -= 300;
                    score += 2000; // four 1s
                } else {
                    if (i === 4) score -= 150;
                    score += (i + 1) * 200; // four of any other number
                }
                continue;
            case 5:
                console.log("case 5");
                if (i === 0) {
                    score -= 400;
                    score += 3000; // five 1s
                } else {
                    if (i === 4) score -= 200;
                    score += (i + 1) * 300; // five of any other number
                }
                continue;
            case 6:
                console.log("case 6");
                if (i === 0) {
                    score -= 500;
                    score += 4000; // six 1s
                } else {
                    if (i === 4) score -= 250;
                    score += (i + 1) * 400; // six of any other number
                }
                continue;
            default:
                console.log("default");
        }
    }
    document.getElementById("score").innerText = "Score: " + (score + totalScore);
}