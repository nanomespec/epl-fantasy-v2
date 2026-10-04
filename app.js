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

const managerName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Nate';
const managerId = tgUser?.id || 'local_user';

// ==========================================
// 2. STATE & STORAGE
// ==========================================
const STORAGE_KEY = 'efpl_official_v6';

// Club Kit / Crest Color Schemes (Inspired by Ethiopian Football Federation Clubs)
const clubColors = {
  "Saint George": { primary: "#FFD700", secondary: "#000080", accent: "#FFFFFF" }, // Yellow & Blue
  "Ethiopian Coffee": { primary: "#FF6600", secondary: "#008000", accent: "#FFFFFF" }, // Orange & Green
  "CBE SA": { primary: "#0047AB", secondary: "#FFFFFF", accent: "#FFD700" }, // Blue & White
  "Fasil Kenema": { primary: "#CC0000", secondary: "#FFCC00", accent: "#FFFFFF" }, // Red & Yellow
  "Mechal": { primary: "#006400", secondary: "#FFD700", accent: "#FFFFFF" } // Green & Yellow
};

let playerMarket = [
  { id: 1, name: "S. Bahiru", club: "Saint George", pos: "GKP", price: 5.5, form: 5.2, status: 'a' },
  { id: 2, name: "A. Nuri", club: "Ethiopian Coffee", pos: "GKP", price: 5.0, form: 4.1, status: 'a' },
  { id: 3, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 6.0, status: 'a' },
  { id: 4, name: "E. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 5.8, status: 'i' },
  { id: 5, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, form: 4.5, status: 'a' },
  { id: 6, name: "S. Bereket", club: "CBE SA", pos: "DEF", price: 5.0, form: 4.8, status: 'a' },
  { id: 7, name: "Y. Endale", club: "Fasil Kenema", pos: "DEF", price: 5.0, form: 3.5, status: 's' },
  { id: 8, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.0, form: 7.2, status: 'a' },
  { id: 9, name: "E. Tadesse", club: "Ethiopian Coffee", pos: "MID", price: 7.5, form: 7.8, status: 'a' },
  { id: 10, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.5, form: 6.9, status: 'd' },
  { id: 11, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, form: 6.1, status: 'a' },
  { id: 12, name: "A. Okutu", club: "Saint George", pos: "FWD", price: 9.0, form: 8.5, status: 'a' },
  { id: 13, name: "H. Konkoni", club: "Ethiopian Coffee", pos: "FWD", price: 8.0, form: 7.0, status: 'a' },
  { id: 14, name: "D. Nathaniel", club: "CBE SA", pos: "FWD", price: 8.5, form: 7.4, status: 'a' },
  { id: 15, name: "B. Gugsa", club: "Fasil Kenema", pos: "FWD", price: 8.0, form: 5.9, status: 'a' }
];

let mySquad = [];
let preFreeHitSquad = null;
let bankBalance = 1.0;
let totalPoints = 0;
let gameweek = 1;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let activeModalId = null;
let pendingSubId = null;
let chipConfirmModal = null;
let gwHistory = [];

// Transfer Rules State
let freeTransfers = 1;
let transfersMade = 0;
let transferCostPenalty = 0;

const defaultStarters = [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13];

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      mySquad = data.mySquad || [];
      preFreeHitSquad = data.preFreeHitSquad || null;
      bankBalance = data.bankBalance ?? 1.0;
      totalPoints = data.totalPoints ?? 0;
      gameweek = data.gameweek ?? 1;
      chipsUsed = data.chipsUsed || chipsUsed;
      activeChip = data.activeChip || null;
      gwHistory = data.gwHistory || [];
      freeTransfers = data.freeTransfers ?? 1;
      transfersMade = data.transfersMade ?? 0;
      transferCostPenalty = data.transferCostPenalty ?? 0;
      if (data.playerMarket) playerMarket = data.playerMarket;
      renderAll();
      return;
    }
  } catch (e) {
    console.warn("Storage restricted", e);
  }
  resetSquad();
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      mySquad, preFreeHitSquad, bankBalance, totalPoints, gameweek, chipsUsed, activeChip, gwHistory,
      freeTransfers, transfersMade, transferCostPenalty, playerMarket
    }));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

function resetSquad() {
  mySquad = playerMarket.map(p => ({
    ...p,
    isStarter: defaultStarters.includes(p.id),
    isCaptain: p.id === 12,
    isViceCaptain: p.id === 13,
    gwPoints: 0,
    stats: { goals: 0, assists: 0, cleanSheet: 0, yellow: 0 }
  }));
  bankBalance = 1.0;
  totalPoints = 0;
  gameweek = 1;
  chipsUsed = { wc: false, tc: false, bb: false, fh: false };
  activeChip = null;
  preFreeHitSquad = null;
  gwHistory = [];
  freeTransfers = 1;
  transfersMade = 0;
  transferCostPenalty = 0;
  saveData();
  renderAll();
}

// ==========================================
// 3. TAB NAVIGATION
// ==========================================
function switchTab(tabName) {
  ['pitch', 'transfers', 'leagues', 'points'].forEach(t => {
    const section = document.getElementById(`tab-${t}`);
    if (section) section.classList.add('hidden');
    
    const navItem = document.getElementById(`nav-${t}`);
    if (navItem) {
      navItem.classList.remove('text-fpl-purple', 'border-t-2', 'border-fpl-purple');
      navItem.classList.add('text-gray-500', 'border-transparent');
    }
  });

  const activeSection = document.getElementById(`tab-${tabName}`);
  if (activeSection) activeSection.classList.remove('hidden');
  
  const activeNav = document.getElementById(`nav-${tabName}`);
  if (activeNav) {
    activeNav.classList.remove('text-gray-500', 'border-transparent');
    activeNav.classList.add('text-fpl-purple', 'border-t-2', 'border-fpl-purple');
  }
  
  renderAll();
}

function renderAll() {
  renderPitch();
  renderMarket();
  renderLeagues();
  renderPoints();
  updateHeader();
}

// ==========================================
// 4. CHIPS & MODALS
// ==========================================
function promptChip(chipName) {
  if (chipsUsed[chipName]) return showNotification(`You used ${chipName.toUpperCase()} already!`);
  if (activeChip) return showNotification(`Chip ${activeChip.toUpperCase()} is already active!`);
  chipConfirmModal = chipName;
  renderPitch();
}

function confirmChipPlay() {
  activeChip = chipConfirmModal;
  if (chipConfirmModal === 'fh') preFreeHitSquad = JSON.parse(JSON.stringify(mySquad));
  chipConfirmModal = null;
  saveData();
  renderPitch();
}

function cancelChipPlay() { chipConfirmModal = null; renderPitch(); }

function showNotification(msg) {
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.showAlert) {
    window.Telegram.WebApp.showAlert(msg);
  } else {
    alert(msg);
  }
}

// ==========================================
// 5. PITCH & FORMATION
// ==========================================
function isValidFormation(starters) {
  if (starters.length !== 11) return false;
  const gk = starters.filter(p => p.pos === 'GKP').length;
  const def = starters.filter(p => p.pos === 'DEF').length;
  const mid = starters.filter(p => p.pos === 'MID').length;
  const fwd = starters.filter(p => p.pos === 'FWD').length;
  return gk === 1 && def >= 3 && def <= 5 && mid >= 2 && mid <= 5 && fwd >= 1 && fwd <= 3;
}

function renderPitch() {
  const container = document.getElementById('pitch-container');
  if (!container) return;

  const starters = mySquad.filter(p => p.isStarter);
  const bench = mySquad.filter(p => !p.isStarter);
  const chipLabels = { wc: 'Wildcard', tc: 'Triple Captain', bb: 'Bench Boost', fh: 'Free Hit' };

  container.innerHTML = `
    <div class="bg-white rounded-lg shadow-sm p-2 mb-3">
      <div class="flex gap-2">
        ${['wc', 'tc', 'bb', 'fh'].map(c => `
          <button onclick="promptChip('${c}')" ${chipsUsed[c] || activeChip ? 'disabled' : ''} 
            class="flex-1 py-1.5 text-[9px] font-bold rounded ${chipsUsed[c] ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : activeChip === c ? 'bg-fpl-purple text-fpl-green' : 'bg-white border border-gray-300 text-fpl-purple hover:bg-gray-50'}">
            ${chipLabels[c]}
          </button>
        `).join('')}
      </div>
      ${activeChip ? `<div class="mt-2 text-center text-xs font-bold text-fpl-purple bg-fpl-green py-1 rounded">⚡ Active: ${chipLabels[activeChip]}</div>` : ''}
    </div>

    ${pendingSubId ? `<div class="bg-fpl-purple text-fpl-green text-xs p-2 text-center font-bold mb-3 rounded-lg shadow">🔄 Select a player to substitute</div>` : ''}
    
    <!-- Realistic Pitch Graphic -->
    <div class="football-pitch rounded-t-2xl p-3 flex flex-col justify-around min-h-[340px] mb-1">
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <!-- Bench Container -->
    <div class="bg-white rounded-b-2xl p-3 shadow-md border border-gray-200">
      <div class="text-[10px] text-fpl-purple font-black uppercase mb-2 flex justify-between px-1">
        <span>Substitutes (Bench)</span>
        ${activeChip === 'bb' ? '<span class="text-green-600 font-bold">Bench Boost Active ⚡</span>' : ''}
      </div>
      <div class="flex justify-center gap-1.5">${bench.map(cardHtml).join('')}</div>
    </div>
    
    ${renderModal()}
    ${renderChipConfirmModal()}
  `;
}

function cardHtml(p) {
  let isCap = p.isCaptain ? '<div class="absolute -top-2 -right-1 bg-black text-fpl-green text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-fpl-green shadow z-10">C</div>' : '';
  let isVice = p.isViceCaptain ? '<div class="absolute -top-2 -right-1 bg-white text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow z-10">V</div>' : '';

  let statusBadge = '';
  if (p.status === 'i') statusBadge = '<div class="absolute -bottom-1 -left-1 bg-red-600 text-white text-[7px] font-black px-1 rounded shadow z-10">INJ</div>';
  else if (p.status === 's') statusBadge = '<div class="absolute -bottom-1 -left-1 bg-amber-600 text-white text-[7px] font-black px-1 rounded shadow z-10">SUS</div>';
  else if (p.status === 'd') statusBadge = '<div class="absolute -bottom-1 -left-1 bg-yellow-400 text-black text-[7px] font-black px-1 rounded shadow z-10">75%</div>';

  const colors = clubColors[p.club] || { primary: "#37003c", secondary: "#00ff85", accent: "#ffffff" };

  return `
    <div onclick="handleCardClick(${p.id})" class="player-card pos-${p.pos} relative text-center w-[74px] p-1.5 cursor-pointer group select-none">
      ${isCap} ${isVice} ${statusBadge}
      <div class="mx-auto w-8 h-8 rounded-full flex items-center justify-center shadow-md mb-1 relative overflow-hidden border border-white/30 group-hover:scale-105 transition-transform" style="background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});">
        <span class="text-[9px] font-black drop-shadow tracking-tighter" style="color: ${colors.accent};">${p.club.split(' ').map(w => w[0]).join('')}</span>
      </div>
      <div class="text-white text-[9px] font-bold truncate px-0.5">${p.name.split(' ').pop()}</div>
      <div class="flex justify-between items-center bg-black/40 rounded px-1 mt-1 text-[8px]">
        <span class="text-gray-300 font-medium">£${p.price}m</span>
        <span class="text-fpl-green font-bold">${p.gwPoints ?? 0} pts</span>
      </div>
    </div>
  `;
}

function handleCardClick(id) {
  if (pendingSubId === null) {
    activeModalId = id;
    renderPitch();
  } else {
    executeSwap(pendingSubId, id);
  }
}

function executeSwap(id1, id2) {
  if (id1 === id2) { pendingSubId = null; renderPitch(); return; }
  const p1 = mySquad.find(p => p.id === id1);
  const p2 = mySquad.find(p => p.id === id2);

  const status1 = p1.isStarter;
  p1.isStarter = p2.isStarter;
  p2.isStarter = status1;

  if (!isValidFormation(mySquad.filter(p => p.isStarter))) {
    p2.isStarter = p1.isStarter;
    p1.isStarter = status1;
    showNotification("Invalid formation! Must have 1 GKP, 3-5 DEF, 2-5 MID, 1-3 FWD.");
  }
  pendingSubId = null;
  saveData();
  renderPitch();
}

function renderModal() {
  if (!activeModalId) return '';
  const p = mySquad.find(x => x.id === activeModalId);
  const stats = p.stats || { goals: 0, assists: 0, cleanSheet: 0, yellow: 0 };
  
  let statusText = '<span class="text-green-600 font-bold">🟢 Available (100% Chance)</span>';
  if (p.status === 'i') statusText = '<span class="text-red-600 font-bold">❌ Injured (0% Chance)</span>';
  else if (p.status === 's') statusText = '<span class="text-amber-600 font-bold">⛔ Suspended</span>';
  else if (p.status === 'd') statusText = '<span class="text-yellow-600 font-bold">⚠️ Doubtful (75% Chance)</span>';

  return `
    <div class="fixed inset-0 bg-fpl-dark/80 flex items-end justify-center z-50">
      <div class="bg-white w-full rounded-t-2xl p-5 shadow-2xl animate-[slideUp_0.2s_ease-out]">
        <div class="flex justify-between items-center mb-2 border-b pb-2">
          <div class="font-black text-lg text-fpl-purple">${p.name} <span class="text-xs font-normal text-gray-500">(${p.club})</span></div>
          <button onclick="activeModalId=null; renderPitch();" class="text-gray-400 font-bold text-xl">&times;</button>
        </div>
        
        <div class="bg-gray-50 border rounded-lg p-3 mb-3 text-xs space-y-2">
          <div class="flex justify-between items-center border-b pb-2">
            <span class="font-bold text-gray-500 uppercase text-[9px]">Match Status</span>
            <span>${statusText}</span>
          </div>
          <div class="flex justify-around text-center pt-1">
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Goals</div><div class="font-black text-fpl-purple">${stats.goals}</div></div>
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Assists</div><div class="font-black text-fpl-purple">${stats.assists}</div></div>
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Clean Sheet</div><div class="font-black text-fpl-purple">${stats.cleanSheet}</div></div>
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Cards</div><div class="font-black text-red-500">${stats.yellow}🟨</div></div>
          </div>
        </div>

        <button onclick="pendingSubId=${p.id}; activeModalId=null; renderPitch();" class="w-full bg-gray-100 text-fpl-purple py-3 rounded-lg text-sm font-bold mb-3 shadow-sm border border-gray-200">🔄 Substitute Player</button>
        <button onclick="setCap(${p.id}, true)" class="w-full bg-fpl-purple text-white py-3 rounded-lg text-sm font-bold mb-3 shadow-sm">👑 Make Captain (2x/3x)</button>
        <button onclick="setCap(${p.id}, false)" class="w-full bg-white border-2 border-fpl-purple text-fpl-purple py-3 rounded-lg text-sm font-bold shadow-sm">⭐ Make Vice-Captain</button>
      </div>
    </div>
  `;
}

function renderChipConfirmModal() {
  if (!chipConfirmModal) return '';
  return `
    <div class="fixed inset-0 bg-fpl-dark/80 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-5 w-72 text-center shadow-2xl">
        <div class="text-xs text-gray-500 font-bold uppercase mb-1">Confirm Chip</div>
        <div class="font-black text-fpl-purple text-xl mb-2">Play ${chipConfirmModal.toUpperCase()}?</div>
        <p class="text-xs text-gray-600 mb-5">This action will lock the chip in for the upcoming Gameweek.</p>
        <button onclick="confirmChipPlay()" class="w-full bg-fpl-green text-fpl-purple py-3 rounded-lg text-sm font-black mb-2">Confirm</button>
        <button onclick="cancelChipPlay()" class="w-full bg-gray-100 text-gray-600 py-3 rounded-lg text-sm font-bold">Cancel</button>
      </div>
    </div>
  `;
}

function setCap(id, isC) {
  mySquad.forEach(p => {
    if (isC) p.isCaptain = (p.id === id);
    else p.isViceCaptain = (p.id === id);
  });
  activeModalId = null;
  saveData();
  renderPitch();
}

// ==========================================
// 6. MARKET / TRANSFERS
// ==========================================
function renderMarket() {
  const container = document.getElementById('tab-transfers');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-fpl-purple text-white p-3 flex justify-between items-center">
        <span class="font-black">Player Market</span>
        <div class="flex gap-2 text-xs">
          <span class="bg-fpl-green text-fpl-purple px-2 py-0.5 rounded font-bold">Bank: £${bankBalance}M</span>
          <span class="bg-white/20 text-white px-2 py-0.5 rounded font-bold">FT: ${freeTransfers}</span>
        </div>
      </div>
      
      ${transferCostPenalty > 0 ? `<div class="bg-red-50 text-red-600 text-xs px-4 py-2 font-bold border-b border-red-100 flex justify-between items-center"><span>⚠️ Transfer Penalty Hit:</span><span>-${transferCostPenalty} pts</span></div>` : ''}

      <div class="p-2 bg-gray-50 text-xs text-gray-500 font-bold border-b flex justify-between px-4">
        <span class="w-2/3">Player</span>
        <span class="w-1/3 text-right">Price / Action</span>
      </div>

      <div class="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
        ${playerMarket.map(p => {
          const owned = mySquad.some(s => s.id === p.id);
          let badge = '';
          if (p.status === 'i') badge = '<span class="text-[9px] bg-red-100 text-red-600 font-bold px-1 rounded ml-1">INJ</span>';
          if (p.status === 's') badge = '<span class="text-[9px] bg-amber-100 text-amber-700 font-bold px-1 rounded ml-1">SUS</span>';
          
          return `
            <div class="p-3 flex justify-between items-center bg-white hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">${p.pos}</div>
                <div>
                  <div class="font-bold text-sm text-fpl-dark flex items-center">${p.name}${badge}</div>
                  <div class="text-[10px] text-gray-500">${p.club} • Form: ${p.form}</div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="font-black text-fpl-purple mb-1">£${p.price}m</span>
                <button onclick="${owned ? `sellPlayer(${p.id})` : `buyPlayer(${p.id})`}" 
                  class="px-4 py-1 rounded text-xs font-bold shadow-sm ${owned ? 'bg-white border border-red-500 text-red-500' : 'bg-fpl-green text-fpl-purple'}">
                  ${owned ? 'Remove' : 'Add'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function buyPlayer(id) {
  const p = playerMarket.find(x => x.id === id);
  if (mySquad.length >= 15) return showNotification("Squad full (15/15)!");
  if (bankBalance < p.price && activeChip !== 'wc' && activeChip !== 'fh') return showNotification("Not enough budget!");

  if (activeChip !== 'wc' && activeChip !== 'fh') {
    if (freeTransfers > 0) {
      freeTransfers--;
    } else {
      transferCostPenalty += 4;
      showNotification("⚠️ Extra transfer used! -4 point hit applied.");
    }
    transfersMade++;
  }

  mySquad.push({ ...p, isStarter: mySquad.filter(s => s.isStarter).length < 11, isCaptain: false, isViceCaptain: false, gwPoints: 0, stats: { goals: 0, assists: 0, cleanSheet: 0, yellow: 0 } });
  if (bankBalance >= p.price && activeChip !== 'wc' && activeChip !== 'fh') {
    bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  }
  
  saveData();
  renderAll();
}

function sellPlayer(id) {
  if (mySquad.length <= 11) return showNotification("Must keep at least 11 players!");
  
  if (activeChip !== 'wc' && activeChip !== 'fh') {
    if (freeTransfers > 0) {
      freeTransfers--;
    } else {
      transferCostPenalty += 4;
      showNotification("⚠️ Extra transfer used! -4 point hit applied.");
    }
    transfersMade++;
  }

  const p = mySquad.find(x => x.id === id);
  mySquad = mySquad.filter(x => x.id !== id);
  bankBalance = parseFloat((bankBalance + p.price).toFixed(1));
  
  saveData();
  renderAll();
}

// ==========================================
// 7. LEAGUES & POINTS
// ==========================================
function renderLeagues() {
  const container = document.getElementById('tab-leagues');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 class="font-black text-fpl-purple text-lg mb-4 border-b pb-2">Global Leagues</h2>
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-3 bg-fpl-purple text-white rounded-lg shadow-sm">
          <div class="font-black text-xl w-8">1</div>
          <div class="flex-1">
            <div class="font-bold text-sm text-fpl-green">Gulit FC (You)</div>
            <div class="text-[10px] text-gray-300">Manager: ${managerName}</div>
          </div>
          <div class="font-black">${totalPoints}</div>
        </div>
        
        <div class="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
          <div class="font-bold text-gray-400 text-lg w-8">2</div>
          <div class="flex-1">
            <div class="font-bold text-sm text-fpl-dark">Addis Star XI</div>
            <div class="text-[10px] text-gray-500">Manager: Dawit</div>
          </div>
          <div class="font-bold text-fpl-dark">${Math.max(0, totalPoints - 12)}</div>
        </div>
      </div>
    </div>
  `;
}

function renderPoints() {
  const container = document.getElementById('tab-points');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-fpl-purple text-white p-4 text-center">
        <div class="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Overall Points</div>
        <div class="text-4xl font-black text-fpl-green">${totalPoints}</div>
      </div>
      
      <div class="p-4">
        <h3 class="font-bold text-sm text-gray-500 uppercase mb-3">Gameweek History</h3>
        ${gwHistory.length === 0 ? '<div class="text-center text-sm text-gray-400 py-4">No data yet. Play a Gameweek!</div>' : `
          <div class="space-y-2">
            ${gwHistory.map(h => `
              <div class="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                <span class="font-bold text-fpl-dark">Gameweek ${h.gameweek}</span>
                <span class="font-black text-fpl-purple bg-gray-200 px-3 py-1 rounded-full">${h.points} pts</span>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// ==========================================
// 8. SIMULATION LOGIC (WITH PRICE FLUCTUATIONS)
// ==========================================
function simulateGameweek() {
  mySquad.forEach(p => {
    let goals = 0;
    let assists = 0;
    let cleanSheet = 0;
    let yellow = 0;
    let pts = 0;

    if (p.status === 'i' || p.status === 's') {
      p.gwPoints = 0;
      p.stats = { goals: 0, assists: 0, cleanSheet: 0, yellow: 0 };
      return;
    }

    let roll = Math.random();
    if (p.pos === 'FWD') {
      if (roll > 0.4) goals = Math.random() > 0.8 ? 2 : 1;
      if (Math.random() > 0.6) assists = 1;
    } else if (p.pos === 'MID') {
      if (roll > 0.5) goals = Math.random() > 0.9 ? 2 : 1;
      if (Math.random() > 0.5) assists = 1;
    } else if (p.pos === 'DEF' || p.pos === 'GKP') {
      if (Math.random() > 0.4) cleanSheet = 1;
      if (Math.random() > 0.85) goals = 1;
      if (Math.random() > 0.7) assists = 1;
    }
    if (Math.random() > 0.8) yellow = 1;

    pts = 2; // Appearance points
    if (p.pos === 'GKP' || p.pos === 'DEF') {
      pts += (goals * 6) + (cleanSheet * 4);
    } else if (p.pos === 'MID') {
      pts += (goals * 5) + (cleanSheet * 1);
    } else if (p.pos === 'FWD') {
      pts += (goals * 4);
    }
    pts += (assists * 3);
    pts -= (yellow * 1);

    p.gwPoints = Math.max(0, pts);
    p.stats = { goals, assists, cleanSheet, yellow };
    p.form = parseFloat(((p.form * 2 + p.gwPoints) / 3).toFixed(1)); // Update form dynamically
  });

  if (activeChip !== 'bb') {
    let starters = mySquad.filter(p => p.isStarter);
    let bench = mySquad.filter(p => !p.isStarter);
    bench.forEach(sub => {
      if (sub.gwPoints === 0) return;
      let starterOut = starters.find(s => s.gwPoints === 0 && (s.pos === sub.pos || s.pos !== 'GKP'));
      if (starterOut) {
        starterOut.isStarter = false;
        sub.isStarter = true;
        starters = mySquad.filter(p => p.isStarter);
      }
    });
  }

  let gwTotal = 0;
  mySquad.forEach(p => {
    let mult = 1;
    if (p.isCaptain) mult = (activeChip === 'tc' ? 3 : 2);
    if (p.isStarter || activeChip === 'bb') gwTotal += p.gwPoints * mult;
  });

  gwTotal -= transferCostPenalty;

  totalPoints += gwTotal;
  gwHistory.push({ gameweek, points: gwTotal });
  gameweek++;

  freeTransfers = Math.min(2, freeTransfers + 1);
  transfersMade = 0;
  transferCostPenalty = 0;

  // Dynamic Market Price Fluctuations
  playerMarket.forEach(p => {
    let rand = Math.random();
    if (rand < 0.05) p.status = 'i';
    else if (rand < 0.08) p.status = 's';
    else if (rand < 0.12) p.status = 'd';
    else p.status = 'a';

    // Price rise/drop calculation based on form and performance
    if (p.form >= 7.5 && Math.random() > 0.4) {
      p.price = parseFloat((p.price + 0.1).toFixed(1));
    } else if ((p.form <= 4.0 || p.status === 'i') && Math.random() > 0.5 && p.price > 4.5) {
      p.price = parseFloat((p.price - 0.1).toFixed(1));
    }
  });

  // Sync price changes to active squad members
  mySquad.forEach(sMember => {
    const marketMatch = playerMarket.find(m => m.id === sMember.id);
    if (marketMatch) sMember.price = marketMatch.price;
  });

  if (activeChip === 'fh' && preFreeHitSquad) {
    mySquad = preFreeHitSquad;
    preFreeHitSquad = null;
    chipsUsed.fh = true;
  } else if (activeChip) {
    chipsUsed[activeChip] = true;
  }

  activeChip = null;
  saveData();
  renderAll();
  showNotification(`Gameweek ${gameweek - 1} finished! You scored ${gwTotal} points. Player prices updated!`);
}

function updateHeader() {
  document.getElementById('bank-balance').innerText = `${bankBalance}M`;
  document.getElementById('squad-count').innerText = `${mySquad.length}/15`;
  document.getElementById('total-points').innerText = totalPoints;
  document.getElementById('gw-number').innerText = gameweek;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', loadData);
