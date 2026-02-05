/* ========= GLOBAL DATA ========= */

let players = [];

let step = 0;        // programsteg
let inputCount = 0; // räknar topp-3-val

let userGuesses = {
    top3: [],
    surprise: null,
    flop: null
};

// ADMIN / FACIT (gemensamt resultat)
let resultTop3 = [null, null, null];

/* ========= START ========= */

fetch("players.txt")
    .then(r => r.text())
    .then(t => {
        players = t.trim().split("\n");
        printPlayerList();
        printTop3Prompt();
    });

/* ========= STDOUT ========= */

function write(text) {
    const out = document.getElementById("stdout");
    out.textContent += text;
    out.scrollTop = out.scrollHeight;
}

function printPlayerList() {
    write("=== SPELARLISTA ===\n");
    for (let i = 0; i < players.length; i++) {
        write(i + ": " + players[i] + "\n");
    }
    write("\n");
}

function printTop3Prompt() {
    write("Välj TOPP 3 i kronologisk ordning (inga dubletter)\n");
    write("Plats " + (inputCount + 1) + ": ");
}

function printSurprisePrompt() {
    write("\nVälj ÅRETS ÖVERRASKNING: ");
}

function printFlopPrompt() {
    write("\nVälj ÅRETS FLOP: ");
}

function printResultPrompt() {
    write("\n=== ADMIN: ANGE RESULTAT ===\n");
    write("Vinnare (1): ");
}

/* ========= STDIN ========= */

function submitInput() {
    const input = document.getElementById("stdin");
    const index = parseInt(input.value);
    input.value = "";

    if (isNaN(index) || index < 0 || index >= players.length) {
        write("\nFel: ogiltigt nummer\n");
        return;
    }

    /* ===== TOPP 3 (ingen dublett) ===== */
    if (step === 0) {
        if (userGuesses.top3.includes(players[index])) {
            write("\nFel: spelaren redan vald i topp 3\n");
            return;
        }

        userGuesses.top3.push(players[index]);
        inputCount++;

        if (inputCount < 3) {
            printTop3Prompt();
        } else {
            step = 1;
            printSurprisePrompt();
        }
    }

    /* ===== ÖVERRASKNING ===== */
    else if (step === 1) {
        userGuesses.surprise = players[index];
        step = 2;
        printFlopPrompt();
    }

    /* ===== FLOP ===== */
    else if (step === 2) {
        userGuesses.flop = players[index];
        step = 3;
        printUserSummary();
        printResultPrompt();
    }

    /* ===== ADMIN: RESULTAT ===== */
    else if (step === 3) {
        resultTop3[0] = players[index];
        step = 4;
        write("\n2:a plats: ");
    }
    else if (step === 4) {
        resultTop3[1] = players[index];
        step = 5;
        write("\n3:e plats: ");
    }
    else if (step === 5) {
        resultTop3[2] = players[index];
        step = 6;
        calculateAndPrintScore();
    }
}

/* ========= SAMMANFATTNING ========= */

function printUserSummary() {
    write("\n=== DINA VAL ===\n");
    write("1. " + userGuesses.top3[0] + "\n");
    write("2. " + userGuesses.top3[1] + "\n");
    write("3. " + userGuesses.top3[2] + "\n");
    write("Överraskning: " + userGuesses.surprise + "\n");
    write("Flop: " + userGuesses.flop + "\n");
}

/* ========= POÄNG ========= */

function calculateAndPrintScore() {
    let score = 0;

    for (let i = 0; i < 3; i++) {
        if (userGuesses.top3[i] === resultTop3[i]) {
            score += 15; // rätt spelare + rätt plats
        }
        else if (resultTop3.includes(userGuesses.top3[i])) {
            score += 5;  // rätt spelare, fel plats
        }
    }

    write("\n=== RESULTAT ===\n");
    write("1. " + resultTop3[0] + "\n");
    write("2. " + resultTop3[1] + "\n");
    write("3. " + resultTop3[2] + "\n");

    write("\n=== POÄNG ===\n");
    write("Total poäng: " + score + "\n");
}
