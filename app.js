/**
 * Ethiopian Premier League Fantasy - App Engine v1.0
 */

const CONFIG = {
    MAX_BUDGET: 100.0,
    POS_LIMITS: { GKP: 2, DEF: 5, MID: 5, FWD: 3 },
    MAX_PER_CLUB: 3,
    STORAGE_KEY: "epl_fantasy_ethiopian_app_v1"
};

let appState = {
    budget: CONFIG.MAX_BUDGET,
    squad: [],       // Up to 15 player objects
    startingXI: [],  // 11 player IDs
    bench: [],       // 4 player IDs
    captainId: null,
    viceCaptainId: null
};

// Ethiopian Premier League Player Database
const PLAYERS_DATABASE = [
    // Saint George SC
    { id: 1, name: "Lealem Birhanu", club: "Saint George", pos: "GKP", price: 5.0 },
    { id: 2, name: "Aschalew Tamene", club: "Saint George", pos: "DEF", price: 5.5 },
    { id: 3, name: "Ramkel Lok", club: "Saint George", pos: "DEF", price: 5.0 },
    { id: 4, name: "Abinet Teshome", club: "Saint George", pos: "MID", price: 6.0 },
    { id: 5, name: "Biniam Belay", club: "Saint George", pos: "MID", price: 7.0 },
    { id: 6, name: "Ismail Ouro-Agoro", club: "Saint George", pos: "FWD", price: 9.0 },
    { id: 7, name: "Ame Mohammed", club: "Saint George", pos: "FWD", price: 7.5 },

    // Ethiopian Coffee SC
    { id: 8, name: "Wondwossen Ashenafi", club: "Ethiopian Coffee", pos: "GKP", price: 4.5 },
    { id: 9, name: "Ramadan Yusef", club: "Ethiopian Coffee", pos: "DEF", price: 5.5 },
    { id: 10, name: "Asrat Tonjo", club: "Ethiopian Coffee", pos: "DEF", price: 5.0 },
    { id: 11, name: "Amanuel Yohannes", club: "Ethiopian Coffee", pos: "MID", price: 7.5 },
    { id: 12, name: "Wogene Gezahegn", club: "Ethiopian Coffee", pos: "MID", price: 6.5 },
    { id: 13, name: "Abubeker Nasir", club: "Ethiopian Coffee", pos: "FWD", price: 10.0 },
    { id: 14, name: "Mesfin Tafesse", club: "Ethiopian Coffee", pos: "FWD", price: 7.0 },

    // Bahir Dar City SC
    { id: 15, name: "Tewodros Getnet", club: "Bahir Dar City", pos: "GKP", price: 4.5 },
    { id: 16, name: "Mignot Debebe", club: "Bahir Dar City", pos: "DEF", price: 5.0 },
    { id: 17, name: "Fereb Zewdu", club: "Bahir Dar City", pos: "MID", price: 6.0 },
    { id: 18, name: "Ali Suleiman", club: "Bahir Dar City", pos: "FWD", price: 8.0 },

    // Fasil Kenema SC
    { id: 19, name: "Said Habtamu", club: "Fasil Kenema", pos: "GKP", price: 5.0 },
    { id: 20, name: "Yared Bayeh", club: "Fasil Kenema", pos: "DEF", price: 6.0 },
    { id: 21, name: "Surafel Dagnachew", club: "Fasil Kenema", pos: "MID", price: 8.5 },
    { id: 22, name: "Getaneh Kebede", club: "Fasil Kenema", pos: "FWD", price: 9.5 },

    // Hawassa City SC
    { id: 23, name: "Sofonias Samrawit", club: "Hawassa City", pos: "GKP", price: 4.5 },
    { id: 24, name: "Priso Marcelin", club: "Hawassa City", pos: "DEF", price: 5.0 },
    { id: 25, name: "Fuad Fereja", club: "Hawassa City", pos: "MID", price: 6.0 },
    { id: 26, name: "Mujib Kassim", club: "Hawassa City", pos: "FWD", price: 8.5 },

    // Adama City SC
    { id: 27, name: "Wosenu Ali", club: "Adama City", pos: "GKP", price: 4.5 },
    { id: 28, name: "Tilahun Guedeye", club: "Adama City", pos: "DEF", price: 4.5 },
    { id: 29, name: "Behailu Assefa", club: "Adama City", pos: "MID", price: 6.5 },
    { id: 30, name: "Habtamu Tadesse", club: "Adama City", pos: "FWD", price: 7.0 }
];

let currentFilter = "ALL";

// ==========================================
// SQUAD ENGINE & RULES
// ==========================================
function addPlayerToSquad(player) {
    if (appState.squad.length >= 15) return { success: false, message: "Squad is full (15/15)." };
    if (appState.budget - player.price < 0) return { success: false, message: "Not enough budget left." };
    
    const posCount = appState.squad.filter(p => p.pos === player.pos).length;
    if (posCount >= CONFIG.POS_LIMITS[player.pos]) return { success: false, message: `Max limit reached for ${player.pos}.` };

    const clubCount = appState.squad.filter(p => p.club === player.club).length;
    if (clubCount >= CONFIG.MAX_PER_CLUB) return { success: false, message: `Max 3 players per club (${player.club}).` };

    appState.squad.push(player);
    appState.budget = +(appState.budget - player.price).toFixed(1);
    updateLineups();
    saveAndRender();
    return { success: true, message: `${player.name} added to squad.` };
}

function removePlayerFromSquad(playerId) {
    const idx = appState.squad.findIndex(p => p.id === playerId);
    if (idx === -1) return;
    const removed = appState.squad.splice(idx, 1)[0];
    appState.budget = +(appState.budget + removed.price).toFixed(1);
    
    if (appState.captainId === playerId) appState.captainId = null;
    if (appState.viceCaptainId === playerId) appState.viceCaptainId = null;

    updateLineups();
    saveAndRender();
}

function updateLineups() {
    if (appState.startingXI.length + appState.bench.length !== appState.squad.length) {
        appState.startingXI = appState.squad.slice(0, 11).map(p => p.id);
        appState.bench = appState.squad.slice(11, 15).map(p => p.id);
    }
    if (!appState.captainId && appState.startingXI.length > 0) {
        appState.captainId = appState.startingXI[0];
    }
}

// ==========================================
// UI RENDERING & DOM HOOKS
// ==========================================
function saveAndRender() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appState));
    renderUI();
}

function renderUI() {
    const budgetEl = document.getElementById("budget-display");
    const squadCountEl = document.getElementById("squad-count");
    
    if (budgetEl) budgetEl.textContent = `£${appState.budget}m`;
    if (squadCountEl) squadCountEl.textContent = `${appState.squad.length}/15`;

    renderPitchRows();
    renderMarket();
}

function renderPitchRows() {
    const rowGkp = document.getElementById("row-gkp");
    const rowDef = document.getElementById("row-def");
    const rowMid = document.getElementById("row-mid");
    const rowFwd = document.getElementById("row-fwd");
    const rowBench = document.getElementById("row-bench");

    if (!rowGkp) return;

    const starters = appState.squad.filter(p => appState.startingXI.includes(p.id));
    const bench = appState.squad.filter(p => appState.bench.includes(p.id));

    rowGkp.innerHTML = starters.filter(p => p.pos === 'GKP').map(renderPlayerNode).join('');
    rowDef.innerHTML = starters.filter(p => p.pos === 'DEF').map(renderPlayerNode).join('');
    rowMid.innerHTML = starters.filter(p => p.pos === 'MID').map(renderPlayerNode).join('');
    rowFwd.innerHTML = starters.filter(p => p.pos === 'FWD').map(renderPlayerNode).join('');
    rowBench.innerHTML = bench.map(renderPlayerNode).join('');
}

function renderPlayerNode(player) {
    const isCap = appState.captainId === player.id;
    return `
        <div class="player-node" onclick="handlePlayerClick(${player.id})">
            <div class="player-pos-badge">${player.pos}</div>
            <div class="player-info">
                <span class="p-name">${player.name}</span>
                <span class="p-price">£${player.price}m</span>
            </div>
            ${isCap ? '<span class="badge" style="position:absolute; top:-4px; right:-4px; background:var(--fpl-pink); color:#fff; font-size:8px; padding:1px 4px; border-radius:50%;">C</span>' : ''}
        </div>
    `;
}

function renderMarket() {
    const container = document.getElementById("market-list");
    if (!container) return;

    const filtered = currentFilter === "ALL" 
        ? PLAYERS_DATABASE 
        : PLAYERS_DATABASE.filter(p => p.pos === currentFilter);

    container.innerHTML = filtered.map(p => {
        const owned = appState.squad.some(s => s.id === p.id);
        return `
            <div class="market-card">
                <div class="market-card-info">
                    <strong>${p.name}</strong>
                    <span>${p.club} • ${p.pos} • £${p.price}m</span>
                </div>
                <button ${owned ? 'disabled' : ''} onclick="handleMarketAdd(${p.id})">
                    ${owned ? 'In Squad' : 'Add'}
                </button>
            </div>
        `;
    }).join("");
}

function handleMarketAdd(id) {
    const player = PLAYERS_DATABASE.find(p => p.id === id);
    const res = addPlayerToSquad(player);
    if (!res.success) alert(res.message);
}

function handlePlayerClick(id) {
    const player = appState.squad.find(p => p.id === id);
    if (!player) return;
    
    if (confirm(`Manage ${player.name}:\n[OK] Set as Captain\n[Cancel] Remove from Squad`)) {
        appState.captainId = player.id;
        saveAndRender();
    } else {
        removePlayerFromSquad(player.id);
    }
}

// ==========================================
// INITIALIZATION & TABS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        try { appState = { ...appState, ...JSON.parse(saved) }; } catch(e){}
    }
    renderUI();

    // Tab switching logic
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            
            e.target.classList.add("active");
            const tabName = e.target.dataset.tab;
            document.getElementById(`${tabName}-tab`).classList.add("active");
        });
    });

    // Market filters
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            currentFilter = e.target.dataset.pos;
            renderMarket();
        });
    });
});
