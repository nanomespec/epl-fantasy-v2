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
let stagedChip = null;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let totalPoints = 0;
let gameweek = 1;
let freeTransfers = 1;
let transfersMadeInGW = 0;
let myLeagues = ["Overall League"];
let activePlayerModalId = null;
let pendingSubPlayerId = null;

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

// ==========================================
// 4. NAVIGATION & TABS (Updated to "Pick Team")
// ==========================================
function switchTab(tab) {
  ['pitch', 'transfers', 'league', 'points'].forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    const btn = document.getElementById(`btn-${t}`);
    if (el) el.classList.add('hidden');
    if (btn) btn.className = "flex-1 py-1 text-gray-400 font-bold text-[10px] text-center";
  });
  
  const targetTab = document.getElementById(`tab-${tab}`);
  const targetBtn = document.getElementById(`btn-${tab}`);
  if (targetTab) targetTab.classList.remove('hidden');
  if (targetBtn) targetBtn.className = "flex-1 py-1 text-emerald-400 font-bold text-[10px] text-center border-b-2 border-emerald-400";

  if (tab === 'transfers') renderMarket();
  if (tab === 'league') renderLeague();
  if (tab === 'points') renderPointsTab();
}

// ==========================================
// 5. OFFICIAL FPL FORMATION & PITCH VIEW
// ==========================================
function isValidFormation(starters) {
  if (starters.length !== 11) return false;
  const gkps = starters.filter(p => p.pos === 'GKP').length;
  const defs = starters.filter(p => p.pos === 'DEF').length;
  const mids = starters.filter(p => p.pos === 'MID').length;
  const fwds = starters.filter(p => p.pos === 'FWD').length;

  return gkps === 1 && defs >= 3 && defs <= 5 && mids >= 2 && mids <= 5 && fwds >= 1 && fwds <= 3;
}

function renderPitch() {
  const container = document.getElementById('pitch-container');
  if (!container) return;
  if (!mySquad || mySquad.length === 0) setDefaultSquad();

  const starters = mySquad.filter(p => p.isStarter);
  const bench = mySquad.filter(p => !p.isStarter);

  const gkps = starters.filter(p => p.pos === 'GKP');
  const defs = starters.filter(p => p.pos === 'DEF');
  const mids = starters.filter(p => p.pos === 'MID');
  const fwds = starters.filter(p => p.pos === 'FWD');

  const totalStartersCount = starters.length;
  const missingStarters = Math.max(0, 11 - totalStartersCount);

  let plusCardsHtml = '';
  for (let i = 0; i < missingStarters; i++) {
    plusCardsHtml += `
      <div onclick="handlePlusClick()" 
        class="bg-[#1e293b]/80 border-2 border-dashed border-emerald-400/65 hover:border-emerald-300 rounded-lg p-1 text-center min-w-[62px] max-w-[70px] min-h-[72px] shadow cursor-pointer transition flex flex-col items-center justify-center animate-pulse">
        <div class="text-lg font-black text-emerald-400 leading-none">+</div>
        <div class="text-[8px] text-emerald-200 uppercase mt-1 font-bold">Add</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="flex flex-col justify-between w-full h-full p-1 space-y-1.5 text-xs">
      ${pendingSubPlayerId ? `
        <div class="bg-emerald-600 text-white text-[11px] font-bold py-1 px-2 rounded text-center flex justify-between items-center shadow">
          <span>🔄 Swap with ${mySquad.find(p => p.id === pendingSubPlayerId)?.name}</span>
          <button onclick="cancelSub()" class="text-xs bg-black/30 px-2 py-0.5 rounded">Cancel</button>
        </div>
      ` : missingStarters > 0 ? `
        <div class="bg-amber-600 text-white text-[11px] font-bold py-1 px-2 rounded text-center shadow">
          ⚠️ Empty starting spots! Tap a bench player or (+) to fill.
        </div>
      ` : ''}

      <!-- Authentic FPL Pitch Area -->
      <div class="relative bg-gradient-to-b from-[#1b5e20] via-[#2e7d32] to-[#1b5e20] border-2 border-emerald-400/70 rounded-xl p-2 flex flex-col justify-around min-h-[280px] shadow-2xl overflow-hidden">
        <!-- Pitch Markings -->
        <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
          <div class="w-24 h-24 border-2 border-white rounded-full"></div>
          <div class="absolute w-full h-[1px] bg-white"></div>
        </div>

        <div class="flex justify-center gap-1.5 z-10">${gkps.map(createPlayerCard).join('')}</div>
        <div class="flex justify-center gap-1.5 flex-wrap z-10">${defs.map(createPlayerCard).join('')}</div>
        <div class="flex justify-center gap-1.5 flex-wrap z-10">${mids.map(createPlayerCard).join('')}</div>
        <div class="flex justify-center gap-1.5 flex-wrap z-10">${fwds.map(createPlayerCard).join('')}${plusCardsHtml}</div>
      </div>

      <!-- Bench Area -->
      <div class="bg-[#111827] border ${stagedChip === 'bb' || activeChip === 'bb' ? 'border-emerald-400 bg-emerald-950/40' : 'border-gray-700'} rounded-xl p-1.5 text-center w-full shadow-lg">
        <div class="text-[9px] font-bold ${stagedChip === 'bb' || activeChip === 'bb' ? 'text-emerald-400' : 'text-gray-400'} uppercase mb-1 tracking-wider">
          BENCH ${stagedChip === 'bb' ? '(Bench Boost Staged 🚀)' : (activeChip === 'bb' ? '(Bench Boost Active! 🚀)' : '')}
        </div>
        <div class="flex justify-center gap-1.5 flex-wrap">${bench.map(createPlayerCard).join('')}</div>
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

  const isPendingSub = pendingSubPlayerId === p.id;

  let headerColor = 'bg-slate-700 text-slate-200';
  if (p.pos === 'GKP') headerColor = 'bg-amber-600 text-white';
  else if (p.pos === 'DEF') headerColor = 'bg-blue-600 text-white';
  else if (p.pos === 'MID') headerColor = 'bg-purple-600 text-white';
  else if (p.pos === 'FWD') headerColor = 'bg-rose-600 text-white';

  return `
    <div onclick="handlePlayerClick(${p.id})" 
      class="bg-white text-gray-900 border ${isPendingSub ? 'border-amber-400 ring-2 ring-amber-400 bg-amber-50' : 'border-gray-300'} rounded-lg shadow-md cursor-pointer transition flex flex-col justify-between overflow-hidden min-w-[62px] max-w-[70px] select-none hover:scale-105">
      <div class="${headerColor} text-[8px] font-extrabold uppercase px-1 py-0.5 text-center truncate">${badgeText}</div>
      <div class="p-1 text-center bg-slate-900 text-white">
        <div class="text-[10px] font-bold truncate leading-tight">${p.name}</div>
        <div class="text-[9px] font-extrabold text-amber-400 mt-0.5">${p.price}M</div>
      </div>
    </div>
  `;
}

function handlePlayerClick(id) {
  const p = mySquad.find(item => item.id === id);
  if (!p) return;

  const startersCount = mySquad.filter(item => item.isStarter).length;

  if (!p.isStarter && startersCount < 11) {
    p.isStarter = true;
    saveUserData();
    renderPitch();
    return;
  }

  if (pendingSubPlayerId === null) {
    activePlayerModalId = id;
    renderPitch();
  } else {
    executeSubstitution(pendingSubPlayerId, id);
  }
}

function handlePlusClick() {
  const benchPlayer = mySquad.find(item => !item.isStarter);
  if (benchPlayer) {
    benchPlayer.isStarter = true;
    saveUserData();
    renderPitch();
  } else {
    switchTab('transfers');
  }
}

function startSubMode(id) {
  pendingSubPlayerId = id;
  activePlayerModalId = null;
  renderPitch();
}

function cancelSub() {
  pendingSubPlayerId = null;
  renderPitch();
}

function executeSubstitution(id1, id2) {
  if (id1 === id2) {
    pendingSubPlayerId = null;
    renderPitch();
    return;
  }

  const p1 = mySquad.find(item => item.id === id1);
  const p2 = mySquad.find(item => item.id === id2);
  if (!p1 || !p2) return;

  const originalStatus1 = p1.isStarter;
  const originalStatus2 = p2.isStarter;

  p1.isStarter = originalStatus2;
  p2.isStarter = originalStatus1;

  const newStarters = mySquad.filter(item => item.isStarter);
  if (!isValidFormation(newStarters)) {
    p1.isStarter = originalStatus1;
    p2.isStarter = originalStatus2;
    alert("Invalid FPL Formation! Allowed formations require 1 GKP, 3-5 DEF, 2-5 MID, and 1-3 FWD.");
  }

  pendingSubPlayerId = null;
  saveUserData();
  renderPitch();
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
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-[#111827] border border-gray-700 rounded-2xl p-4 w-full max-w-xs shadow-2xl text-center text-white">
        <div class="text-xs text-emerald-400 font-bold uppercase">${p.pos} • ${p.club}</div>
        <div class="text-base font-extrabold my-1">${p.name}</div>
        <div class="text-[11px] text-gray-400 mb-4">Price: ${p.price}M | Form: ${p.form}</div>
        
        <div class="space-y-2">
          <button onclick="startSubMode(${p.id})" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold shadow">
            🔄 Substitute / Swap
          </button>
          <button onclick="setCaptain(${p.id})" class="w-full py-2.5 bg-amber-600/30 border border-amber-500/50 rounded-xl text-xs font-bold text-amber-400 shadow">
            👑 Make Captain (C)
          </button>
          <button onclick="setViceCaptain(${p.id})" class="w-full py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 shadow">
            ⭐ Make Vice-Captain (VC)
          </button>
          <button onclick="closePlayerModal()" class="w-full py-2 bg-transparent rounded-xl text-xs font-bold text-gray-400 mt-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `;
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
// 6. CHIPS LOGIC
// ==========================================
function stageChip(chipName) {
  if (chipsUsed[chipName]) {
    return alert(`You have already used the ${chipName.toUpperCase()} chip this season!`);
  }

  if (stagedChip === chipName) {
    stagedChip = null;
    alert(`Unselected ${chipName.toUpperCase()} chip.`);
  } else {
    stagedChip = chipName;
    alert(`Chip Staged: ${chipName.toUpperCase()}. Click 'Simulate Gameweek' to lock it in! 🚀`);
  }

  saveUserData();
  renderPitch();
}

function updateChipUI() {
  ['wc', 'tc', 'bb', 'fh'].forEach(chip => {
    const btn = document.getElementById(`btn-chip-${chip}`);
    if (btn) {
      if (stagedChip === chip) {
        btn.className = "flex-1 py-1 px-1 bg-amber-950/80 border border-amber-400 text-amber-300 rounded text-[10px] font-bold shadow animate-pulse";
      } else if (chipsUsed[chip]) {
        btn.className = "flex-1 py-1 px-1 bg-gray-900/40 border border-gray-800 text-gray-600 rounded text-[10px] font-bold cursor-not-allowed";
      } else {
        btn.className = "flex-1 py-1 px-1 bg-[#1f2937] border border-gray-700 text-gray-300 rounded text-[10px] font-bold hover:border-gray-500";
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
      <div class="bg-[#1f2937] p-2.5 rounded-xl border border-gray-700 flex justify-between items-center mb-2 text-xs">
        <div>
          <div class="font-bold text-white">${p.name} <span class="text-[10px] text-gray-400">(${p.club})</span></div>
          <div class="text-[10px] text-emerald-400 font-semibold">${p.pos} • ${p.price}M ETB</div>
        </div>
        <button onclick="${inSquad ? `sellPlayer(${p.id})` : `buyPlayer(${p.id})`}" 
          class="px-3 py-1.5 rounded-lg text-[10px] font-bold ${inSquad ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'}">
          ${inSquad ? 'Sell' : 'Buy'}
        </button>
      </div>
    `;
  }).join('');
}

function buyPlayer(id) {
  const p = playerMarket.find(item => item.id === id);
  if (mySquad.length >= 15) return alert("Squad full!");
  if (bankBalance < p.price) return alert("Not enough budget!");

  const startersCount = mySquad.filter(item => item.isStarter).length;
  mySquad.push({ ...p, purchasePrice: p.price, isStarter: startersCount < 11, isCaptain: false, isViceCaptain: false, gwPoints: 0 });
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

  const wasStarter = p.isStarter;

  mySquad = mySquad.filter(item => item.id !== id);
  bankBalance = parseFloat((bankBalance + p.price).toFixed(1));

  if (wasStarter) {
    const benchPlayer = mySquad.find(item => !item.isStarter);
    if (benchPlayer) {
      benchPlayer.isStarter = true;
    }
  }

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
    <div class="mb-2 text-[11px] text-emerald-400 font-bold">Active Leagues: ${myLeagues.join(', ')}</div>
    ${leaderboard.map(user => `
      <div class="flex justify-between items-center py-2 border-b border-gray-700/50 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-gray-400 font-bold w-4">#${user.rank}</span>
          <span class="font-semibold text-white">${user.name}</span>
        </div>
        <span class="font-bold text-emerald-400">${user.pts} pts</span>
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
// 9. POINTS TAB VIEW
// ==========================================
function renderPointsTab() {
  const list = document.getElementById('points-list');
  if (!list) return;

  const starters = mySquad.filter(p => p.isStarter);
  const bench = mySquad.filter(p => !p.isStarter);

  let gwTotal = 0;
  starters.forEach(p => {
    let mult = p.isCaptain ? (activeChip === 'tc' ? 3 : 2) : 1;
    gwTotal += (p.gwPoints || 0) * mult;
  });

  list.innerHTML = `
    <div class="bg-[#1f2937] p-3.5 rounded-xl border border-gray-700 mb-3 flex justify-between items-center shadow">
      <div>
        <div class="text-[10px] text-gray-400 uppercase font-bold">Gameweek Score</div>
        <div class="text-lg font-black text-emerald-400">${gwTotal} Points</div>
      </div>
      <div class="text-right">
        <div class="text-[10px] text-gray-400 uppercase font-bold">Overall Total</div>
        <div class="text-lg font-black text-blue-400">${totalPoints} Pts</div>
      </div>
    </div>
    <div class="text-xs font-bold text-gray-300 mb-1">Starting XI Breakdown</div>
    <div class="space-y-1 mb-3">
      ${starters.map(p => {
        let mult = p.isCaptain ? (activeChip === 'tc' ? 3 : 2) : 1;
        let ptsEarned = (p.gwPoints || 0) * mult;
        return `
          <div class="bg-[#1f2937] px-3 py-2 rounded-lg flex justify-between items-center text-xs border border-gray-800">
            <div>
              <span class="font-bold text-white">${p.name}</span>
              <span class="text-[10px] text-emerald-300 ml-1">(${p.pos}${p.isCaptain ? ' - C' : ''})</span>
            </div>
            <span class="font-black text-emerald-400">${ptsEarned} pts</span>
          </div>
        `;
      }).join('')}
    </div>
    <div class="text-xs font-bold text-gray-300 mb-1">Substitutes / Bench</div>
    <div class="space-y-1">
      ${bench.map(p => `
        <div class="bg-[#1f2937]/50 px-3 py-2 rounded-lg flex justify-between items-center text-xs border border-gray-800/60">
          <div>
            <span class="font-bold text-gray-300">${p.name}</span>
            <span class="text-[10px] text-gray-500 ml-1">(${p.pos})</span>
          </div>
          <span class="font-black text-gray-400">${p.gwPoints || 0} pts</span>
        </div>
      `).join('')}
    </div>
  `;
}

// ==========================================
// 10. REAL FPL AUTOMATED SUBSTITUTION ENGINE
// ==========================================
function applyAutomaticSubstitutions() {
  if (activeChip === 'bb') return; // Bench Boost disables automatic bench subs

  let starters = mySquad.filter(p => p.isStarter);
  let bench = mySquad.filter(p => !p.isStarter);

  // 1. Goalkeeper automatic substitution check
  let starterGkp = starters.find(p => p.pos === 'GKP');
  let benchGkp = bench.find(p => p.pos === 'GKP');

  if (starterGkp && starterGkp.gwPoints === 0 && benchGkp && benchGkp.gwPoints > 0) {
    starterGkp.isStarter = false;
    benchGkp.isStarter = true;
    starters = mySquad.filter(p => p.isStarter);
    bench = mySquad.filter(p => !p.isStarter);
  }

  // 2. Outfield substitutions checking bench in exact left-to-right order
  for (let i = 0; i < bench.length; i++) {
    let subCandidate = bench[i];
    if (subCandidate.pos === 'GKP') continue;
    if (subCandidate.gwPoints === 0) continue; // Didn't play, skip

    // Find a starting outfield player who scored 0 points
    let eligibleStarter = starters.find(s => s.gwPoints === 0 && s.pos !== 'GKP');
    if (eligibleStarter) {
      eligibleStarter.isStarter = false;
      subCandidate.isStarter = true;

      const testStarters = mySquad.filter(p => p.isStarter);
      if (isValidFormation(testStarters)) {
        break; // Successful sub made, move to next bench priority
      } else {
        // Revert if resulting formation violates FPL rule
        eligibleStarter.isStarter = true;
        subCandidate.isStarter = false;
      }
    }
  }
}

// ==========================================
// 11. SIMULATION & CHIP CONFIRMATION ENGINE
// ==========================================
function simulateGameweek() {
  if (stagedChip) {
    activeChip = stagedChip;
    chipsUsed[stagedChip] = true;
    stagedChip = null;
  }

  mySquad.forEach(p => {
    let played = Math.random() > 0.3;
    p.gwPoints = played ? (2 + Math.floor(Math.random() * 7)) : 0;
  });

  applyAutomaticSubstitutions();

  let gwPts = 0;
  mySquad.forEach(p => {
    let multiplier = 1;
    if (p.isCaptain) {
      multiplier = (activeChip === 'tc' ? 3 : 2);
    }

    if (p.isStarter || activeChip === 'bb') {
      gwPts += (p.gwPoints || 0) * multiplier;
    }
  });

  totalPoints += gwPts;
  gameweek++;
  activeChip = null; 
  saveUserData();
  renderPitch();
  renderPointsTab();
  alert(`Gameweek Simulated! Automatic subs processed. Total GW Points: ${gwPts}.`);
}

function updateHeader() {
  const bankElem = document.getElementById('bank-balance');
  const countElem = document.getElementById('squad-count');
  const totalPtsElem = document.getElementById('total-points');
  const gwElem = document.getElementById('gw-number');

  if (bankElem) bankElem.innerText = `${bankBalance.toFixed(1)}M`;
  if (countElem) countElem.innerText = `${mySquad.length}/15`;
  if (totalPtsElem) totalPtsElem.innerText = totalPoints;
  if (gwElem) gwElem.innerText = gameweek;
}

// ==========================================
// 12. BOOTSTRAPPER & EVENT LISTENERS
// ==========================================
function initApp() {
  loadUserData();
  renderPitch();

  const tabs = ['pitch', 'transfers', 'league', 'points'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`btn-${tab}`);
    if (btn) {
      btn.addEventListener('click', () => switchTab(tab));
    }
  });

  ['wc', 'tc', 'bb', 'fh'].forEach(chip => {
    const chipBtn = document.getElementById(`btn-chip-${chip}`);
    if (chipBtn) {
      chipBtn.addEventListener('click', () => stageChip(chip));
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initApp();
}
