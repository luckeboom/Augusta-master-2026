/* ======================================================
   GLOBAL DATA
====================================================== */

let players = [];

/* Programflöde (printf / scanf-stil) */
let step = 0;
let inputCount = 0;
let adminResultCount = 0;

/* Användarens val */
let userGuesses = {
    top3: [],
    surprise: null,
    flop: null
};

/* ADMIN – SLUTRESULTAT */
let resultTop10 = []; // index 0 = 1:a, index 9 = 10:e

/* ======================================================
   VÄRLDSRANKING (DAGENS – FAST DATA)
   Alla som inte finns här ⇒ rank > 10
====================================================== */

const worldRanking = {
    "Scottie Scheffler": 1,
    "Rory McIlroy": 2,
    "Justin Rose": 3,
    "Tommy Fleetwood": 4,
    "Russell Henley": 5,
    "Robert MacIntyre": 6,
    "J.J. Spaun": 7,
    "Xander Schauffele": 8,
    "Ben Griffin": 9,
    "Justin Thomas": 10
};

/* ======================================================
   START – LÄS SPELARE FRÅN FIL
====================================================== */

fetch("players.txt")
    .then(r => r.text())
    .then(t => {
        players = t.trim().split("\n");
        printPlayerList();
        printTop3Prompt();
    });

/* ======================================================
   STDOUT (printf)
====================================================== */

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

function printAdminResultPrompt() {
    write("\n=== ADMIN: ANGE SLUTRESULTAT TOPP 10 ===\n");
    write("Plats " + (adminResultCount + 1) + ": ");
}

/* ======================================================
   STDIN (scanf)
====================================================== */

function submitInput() {
    const input = document.getElementById("stdin");
    const index = parseInt(input.value);
    input.value = "";

    if (isNaN(index) || index < 0 || index >= players.length) {
        write("\nFel: ogiltigt nummer\n");
        return;
    }

    /* ---------- TOPP 3 ---------- */
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

    /* ---------- ÖVERRASKNING ---------- */
    else if (step === 1) {
        userGuesses.surprise = players[index];
        step = 2;
        printFlopPrompt();
    }

    /* ---------- FLOP ---------- */
    else if (step === 2) {
        userGuesses.flop = players[index];
        step = 3;
        printUserSummary();
        printAdminResultPrompt();
    }

    /* ---------- ADMIN: TOPP 10 ---------- */
    else if (step === 3) {
        if (resultTop10.includes(players[index])) {
            write("\nFel: spelaren redan vald i resultatet\n");
            return;
        }

        resultTop10.push(players[index]);
        adminResultCount++;

        if (adminResultCount < 10) {
            printAdminResultPrompt();
        } else {
            step = 4;
            calculateAndPrintScore();
        }
    }
}

/* ======================================================
   SAMMANFATTNING
====================================================== */

function printUserSummary() {
    write("\n=== DINA VAL ===\n");
    write("1. " + userGuesses.top3[0] + "\n");
    write("2. " + userGuesses.top3[1] + "\n");
    write("3. " + userGuesses.top3[2] + "\n");
    write("Överraskning: " + userGuesses.surprise + "\n");
    write("Flop: " + userGuesses.flop + "\n");
}

/* ======================================================
   HJÄLPFUNKTIONER
====================================================== */

function getFinishPosition(player) {
    const index = resultTop10.indexOf(player);
    return index === -1 ? 999 : index + 1;
}

/* ---------- FLOP-LOGIK ---------- */
/*
Rank 1–5  → måste vara topp 5
Rank 6–10 → måste vara topp 10
*/

function isFlop(player) {
    const rank = worldRanking[player] ?? 999;
    const finish = getFinishPosition(player);

    if (rank <= 5 && finish > 5) return true;
    if (rank >= 6 && rank <= 10 && finish > 10) return true;

    return false;
}

/* ---------- ÖVERRASKNING-LOGIK ---------- */
/*
Rank > 10 → topp 5
Rank 1–10 → MÅSTE VINNA
*/

function isSurprise(player) {
    const rank = worldRanking[player] ?? 999;
    const finish = getFinishPosition(player);

    if (rank > 10 && finish <= 5) return true;
    if (rank <= 10 && finish === 1) return true;

    return false;
}

/* ======================================================
   POÄNGBERÄKNING
====================================================== */

function calculateAndPrintScore() {
    let score = 0;

    /* TOPP 3 */
    for (let i = 0; i < 3; i++) {
        if (userGuesses.top3[i] === resultTop10[i]) {
            score += 15; // rätt spelare + rätt plats
        } else if (resultTop10.includes(userGuesses.top3[i])) {
            score += 5;  // rätt spelare, fel plats
        }
    }

    /* FLOP */
    if (isFlop(userGuesses.flop)) {
        score += 10;
    }

    /* ÖVERRASKNING */
    if (isSurprise(userGuesses.surprise)) {
        score += 10;
    }

    /* UTSKRIFT */
    write("\n=== SLUTRESULTAT ===\n");
    for (let i = 0; i < 10; i++) {
        write((i + 1) + ". " + resultTop10[i] + "\n");
    }

    write("\n=== POÄNG ===\n");
    write("Total poäng: " + score + "\n");
}
