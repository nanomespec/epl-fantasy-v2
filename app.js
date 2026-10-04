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
const STORAGE_KEY = 'efpl_official_v3';

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
let bankBalance = 1.0;
let totalPoints = 0;
let gameweek = 1;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let activeModalId = null;
let pendingSubId = null;
let chipConfirmModal = null;
let gwHistory = [];

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
      mySquad, preFreeHitSquad, bankBalance, totalPoints, gameweek, chipsUsed, activeChip, gwHistory 
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
    gwPoints: 0
  }));
  bankBalance = 1.0;
  totalPoints = 0;
  gameweek = 1;
  chipsUsed = { wc: false, tc: false, bb: false, fh: false };
  activeChip = null;
  preFreeHitSquad = null;
  gwHistory = [];
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
    
    <div class="fpl-pitch rounded-t-xl p-2 flex flex-col justify-around min-h-[320px] shadow-sm">
      <div class="flex justify-center gap-1">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <div class="bg-white border-x-4 border-b-4 border-[#ffffff] rounded-b-xl p-2 shadow-md">
      <div class="text-[10px] text-fpl-purple font-black uppercase mb-2 flex justify-between px-2">
        <span>Bench</span>
        ${activeChip === 'bb' ? '<span class="text-green-600">Boost Active</span>' : ''}
      </div>
      <div class="flex justify-center gap-1">${bench.map(cardHtml).join('')}</div>
    </div>
    
    ${renderModal()}
    ${renderChipConfirmModal()}
  `;
}

function cardHtml(p) {
  let isCap = p.isCaptain ? '<div class="absolute -top-2 -right-1 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">C</div>' : '';
  let isVice = p.isViceCaptain ? '<div class="absolute -top-2 -right-1 bg-white border border-black text-black text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">V</div>' : '';

  return `
    <div onclick="handleCardClick(${p.id})" class="relative text-center w-[72px] cursor-pointer group">
      ${isCap} ${isVice}
      <div class="mx-auto w-10 h-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23ffffff%22><path d=%22M15.53 2.47a1.25 1.25 0 00-1.77 0L12 4.24l-1.76-1.77a1.25 1.25 0 00-1.77 0l-3.5 3.5v14.5a1 1 0 001 1h12a1 1 0 001-1V5.97l-3.44-3.5z%22/></svg>')] bg-no-repeat bg-center bg-contain mb-1 drop-shadow-md group-hover:scale-110 transition-transform"></div>
      <div class="bg-fpl-dark text-white text-[9px] font-bold rounded-t-[3px] truncate px-1 py-0.5">${p.name.split(' ').pop()}</div>
      <div class="bg-white text-fpl-dark text-[9px] font-bold rounded-b-[3px] shadow-sm">${p.price}</div>
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
  return `
    <div class="fixed inset-0 bg-fpl-dark/80 flex items-end justify-center z-50">
      <div class="bg-white w-full rounded-t-2xl p-5 shadow-2xl animate-[slideUp_0.2s_ease-out]">
        <div class="flex justify-between items-center mb-4 border-b pb-2">
          <div class="font-black text-lg text-fpl-purple">${p.name}</div>
          <button onclick="activeModalId=null; renderPitch();" class="text-gray-400 font-bold text-xl">&times;</button>
        </div>
        <button onclick="pendingSubId=${p.id}; activeModalId=null; renderPitch();" class="w-full bg-gray-100 text-fpl-purple py-3 rounded-lg text-sm font-bold mb-3 shadow-sm border border-gray-200">🔄 Substitute</button>
        <button onclick="setCap(${p.id}, true)" class="w-full bg-fpl-purple text-white py-3 rounded-lg text-sm font-bold mb-3 shadow-sm">👑 Make Captain</button>
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
        <span class="font-black">Player Selection</span>
        <span class="bg-fpl-green text-fpl-purple px-2 py-0.5 rounded text-xs font-bold">${bankBalance}M</span>
      </div>
      
      <div class="p-2 bg-gray-50 text-xs text-gray-500 font-bold border-b flex justify-between px-4">
        <span class="w-2/3">Player</span>
        <span class="w-1/3 text-right">Price / Action</span>
      </div>

      <div class="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
        ${playerMarket.map(p => {
          const owned = mySquad.some(s => s.id === p.id);
          return `
            <div class="p-3 flex justify-between items-center bg-white hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">${p.pos}</div>
                <div>
                  <div class="font-bold text-sm text-fpl-dark">${p.name}</div>
                  <div class="text-[10px] text-gray-500">${p.club}</div>
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

  mySquad.push({ ...p, isStarter: mySquad.filter(s => s.isStarter).length < 11, isCaptain: false, isViceCaptain: false, gwPoints: 0 });
  if (bankBalance >= p.price && activeChip !== 'wc' && activeChip !== 'fh') bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  
  saveData();
  renderAll();
}

function sellPlayer(id) {
  if (mySquad.length <= 11) return showNotification("Must keep at least 11 players!");
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
// 8. SIMULATION LOGIC
// ==========================================
function simulateGameweek() {
  mySquad.forEach(p => { p.gwPoints = Math.random() > 0.3 ? 2 + Math.floor(Math.random() * 6) : 0; });

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

  totalPoints += gwTotal;
  gwHistory.push({ gameweek, points: gwTotal });
  gameweek++;

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
  showNotification(`Gameweek ${gameweek - 1} finished! You scored ${gwTotal} points.`);
}

function updateHeader() {
  document.getElementById('bank-balance').innerText = `${bankBalance}M`;
  document.getElementById('squad-count').innerText = `${mySquad.length}/15`;
  document.getElementById('total-points').innerText = totalPoints;
  document.getElementById('gw-number').innerText = gameweek;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadData);
