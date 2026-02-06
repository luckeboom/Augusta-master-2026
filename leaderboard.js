/*
function loadLeaderboard() {
  fetch("data/mockLeaderboard.json")
    .then(r => r.json())
    .then(data => {
      data.sort((a, b) => b.points - a.points);
      renderLeaderboard(data);
    });
}
//denna är den riktiga koden men föräns denna är lanserad så kan vi inte göra en leaderboard etc så vi har en fejkad för att förstå hur programmet kommer se ut
function renderLeaderboard(list) {
  const el = document.getElementById("leaderboard");
  el.innerHTML = "";

  list.forEach((u, i) => {
    el.innerHTML += `
      <div class="row ${i < 3 ? "top3" : ""}">
        <span class="rank">${i + 1}</span>
        <span class="name">${u.user}</span>
        <span class="points">${u.points}</span>
      </div>
    `;
  });
}
*/
const mockLeaderboard = [
  { name: "Anna", points: 85 },
  { name: "Erik", points: 72 },
  { name: "Lisa", points: 68 }
];

function renderLeaderboard() {
  const el = document.getElementById("leaderboard-list");
  el.innerHTML = "";

  mockLeaderboard.forEach((u, i) => {
    el.innerHTML += `
      <div>
        ${i + 1}. ${u.name} – ${u.points} poäng
      </div>
    `;
  });
}
