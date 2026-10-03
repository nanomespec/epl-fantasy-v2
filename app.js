// ==========================================
// 1. TELEGRAM WEBAPP INIT
// ==========================================
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg) {
  try { tg.expand(); tg.ready(); } catch (e) {}
}

const userId = tg?.initDataUnsafe?.user?.id || 'guest_user';
const STORAGE_KEY = `epl_fantasy_local_${userId}`;

// ==========================================
// 2. PLAYER MARKET DATASET
// ==========================================
const playerMarket = [
  { id: 1, name: "S. Bahiru", club: "Saint George", pos: "GKP", price: 5.5, goals: 0, assists: 0, cleans: 3, form: 5.2 },
  { id: 2, name: "A. Nuri", club: "Ethiopian Coffee", pos: "GKP", price: 5.0, goals: 0, assists: 0, cleans: 2, form: 4.1 },
  { id: 3, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, goals: 1, assists: 1, cleans: 3, form: 6.0 },
  { id: 4, name: "E. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, goals: 0, assists: 2, cleans: 3, form: 5.8 },
  { id: 5, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, goals: 0, assists: 1, cleans: 2, form: 4.5 },
  { id: 6, name: "S. Bereket", club: "CBE SA", pos: "DEF", price: 5.0, goals: 1, assists: 0, cleans: 2, form: 4.8 },
  { id: 7, name: "Y. Endale", club: "Fasil Kenema", pos: "DEF", price: 5.0, goals: 0, assists: 0, cleans: 1, form: 3.5 },
  { id: 8, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.0, goals: 3, assists: 2, cleans: 0, form: 7.2 },
  { id: 9, name: "E. Tadesse", club: "Ethiopian Coffee", pos: "MID", price: 7.5, goals: 4, assists: 1, cleans: 0, form: 7.8 },
  { id: 10, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.5, goals: 2, assists: 4, cleans: 0, form: 6.9 },
  { id: 11, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, goals: 2, assists: 2, cleans: 0, form: 6.1 },
  { id: 12, name: "A. Okutu", club: "Saint George", pos: "FWD", price: 9.0, goals: 6, assists: 1, cleans: 0, form: 8.5 },
  { id: 13, name: "H. Konkoni", club: "Ethiopian Coffee", pos: "FWD", price: 8.0, goals: 4, assists: 2, cleans: 0, form: 7.0 },
  { id: 14, name: "D. Nathaniel", club: "CBE SA", pos: "FWD", price: 8.5, goals: 5, assists: 0, cleans: 0, form: 7.4 },
  { id: 15, name: "B. Gugsa", club: "Fasil Kenema", pos: "FWD", price: 8.0, goals: 3, assists: 1, cleans: 0, form: 5.9 }
];

// ==========================================
// 3. STATE MANAGEMENT
// ==========================================
let mySquad = [];
let bankBalance = 100.0;
let stagedChip = null;      // Selected before confirmation
let activeChip = null;      // Locked in when gameweek triggers
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let totalPoints = 0;
let gameweek = 1;
let freeTransfers = 1;
let transfersMadeInGW = 0;
let myLeagues = ["Overall League"];
let activePlayerModalId = null;

const defaultStarterIds = [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13];

function setDefaultSquad() {
  mySquad = playerMarket.map((p) => ({
    ...p,
    purchasePrice: p.price,
    isStarter: defaultStarterIds.includes(p.id),
    isCaptain: p.id === 12,
    isViceCaptain: p.id === 13,
    gwPoints: 0
  }));
  bankBalance = parseFloat((100.0 - mySquad.reduce((sum, p) => sum + p.price, 0)).toFixed(1));
  freeTransfers = 1;
  transfersMadeInGW = 0;
  saveUserData();
}

function loadUserData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      mySquad = data.mySquad || [];
      bankBalance = data.bankBalance !== undefined ? data.bankBalance : 100.0;
      stagedChip = data.stagedChip || null;
      activeChip = data.activeChip || null;
      chipsUsed = data.chipsUsed || { wc: false, tc: false, bb: false, fh: false };
      totalPoints = data.totalPoints || 0;
      gameweek = data.gameweek || 1;
      freeTransfers = data.freeTransfers !== undefined ? data.freeTransfers : 1;
      transfersMadeInGW = data.transfersMadeInGW || 0;
      myLeagues = data.myLeagues || ["Overall League"];
    }
  } catch (e) {
    console.error("Storage load issue:", e);
  }

  if (!mySquad || mySquad.length === 0) {
    setDefaultSquad();
  }
}

function saveUserData() {
  try {
    const payload = { mySquad, bankBalance, stagedChip, activeChip, chipsUsed, totalPoints, gameweek, freeTransfers, transfersMadeInGW, myLeagues };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Storage save issue:", e);
  }
}

function resetSquadData() {
  localStorage.removeItem(STORAGE_KEY);
  totalPoints = 0;
  gameweek = 1;
  stagedChip = null;
  activeChip = null;
  chipsUsed = { wc: false, tc: false, bb: false, fh: false };
  setDefaultSquad();
  renderPitch();
  renderMarket();
  renderLeague();
}

// ==========================================
// 4. NAVIGATION & TABS
// ==========================================
function switchTab(tab) {
  ['pitch', 'transfers', 'league'].forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    const btn = document.getElementById(`btn-${t}`) || document.getElementById(`btn-${t === 'league' ? 'leagues' : t}`);
    if (el) el.classList.add('hidden');
    if (btn) btn.className = "flex-1 py-1 text-gray-400 font-bold";
  });
  
  const targetTab = document.getElementById(`tab-${tab}`);
  const targetBtn = document.getElementById(`btn-${tab}`) || document.getElementById(`btn-${tab === 'league' ? 'leagues' : tab}`);
  if (targetTab) targetTab.classList.remove('hidden');
  if (targetBtn) targetBtn.className = "flex-1 py-1 text-blue-400 font-bold";

  if (tab === 'transfers') renderMarket();
  if (tab === 'league') renderLeague();
}

// ==========================================
// 5. PITCH RENDERING & FPL MODAL ACTIONS
// ==========================================
function renderPitch() {
  const container = document.getElementById('pitch-container') || 
                    document.getElementById('squad-pitch') || 
                    document.querySelector('.green-pitch-container') ||
                    document.querySelector('main div');

  if (!container) return;

  if (!mySquad || mySquad.length === 0) {
    setDefaultSquad();
  }

  const starters = mySquad.filter(p => p.isStarter);
  const bench = mySquad.filter(p => !p.isStarter);

  const gkps = starters.filter(p => p.pos === 'GKP');
  const defs = starters.filter(p => p.pos === 'DEF');
  const mids = starters.filter(p => p.pos === 'MID');
  const fwds = starters.filter(p => p.pos === 'FWD');

  container.innerHTML = `
    <div class="flex flex-col justify-between w-full h-full p-2 space-y-1 overflow-y-auto">
      <!-- Pitch Area -->
      <div class="bg-gradient-to-b from-emerald-800 to-emerald-950 border border-emerald-600/50 rounded-xl p-2 flex flex-col justify-around min-h-[320px] shadow-inner relative">
        <div class="flex justify-center gap-2">${gkps.map(createPlayerCard).join('')}</div>
        <div class="flex justify-center gap-2 flex-wrap">${defs.map(createPlayerCard).join('')}</div>
        <div class="flex justify-center gap-2 flex-wrap">${mids.map(createPlayerCard).join('')}</div>
        <div class="flex justify-center gap-2 flex-wrap">${fwds.map(createPlayerCard).join('')}</div>
      </div>

      <!-- Bench Area -->
      <div class="bg-[#17212b]/95 border ${stagedChip === 'bb' || activeChip === 'bb' ? 'border-green-400 bg-green-950/30' : 'border-gray-700'} rounded-xl p-2 text-center w-full">
        <div class="flex justify-between items-center mb-1 px-1">
          <span class="text-[10px] font-bold ${stagedChip === 'bb' || activeChip === 'bb' ? 'text-green-400' : 'text-gray-300'} uppercase tracking-wider">
            Bench ${stagedChip === 'bb' ? '(Bench Boost Staged 🚀)' : (activeChip === 'bb' ? '(Bench Boost Active! 🚀)' : '')}
          </span>
        </div>
        <div class="flex justify-center gap-2 flex-wrap">${bench.map(createPlayerCard).join('')}</div>
      </div>
    </div>
    ${renderPlayerModal()}
  `;
  updateHeader();
  updateChipUI();
}

function createPlayerCard(p) {
  let badgeText = p.pos;
  if (p.isCaptain) badgeText += ' (C)';
  else if (p.isViceCaptain) badgeText += ' (VC)';

  return `
    <div onclick="openPlayerModal(${p.id})" class="bg-[#242f3d] border border-gray-600 hover:border-blue-400 rounded-lg p-1.5 text-center min-w-[70px] shadow-md cursor-pointer transition flex flex-col justify-between">
      <div class="text-[9px] text-blue-300 font-bold uppercase truncate">${badgeText}</div>
      <div class="text-[11px] font-bold text-white my-0.5 truncate max-w-[70px]">${p.name}</div>
      <div class="bg-[#17212b] border border-gray-700 rounded px-1 py-0.5 mt-0.5">
        <span class="text-[9px] text-gray-400 uppercase">Pts</span>
        <div class="text-[11px] font-black text-green-400">${p.gwPoints || 0}</div>
      </div>
    </div>
  `;
}

function openPlayerModal(id) {
  activePlayerModalId = id;
  renderPitch();
}

function closePlayerModal() {
  activePlayerModalId = null;
  renderPitch();
}

function renderPlayerModal() {
  if (!activePlayerModalId) return '';
  const p = mySquad.find(item => item.id === activePlayerModalId);
  if (!p) return '';

  return `
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-[#17212b] border border-gray-600 rounded-xl p-4 w-full max-w-xs shadow-2xl text-center">
        <div class="text-xs text-blue-400 font-bold uppercase">${p.pos} • ${p.club}</div>
        <div class="text-lg font-extrabold text-white my-1">${p.name}</div>
        <div class="text-xs text-gray-400 mb-4">Price: ${p.price}M ETB | Form: ${p.form}</div>
        
        <div class="space-y-2">
          <button onclick="togglePlayerPosition(${p.id})" class="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white shadow">
            ${p.isStarter ? '🔄 Move to Bench' : '⬆️ Substitute to Pitch'}
          </button>
          <button onclick="setCaptain(${p.id})" class="w-full py-2 bg-yellow-600/30 hover:bg-yellow-600/55 border border-yellow-500/50 rounded-lg text-xs font-bold text-yellow-400 shadow">
            👑 Make Captain (C)
          </button>
          <button onclick="setViceCaptain(${p.id})" class="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold text-gray-300 shadow">
            ⭐ Make Vice-Captain (VC)
          </button>
          <button onclick="closePlayerModal()" class="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-400 mt-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
}

function togglePlayerPosition(id) {
  const p = mySquad.find(item => item.id === id);
  if (!p) return;

  const startersCount = mySquad.filter(item => item.isStarter).length;
  if (p.isStarter && startersCount <= 11) {
    alert("You must maintain at least 11 starting players!");
    return;
  }
  if (!p.isStarter && startersCount >= 11) {
    const benchPlayer = mySquad.find(item => !item.isStarter && item.pos === p.pos);
    if (benchPlayer) {
      benchPlayer.isStarter = true;
    }
  }

  p.isStarter = !p.isStarter;
  activePlayerModalId = null;
  saveUserData();
  renderPitch();
}

function setCaptain(id) {
  mySquad.forEach(item => item.isCaptain = (item.id === id));
  activePlayerModalId = null;
  saveUserData();
  renderPitch();
}

function setViceCaptain(id) {
  mySquad.forEach(item => item.isViceCaptain = (item.id === id));
  activePlayerModalId = null;
  saveUserData();
  renderPitch();
}

// ==========================================
// 6. REAL FPL CHIPS (STAGED UNTIL CONFIRMED)
// ==========================================
function stageChip(chipName) {
  if (chipsUsed[chipName]) {
    return alert(`You have already used the ${chipName.toUpperCase()} chip this season! FPL rules allow each chip only once.`);
  }

  if (stagedChip === chipName) {
    stagedChip = null;
    alert(`Unselected ${chipName.toUpperCase()} chip.`);
  } else {
    stagedChip = chipName;
    alert(`Chip Staged: ${chipName.toUpperCase()}. Click 'Simulate Gameweek' to confirm and lock it in! 🚀`);
  }

  saveUserData();
  renderPitch();
}

function updateChipUI() {
  ['wc', 'tc', 'bb', 'fh'].forEach(chip => {
    const btn = document.getElementById(`btn-chip-${chip}`) || document.getElementById(`chip-${chip}`);
    if (btn) {
      if (stagedChip === chip) {
        btn.className = "flex-1 py-1.5 px-2 bg-amber-950/80 border border-amber-400 text-amber-300 rounded-lg text-xs font-bold shadow transition animate-pulse";
      } else if (chipsUsed[chip]) {
        btn.className = "flex-1 py-1.5 px-2 bg-gray-900/40 border border-gray-800 text-gray-600 rounded-lg text-xs font-bold cursor-not-allowed";
      } else {
        btn.className = "flex-1 py-1.5 px-2 bg-[#242f3d] border border-gray-700 text-gray-300 rounded-lg text-xs font-bold hover:border-gray-500 transition";
      }
    }
  });
}

// ==========================================
// 7. MARKET & TRANSFERS
// ==========================================
function renderMarket() {
  const list = document.getElementById('market-list');
  if (!list) return;

  list.innerHTML = playerMarket.map(p => {
    const inSquad = mySquad.some(s => s.id === p.id);
    return `
      <div class="bg-[#242f3d] p-3 rounded-lg border border-gray-700 flex justify-between items-center mb-2">
        <div>
          <div class="font-bold text-sm text-white">${p.name} <span class="text-xs font-normal text-gray-400">(${p.club})</span></div>
          <div class="text-xs text-blue-400 font-semibold">${p.pos} • ${p.price}M ETB</div>
        </div>
        <button onclick="${inSquad ? `sellPlayer(${p.id})` : `buyPlayer(${p.id})`}" 
          class="px-3 py-1 rounded text-xs font-bold ${inSquad ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}">
          ${inSquad ? 'Sell' : 'Buy'}
        </button>
      </div>
    `;
  }).join('');
}

function buyPlayer(id) {
  const p = playerMarket.find(item => item.id === id);
  if (mySquad.length >= 15) return alert("Squad full! Sell a player first.");
  if (bankBalance < p.price) return alert("Not enough budget!");

  mySquad.push({ ...p, purchasePrice: p.price, isStarter: mySquad.length < 11, isCaptain: false, isViceCaptain: false, gwPoints: 0 });
  bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  transfersMadeInGW++;

  saveUserData();
  renderPitch();
  renderMarket();
}

function sellPlayer(id) {
  const p = mySquad.find(item => item.id === id);
  if (!p) return;
  if (mySquad.length <= 11) return alert("You must keep at least 11 players!");

  mySquad = mySquad.filter(item => item.id !== id);
  bankBalance = parseFloat((bankBalance + p.price).toFixed(1));

  saveUserData();
  renderPitch();
  renderMarket();
}

// ==========================================
// 8. LEAGUES
// ==========================================
function renderLeague() {
  const list = document.getElementById('league-list');
  if (!list) return;

  const leaderboard = [
    { rank: 1, name: "Gulit FC (You)", pts: totalPoints },
    { rank: 2, name: "Sheger Warriors", pts: Math.max(0, totalPoints - 12) },
    { rank: 3, name: "Addis Strikers", pts: Math.max(0, totalPoints - 24) }
  ];

  list.innerHTML = `
    <div class="mb-3 text-xs text-blue-400 font-bold">Active Leagues: ${myLeagues.join(', ')}</div>
    ${leaderboard.map(user => `
      <div class="flex justify-between items-center py-2 border-b border-gray-700/50">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-gray-400 w-4">#${user.rank}</span>
          <span class="text-sm font-semibold text-white">${user.name}</span>
        </div>
        <span class="text-sm font-bold text-green-400">${user.pts} pts</span>
      </div>
    `).join('')}
  `;
}

function createLeague() {
  const code = 'ETH-' + Math.floor(100 + Math.random() * 900);
  const name = prompt("Enter League Name:", "Ethiopian Super League");
  if (!name) return;
  myLeagues.push(`${name} (${code})`);
  saveUserData();
  renderLeague();
  alert(`League created! Code: ${code}`);
}

function joinLeague() {
  const input = document.getElementById('league-code-input');
  if (!input || !input.value) return alert("Please enter a valid league code.");
  myLeagues.push(`Private League (${input.value.trim().toUpperCase()})`);
  input.value = '';
  saveUserData();
  renderLeague();
  alert("Successfully joined league!");
}

// ==========================================
// 9. SIMULATION & CHIP CONFIRMATION ENGINE
// ==========================================
function simulateGameweek() {
  // Confirm staged chip on simulation
  if (stagedChip) {
    activeChip = stagedChip;
    chipsUsed[stagedChip] = true;
    stagedChip = null;
  }

  let gwPts = 0;
  mySquad.forEach(p => {
    let pts = 2 + Math.floor(Math.random() * 5);
    p.gwPoints = pts;
    
    let multiplier = 1;
    if (p.isCaptain) {
      multiplier = (activeChip === 'tc' ? 3 : 2);
    }

    if (p.isStarter || activeChip === 'bb') {
      gwPts += pts * multiplier;
    }
  });

  totalPoints += gwPts;
  gameweek++;
  activeChip = null; // Reset active chip after gameweek completion
  saveUserData();
  renderPitch();
  alert(`Gameweek Simulated! Earned ${gwPts} points.`);
}

function updateHeader() {
  const bankElem = document.getElementById('bank-balance');
  const countElem = document.getElementById('squad-count');
  const totalPtsElem = document.getElementById('total-points');
  const gwElem = document.getElementById('gw-number');

  if (bankElem) bankElem.innerText = `${bankBalance.toFixed(1)}M ETB`;
  if (countElem) countElem.innerText = `${mySquad.length}/15`;
  if (totalPtsElem) totalPtsElem.innerText = totalPoints;
  if (gwElem) gwElem.innerText = gameweek;
}

// ==========================================
// 10. BOOTSTRAPPER & EVENT LISTENERS
// ==========================================
function initApp() {
  loadUserData();
  renderPitch();

  // Wire up tabs
  const btnPick = document.getElementById('btn-pitch') || document.getElementById('btn-pick');
  const btnTransfers = document.getElementById('btn-transfers');
  const btnLeagues = document.getElementById('btn-league') || document.getElementById('btn-leagues');

  if (btnPick) btnPick.addEventListener('click', () => switchTab('pitch'));
  if (btnTransfers) btnTransfers.addEventListener('click', () => switchTab('transfers'));
  if (btnLeagues) btnLeagues.addEventListener('click', () => switchTab('league'));

  // Wire up chips
  ['wc', 'tc', 'bb', 'fh'].forEach(chip => {
    const chipBtn = document.getElementById(`btn-chip-${chip}`) || document.getElementById(`chip-${chip}`);
    if (chipBtn) {
      chipBtn.addEventListener('click', () => stageChip(chip));
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initApp();
}
