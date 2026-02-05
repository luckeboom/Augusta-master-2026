  let choice = prompt(
    "Tror du att det blir en Hole-in-One ELLER Albatross? (ja/nej)"
  );

  if (!choice) return 0;
  choice = choice.trim().toLowerCase();

  if (choice !== "ja" && choice !== "nej") {
    alert("Skriv 'ja' eller 'nej'.");
    return 0;
  }

  if (choice === "ja") {
    return actualEvent ? 10 : -4;
  } else {
    return actualEvent ? -10 : 4;
  }
}
