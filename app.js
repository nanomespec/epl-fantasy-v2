// ==========================================
// 1. TELEGRAM & USER INITIALIZATION
// ==========================================
let tgUser = null;
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
  if (window.Telegram.WebApp.enableClosingConfirmation) {
    window.Telegram.WebApp.enableClosingConfirmation();
  }
  tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
}

const managerName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Local Manager';
const managerId = tgUser?.id || 'local_user';

// Initialize Header Info
document.getElementById('manager-name').innerText = managerName;

// ==========================================
// 2. STATE & STORAGE
// ==========================================
const STORAGE_KEY = 'efpl_official_v11';

let appState = {
  bank: 100.0,
  points: 0,
  squad: []
};

// Player Market Database
const playerMarket = [
  { id: 1001, name: "B. Alemu", club: "St. George", pos: "GKP", price: 5.5, form: 6.2 },
  { id: 1002, name: "S. Hamid", club: "St. George", pos: "DEF", price: 6.0, form: 5.4 },
  { id: 1003, name: "G. Gugsa", club: "Fasil Kenema", pos: "MID", price: 7.5, form: 7.1 },
  { id: 1004, name: "A. Gebremichael", club: "Ethiopia Bunna", pos: "FWD", price: 8.5, form: 8.0 },
  { id: 1005, name: "F. Mohammed", club: "Bahir Dar", pos: "MID", price: 6.5, form: 5.8 },
  { id: 1006, name: "M. Debebe", club: "Defense Force", pos: "DEF", price: 5.0, form: 4.9 },
  { id: 1007, name: "C. Menkir", club: "Hawassa City", pos: "GKP", price: 4.5, form: 3.8 },
  { id: 1008, name: "A. Hussien", club: "Adama City", pos: "FWD", price: 5.5, form: 4.6 }
];

// ==========================================
// 3. CORE LOGIC & FUNCTIONS
// ==========================================

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appState = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse local storage data", e);
    }
  }
  
  // Default squad setup if empty
  if (!appState.squad || appState.squad.length === 0) {
    appState.squad = [
      { id: 1001, name: "B. Alemu", pos: "GKP", isBench: false },
      { id: 1002, name: "S. Hamid", pos: "DEF", isBench: false },
      { id: 1006, name: "M. Debebe", pos: "DEF", isBench: false },
      { id: 1003, name: "G. Gugsa", pos: "MID", isBench: false },
      { id: 1005, name: "F. Mohammed", pos: "MID", isBench: false },
      { id: 1004, name: "A. Gebremichael", pos: "FWD", isBench: false },
      { id: 1007, name: "C. Menkir", pos: "GKP", isBench: true },
      { id: 1008, name: "A. Hussien", pos: "FWD", isBench: true }
    ];
  }
  updateUI();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function updateUI() {
  document.getElementById('bank-val').innerText = `ETB ${appState.bank.toFixed(1)}M`;
  document.getElementById('points-val').innerText = appState.points;
  renderPitch();
  renderMarket(playerMarket);
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

  document.getElementById(`tab-${tabId}`).classList.add('active');
  event.currentTarget.classList.add('active');
}

function renderPitch() {
  const rows = {
    GKP: document.getElementById('row-GKP'),
    DEF: document.getElementById('row-DEF'),
    MID: document.getElementById('row-MID'),
    FWD: document.getElementById('row-FWD'),
    BENCH: document.getElementById('row-BENCH')
  };

  // Clear rows
  Object.values(rows).forEach(r => r.innerHTML = '');

  appState.squad.forEach(player => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
      <div class="player-icon">👕</div>
      <div class="player-name">${player.name}</div>
      <div class="player-price">${player.pos}</div>
    `;

    if (player.isBench) {
      rows.BENCH.appendChild(card);
    } else if (rows[player.pos]) {
      rows[player.pos].appendChild(card);
    }
  });
}

function renderMarket(list) {
  const container = document.getElementById('market-list');
  container.innerHTML = '';

  list.forEach(p => {
    const isOwned = appState.squad.some(s => s.id === p.id);
    const item = document.createElement('div');
    item.className = 'market-item';
    item.innerHTML = `
      <div>
        <strong>${p.name}</strong> (${p.pos}) - <small>${p.club}</small><br/>
        <span style="font-size:12px; color:#94a3b8;">Price: ETB ${p.price}M | Form: ${p.form}</span>
      </div>
      <button class="btn-add" ${isOwned ? 'disabled style="opacity:0.5"' : ''} onclick="buyPlayer(${p.id})">
        ${isOwned ? 'Owned' : 'Buy'}
      </button>
    `;
    container.appendChild(item);
  });
}

function filterMarket() {
  const search = document.getElementById('player-search').value.toLowerCase();
  const pos = document.getElementById('pos-filter').value;

  const filtered = playerMarket.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search) || p.club.toLowerCase().includes(search);
    const matchesPos = pos === 'ALL' || p.pos === pos;
    return matchesSearch && matchesPos;
  });

  renderMarket(filtered);
}

function buyPlayer(playerId) {
  const player = playerMarket.find(p => p.id === playerId);
  if (!player) return;

  if (appState.bank < player.price) {
    alert("Not enough funds in bank!");
    return;
  }

  appState.bank -= player.price;
  appState.squad.push({ id: player.id, name: player.name, pos: player.pos, isBench: true });
  saveState();
  updateUI();
}

// Start application
loadState();
