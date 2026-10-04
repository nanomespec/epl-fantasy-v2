/**
 * EPL & Local Fantasy League - Full FPL Engine v2.0
 */

const CONFIG = {
    MAX_BUDGET: 100.0,
    POS_LIMITS: { GKP: 2, DEF: 5, MID: 5, FWD: 3 },
    MAX_PER_CLUB: 3,
    STORAGE_KEY: "epl_fantasy_full_engine"
};

let appState = {
    budget: CONFIG.MAX_BUDGET,
    squad: [],       // Array of player objects (up to 15)
    startingXI: [],  // Array of 11 player IDs
    bench: [],       // Array of 4 player IDs (ordered priority)
    captainId: null,
    viceCaptainId: null
};

// ==========================================
// PLAYER DATABASE
// ==========================================
const PLAYERS_DATABASE = [
    { id: 1, name: "I. Danlad", club: "Ethiopian Coffee", pos: "GKP", price: 5.0 },
    { id: 2, name: "T. Kibatu", club: "Ethiopian Coffee", pos: "GKP", price: 4.5 },
    { id: 3, name: "R. James", club: "Ethiopian Coffee", pos: "DEF", price: 5.0 },
    { id: 4, name: "A. Mengistu", club: "Saint George", pos: "DEF", price: 5.5 },
    { id: 5, name: "D. Bekele", club: "Saint George", pos: "DEF", price: 4.5 },
    { id: 6, name: "E. Selesh", club: "Saint George", pos: "MID", price: 4.5 },
    { id: 7, name: "B. Endale", club: "Saint George", pos: "MID", price: 5.0 },
    { id: 8, name: "S. Girma", club: "Ethiopian Coffee", pos: "MID", price: 6.5 },
    { id: 9, name: "A. Yalew", club: "Saint George", pos: "FWD", price: 8.5 },
    { id: 10, name: "T. Teshome", club: "Saint George", pos: "FWD", price: 7.5 },
    { id: 11, name: "M. Nasser", club: "Ethiopian Coffee", pos: "FWD", price: 8.0 }
];

let currentFilter = "ALL";

// ==========================================
// SQUAD VALIDATION & ADDITION
// ==========================================
function addPlayerToSquad(player) {
    if (appState.squad.length >= 15) {
        return { success: false, message: "Your 15-player squad is full." };
    }
    if (appState.budget - player.price < 0) {
        return { success: false, message: "Not enough budget left (£100.0m limit)." };
    }
    
    const posCount = appState.squad.filter(p => p.pos === player.pos).length;
    if (posCount >= CONFIG.POS_LIMITS[player.pos]) {
        return { success: false, message: `You already have the maximum number of ${player.pos}s.` };
    }

    const clubCount = appState.squad.filter(p => p.club === player.club).length;
    if (clubCount >= CONFIG.MAX_PER_CLUB) {
        return { success: false, message: `Max limit of 3 players reached for ${player.club}.` };
    }

    appState.squad.push(player);
    appState.budget = +(appState.budget - player.price).toFixed(1);

    updateLineupDefaults();
    saveAndRender();
    return { success: true, message: `${player.name} added to squad.` };
}

function removePlayerFromSquad(playerId) {
    const index = appState.squad.findIndex(p => p.id === playerId);
    if (index === -1) return { success: false, message: "Player not found in squad." };

    const removed = appState.squad.splice(index, 1)[0];
    appState.budget = +(appState.budget + removed.price).toFixed(1);

    appState.startingXI = appState.startingXI.filter(id => id !== playerId);
    appState.bench = appState.bench.filter(id => id !== playerId);
    if (appState.captainId === playerId) appState.captainId = null;
    if (appState.viceCaptainId === playerId) appState.viceCaptainId = null;

    updateLineupDefaults();
    saveAndRender();
    return { success: true, message: `${removed.name} removed from squad.` };
}

// ==========================================
// LINEUP & FORMATION DEFAULTS
// ==========================================
function updateLineupDefaults() {
    if (appState.startingXI.length + appState.bench.length !== appState.squad.length) {
        appState.startingXI = appState.squad.slice(0, 11).map(p => p.id);
        appState.bench = appState.squad.slice(11, 15).map(p => p.id);
    }
}

// ==========================================
// PITCH VIEW & SUBSTITUTION LOGIC
// ==========================================
function subPlayer(inPlayerId, outPlayerId) {
    const isStartingInXI = appState.startingXI.includes(inPlayerId);
    const isBenchInXI = appState.startingXI.includes(outPlayerId);

    if (isStartingInXI === isBenchInXI) {
        return { success: false, message: "One player must be from the Starting XI and one from the Bench." };
    }

    const targetXIId = isStartingInXI ? outPlayerId : inPlayerId; 
    const targetBenchId = isStartingInXI ? inPlayerId : outPlayerId; 

    const tempXI = appState.startingXI.map(id => id === targetXIId ? targetBenchId : id);
    
    const validationResult = validateCustomFormation(tempXI);
    if (!validationResult.valid) {
        return { success: false, message: validationResult.message };
    }

    appState.startingXI = tempXI;
    appState.bench = appState.squad
        .map(p => p.id)
        .filter(id => !appState.startingXI.includes(id));

    saveAndRender();
    return { success: true, message: "Successful substitution!" };
}

function validateCustomFormation(xiIds) {
    const starters = appState.squad.filter(p => xiIds.includes(p.id));
    const gkp = starters.filter(p => p.pos === 'GKP').length;
    const def = starters.filter(p => p.pos === 'DEF').length;
    const mid = starters.filter(p => p.pos === 'MID').length;
    const fwd = starters.filter(p => p.pos === 'FWD').length;

    if (gkp !== 1) return { valid: false, message: "Formation must have exactly 1 Goalkeeper." };
    if (def < 3) return { valid: false, message: "Formation must have at least 3 Defenders." };
    if (mid < 2) return { valid: false, message: "Formation must have at least 2 Midfielders." };
    if (fwd < 1) return { valid: false, message: "Formation must have at least 1 Forward." };

    return { valid: true };
}

// ==========================================
// UI RENDERING & DOM HOOKS
// ==========================================
function renderUI() {
    const budgetEl = document.getElementById("budget-counter");
    const squadCountEl = document.getElementById("squad-count");
    
    if (budgetEl) budgetEl.textContent = `£${appState.budget}m`;
    if (squadCountEl) squadCountEl.textContent = `${appState.squad.length}/15`;

    renderMarket();
    renderSquadList();
    renderPitchAndBench();
}

function renderMarket() {
    const container = document.getElementById("player-list");
    if (!container) return;

    const filtered = currentFilter === "ALL" 
        ? PLAYERS_DATABASE 
        : PLAYERS_DATABASE.filter(p => p.pos === currentFilter);

    container.innerHTML = filtered.map(p => {
        const isOwned = appState.squad.some(s => s.id === p.id);
        return `
            <div class="player-card">
                <div>
                    <strong>${p.name}</strong><br>
                    <span>${p.club} • ${p.pos} • £${p.price}m</span>
                </div>
                <button ${isOwned ? 'disabled style="opacity:0.5"' : ''} onclick="handleAdd(${p.id})">
                    ${isOwned ? 'Owned' : 'Add'}
                </button>
            </div>
        `;
    }).join("");
}

function renderSquadList() {
    const container = document.getElementById("user-squad-list");
    if (!container) return;

    if (appState.squad.length === 0) {
        container.innerHTML = `<p style="color: #a1a1aa; font-size: 0.9rem;">Your squad is empty. Add players from the market!</p>`;
        return;
    }

    container.innerHTML = appState.squad.map(p => `
        <div class="squad-item">
            <span><strong>${p.name}</strong> (${p.pos} - ${p.club}) - £${p.price}m</span>
            <button onclick="handleRemove(${p.id})" style="background:#ff4757; color:#fff;">Remove</button>
        </div>
    `).join("");
}

function renderPitchAndBench() {
    const pitchContainer = document.getElementById("pitch-container");
    const benchContainer = document.getElementById("bench-container");
    if (!pitchContainer || !benchContainer) return;

    const starters = appState.squad.filter(p => appState.startingXI.includes(p.id));
    const benchPlayers = appState.squad.filter(p => appState.bench.includes(p.id));

    pitchContainer.innerHTML = `<h3>Starting XI (${starters.length}/11)</h3>` + starters.map(p => `
        <div class="squad-item">
            <span>⭐ ${p.name} [${p.pos}]</span>
        </div>
    `).join("");

    benchContainer.innerHTML = `<h3>Bench (${benchPlayers.length}/4)</h3>` + benchPlayers.map(p => `
        <div class="squad-item" style="opacity: 0.8;">
            <span>🔄 ${p.name} [${p.pos}]</span>
        </div>
    `).join("");
}

// Global Event Triggers
function handleAdd(id) {
    const player = PLAYERS_DATABASE.find(p => p.id === id);
    const res = addPlayerToSquad(player);
    if (!res.success) alert(res.message);
}

function handleRemove(id) {
    const res = removePlayerFromSquad(id);
    if (!res.success) alert(res.message);
}

// ==========================================
// PERSISTENCE & INITIALIZATION
// ==========================================
function saveAndRender() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appState));
    renderUI();
}

function loadGame() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            appState = { ...appState, ...data };
        } catch (e) {
            console.error("Error loading saved game", e);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    renderUI();

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            currentFilter = e.target.dataset.pos;
            renderMarket();
        });
    });
});
