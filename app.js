// Telegram WebApp Setup
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    if (tg.initDataUnsafe?.user) {
        document.getElementById('manager-name').textContent = `Manager: ${tg.initDataUnsafe.user.first_name}`;
    }
}

// Ethiopian Premier League Master Database
const MARKET_PLAYERS = [
    { id: 1, name: "Lealem Birhanu", club: "Saint George", pos: "GKP", price: 5.0 },
    { id: 2, name: "Said Habtamu", club: "Ethiopian Coffee", pos: "GKP", price: 4.5 },
    { id: 3, name: "Aschalew Tamene", club: "Saint George", pos: "DEF", price: 5.5 },
    { id: 4, name: "Henok Adhyna", club: "Fasil Kenema", pos: "DEF", price: 5.0 },
    { id: 5, name: "Suleman Hamid", club: "Ethiopian Coffee", pos: "DEF", price: 4.5 },
    { id: 6, name: "Amanuel Yohannes", club: "Ethiopian Coffee", pos: "MID", price: 7.5 },
    { id: 7, name: "Biniam Belay", club: "Saint George", pos: "MID", price: 7.0 },
    { id: 8, name: "Gatoch Panom", club: "Fasil Kenema", pos: "MID", price: 6.5 },
    { id: 9, name: "Abubeker Nasir", club: "Ethiopian Coffee", pos: "FWD", price: 10.0 },
    { id: 10, name: "Getaneh Kebede", club: "Fasil Kenema", pos: "FWD", price: 9.5 },
    { id: 11, name: "Chernet Gugsa", club: "Bahir Dar City", pos: "FWD", price: 8.0 }
];

// Initial Squad Setup (Starting XI + Bench)
let squad = [
    { id: 1, name: "Lealem Birhanu", club: "Saint George", pos: "GKP", price: 5.0, slot: "GKP" },
    { id: 3, name: "Aschalew Tamene", club: "Saint George", pos: "DEF", price: 5.5, slot: "DEF" },
    { id: 4, name: "Henok Adhyna", club: "Fasil Kenema", pos: "DEF", price: 5.0, slot: "DEF" },
    { id: 6, name: "Amanuel Yohannes", club: "Ethiopian Coffee", pos: "MID", price: 7.5, slot: "MID" },
    { id: 9, name: "Abubeker Nasir", club: "Ethiopian Coffee", pos: "FWD", price: 10.0, slot: "FWD" },
    { id: 2, name: "Said Habtamu", club: "Ethiopian Coffee", pos: "GKP", price: 4.5, slot: "BENCH" }
];

let bankBudget = 62.5; // Out of £100.0m total

// Render Squad onto Pitch & Bench
function renderSquad() {
    const rowGkp = document.getElementById("row-gkp");
    const rowDef = document.getElementById("row-def");
    const rowMid = document.getElementById("row-mid");
    const rowFwd = document.getElementById("row-fwd");
    const rowBench = document.getElementById("row-bench");

    rowGkp.innerHTML = "";
    rowDef.innerHTML = "";
    rowMid.innerHTML = "";
    rowFwd.innerHTML = "";
    rowBench.innerHTML = "";

    squad.forEach(player => {
        const cardHtml = createPlayerCard(player);
        if (player.slot === "BENCH") {
            rowBench.innerHTML += cardHtml;
        } else if (player.pos === "GKP") {
            rowGkp.innerHTML += cardHtml;
        } else if (player.pos === "DEF") {
            rowDef.innerHTML += cardHtml;
        } else if (player.pos === "MID") {
            rowMid.innerHTML += cardHtml;
        } else if (player.pos === "FWD") {
            rowFwd.innerHTML += cardHtml;
        }
    });

    document.getElementById("budget-display").textContent = `£${bankBudget.toFixed(1)}m`;
}

function createPlayerCard(player) {
    return `
        <div class="player-card" onclick="removePlayer(${player.id})">
            <span class="p-pos">${player.pos}</span>
            <span class="p-name">${player.name}</span>
            <span class="p-club">${player.club}</span>
            <span class="p-price">£${player.price.toFixed(1)}m</span>
        </div>
    `;
}

// Remove Player from Squad
function removePlayer(playerId) {
    const idx = squad.findIndex(p => p.id === playerId);
    if (idx !== -1) {
        const removed = squad.splice(idx, 1)[0];
        bankBudget += removed.price;
        renderSquad();
        renderMarket();
    }
}

// Render Transfer Market
function renderMarket(filterPos = "ALL") {
    const marketList = document.getElementById("market-list");
    marketList.innerHTML = "";

    const filtered = MARKET_PLAYERS.filter(p => filterPos === "ALL" || p.pos === filterPos);

    filtered.forEach(player => {
        const inSquad = squad.some(s => s.id === player.id);
        const canAfford = bankBudget >= player.price;

        marketList.innerHTML += `
            <div class="market-item">
                <div class="m-info">
                    <h4>${player.name} (${player.pos})</h4>
                    <span>${player.club} • £${player.price.toFixed(1)}m</span>
                </div>
                <button 
                    class="buy-btn" 
                    ${inSquad || !canAfford ? "disabled" : ""} 
                    onclick="buyPlayer(${player.id})">
                    ${inSquad ? "Owned" : "Buy"}
                </button>
            </div>
        `;
    });
}

// Buy Player from Market
function buyPlayer(playerId) {
    const player = MARKET_PLAYERS.find(p => p.id === playerId);
    if (!player || bankBudget < player.price) return;

    bankBudget -= player.price;
    const slot = squad.length >= 5 ? "BENCH" : player.pos;
    squad.push({ ...player, slot: slot });

    renderSquad();
    renderMarket(document.querySelector(".filter-btn.active").dataset.pos);
}

// Tab Switching Listener
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        e.target.classList.add("active");
        document.getElementById(e.target.dataset.tab).classList.add("active");
    });
});

// Position Filter Listener
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        renderMarket(e.target.dataset.pos);
    });
});

// Initial boot
renderSquad();
renderMarket();
