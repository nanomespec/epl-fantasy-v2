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

const managerName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Nahom';
document.getElementById('manager-name').innerText = managerName;

// ==========================================
// 2. STATE & STORAGE
// ==========================================
const STORAGE_KEY = 'efpl_gateway_v2';

let appState = {
  bank: 100.0,
  slots: [
    // Starting XI (Formation: 1-4-4-2)
    { id: 1, pos: 'GKP', isBench: false, player: null },
    { id: 2, pos: 'DEF', isBench: false, player: null },
    { id: 3, pos: 'DEF', isBench: false, player: null },
    { id: 4, pos: 'DEF', isBench: false, player: null },
    { id: 5, pos: 'DEF', isBench: false, player: null },
    { id: 6, pos: 'MID', isBench: false, player: null },
    { id: 7, pos: 'MID', isBench: false, player: null },
    { id: 8, pos: 'MID', isBench: false, player: null },
    { id: 9, pos: 'MID', isBench: false, player: null },
    { id: 10, pos: 'FWD', isBench: false, player: null },
    { id: 11, pos: 'FWD', isBench: false, player: null },
    // Bench Substitutes (4)
    { id: 12, pos: 'GKP', isBench: true, player: null },
    { id: 13, pos: 'DEF', isBench: true, player: null },
    { id: 14, pos: 'MID', isBench: true, player: null },
    { id: 15, pos: 'FWD', isBench: true, player: null }
  ]
};

// ==========================================
// 3. COMPLETE 16-TEAM PLAYER MARKET DATABASE
// ==========================================
const playerMarket = [
  // 1. Saint George
  { id: 101, name: "T. Yohannes", club: "Saint George", pos: "GKP", price: 5.0 },
  { id: 102, name: "S. Mustefa", club: "Saint George", pos: "DEF", price: 5.5 },
  { id: 103, name: "A. Atula", club: "Saint George", pos: "MID", price: 6.5 },
  { id: 104, name: "T. Teshome", club: "Saint George", pos: "FWD", price: 7.5 },
  
  // 2. Ethiopian Coffee
  { id: 201, name: "I. Danlad", club: "Ethiopian Coffee", pos: "GKP", price: 5.0 },
  { id: 202, name: "R. James", club: "Ethiopian Coffee", pos: "DEF", price: 5.0 },
  { id: 203, name: "Y. Tariku", club: "Ethiopian Coffee", pos: "MID", price: 6.5 },
  { id: 204, name: "Z. Abate", club: "Ethiopian Coffee", pos: "FWD", price: 7.5 },

  // 3. Mechal SC
  { id: 301, name: "D. Mamo", club: "Mechal", pos: "GKP", price: 5.0 },
  { id: 302, name: "A. Tamene", club: "Mechal", pos: "DEF", price: 5.5 },
  { id: 303, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0 },
  { id: 304, name: "A. Nasir", club: "Mechal", pos: "FWD", price: 9.0 },

  // 4. Sidama Coffee
  { id: 401, name: "C. Lo Ndoye", club: "Sidama Coffee", pos: "GKP", price: 5.0 },
  { id: 402, name: "Y. Baye", club: "Sidama Coffee", pos: "DEF", price: 5.0 },
  { id: 403, name: "S. Dagnachew", club: "Sidama Coffee", pos: "MID", price: 7.0 },
  { id: 404, name: "A. Yalew", club: "Sidama Coffee", pos: "FWD", price: 8.5 },

  // 5. Hawassa City
  { id: 501, name: "S. Habtamu", club: "Hawassa City", pos: "GKP", price: 4.5 },
  { id: 502, name: "S. Wodesa", club: "Hawassa City", pos: "DEF", price: 5.0 },
  { id: 503, name: "A. Demissie", club: "Hawassa City", pos: "MID", price: 6.5 },
  { id: 504, name: "G. Kebede", club: "Hawassa City", pos: "FWD", price: 7.5 },

  // 6. Fasil Kenema
  { id: 601, name: "M. Pouaty", club: "Fasil Kenema", pos: "GKP", price: 5.0 },
  { id: 602, name: "M. Debebe", club: "Fasil Kenema", pos: "DEF", price: 5.0 },
  { id: 603, name: "Y. Yohannis", club: "Fasil Kenema", pos: "MID", price: 6.5 },
  { id: 604, name: "A. Gidey", club: "Fasil Kenema", pos: "FWD", price: 7.5 },

  // 7. Bahir Dar City
  { id: 701, name: "P. S. Ndiaye", club: "Bahir Dar City", pos: "GKP", price: 5.0 },
  { id: 702, name: "M. Kassa", club: "Bahir Dar City", pos: "DEF", price: 5.0 },
  { id: 703, name: "B. Tigabu", club: "Bahir Dar City", pos: "MID", price: 6.5 },
  { id: 704, name: "A. Tefera", club: "Bahir Dar City", pos: "FWD", price: 7.0 },

  // 8. CBE SA
  { id: 801, name: "A. Desta", club: "CBE SA", pos: "GKP", price: 5.0 },
  { id: 802, name: "C. Amankwah", club: "CBE SA", pos: "DEF", price: 5.5 },
  { id: 803, name: "Z. Abebe", club: "CBE SA", pos: "MID", price: 6.5 },
  { id: 804, name: "D. Yohannes", club: "CBE SA", pos: "FWD", price: 8.0 },

  // 9. Ethiopian Insurance
  { id: 901, name: "A. Nuri", club: "Ethiopian Insurance", pos: "GKP", price: 5.0 },
  { id: 902, name: "I. Abdul-Ganiyu", club: "Ethiopian Insurance", pos: "DEF", price: 5.0 },
  { id: 903, name: "D. Damisse", club: "Ethiopian Insurance", pos: "MID", price: 6.0 },
  { id: 904, name: "W. Gezahegn", club: "Ethiopian Insurance", pos: "FWD", price: 7.0 },

  // 10. Adama City
  { id: 1001, name: "W. Gedamu", club: "Adama City", pos: "GKP", price: 4.5 },
  { id: 1002, name: "F. Alemu", club: "Adama City", pos: "DEF", price: 5.0 },
  { id: 1003, name: "B. Tadesse", club: "Adama City", pos: "MID", price: 6.0 },
  { id: 1004, name: "K. Osei", club: "Adama City", pos: "FWD", price: 7.5 },

  // 11. Hadiya Hossana
  { id: 1101, name: "M. Shanko", club: "Hadiya Hossana", pos: "GKP", price: 4.5 },
  { id: 1102, name: "E. Tamiru", club: "Hadiya Hossana", pos: "DEF", price: 5.0 },
  { id: 1103, name: "B. Assefa", club: "Hadiya Hossana", pos: "MID", price: 6.0 },
  { id: 1104, name: "S. Oukri", club: "Hadiya Hossana", pos: "FWD", price: 7.0 },

  // 12. Dire Dawa City
  { id: 1201, name: "T. Aschalew", club: "Dire Dawa City", pos: "GKP", price: 4.5 },
  { id: 1202, name: "A. Mengistu", club: "Dire Dawa City", pos: "DEF", price: 4.5 },
  { id: 1203, name: "E. Bekele", club: "Dire Dawa City", pos: "MID", price: 6.0 },
  { id: 1204, name: "O. Okiki", club: "Dire Dawa City", pos: "FWD", price: 7.0 },

  // 13. Welayta Dicha
  { id: 1301, name: "R. Ismael", club: "Welayta Dicha", pos: "GKP", price: 4.5 },
  { id: 1302, name: "G. Chala", club: "Welayta Dicha", pos: "DEF", price: 5.0 },
  { id: 1303, name: "A. Mohammed", club: "Welayta Dicha", pos: "MID", price: 6.0 },
  { id: 1304, name: "B. Girma", club: "Welayta Dicha", pos: "FWD", price: 7.0 },

  // 14. Arba Minch City
  { id: 1401, name: "E. Mulugeta", club: "Arba Minch City", pos: "GKP", price: 4.5 },
  { id: 1402, name: "B. Zerihun", club: "Arba Minch City", pos: "DEF", price: 4.5 },
  { id: 1403, name: "T. Wakjira", club: "Arba Minch City", pos: "MID", price: 5.5 },
  { id: 1404, name: "Y. Getachew", club: "Arba Minch City", pos: "FWD", price: 6.5 },

  // 15. Legetafo Legedadi
  { id: 1501, name: "S. Negash", club: "Legetafo", pos: "GKP", price: 4.5 },
  { id: 1502, name: "D. Hunde", club: "Legetafo", pos: "DEF", price: 4.5 },
  { id: 1503, name: "M. Kemal", club: "Legetafo", pos: "MID", price: 5.5 },
  { id: 1504, name: "K. Nasir", club: "Legetafo", pos: "FWD", price: 6.5 },

  // 16. Ethio Electric
  { id: 1601, name: "B. Haile", club: "Ethio Electric", pos: "GKP", price: 4.5 },
  { id: 1602, name: "N. Kassim", club: "Ethio Electric", pos: "DEF", price: 4.5 },
  { id: 1603, name: "H. Kedir", club: "Ethio Electric", pos: "MID", price: 5.5 },
  { id: 1604, name: "A. Wondimu", club: "Ethio Electric", pos: "FWD", price: 6.5 }
];

let activeSlotId = null;
let currentPositionFilter = null;

// ==========================================
// 4. STORAGE & UI RENDERING
// ==========================================
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      appState = JSON.parse(saved);
    } catch (e) {
      console.error("Error loading saved state", e);
    }
  }
  renderPitch();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function renderPitch() {
  const rows = {
    GKP: document.getElementById('row-GKP'),
    DEF: document.getElementById('row-DEF'),
    MID: document.getElementById('row-MID'),
    FWD: document.getElementById('row-FWD'),
    BENCH: document.getElementById('row-BENCH')
  };

  Object.values(rows).forEach(r => r.innerHTML = '');

  let filledCount = 0;

  appState.slots.forEach(s => {
    const targetRow = s.isBench ? rows.BENCH : rows[s.pos];
    const slotEl = document.createElement('div');
    slotEl.className = `slot ${s.player ? 'filled' : ''}`;

    if (s.player) {
      filledCount++;
      slotEl.innerHTML = `
        <div class="slot-btn">👕</div>
        <div class="slot-label">${s.player.name}</div>
        <div class="slot-sub">ETB ${s.player.price}M</div>
      `;
      slotEl.onclick = () => removePlayer(s.id);
    } else {
      slotEl.innerHTML = `
        <div class="slot-btn">+</div>
        <div class="slot-label">${s.pos}</div>
        <div class="slot-sub">${s.isBench ? 'Bench' : 'Select'}</div>
      `;
      slotEl.onclick = () => openModal(s.id, s.pos);
    }

    targetRow.appendChild(slotEl);
  });

  document.getElementById('squad-count').innerText = `${filledCount}/15`;
  document.getElementById('bank-val').innerText = `ETB ${appState.bank.toFixed(1)}M`;
}

// ==========================================
// 5. MODAL & PLAYER SELECTION LOGIC
// ==========================================
function openModal(slotId, position) {
  activeSlotId = slotId;
  currentPositionFilter = position;
  document.getElementById('modal-title').innerText = `Select ${position}`;
  document.getElementById('modal-search').value = '';
  
  renderModalList();
  document.getElementById('selection-modal').style.display = 'flex';
}

function renderModalList() {
  const listEl = document.getElementById('player-options-list');
  listEl.innerHTML = '';

  const searchQuery = document.getElementById('modal-search').value.toLowerCase();
  const selectedPlayerIds = appState.slots.filter(s => s.player).map(s => s.player.id);

  const available = playerMarket.filter(p => {
    const matchPos = p.pos === currentPositionFilter;
    const notSelected = !selectedPlayerIds.includes(p.id);
    const matchSearch = p.name.toLowerCase().includes(searchQuery) || p.club.toLowerCase().includes(searchQuery);
    return matchPos && notSelected && matchSearch;
  });

  if (available.length === 0) {
    listEl.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px;">No matching players found.</p>';
    return;
  }

  available.forEach(p => {
    const item = document.createElement('div');
    item.className = 'player-option';
    item.innerHTML = `
      <div>
        <strong>${p.name}</strong> <span style="font-size:11px; color:var(--text-muted);">(${p.club})</span><br/>
        <span style="font-size:11px; color:var(--accent-color);">ETB ${p.price}M</span>
      </div>
      <button class="btn-select" onclick="selectPlayer(${p.id})">Add</button>
    `;
    listEl.appendChild(item);
  });
}

function filterModalPlayers() {
  renderModalList();
}

function selectPlayer(playerId) {
  const player = playerMarket.find(p => p.id === playerId);
  if (!player) return;

  // Check budget limit
  if (appState.bank < player.price) {
    alert("Insufficient budget remaining!");
    return;
  }

  // Check Max 3 Players per Club rule
  const clubCount = appState.slots.filter(s => s.player && s.player.club === player.club).length;
  if (clubCount >= 3) {
    alert(`You can only select a maximum of 3 players from ${player.club}!`);
    return;
  }

  const slotIndex = appState.slots.findIndex(s => s.id === activeSlotId);
  if (slotIndex !== -1) {
    appState.bank -= player.price;
    appState.slots[slotIndex].player = player;
    saveState();
    renderPitch();
    closeModal();
  }
}

function removePlayer(slotId) {
  const slotIndex = appState.slots.findIndex(s => s.id === slotId);
  if (slotIndex !== -1 && appState.slots[slotIndex].player) {
    appState.bank += appState.slots[slotIndex].player.price;
    appState.slots[slotIndex].player = null;
    saveState();
    renderPitch();
  }
}

function closeModal() {
  document.getElementById('selection-modal').style.display = 'none';
  activeSlotId = null;
  currentPositionFilter = null;
}

// Initialize App on load
loadState();
