/**
 * EPL & Local Fantasy League - Main Application Logic
 * Built from scratch to ensure clean code, zero errors, and full modularity.
 */

// ==========================================
// 1. CONFIGURATION & STATE
// ==========================================
const CONFIG = {
    MAX_SQUAD_SIZE: 15,
    MAX_BUDGET: 100.0,
    STORAGE_KEY: "epl_fantasy_squad_v2"
};

let appState = {
    budget: CONFIG.MAX_BUDGET,
    players: [], // User's selected squad
    filter: "ALL"
};

// ==========================================
// 2. PLAYER DATABASE (Sample & Extensible)
// ==========================================
const PLAYERS_DATABASE = [
    // Goalkeepers (GKP)
    { id: 1, name: "I. Danlad", club: "Ethiopian Coffee", pos: "GKP", price: 5.0 },
    { id: 2, name: "T. Kibatu", club: "Ethiopian Coffee", pos: "GKP", price: 4.5 },
    
    // Defenders (DEF)
    { id: 3, name: "R. James", club: "Ethiopian Coffee", pos: "DEF", price: 5.0 },
    { id: 4, name: "A. Mengistu", club: "Saint George", pos: "DEF", price: 5.5 },
    { id: 5, name: "D. Bekele", club: "Saint George", pos: "DEF", price: 4.5 },

    // Midfielders (MID)
    { id: 6, name: "E. Selesh", club: "Saint George", pos: "MID", price: 4.5 },
    { id: 7, name: "B. Endale", club: "Saint George", pos: "MID", price: 5.0 },
    { id: 8, name: "S. Girma", club: "Ethiopian Coffee", pos: "MID", price: 6.5 },

    // Forwards (FWD)
    { id: 9, name: "A. Yalew", club: "Saint George", pos: "FWD", price: 8.5 },
    { id: 10, name: "T. Teshome", club: "Saint George", pos: "FWD", price: 7.5 },
    { id: 11, name: "M. Nasser", club: "Ethiopian Coffee", pos: "FWD", price: 8.0 }
];

// ==========================================
// 3. CORE SQUAD LOGIC
// ==========================================
function initApp() {
    loadFromLocalStorage();
    renderApp();
    setupEventListeners();
}

function addPlayer(playerId) {
    const player = PLAYERS_DATABASE.find(p => p.id === playerId);
    if (!player) return { success: false, message: "Player not found." };

    if (appState.players.length >= CONFIG.MAX_SQUAD_SIZE) {
        return { success: false, message: "Squad is full (Max 15 players)." };
    }

    if (appState.budget - player.price < 0) {
        return { success: false, message: "Not enough budget!" };
    }

    if (appState.players.some(p => p.id === playerId)) {
        return { success: false, message: "Player is already in your squad." };
    }

    appState.players.push(player);
    appState.budget = +(appState.budget - player.price).toFixed(1);
    
    saveToLocalStorage();
    renderApp();
    return { success: true, message: `${player.name} added successfully.` };
}

function removePlayer(playerId) {
    const index = appState.players.findIndex(p => p.id === playerId);
    if (index === -1) return { success: false, message: "Player not in squad." };

    const removed = appState.players.splice(index, 1)[0];
    appState.budget = +(appState.budget + removed.price).toFixed(1);

    saveToLocalStorage();
    renderApp();
    return { success: true, message: `${removed.name} removed.` };
}

// ==========================================
// 4. STORAGE HELPERS
// ==========================================
function saveToLocalStorage() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
            budget: appState.budget,
            players: appState.players
        }));
    } catch (e) {
        console.error("Failed to save local state:", e);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            appState.budget = data.budget;
            appState.players = data.players;
        }
    } catch (e) {
        console.error("Failed to load local state:", e);
    }
}

// ==========================================
// 5. UI RENDERING & DOM HOOKS
// ==========================================
function renderApp() {
    // Update budget and squad count counters if elements exist in HTML
    updateElementText("budget-counter", `£${appState.budget}m`);
    updateElementText("squad-count", `${appState.players.length}/15`);
    
    renderPlayerList();
    renderUserSquad();
}

function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function renderPlayerList() {
    const container = document.getElementById("player-list");
    if (!container) return;

    const filtered = appState.filter === "ALL" 
        ? PLAYERS_DATABASE 
        : PLAYERS_DATABASE.filter(p => p.pos === appState.filter);

    container.innerHTML = filtered.map(p => `
        <div class="player-card" data-id="${p.id}">
            <div class="info">
                <strong>${p.name}</strong>
                <span>${p.club} • ${p.pos} • £${p.price}m</span>
            </div>
            <button onclick="handleAddClick(${p.id})">Add</button>
        </div>
    `).join("");
}

function renderUserSquad() {
    const container = document.getElementById("user-squad-list");
    if (!container) return;

    container.innerHTML = appState.players.map(p => `
        <div class="squad-item" data-id="${p.id}">
            <span>${p.name} (${p.pos}) - £${p.price}m</span>
            <button onclick="handleRemoveClick(${p.id})">Remove</button>
        </div>
    `).join("");
}

// ==========================================
/* 6. EVENT HANDLERS */
// ==========================================
function handleAddClick(id) {
    const res = addPlayer(id);
    if (!res.success) alert(res.message);
}

function handleRemoveClick(id) {
    removePlayer(id);
}

function setupEventListeners() {
    // Optional: Filter buttons hookup if present in HTML
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            appState.filter = e.target.dataset.pos;
            renderPlayerList();
        });
    });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", initApp);

