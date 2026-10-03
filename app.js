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
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let totalPoints = 0;
let gameweek = 1;
let freeTransfers = 1;
let transfersMadeInGW = 0;
let myLeagues = ["Overall League"];

let selectedPlayerId = null;
let pendingSubId = null;

const defaultStarterIds = [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13];

function setDefaultSquad() {
  mySquad = playerMarket.map((p) => ({
    ...p,
    purchasePrice: p.price,
    isStarter: defaultStarterIds.includes(p.id),
    isCaptain: p.id === 12,
    isViceCaptain: p.id === 13,
    gwPoints: 0,
    dnp: false
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
    const payload = { mySquad, bankBalance, activeChip, chipsUsed, totalPoints, gameweek, freeTransfers, transfersMadeInGW, myLeagues };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Storage save issue:", e);
  }
}

function resetSquadData() {
  localStorage.removeItem(STORAGE_KEY);
  totalPoints = 0;
  gameweek = 1;
  activeChip = null;
  chipsUsed = { wc: false, tc: false, bb: false, fh: false };
  setDefaultSquad();
  renderPitch();
}

// ==========================================
// 4. PITCH RENDERING (FALLBACK SELECTORS)
// ==========================================
function renderPitch() {
  // Find container across different possible ID names in index.html
  const container = document.getElementById('pitch-container') || 
                    document.getElementById('squad-pitch') || 
                    document.querySelector('.green-pitch-container') ||
                    document.querySelector('main div');

  if (!container) {
    console.error("No pitch container found in DOM.");
    return;
  }

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
    <div class="flex flex-col justify-around h-full space-y-2 w-full p-2">
      <div class="flex justify-center gap-2">${gkps.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${defs.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${mids.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${fwds.map(createPlayerCard).join('')}</div>
    </div>
    <div class="mt-2 p-2 bg-[#17212b]/90 border border-gray-700 rounded-xl text-center w-full">
      <p class="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">Bench</p>
      <div class="flex justify-center gap-2 flex-wrap">${bench.map(createPlayerCard).join('')}</div>
    </div>
  `;
  updateHeader();
}

function createPlayerCard(p) {
  let captainBadge = p.isCaptain ? ' <span class="text-yellow-400 font-black">(C)</span>' : (p.isViceCaptain ? ' <span class="text-gray-300 font-black">(VC)</span>' : '');
  return `
    <div class="bg-[#242f3d] border border-gray-600 rounded-lg p-1.5 text-center min-w-[68px] shadow-md">
      <div class="text-[9px] text-blue-300 font-bold uppercase">${p.pos}${captainBadge}</div>
      <div class="text-[11px] font-bold text-white my-0.5 truncate max-w-[64px]">${p.name}</div>
      <div class="text-[10px] font-black text-green-400">${p.gwPoints || 0} pts</div>
    </div>
  `;
}

// ==========================================
// 5. SIMULATION ENGINE
// ==========================================
function simulateGameweek() {
  let gwPts = 0;
  mySquad.forEach(p => {
    let pts = 2 + Math.floor(Math.random() * 5);
    p.gwPoints = pts;
    if (p.isStarter || activeChip === 'bb') {
      gwPts += p.isCaptain ? pts * 2 : pts;
    }
  });

  totalPoints += gwPts;
  gameweek++;
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
// 6. INITIALIZATION HOOK
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  renderPitch();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  loadUserData();
  renderPitch();
}
