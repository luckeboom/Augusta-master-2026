function holeInOneOrAlbatrossMarket(actualEvent) {
  while (true) {
    let choice = prompt(
      "Tror du att det blir en Hole-in-One ELLER Albatross?\n" +
      "Skriv 'ja', 'nej' eller 'q' för att avbryta"
    );

    if (!choice) return 0;

    choice = choice.trim().toLowerCase();

    // Avbryt
    if (choice === "q") {
      return 0;
    }

    // Ogiltigt input → fråga igen
    if (choice !== "ja" && choice !== "nej") {
      alert("Skriv endast 'ja', 'nej' eller 'q'.");
      continue;
    }

    // Giltigt svar → räkna poäng
    if (choice === "ja") {
      return actualEvent ? 10 : -4;
    } else {
      return actualEvent ? -10 : 4;
    }
  }
}
