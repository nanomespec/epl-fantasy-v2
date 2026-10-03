// Initialize Telegram SDK
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) { tg.expand(); tg.ready(); }

const userId = tg?.initDataUnsafe?.user?.id || 'guest_user';
const STORAGE_KEY = `epl_fantasy_squad_${userId}`;

// 1. Extended Market Dataset
const playerMarket = [
  { id: 1, name: "S. Bahiru", club: "Saint George", pos: "GKP", price: 5.5, fixture: "NEG (H)" },
  { id: 2, name: "A. Nuri", club: "Ethiopian Coffee", pos: "GKP", price: 5.0, fixture: "SHE (H)" },
  { id: 3, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, fixture: "NEG (H)" },
  { id: 4, name: "E. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, fixture: "NEG (H)" },
  { id: 5, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, fixture: "SHE (H)" },
  { id: 6, name: "S. Bereket", club: "CBE SA", pos: "DEF", price: 5.0, fixture: "SID (A)" },
  { id: 7, name: "Y. Endale", club: "Fasil Kenema", pos: "DEF", price: 5.0, fixture: "WOL (A)" },
  { id: 8, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.0, fixture: "NEG (H)" },
  { id: 9, name: "E. Tadesse", club: "Ethiopian Coffee", pos: "MID", price: 7.5, fixture: "SHE (H)" },
  { id: 10, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.5, fixture: "SID (A)" },
  { id: 11, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, fixture: "HAW (A)" },
  { id: 12, name: "A. Okutu", club: "Saint George", pos: "FWD", price: 9.0, fixture: "NEG (H)" },
  { id: 13, name: "H. Konkoni", club: "Ethiopian Coffee", pos: "FWD", price: 8.0, fixture: "SHE (H)" },
  { id: 14, name: "D. Nathaniel", club: "CBE SA", pos: "FWD", price: 8.5, fixture: "SID (A)" },
  { id: 15, name: "B. Gugsa", club: "Fasil Kenema", pos: "FWD", price: 8.0, fixture: "WOL (A)" }
];

// 2. User State Variables
let mySquad = [];
let bankBalance = 100.0;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let totalPoints = 0;
let gameweek = 1;

let selectedPlayerId = null;
let pendingSubId = null;

// 3. Save & Load Data
function loadUserData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      mySquad = data.mySquad || [];
      bankBalance = data.bankBalance !== undefined ? data.bankBalance : 0.0;
      activeChip = data.activeChip || null;
      chipsUsed = data.chipsUsed || { wc: false, tc: false, bb: false, fh: false };
      totalPoints = data.totalPoints || 0;
      gameweek = data.gameweek || 1;
      return;
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
  }
  
  mySquad = playerMarket.slice(0, 15).map((p, idx) => ({
    ...p,
    isStarter: idx < 11,
    isCaptain: idx === 11,
    isViceCaptain: idx === 12,
    gwPoints: 0
  }));
  bankBalance = 100.0 - mySquad.reduce((sum, p) => sum + p.price, 0);
  saveUserData();
}

function saveUserData() {
  const payload = { mySquad, bankBalance, activeChip, chipsUsed, totalPoints, gameweek };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// 4. Substitution & Formation Validation Rules
function validateFormation(proposedSquad) {
  const starters = proposedSquad.filter(p => p.isStarter);
  const gkps = starters.filter(p => p.pos === 'GKP').length;
  const defs = starters.filter(p => p.pos === 'DEF').length;
  const mids = starters.filter(p => p.pos === 'MID').length;
  const fwds = starters.filter(p => p.pos === 'FWD').length;

  if (gkps !== 1) return "Must have exactly 1 Goalkeeper on the pitch.";
  if (defs < 3 || defs > 5) return "Starting formation must have between 3 and 5 Defenders.";
  if (mids < 2 || mids > 5) return "Starting formation must have between 2 and 5 Midfielders.";
  if (fwds < 1 || fwds > 3) return "Starting formation must have between 1 and 3 Forwards.";

  return null; // Valid
}

function executeSwap(id1, id2) {
  const p1 = mySquad.find(p => p.id === id1);
  const p2 = mySquad.find(p => p.id === id2);
  if (!p1 || !p2) return;

  // GKP Swap Restriction
  if ((p1.pos === 'GKP' || p2.pos === 'GKP') && p1.pos !== p2.pos) {
    alert("Goalkeepers can only be swapped with another Goalkeeper!");
    return;
  }

  // Create speculative squad state
  const testSquad = mySquad.map(p => {
    if (p.id === id1) return { ...p, isStarter: p2.isStarter };
    if (p.id === id2) return { ...p, isStarter: p1.isStarter };
    return p;
  });

  const error = validateFormation(testSquad);
  if (error) {
    alert(`Invalid Substitution!\n${error}`);
    return;
  }

  // Apply Swap
  const tempStarter = p1.isStarter;
  p1.isStarter = p2.isStarter;
  p2.isStarter = tempStarter;

  saveUserData();
  renderPitch();
}

// 5. Simulation Engine
function simulateGameweek() {
  let currentGwPoints = 0;

  mySquad.forEach(player => {
    let pts = 2;
    const rand = Math.random();
    if (player.pos === 'FWD' && rand > 0.4) pts += 4;
    if (player.pos === 'MID' && rand > 0.5) pts += 5;
    if (player.pos === 'MID' && rand > 0.3) pts += 3;
    if ((player.pos === 'DEF' || player.pos === 'GKP') && rand > 0.5) pts += 4;

    player.gwPoints = pts;

    if (player.isStarter || activeChip === 'bb') {
      let multiplier = 1;
      if (player.isCaptain) {
        multiplier = activeChip === 'tc' ? 3 : 2;
      }
      currentGwPoints += (pts * multiplier);
    }
  });

  totalPoints += currentGwPoints;
  gameweek++;

  if (activeChip) {
    chipsUsed[activeChip] = true;
    activeChip = null;
  }

  saveUserData();
  renderPitch();
  alert(`Gameweek Simulated!\nYour Squad earned ${currentGwPoints} points! 🚀`);
}

// 6. Render Pitch
function renderPitch() {
  const container = document.getElementById('pitch-container');
  if (!container) return;

  const starters = mySquad.filter(p => p.isStarter);
  const bench = mySquad.filter(p => !p.isStarter);

  const gkps = starters.filter(p => p.pos === 'GKP');
  const defs = starters.filter(p => p.pos === 'DEF');
  const mids = starters.filter(p => p.pos === 'MID');
  const fwds = starters.filter(p => p.pos === 'FWD');

  container.innerHTML = `
    <div class="flex flex-col justify-around h-full space-y-3 my-auto">
      <div class="flex justify-center gap-2">${gkps.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${defs.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${mids.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${fwds.map(createPlayerCard).join('')}</div>
    </div>
    <div class="mt-4 p-3 bg-[#242f3d]/60 border ${activeChip === 'bb' ? 'border-green-400 bg-green-950/20' : 'border-gray-700'} rounded-xl text-center">
      <p class="text-[10px] font-bold ${activeChip === 'bb' ? 'text-green-400' : 'text-gray-400'} uppercase tracking-wider mb-2">
        Substitutes ${activeChip === 'bb' ? '(Bench Boost Active! 🚀)' : ''}
      </p>
      <div class="flex justify-center gap-2 flex-wrap">${bench.map(createPlayerCard).join('')}</div>
    </div>
  `;
  updateHeader();
  updateChipUI();
}

function createPlayerCard(p) {
  const isPending = pendingSubId === p.id;
  let captainBadge = '';

  if (p.isCaptain) {
    captainBadge = activeChip === 'tc' 
      ? ' <span class="text-yellow-400 font-black">(3xC)</span>' 
      : ' <span class="text-yellow-400 font-black">(C)</span>';
  } else if (p.isViceCaptain) {
    captainBadge = ' <span class="text-gray-300 font-black">(VC)</span>';
  }

  return `
    <div onclick="handlePlayerClick(${p.id})" 
      class="bg-[#242f3d] border ${isPending ? 'border-yellow-400 animate-pulse' : 'border-gray-700'} rounded-lg p-2 text-center min-w-[72px] shadow-md cursor-pointer active:scale-95 transition-all">
      <div class="text-[9px] text-blue-400 font-bold uppercase">${p.pos}${captainBadge}</div>
      <div class="text-xs font-bold text-white my-0.5 truncate max-w-[68px]">${p.name}</div>
      <div class="text-[10px] font-black text-green-400">${p.gwPoints || 0} pts</div>
    </div>
  `;
}

// 7. Navigation & Event Handlers
function switchTab(tab) {
  ['pitch', 'transfers', 'league'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.add('hidden');
    document.getElementById(`btn-${t}`).className = "flex-1 py-1 text-gray-400 font-bold";
  });
  document.getElementById(`tab-${tab}`).classList.remove('hidden');
  document.getElementById(`btn-${tab}`).className = "flex-1 py-1 text-blue-400 font-bold";

  if (tab === 'transfers') renderMarket();
  if (tab === 'league') renderLeague();
}

function playChip(chipKey) {
  if (chipsUsed[chipKey]) return alert("You have already used this chip this season!");
  activeChip = activeChip === chipKey ? null : chipKey;
  saveUserData();
  updateChipUI();
  renderPitch();
}

function updateChipUI() {
  const chipButtons = { wc: 'chip-wc', tc: 'chip-tc', bb: 'chip-bb', fh: 'chip-fh' };
  Object.keys(chipButtons).forEach(key => {
    const btn = document.getElementById(chipButtons[key]);
    if (!btn) return;
    if (activeChip === key) {
      btn.className = "flex-1 py-1.5 bg-green-600 text-white font-black rounded border border-green-400 shadow-lg";
    } else if (chipsUsed[key]) {
      btn.className = "flex-1 py-1.5 bg-gray-800 text-gray-500 font-bold rounded cursor-not-allowed opacity-50";
    } else {
      btn.className = "flex-1 py-1.5 bg-gray-700/50 rounded font-bold hover:bg-gray-600 transition";
    }
  });
}

function handlePlayerClick(id) {
  if (pendingSubId) {
    if (pendingSubId === id) { pendingSubId = null; renderPitch(); return; }
    executeSwap(pendingSubId, id);
    pendingSubId = null;
    return;
  }
  selectedPlayerId = id;
  const player = mySquad.find(p => p.id === id);
  document.getElementById('modal-player-name').innerText = player.name;
  document.getElementById('modal-player-details').innerText = `${player.pos} • ${player.club} • ${player.price}M ETB`;
  document.getElementById('player-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('player-modal').classList.add('hidden');
  selectedPlayerId = null;
}

function prepareSub() { pendingSubId = selectedPlayerId; closeModal(); renderPitch(); }

function setCaptain() {
  mySquad.forEach(p => { p.isCaptain = (p.id === selectedPlayerId); });
  const currentVC = mySquad.find(p => p.isViceCaptain);
  if (currentVC && currentVC.id === selectedPlayerId) currentVC.isViceCaptain = false;
  saveUserData();
  closeModal();
  renderPitch();
}

function setViceCaptain() {
  mySquad.forEach(p => { p.isViceCaptain = (p.id === selectedPlayerId); });
  const currentC = mySquad.find(p => p.isCaptain);
  if (currentC && currentC.id === selectedPlayerId) currentC.isCaptain = false;
  saveUserData();
  closeModal();
  renderPitch();
}

function renderMarket() {
  const list = document.getElementById('market-list');
  list.innerHTML = playerMarket.map(p => {
    const inSquad = mySquad.some(s => s.id === p.id);
    return `
      <div class="bg-[#242f3d] p-3 rounded-lg border border-gray-700 flex justify-between items-center">
        <div>
          <div class="font-bold text-sm text-white">${p.name} <span class="text-xs font-normal text-gray-400">(${p.club})</span></div>
          <div class="text-xs text-blue-400 font-semibold">${p.pos} • ${p.price}M ETB • ${p.fixture}</div>
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
  
  // Max 3 players per club rule
  const clubCount = mySquad.filter(item => item.club === p.club).length;
  if (clubCount >= 3) return alert(`Limit reached! You can only have 3 players from ${p.club}.`);

  if (bankBalance < p.price && activeChip !== 'wc' && activeChip !== 'fh') return alert("Not enough budget!");

  mySquad.push({ ...p, isStarter: mySquad.length < 11, isCaptain: false, isViceCaptain: false, gwPoints: 0 });
  bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  saveUserData();
  renderPitch();
  renderMarket();
}

function sellPlayer(id) {
  const p = mySquad.find(item => item.id === id);
  if (!p) return;
  mySquad = mySquad.filter(item => item.id !== id);
  bankBalance = parseFloat((bankBalance + p.price).toFixed(1));
  saveUserData();
  renderPitch();
  renderMarket();
}

function renderLeague() {
  const list = document.getElementById('league-list');
  const userName = tg?.initDataUnsafe?.user?.first_name ? `${tg.initDataUnsafe.user.first_name}'s Team` : "Gulit FC (You)";
  const leaderboard = [
    { rank: 1, name: userName, pts: totalPoints },
    { rank: 2, name: "Sheger Warriors", pts: Math.max(0, totalPoints - 12) },
    { rank: 3, name: "Addis Strikers", pts: Math.max(0, totalPoints - 24) },
    { rank: 4, name: "Fasil Dynasty", pts: Math.max(0, totalPoints - 31) }
  ];

  list.innerHTML = leaderboard.map(user => `
    <div class="flex justify-between items-center py-1.5 border-b border-gray-700/50 last:border-0">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-gray-400 w-4">#${user.rank}</span>
        <span class="text-sm font-semibold text-white">${user.name}</span>
      </div>
      <span class="text-sm font-bold text-green-400">${user.pts} pts</span>
    </div>
  `).join('');
}

function updateHeader() {
  document.getElementById('bank-balance').innerText = `${bankBalance.toFixed(1)}M ETB`;
  document.getElementById('squad-count').innerText = `${mySquad.length}/15`;
  document.getElementById('total-points').innerText = totalPoints;
  const gwElem = document.getElementById('gw-number');
  if (gwElem) gwElem.innerText = gameweek;
}

// Boot
document.addEventListener('DOMContentLoaded', () => { loadUserData(); renderPitch(); });
loadUserData();
renderPitch();



