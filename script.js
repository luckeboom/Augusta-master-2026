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
  lowestRound: null,
  holeOrAlbatross: null
};

/* ADMIN – RESULTAT */
let resultTop10 = [];
let lowestRoundWinner = null;
let holeOrAlbatrossHappened = null;

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

function printLowestRoundPrompt() {
  write("\nVälj LÄGSTA RUNDA: ");
}

function printHoleOrAlbatrossPrompt() {
  write("\nTror du det blir Hole-in-One eller Albatross? (ja/nej): ");
}

function printAdminResultPrompt() {
  write("\n=== ADMIN: SLUTRESULTAT TOPP 10 ===\n");
  write("Plats " + (adminResultCount + 1) + ": ");
}

function printAdminLowestRoundPrompt() {
  write("\nADMIN: Vem hade lägsta rundan?: ");
}

function printAdminHolePrompt() {
  write("\nADMIN: Blev det Hole-in-One eller Albatross? (ja/nej): ");
}

/* ======================================================
   INPUT
====================================================== */

function submitInput() {
  const input = document.getElementById("stdin");
  const value = input.value.trim();
  input.value = "";

  let player = null;

  /* ===== STEG SOM KRÄVER NUMMER ===== */
  if (
    step === 0 || // topp 3
    step === 1 || // överraskning
    step === 2 || // flop
    step === 3 || // lägsta runda (user)
    step === 5 || // admin topp 10
    step === 6    // admin lägsta runda
  ) {
    const index = parseInt(value);

    if (isNaN(index) || index < 0 || index >= players.length) {
      write("\nFel: ogiltigt nummer\n");
      return;
    }

    player = players[index];
  }

  /* ===== STEG 0: TOPP 3 ===== */
  if (step === 0) {
    if (userGuesses.top3.includes(player)) {
      write("\nFel: spelaren redan vald\n");
      return;
    }

    userGuesses.top3.push(player);
    inputCount++;

    if (inputCount < 3) {
      printTop3Prompt();
    } else {
      step = 1;
      printSurprisePrompt();
    }
  }

  /* ===== STEG 1: ÖVERRASKNING ===== */
  else if (step === 1) {
    userGuesses.surprise = player;
    step = 2;
    printFlopPrompt();
  }

  /* ===== STEG 2: FLOP ===== */
  else if (step === 2) {
    userGuesses.flop = player;
    step = 3;
    printLowestRoundPrompt();
  }

  /* ===== STEG 3: LÄGSTA RUNDA (USER) ===== */
  else if (step === 3) {
    userGuesses.lowestRound = player;
    step = 4;
    printHoleOrAlbatrossPrompt();
  }

  /* ===== STEG 4: HOLE-IN-ONE / ALBATROSS (USER) ===== */
  else if (step === 4) {
    const v = value.toLowerCase();

    if (v !== "ja" && v !== "nej") {
      write("Skriv ja eller nej\n");
      printHoleOrAlbatrossPrompt();
      return;
    }

    userGuesses.holeOrAlbatross = v;
    printUserSummary();
    step = 5;
    printAdminResultPrompt();
     return;
  }

  /* ===== STEG 5: ADMIN TOPP 10 ===== */
  else if (step === 5) {
    if (resultTop10.includes(player)) {
      write("\nFel: spelaren redan vald\n");
      return;
    }

    resultTop10.push(player);
    adminResultCount++;

    if (adminResultCount < 10) {
      printAdminResultPrompt();
    } else {
      step = 6;
      printAdminLowestRoundPrompt();
    }
  }

  /* ===== STEG 6: ADMIN LÄGSTA RUNDA ===== */
  else if (step === 6) {
    lowestRoundWinner = player;
    step = 7;
    printAdminHolePrompt();
  }

  /* ===== STEG 7: ADMIN HOLE-IN-ONE ===== */
  else if (step === 7) {
    const v = value.toLowerCase();

    if (v !== "ja" && v !== "nej") {
      write("Skriv ja eller nej\n");
      printAdminHolePrompt();
      return;
    }

    holeOrAlbatrossHappened = v === "ja";
    calculateAndPrintScore();
     return;
  }
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

 /* TOPP 3 */
 write("\nTOPP 3:\n");
 userGuesses.top3.forEach((p, i) => {
  if (p === resultTop10[i]) {
    score += 15;
    write("✓ " + p + " rätt plats (+15)\n");
  } else if (resultTop10.slice(0,3).includes(p)) {
    score += 5;
    write("✓ " + p + " topp 3 men fel plats (+5)\n");
  } else {
    write("✗ " + p + " ej topp 3 (+0)\n");
  }
});

  write("\nFLOP:\n");
  if (isFlop(userGuesses.flop)) {
    score += 10;
    write("✓ " + userGuesses.flop + " FLOP (+10)\n");
  } else {
    write("✗ " + userGuesses.flop + " (+0)\n");
  }

  write("\nÖVERRASKNING:\n");
  if (isSurprise(userGuesses.surprise)) {
    score += 10;
    write("✓ " + userGuesses.surprise + " ÖVERRASKNING (+10)\n");
  } else {
    write("✗ " + userGuesses.surprise + " (+0)\n");
  }

 /* LÄGSTA RUNDA */
write("\nLÄGSTA RUNDA:\n");

if (!lowestRoundWinner) {
  write("✗ Admin har inte satt lägsta runda\n");
}
else if (!userGuesses.lowestRound) {
  write("✗ Du gjorde ingen gissning (+0)\n");
}
else if (userGuesses.lowestRound === lowestRoundWinner) {
  score += 10;
  write(
    "✓ Rätt! " +
    userGuesses.lowestRound +
    " hade lägsta rundan (+10)\n"
  );
}
else {
  write(
    "✗ Fel. Du gissade " +
    userGuesses.lowestRound +
    ", admin satte " +
    lowestRoundWinner +
    " (+0)\n"
  );
}

  /* HOLE-IN-ONE / ALBATROSS */
write("\nHOLE-IN-ONE / ALBATROSS:\n");

const specialPoints =
  holeInOneOrAlbatrossMarket(holeOrAlbatrossHappened);

score += specialPoints;

write(
  (specialPoints > 0 ? "✓ Rätt! " : "✗ Fel. ") +
  "Du svarade: " + userGuesses.holeOrAlbatross +
  ", admin: " + (holeOrAlbatrossHappened ? "ja" : "nej") +
  " (" + (specialPoints >= 0 ? "+" : "") + specialPoints + ")\n"
);

  write("\n=== TOTAL POÄNG ===\n");
  write("Total poäng: " + score + "\n");

  document.getElementById("first").textContent  = resultTop10[0] || "-";
  document.getElementById("second").textContent = resultTop10[1] || "-";
  document.getElementById("third").textContent  = resultTop10[2] || "-";
}
