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
    squad: [],       // Array of 15 player objects
    startingXI: [],  // Array of 11 player IDs
    bench: [],       // Array of 4 player IDs (ordered priority)
    captainId: null,
    viceCaptainId: null
};

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
    
    // Check position limits
    const posCount = appState.squad.filter(p => p.pos === player.pos).length;
    if (posCount >= CONFIG.POS_LIMITS[player.pos]) {
        return { success: false, message: `You already have the maximum number of ${player.pos}s.` };
    }

    // Check club limit (Max 3 per club)
    const clubCount = appState.squad.filter(p => p.club === player.club).length;
    if (clubCount >= CONFIG.MAX_PER_CLUB) {
        return { success: false, message: `Max limit of 3 players reached for ${player.club}.` };
    }

    appState.squad.push(player);
    appState.budget = +(appState.budget - player.price).toFixed(1);

    // Auto-assign to starting XI or bench if space permits
    updateLineupDefaults();
    saveAndRender();
    return { success: true, message: `${player.name} added to squad.` };
}

function removePlayerFromSquad(playerId) {
    const index = appState.squad.findIndex(p => p.id === playerId);
    if (index === -1) return { success: false, message: "Player not found in squad." };

    const removed = appState.squad.splice(index, 1)[0];
    appState.budget = +(appState.budget + removed.price).toFixed(1);

    // Clean up captain/XI/bench arrays
    appState.startingXI = appState.startingXI.filter(id => id !== playerId);
    appState.bench = appState.bench.filter(id => id !== playerId);
    if (appState.captainId === playerId) appState.captainId = null;
    if (appState.viceCaptainId === playerId) appState.viceCaptainId = null;

    updateLineupDefaults();
    saveAndRender();
    return { success: true, message: `${removed.name} removed from squad.` };
}

// ==========================================
// LINEUP & FORMATION LOGIC
// ==========================================
function updateLineupDefaults() {
    // If squad is newly forming, auto-populate starting XI (1 GKP, 4 DEF, 4 MID, 2 FWD = 11) 
    // and bench (1 GKP, 3 outfield) if unassigned.
    if (appState.startingXI.length + appState.bench.length !== appState.squad.length) {
        appState.startingXI = appState.squad.slice(0, 11).map(p => p.id);
        appState.bench = appState.squad.slice(11, 15).map(p => p.id);
    }
}

function validateFormation() {
    const starters = appState.squad.filter(p => appState.startingXI.includes(p.id));
    const gkpCount = starters.filter(p => p.pos === 'GKP').length;
    const defCount = starters.filter(p => p.pos === 'DEF').length;
    const midCount = starters.filter(p => p.pos === 'MID').length;
    const fwdCount = starters.filter(p => p.pos === 'FWD').length;

    // FPL Rule: Exactly 1 GKP, at least 3 DEF, at least 2 MID, at least 1 FWD
    if (gkpCount !== 1) return { valid: false, message: "Starting XI must include exactly 1 Goalkeeper." };
    if (defCount < 3) return { valid: false, message: "Starting XI must include at least 3 Defenders." };
    if (midCount < 2) return { valid: false, message: "Starting XI must include at least 2 Midfielders." };
    if (fwdCount < 1) return { valid: false, message: "Starting XI must include at least 1 Forward." };

    return { valid: true };
}

function setCaptain(playerId) {
    if (!appState.startingXI.includes(playerId)) {
        return { success: false, message: "Captain must be chosen from your Starting XI." };
    }
    appState.captainId = playerId;
    saveAndRender();
    return { success: true, message: "Captain assigned successfully." };
}

function setViceCaptain(playerId) {
    if (!appState.startingXI.includes(playerId)) {
        return { success: false, message: "Vice-Captain must be chosen from your Starting XI." };
    }
    appState.viceCaptainId = playerId;
    saveAndRender();
    return { success: true, message: "Vice-Captain assigned successfully." };
}

// ==========================================
// PERSISTENCE & UI HOOKS
// ==========================================
function saveAndRender() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appState));
    // Trigger UI update functions in your view
    if (typeof renderUI === "function") renderUI();
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
