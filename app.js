// ==========================================
// 1. STATE & INITIALIZATION
// ==========================================
const STORAGE_KEY = 'epl_fantasy_clean_v1';

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
let bankBalance = 100.0;
let totalPoints = 0;
let gameweek = 1;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let activeModalId = null;
let pendingSubId = null;

const defaultStarters = [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13];

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const data = JSON.parse(saved);
    mySquad = data.mySquad;
    bankBalance = data.bankBalance;
    totalPoints = data.totalPoints;
    gameweek = data.gameweek;
    chipsUsed = data.chipsUsed || chipsUsed;
  } else {
    resetSquad();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ mySquad, bankBalance, totalPoints, gameweek, chipsUsed }));
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
// 3. PITCH & FORMATION RULES (FPL)
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

  container.innerHTML = `
    ${pendingSubId ? `<div class="bg-amber-600 text-white text-xs p-1 text-center font-bold mb-2">🔄 Select player to swap with ${mySquad.find(p => p.id === pendingSubId)?.name}</div>` : ''}
    
    <div class="bg-gradient-to-b from-emerald-800 to-emerald-900 border-2 border-emerald-400 rounded-xl p-2 flex flex-col justify-around min-h-[280px] shadow-xl">
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-2">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <div class="bg-gray-900 border border-gray-700 rounded-xl p-2 mt-2">
      <div class="text-[10px] text-gray-400 font-bold uppercase mb-1 text-center">Bench</div>
      <div class="flex justify-center gap-2">${bench.map(cardHtml).join('')}</div>
    </div>
    ${renderModal()}
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
    // Revert swap if illegal formation
    p2.isStarter = p1.isStarter;
    p1.isStarter = status1;
    alert("Invalid formation! Must have 1 GKP, 3-5 DEF, 2-5 MID, 1-3 FWD.");
  }
  pendingSubId = null;
  saveData();
  renderPitch();
}

// ==========================================
// 4. PLAYER MODAL ACTIONS
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
// 5. TRANSFERS MARKET
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
  if (bankBalance < p.price) return alert("Not enough budget!");

  mySquad.push({ ...p, isStarter: mySquad.filter(s => s.isStarter).length < 11, isCaptain: false, isViceCaptain: false, gwPoints: 0 });
  bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
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
// 6. SIMULATION & AUTO SUBS
// ==========================================
function simulateGameweek() {
  mySquad.forEach(p => {
    p.gwPoints = Math.random() > 0.3 ? 2 + Math.floor(Math.random() * 6) : 0;
  });

  // Real FPL Auto Subs logic
  let starters = mySquad.filter(p => p.isStarter);
  let bench = mySquad.filter(p => !p.isStarter);

  bench.forEach(sub => {
    if (sub.gwPoints === 0) return;
    const starterOut = starters.find(s => s.gwPoints === 0 && (s.pos === sub.pos || s.pos !== 'GKP'));
    if (starterOut) {
      starterOut.isStarter = false;
      sub.isStarter = true;
      starters = mySquad.filter(p => p.isStarter);
    }
  });

  let gwTotal = 0;
  mySquad.forEach(p => {
    let mult = p.isCaptain ? (activeChip === 'tc' ? 3 : 2) : 1;
    if (p.isStarter || activeChip === 'bb') {
      gwTotal += p.gwPoints * mult;
    }
  });

  totalPoints += gwTotal;
  gameweek++;
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
