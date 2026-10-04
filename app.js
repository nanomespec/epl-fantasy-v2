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

    updateLineupDefaults();
    saveAndRender();
    return { success: true, message: `${player.name} added to squad.` };
}

function removePlayerFromSquad(playerId) {
    const index = appState.squad.findIndex(p => p.id === playerId);
    if (index === -1) return { success: false, message: "Player not found in squad." };

    const removed = appState.squad.splice(index, 1)[0];
    appState.budget = +(appState.budget + removed.price).toFixed(1);

    // Clean up arrays
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
    // If squad size changes and arrays desync, re-populate starting XI and bench
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

    // One must be in starting XI and the other on the bench
    if (isStartingInXI === isBenchInXI) {
        return { success: false, message: "One player must be from the Starting XI and one from the Bench." };
    }

    const targetXIId = isStartingInXI ? outPlayerId : inPlayerId; 
    const targetBenchId = isStartingInXI ? inPlayerId : outPlayerId; 

    // Temporarily simulate swap to check valid formations
    const tempXI = appState.startingXI.map(id => id === targetXIId ? targetBenchId : id);
    
    const validationResult = validateCustomFormation(tempXI);
    if (!validationResult.valid) {
        return { success: false, message: validationResult.message };
    }

    // Apply swap
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
// PERSISTENCE & UI HOOKS
// ==========================================
function saveAndRender() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(appState));
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

// Initialize on load
loadGame();
