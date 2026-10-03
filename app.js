// ==========================================
// 1. STATE & INITIALIZATION
// ==========================================
const STORAGE_KEY = 'epl_fantasy_clean_v3';

const playerMarket = [
  { id: 1, name: "S. Bahiru", club: "Saint George", pos: "GKP", price: 5.5, form: 5.2 },
  { id: 2, name: "A. Nuri", club: "Ethiopian Coffee", pos: "GKP", price: 5.0, form: 4.1 },
  { id: 3, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 6.0 },
  { id: 4, name: "E. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 5.8 },
  { id: 5, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, form: 4.5 },
  { id: 6, name: "S. Bereket", club: "CBE SA", pos: "DEF", price: 5.0, form: 4.8 },
  { id: 7, name: "Y. Endale", club: "Fasil Kenema", pos: "DEF", price: 5.0, form: 3.5 },
  { id: 8, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.0, form: 7.2 },
  { id: 9, name: "E. Tadesse", club: "Ethiopian Coffee", pos: "MID", price: 7.5, form: 7.8 },
  { id: 10, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.5, form: 6.9 },
  { id: 11, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, form: 6.1 },
  { id: 12, name: "A. Okutu", club: "Saint George", pos: "FWD", price: 9.0, form: 8.5 },
  { id: 13, name: "H. Konkoni", club: "Ethiopian Coffee", pos: "FWD", price: 8.0, form: 7.0 },
  { id: 14, name: "D. Nathaniel", club: "CBE SA", pos: "FWD", price: 8.5, form: 7.4 },
  { id: 15, name: "B. Gugsa", club: "Fasil Kenema", pos: "FWD", price: 8.0, form: 5.9 }
];

let mySquad = [];
let preFreeHitSquad = null;
let bankBalance = 100.0;
let totalPoints = 0;
let gameweek = 1;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let activeModalId = null;
let pendingSubId = null;
let chipConfirmModal = null; // Holds chip name waiting for confirmation

const defaultStarters = [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13];

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    mySquad = data.mySquad;
    preFreeHitSquad = data.preFreeHitSquad || null;
    bankBalance = data.bankBalance;
    totalPoints = data.totalPoints;
    gameweek = data.gameweek;
    chipsUsed = data.chipsUsed || chipsUsed;
    activeChip = data.activeChip || null;
  } else {
    resetSquad();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
    mySquad, preFreeHitSquad, bankBalance, totalPoints, gameweek, chipsUsed, activeChip 
  }));
}

function resetSquad() {
  mySquad = playerMarket.map(p => ({
    ...p,
    isStarter: defaultStarters.includes(p.id),
    isCaptain: p.id === 12,
    isViceCaptain: p.id === 13,
    gwPoints: 0
  }));
  bankBalance = parseFloat((100.0 - mySquad.reduce((sum, p) => sum + p.price, 0)).toFixed(1));
  totalPoints = 0;
  gameweek = 1;
  chipsUsed = { wc: false, tc: false, bb: false, fh: false };
  activeChip = null;
  preFreeHitSquad = null;
  saveData();
  renderPitch();
}

// ==========================================
// 2. NAVIGATION TABS
// ==========================================
function switchTab(tab) {
  ['pitch', 'transfers', 'points'].forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.add('hidden');
  });
  document.getElementById(`tab-${tab}`)?.classList.remove('hidden');

  if (tab === 'transfers') renderMarket();
  if (tab === 'points') renderPoints();
}

// ==========================================
// 3. FPL CHIP CONFIRMATION SYSTEM
// ==========================================
function promptChip(chipName) {
  if (chipsUsed[chipName]) {
    return alert(`You have already used the ${chipName.toUpperCase()} chip this season!`);
  }
  if (activeChip) {
    return alert(`You already have an active chip (${activeChip.toUpperCase()}) for this gameweek!`);
  }
  chipConfirmModal = chipName;
  renderPitch();
}

function confirmChipPlay() {
  const chipName = chipConfirmModal;
  if (!chipName) return;

  activeChip = chipName;
  if (chipName === 'fh') {
    preFreeHitSquad = JSON.parse(JSON.stringify(mySquad));
  }
  chipConfirmModal = null;
  saveData();
  renderPitch();
}

function cancelChipPlay() {
  chipConfirmModal = null;
  renderPitch();
}

// ==========================================
// 4. PITCH & FORMATION RULES (FPL)
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
    <!-- Single Clean Chip Management Bar -->
    <div class="bg-gray-800/80 border border-gray-700 rounded-xl p-2 mb-2">
      <div class="text-[10px] text-gray-400 uppercase font-bold mb-1 text-center">Available Chips</div>
      <div class="flex gap-1.5">
        ${['wc', 'tc', 'bb', 'fh'].map(c => `
          <button onclick="promptChip('${c}')" ${chipsUsed[c] || activeChip ? 'disabled' : ''} 
            class="flex-1 py-1 text-[9px] font-bold rounded border ${chipsUsed[c] ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed' : activeChip === c ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'}">
            ${chipLabels[c]}${chipsUsed[c] ? '(Used)' : ''}
          </button>
        `).join('')}
      </div>
      ${activeChip ? `<div class="mt-2 text-center text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/50 py-1 rounded">⚡ Active Chip Locked: ${chipLabels[activeChip]}</div>` : ''}
    </div>

    ${pendingSubId ? `<div class="bg-amber-600 text-white text-xs p-1 text-center font-bold mb-2 rounded">🔄 Select player to swap with ${mySquad.find(p => p.id === pendingSubId)?.name}</div>` : ''}
    
    <div class="bg-gradient-to-b from-emerald-800 to-emerald-900 border-2 border-emerald-400 rounded-xl p-2 flex flex-col justify-around min-h-[260px] shadow-xl">
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <div class="bg-gray-900 border border-gray-700 rounded-xl p-2 mt-2">
      <div class="text-[10px] text-gray-400 font-bold uppercase mb-1 text-center">Bench ${activeChip === 'bb' ? '(Boost Active 🚀)' : ''}</div>
      <div class="flex justify-center gap-2">${bench.map(cardHtml).join('')}</div>
    </div>
    ${renderModal()}
    ${renderChipConfirmModal()}
  `;
  updateHeader();
}

function cardHtml(p) {
  let badge = p.pos;
  if (p.isCaptain) badge += ' (C)';
  if (p.isViceCaptain) badge += ' (VC)';

  return `
    <div onclick="handleCardClick(${p.id})" class="bg-white text-black rounded p-1 text-center w-16 cursor-pointer shadow hover:scale-105 transition">
      <div class="text-[7px] font-black bg-gray-200 uppercase rounded">${badge}</div>
      <div class="text-[10px] font-bold truncate mt-1">${p.name}</div>
      <div class="text-[9px] text-amber-600 font-bold">${p.price}M</div>
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
    alert("Invalid formation! Must have 1 GKP, 3-5 DEF, 2-5 MID, 1-3 FWD.");
  }
  pendingSubId = null;
  saveData();
  renderPitch();
}

// ==========================================
// 5. MODALS (Player & Chip Confirmation)
// ==========================================
function renderModal() {
  if (!activeModalId) return '';
  const p = mySquad.find(x => x.id === activeModalId);
  return `
    <div class="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 border border-gray-600 rounded-xl p-4 w-64 text-center text-white">
        <div class="font-bold text-sm mb-2">${p.name}</div>
        <button onclick="pendingSubId=${p.id}; activeModalId=null; renderPitch();" class="w-full bg-emerald-600 py-1.5 rounded text-xs font-bold mb-2">🔄 Substitute</button>
        <button onclick="setCap(${p.id}, true)" class="w-full bg-amber-600 py-1.5 rounded text-xs font-bold mb-2">👑 Make Captain (C)</button>
        <button onclick="setCap(${p.id}, false)" class="w-full bg-gray-700 py-1.5 rounded text-xs font-bold mb-2">⭐ Make Vice-Captain (VC)</button>
        <button onclick="activeModalId=null; renderPitch();" class="w-full text-gray-400 text-xs mt-1">Cancel</button>
      </div>
    </div>
  `;
}

function renderChipConfirmModal() {
  if (!chipConfirmModal) return '';
  const names = { wc: 'Wildcard', tc: 'Triple Captain', bb: 'Bench Boost', fh: 'Free Hit' };
  return `
    <div class="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800 border border-amber-500/60 rounded-2xl p-4 w-64 text-center text-white shadow-2xl">
        <div class="text-xs text-amber-400 font-bold uppercase">Confirm Chip Activation</div>
        <div class="font-extrabold text-base my-2">Play ${names[chipConfirmModal]}?</div>
        <p class="text-[10px] text-gray-300 mb-4">Once confirmed, this chip will be locked in for the upcoming Gameweek simulation.</p>
        <button onclick="confirmChipPlay()" class="w-full bg-amber-500 text-black py-2 rounded-xl text-xs font-extrabold mb-2 shadow">Confirm & Use Chip</button>
        <button onclick="cancelChipPlay()" class="w-full bg-gray-700 text-gray-300 py-1.5 rounded-xl text-xs font-bold">Cancel</button>
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
// 6. TRANSFERS MARKET
// ==========================================
function renderMarket() {
  const list = document.getElementById('market-list');
  if (!list) return;

  list.innerHTML = playerMarket.map(p => {
    const owned = mySquad.some(s => s.id === p.id);
    return `
      <div class="bg-gray-800 p-2 rounded flex justify-between items-center text-xs mb-1">
        <div>${p.name} (${p.club}) - <span class="text-emerald-400">${p.price}M</span></div>
        <button onclick="${owned ? `sellPlayer(${p.id})` : `buyPlayer(${p.id})`}" class="px-2 py-1 rounded font-bold ${owned ? 'bg-red-600/30 text-red-400' : 'bg-emerald-600/30 text-emerald-400'}">
          ${owned ? 'Sell' : 'Buy'}
        </button>
      </div>
    `;
  }).join('');
}

function buyPlayer(id) {
  const p = playerMarket.find(x => x.id === id);
  if (mySquad.length >= 15) return alert("Squad full (15/15)!");
  
  if (bankBalance < p.price && activeChip !== 'wc' && activeChip !== 'fh') {
    return alert("Not enough budget!");
  }

  mySquad.push({ ...p, isStarter: mySquad.filter(s => s.isStarter).length < 11, isCaptain: false, isViceCaptain: false, gwPoints: 0 });
  if (bankBalance >= p.price && activeChip !== 'wc' && activeChip !== 'fh') {
    bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  }
  
  saveData();
  renderPitch();
  renderMarket();
}

function sellPlayer(id) {
  if (mySquad.length <= 11) return alert("Must keep at least 11 players!");
  const p = mySquad.find(x => x.id === id);
  mySquad = mySquad.filter(x => x.id !== id);
  bankBalance = parseFloat((bankBalance + p.price).toFixed(1));
  saveData();
  renderPitch();
  renderMarket();
}

// ==========================================
// 7. SIMULATION & CHIP EXECUTION
// ==========================================
function simulateGameweek() {
  mySquad.forEach(p => {
    p.gwPoints = Math.random() > 0.3 ? 2 + Math.floor(Math.random() * 6) : 0;
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
    if (p.isCaptain) {
      mult = (activeChip === 'tc' ? 3 : 2);
    }
    if (p.isStarter || activeChip === 'bb') {
      gwTotal += p.gwPoints * mult;
    }
  });

  totalPoints += gwTotal;
  gameweek++;

  if (activeChip === 'fh' && preFreeHitSquad) {
    mySquad = preFreeHitSquad;
    preFreeHitSquad = null;
    chipsUsed.fh = true;
  } else if (activeChip === 'wc') {
    chipsUsed.wc = true;
  } else if (activeChip === 'tc') {
    chipsUsed.tc = true;
  } else if (activeChip === 'bb') {
    chipsUsed.bb = true;
  }

  activeChip = null;
  saveData();
  renderPitch();
  alert(`Gameweek simulated! You scored ${gwTotal} points.`);
}

function updateHeader() {
  document.getElementById('bank-balance').innerText = `${bankBalance}M`;
  document.getElementById('squad-count').innerText = `${mySquad.length}/15`;
  document.getElementById('total-points').innerText = totalPoints;
  document.getElementById('gw-number').innerText = gameweek;
}

function renderPoints() {
  document.getElementById('points-list').innerHTML = `<div class="text-xs text-gray-300">Total Season Points: <b class="text-emerald-400">${totalPoints}</b></div>`;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadData);
