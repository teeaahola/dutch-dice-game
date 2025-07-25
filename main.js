// TODO: fix keeping score when rolling again in one turn


let kept = new Array(6).fill(false);
let keptFromPrev = new Array(6).fill(false);

let diceText = new Array(6).fill("");
let diceValues = new Array(6).fill(0);
let totalScore = 0;
let score = 0;

const players = [];
let currentPlayer = 0;
let startGame = true;
let currentWinner = null;
let winnerScore = 0;
let stopAt = null;

const createDie = (number, i) => {
    let div = document.createElement("div");
    div.classList.add("dieContainer");
    div.id = "div" + i;
    div.alt = "Die showing " + (number + 1);
    div.tabIndex = 0;
    div.onclick = () => clickDie(i);
    div.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            clickDie(i);
        }
    });
    let die = document.createElement("img");
    die.src = "images/" + (number + 1) + ".png";
    die.classList.add("die");
    die.id = "die" + i;
    diceValues[i] = number;
    div.appendChild(die);
    return div;
}

const createFlush = () => {
    for (let i = 0; i < 6; i++) {
        let div = createDie(i, i);
        div.classList.add("disabledDie");
        div.disabled = true;
        div.tabIndex = -1;
        document.getElementById("dice").appendChild(div);
    }
}

window.onload = () => {
    createFlush();
}

const showRules = () => {
    document.getElementById("rulesDialog").showModal();
}

const closeDialog = () => {
    document.getElementById("rulesDialog").close();
}

const untick = () => {
    kept.fill(false);
    keptFromPrev.fill(false);
}

const addPlayer = () => {
    const playerName = document.getElementById("playerName").value.trim();
    if (playerName === "") {
        alert("Please enter a player name.");
        return;
    }
    document.getElementById("scoreTable").classList.remove("hidden");
    let playerNumber = players.length
    // add player name to table
    let playerList = document.getElementById("players");
    let newPlayer = document.createElement("th");
    newPlayer.id = "player" + playerNumber;
    newPlayer.textContent = playerName;
    playerList.appendChild(newPlayer);
    // add player score list to table
    let scoreData = document.createElement("td");
    let scoreList = document.getElementById("scores");
    scoreList.appendChild(scoreData);
    let newScoreList = document.createElement("ul");
    newScoreList.classList.add("score");
    newScoreList.id = "scoreList" + playerNumber;
    scoreData.appendChild(newScoreList);
    players.push(playerName);
    // add player total score to table
    let totalData = document.createElement("td");
    totalData.id = "total" + playerNumber;
    totalData.classList.add("total");
    totalData.innerText = "0";
    let totalList = document.getElementById("totals");
    totalList.appendChild(totalData);
    // reset the input field
    document.getElementById("playerName").value = "";
    document.getElementById("next").disabled = false;
    return false;
}

const OR = (arr1, arr2) => {
    return arr1.map((value, index) => value || arr2[index]);
}

// rolls six dice
const rollDice = () => {
    // if all dice are kept when the dice are rolled, keep the current score as baseline
    if (OR(kept, keptFromPrev).every(value => value)) {
        totalScore += score;
        untick();
    }
    keptFromPrev = OR(kept, keptFromPrev);
    kept = new Array(6).fill(false);
    let dice = document.getElementById("dice");
    for (let i = 0; i < 6; i++) {
        if (keptFromPrev[i]) {
            // if the die was kept from the previous roll, keep it
            let div = document.getElementById("div" + i);
            dice.removeChild(div);
            div.disabled = true;
            div.tabIndex = -1;
            if (!div.classList.contains("disabledDie")) {
                div.classList.add("disabledDie");
            }
            dice.appendChild(div);
        } else {
            if (startGame) {
                startGame = !(i === 5);
                let div = document.getElementById("div" + i);
                dice.removeChild(div);
            } else {
                let oldDiv = document.getElementById("div" + i);
                dice.removeChild(oldDiv);
            }
            // create a new die
            let value = Math.floor(Math.random() * 6);
            let div = createDie(value, i);
            dice.appendChild(div);
        }
    }
    document.getElementById("roll").disabled = true;
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
    if (document.getElementById("div" + number).disabled) return;
    if (kept[number]) {
        document.getElementById("die" + number).checked = false;
    } else {
        document.getElementById("die" + number).checked = true;
    }
    let div = document.getElementById("div" + number);
    div.classList.toggle("selected");
    keep(number);
}

// change the current player
const changePlayer = () => {
    if (startGame) {
        document.getElementById("next").innerHTML = "Next player";
        document.getElementById("player" + currentPlayer).classList.add("current");
    } else {
        let newScore = document.createElement("li");
        let result = kept.some(Boolean) ? totalScore + score : 0;
        newScore.textContent = result > 0 ? totalScore + score : "—";
        document.getElementById("scoreList" + currentPlayer).appendChild(newScore);
        let current = document.getElementById("total" + currentPlayer).innerText;
        document.getElementById("total" + currentPlayer).innerText = Number(current) + result;
        document.getElementById("player" + currentPlayer).classList.remove("current");
        currentPlayer = (currentPlayer + 1) % players.length;
        document.getElementById("player" + currentPlayer).classList.add("current");
    }
    const name = players[currentPlayer];
}

// reset the game
const resetGame = () => {
    players.length = currentPlayer = winnerScore = totalScore = score = 0;
    currentWinner = stopAt = null;
    startGame = true;
    kept.fill(false);
    keptFromPrev.fill(false);

    document.getElementById("players").innerHTML = "";
    document.getElementById("scores").innerHTML = "";
    document.getElementById("totals").innerHTML = "";
    document.getElementById("dice").innerHTML = "";
    document.getElementById("next").disabled = true;
    document.getElementById("next").innerHTML = "Start";

    untick();

    document.getElementById("scoreTotal").innerText = "Score: 0";
    document.getElementById("scoreTable").classList.add("hidden");

    createFlush();
}

// reset the dice for the next player, also used for starting the game
const nextPlayer = () => {
    let previousPlayer = currentPlayer;
    changePlayer();
    let topScore = Number(document.getElementById("total" + previousPlayer).innerText);
    if (topScore >= 5000) {
        if (currentWinner === null) {
            currentWinner = previousPlayer;
            winnerScore = topScore;
        }
        if (winnerScore > 0 && topScore > winnerScore) {
            if (stopAt === null) {
                stopAt = currentWinner;
            }
            currentWinner = previousPlayer;
            winnerScore = topScore;
        }
    }
    if (currentPlayer === currentWinner || currentPlayer === stopAt) {
        alert("Congratulations " + players[currentWinner] + "! You have won with a score of " + winnerScore + "!");
        document.getElementById("roll").disabled = true;
        document.getElementById("next").disabled = true;
        for (let i = 0; i < 6; i++) {
            let div = document.getElementById("div" + i);
            div.disabled = true;
            div.tabIndex = -1;
            div.classList.add("disabledDie");
        }
        return;
    }
    untick();
    totalScore = score = 0;
    document.getElementById("scoreTotal").innerText = "Score: 0";
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
        document.getElementById("scoreTotal").innerText = "Score: " + score;
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
            // remove the counted dice from further single scoring
            count -= (count - 2);
        }
        // score single 1s and 5s left
        if (value === 0 && count > 0) score += 100 * count;
        if (value === 4 && count > 0) score += 50 * count;
    }
    document.getElementById("roll").disabled = (score === 0);
    document.getElementById("scoreTotal").innerText = "Score: " + (score + totalScore);
}