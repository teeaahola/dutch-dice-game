let kept = new Array(6).fill(false);
let keptFromPrev = new Array(6).fill(false);

let diceText = new Array(6).fill("");
let diceValues = new Array(6).fill(0);
let totalScore = 0;
let score = 0;
let rolloverScore = 0;

const players = [];
let currentPlayer = 0;
let startGame = true;
let currentWinner = null;
let winnerScore = 0;
let stopAt = null;

/**
 * Initializes a die element with a random number and sets up event listeners.
 * The die is clickable and can be selected or deselected.
 * @param {*} number - The random number for the die (0-5).
 * @param {*} i - The index of the die in the dice array.
 * @returns {div} - DOM element representing the die.
 */
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

/**
 * Creates a flush of six dice with values 1-6.
 * All dice are initially disabled.
 */
const createFlush = () => {
    for (let i = 0; i < 6; i++) {
        let div = createDie(i, i);
        div.classList.add("disabledDie");
        div.disabled = true;
        div.tabIndex = -1;
        document.getElementById("dice").appendChild(div);
    }
}

/**
 * Initializes the game by creating a flush of dice and setting up an event listener for the form.
 */
window.onload = () => {
    createFlush();

    var input = document.getElementById("playerName");
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("addPlayer").click();
        }
    });
}

/**
 * Displays the rules of the game in a dialog.
 * The dialog is shown when the "Show Rules" button is clicked.
 */
const showRules = () => {
    document.getElementById("rulesDialog").showModal();
}

/**
 * Closes the rules dialog.
 */
const closeDialog = () => {
    document.getElementById("rulesDialog").close();
}

/**
 * Unticks all dice and resets the kept arrays.
 * This is used to reset the game state when starting a new round or game.
 */
const untick = () => {
    kept.fill(false);
    keptFromPrev.fill(false);
}

/**
 * Adds a new player to the game.
 * The player's name is taken from the input field.
 * Do not allow empty names.
 * The player is added to the score table and the input field is reset.
 */
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
}

/**
 * Performs a logical OR operation on two arrays element-wise.
 * @param {*} arr1 - The first array to compare.
 * @param {*} arr2 - The second array to compare.
 * @returns {Array} - A new array where each element is the logical OR of the corresponding elements in arr1 and arr2.
 */
const OR = (arr1, arr2) => {
    return arr1.map((value, index) => value || arr2[index]);
}

/**
 * Rolls the dice and updates the game state.
 * If all dice are kept from the previous roll, it keeps the current score as a baseline.
 * Generates new random values for the dice and updates the display.
 * The score is updated based on the kept dice.
 */
const rollDice = () => {
    // if all dice are kept when the dice are rolled, keep the current score as baseline
    if (OR(kept, keptFromPrev).every(value => value)) {
        rolloverScore = totalScore + score;
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

/**
 * Toggles the kept state of the die and updates the score.
 * If the die is kept, it is marked as selected; if unkept, it is unselected.
 * The score is recalculated based on the current kept dice.
 * @param {*} number - The index of the die to keep or unkeep.
 */
const keep = (number) => {
    kept[number] = !kept[number];
    countScore();
}

/**
 * Handles the click event on a die.
 * If the die is disabled, it does nothing.
 * If the die is already kept, it unkeeps it; otherwise, it keeps it.
 * The die's visual state is updated to reflect its kept status.
 * @param {*} number - The index of the die to click.
 */
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

/**
 * Changes the current player to the next one.
 * If the game has started, it updates the UI to show the next player and counts the
 * player's score of the round and the game.
 */
const changePlayer = () => {
    if (startGame) {
        document.getElementById("next").innerHTML = "Next player";
        document.getElementById("player" + currentPlayer).classList.add("current");
    } else {
        let newScore = document.createElement("li");
        let result = kept.some(Boolean) ? totalScore + score : rolloverScore;
        newScore.textContent = result > 0 ? result : "—";
        document.getElementById("scoreList" + currentPlayer).appendChild(newScore);
        let current = document.getElementById("total" + currentPlayer).innerText;
        document.getElementById("total" + currentPlayer).innerText = Number(current) + result;
        document.getElementById("player" + currentPlayer).classList.remove("current");
        currentPlayer = (currentPlayer + 1) % players.length;
        document.getElementById("player" + currentPlayer).classList.add("current");
    }
    const name = players[currentPlayer];
}

/**
 * Resets the game state to its initial values.
 * Clears the players, scores, and dice.
 * Resets the UI elements and prepares for a new game.
 */
const resetGame = () => {
    players.length = currentPlayer = winnerScore = totalScore = score = rolloverScore = 0;
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
    document.getElementById("addPlayer").disabled = false;

    untick();

    document.getElementById("scoreTotal").innerText = "Score: 0";
    document.getElementById("scoreTable").classList.add("hidden");

    createFlush();
}

/**
 * Moves to the next player and checks for a winner.
 * If the current player has a score of 5000 or more, they are declared the
 * winner.
 * If a winner is found, the game is ended and the UI is updated to reflect the
 * winner's score.
 * If no winner is found, the game continues with the next player.
 */
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
        alert("Congratulations, " + players[currentWinner] + "! You have won with a score of " + winnerScore + "!");
        document.getElementById("roll").disabled = true;
        document.getElementById("next").disabled = true;
        document.getElementById("addPlayer").disabled = true;
        for (let i = 0; i < 6; i++) {
            let div = document.getElementById("div" + i);
            div.disabled = true;
            div.tabIndex = -1;
            div.classList.add("disabledDie");
        }
        return;
    }
    untick();
    totalScore = score = rolloverScore = 0;
    document.getElementById("scoreTotal").innerText = "Score: 0";
    rollDice();
}

/**
 * Checks if all kept dice form a flush (1, 2, 3, 4, 5, 6).
 * @returns {boolean} - Returns true if all kept dice form a flush.
 */
const isFlush = () => {
    // sort a copy of the dice values
    let sortedValues = [...diceValues].sort((a, b) => a - b);
    return OR(kept, keptFromPrev).every((value, index) => value && sortedValues[index] === index);
}

/**
 * Calculates the score based on the kept dice.
 */
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