/* ======================================================
   GLOBAL DATA
====================================================== */

let players = [];

/* Programflöde */
let step = 0;
let inputCount = 0;
let adminResultCount = 0;

/* Användarens val */
let userGuesses = {
  top3: [],
  surprise: null,
  flop: null,
  lowestRound: null
};

/* ADMIN – RESULTAT */
let resultTop10 = [];
let lowestRoundWinner = null;

/* ======================================================
   VÄRLDSRANKING (FAST DATA)
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
   START – LÄS SPELARE
====================================================== */

fetch("players.txt")
  .then(r => r.text())
  .then(t => {
    players = t.trim().split("\n");
    printPlayerList();
    printTop3Prompt();
  });

/* ======================================================
   OUTPUT
====================================================== */

function write(text) {
  const out = document.getElementById("stdout");
  out.textContent += text;
  out.scrollTop = out.scrollHeight;
}

function printPlayerList() {
  write("=== SPELARLISTA ===\n");
  players.forEach((p, i) => write(i + ": " + p + "\n"));
  write("\n");
}

function printTop3Prompt() {
  write("Välj TOPP 3 i kronologisk ordning\n");
  write("Plats " + (inputCount + 1) + ": ");
}

function printSurprisePrompt() {
  write("\nVälj ÅRETS ÖVERRASKNING: ");
}

function printFlopPrompt() {
  write("\nVälj ÅRETS FLOP: ");
}

function printAdminResultPrompt() {
  write("\n=== ADMIN: SLUTRESULTAT TOPP 10 ===\n");
  write("Plats " + (adminResultCount + 1) + ": ");
}

/* ======================================================
   INPUT
====================================================== */

function submitInput() {
  const input = document.getElementById("stdin");
  const index = parseInt(input.value);
  input.value = "";

  if (isNaN(index) || index < 0 || index >= players.length) {
    write("\nFel: ogiltigt nummer\n");
    return;
  }

  const player = players[index];

  if (step === 0) {
    if (userGuesses.top3.includes(player)) {
      write("\nFel: spelaren redan vald\n");
      return;
    }
    userGuesses.top3.push(player);
    inputCount++;
    if (inputCount < 3) printTop3Prompt();
    else { step = 1; printSurprisePrompt(); }
  }

  else if (step === 1) {
    userGuesses.surprise = player;
    step = 2;
    printFlopPrompt();
  }

  else if (step === 2) {
    userGuesses.flop = player;
    step = 3;
    printUserSummary();
    printAdminResultPrompt();
  }

  else if (step === 3) {
    if (resultTop10.includes(player)) {
      write("\nFel: spelaren redan vald\n");
      return;
    }
    resultTop10.push(player);
    adminResultCount++;
    if (adminResultCount < 10) printAdminResultPrompt();
    else calculateAndPrintScore();
  }
}

/* ======================================================
   ADMIN: LÄGSTA RUNDA
====================================================== */

function setLowestRoundWinner(playerName) {
  lowestRoundWinner = playerName;
}

/* ======================================================
   SAMMANFATTNING
====================================================== */

function printUserSummary() {
  write("\n=== DINA VAL ===\n");
  userGuesses.top3.forEach((p, i) => write((i + 1) + ". " + p + "\n"));
  write("Överraskning: " + userGuesses.surprise + "\n");
  write("Flop: " + userGuesses.flop + "\n");
}

/* ======================================================
   LOGIK
====================================================== */

function getFinishPosition(player) {
  const i = resultTop10.indexOf(player);
  return i === -1 ? 999 : i + 1;
}

function isFlop(player) {
  const rank = worldRanking[player] ?? 999;
  const finish = getFinishPosition(player);
  if (rank <= 5 && finish > 5) return true;
  if (rank >= 6 && rank <= 10 && finish > 10) return true;
  return false;
}

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

  write("\n=== POÄNGBERÄKNING ===\n");

  /* TOPP 3 – ENDAST EXAKT PLATS */
  write("\nTOPP 3:\n");
  userGuesses.top3.forEach((p, i) => {
    if (p === resultTop10[i]) {
      score += 15;
      write("✓ " + p + " rätt plats (+15)\n");
    } else {
      write("✗ " + p + " fel plats (+0)\n");
    }
  });

  /* FLOP */
  write("\nFLOP:\n");
  if (isFlop(userGuesses.flop)) {
    score += 10;
    write("✓ " + userGuesses.flop + " FLOP (+10)\n");
  } else {
    write("✗ " + userGuesses.flop + " (+0)\n");
  }

  /* ÖVERRASKNING */
  write("\nÖVERRASKNING:\n");
  if (isSurprise(userGuesses.surprise)) {
    score += 10;
    write("✓ " + userGuesses.surprise + " ÖVERRASKNING (+10)\n");
  } else {
    write("✗ " + userGuesses.surprise + " (+0)\n");
  }

  /* LÄGSTA RUNDA – ALDRIG NULL */
  write("\nLÄGSTA RUNDA:\n");
  if (userGuesses.lowestRound && lowestRoundWinner) {
    if (userGuesses.lowestRound === lowestRoundWinner) {
      score += 10;
      write("✓ " + lowestRoundWinner + " lägsta runda (+10)\n");
    } else {
      write("✗ Gissade " + userGuesses.lowestRound +
            ", rätt var " + lowestRoundWinner + " (+0)\n");
    }
  } else {
    write("✗ Ingen giltig gissning (+0)\n");
  }

  write("\n=== TOTAL POÄNG ===\n");
  write("Total poäng: " + score + "\n");

  document.getElementById("first").textContent  = resultTop10[0] || "-";
  document.getElementById("second").textContent = resultTop10[1] || "-";
  document.getElementById("third").textContent  = resultTop10[2] || "-";
}
