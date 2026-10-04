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
const STORAGE_KEY = 'efpl_official_v11';

// Club Colors (Ethiopian Premier League)
const clubColors = {
  "Saint George": { primary: "#FFD700", secondary: "#000080", accent: "#FFFFFF" },
  "Ethiopian Coffee": { primary: "#FF6600", secondary: "#008000", accent: "#FFFFFF" },
  "CBE SA": { primary: "#0047AB", secondary: "#FFFFFF", accent: "#FFD700" },
  "Fasil Kenema": { primary: "#CC0000", secondary: "#FFCC00", accent: "#FFFFFF" },
  "Mechal": { primary: "#006400", secondary: "#FFD700", accent: "#FFFFFF" },
  "Bahir Dar City": { primary: "#FF4500", secondary: "#000080", accent: "#FFFFFF" },
  "Hawassa City": { primary: "#008080", secondary: "#FFFFFF", accent: "#FFD700" },
  "Adama City": { primary: "#800080", secondary: "#FFD700", accent: "#FFFFFF" },
  "Sidama Coffee": { primary: "#008000", secondary: "#FFD700", accent: "#FFFFFF" },
  "Wolayta Dicha": { primary: "#0000FF", secondary: "#FFFFFF", accent: "#FF0000" }
};

let playerMarket = [
  // Goalkeepers (GKP)
  { id: 1, name: "S. Bahiru", club: "Saint George", pos: "GKP", price: 5.5, form: 5.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 2, name: "A. Nuri", club: "Ethiopian Coffee", pos: "GKP", price: 5.0, form: 4.1, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 3, name: "T. Yigezu", club: "Bahir Dar City", pos: "GKP", price: 4.5, form: 4.6, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 4, name: "M. Tilahun", club: "Fasil Kenema", pos: "GKP", price: 4.5, form: 4.9, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 5, name: "B. Desta", club: "Hawassa City", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },

  // Defenders (DEF)
  { id: 6, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 6.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 7, name: "E. Frimpong", club: "Saint George", pos: "DEF", price: 5.0, form: 5.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 8, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, form: 4.5, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 9, name: "S. Bereket", club: "CBE SA", pos: "DEF", price: 4.5, form: 4.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 10, name: "Y. Endale", club: "Fasil Kenema", pos: "DEF", price: 4.5, form: 3.5, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 11, name: "D. Girma", club: "Bahir Dar City", pos: "DEF", price: 4.5, form: 5.0, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 12, name: "K. Asrat", club: "Adama City", pos: "DEF", price: 4.0, form: 4.2, status: 'a', nextOpp: "Wolayta (A)", fdr: 3 },
  { id: 13, name: "H. Lemma", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 4.7, status: 'a', nextOpp: "Mechal (H)", fdr: 3 },

  // Midfielders (MID)
  { id: 14, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.0, form: 7.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 15, name: "E. Tadesse", club: "Ethiopian Coffee", pos: "MID", price: 7.5, form: 7.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 16, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.0, form: 6.9, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 17, name: "G. Panom", club: "Mechal", pos: "MID", price: 6.5, form: 6.1, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 18, name: "F. Alemu", club: "Bahir Dar City", pos: "MID", price: 6.0, form: 5.9, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 19, name: "M. Mekonnen", club: "Hawassa City", pos: "MID", price: 5.5, form: 5.2, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 20, name: "T. Kebede", club: "Adama City", pos: "MID", price: 5.5, form: 5.5, status: 'a', nextOpp: "Wolayta (A)", fdr: 3 },
  { id: 21, name: "W. Tesfaye", club: "Wolayta Dicha", pos: "MID", price: 5.0, form: 4.8, status: 'a', nextOpp: "Adama (H)", fdr: 3 },

  // Forwards (FWD)
  { id: 22, name: "A. Okutu", club: "Saint George", pos: "FWD", price: 8.5, form: 8.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 23, name: "H. Konkoni", club: "Ethiopian Coffee", pos: "FWD", price: 8.0, form: 7.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 24, name: "D. Nathaniel", club: "CBE SA", pos: "FWD", price: 7.5, form: 7.4, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 25, name: "B. Gugsa", club: "Fasil Kenema", pos: "FWD", price: 7.0, form: 5.9, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 26, name: "O. Okiki", club: "Bahir Dar City", pos: "FWD", price: 6.5, form: 6.8, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 27, name: "S. Getachew", club: "Sidama Coffee", pos: "FWD", price: 6.0, form: 6.2, status: 'a', nextOpp: "Mechal (H)", fdr: 3 }
];

// Squad & Transfer Core State
let mySquad = []; // Starts EMPTY so user gets £100m to pick their 15 players
let draftSquad = []; // Draft squad for transfers tab before confirmation
let bankBalance = 100.0; // £100.0m starting budget
let totalPoints = 0;
let gameweek = 1;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let preFreeHitSquad = null;

let pendingSubId = null;
let activeModalId = null;
let chipConfirmModal = null;
let gwHistory = [];
let lastGwEvents = [];

// Transfer tracking
let freeTransfers = 1;
let pendingTransfersCount = 0;
let currentGwHits = 0;

const SQUAD_LIMITS = { GKP: 2, DEF: 5, MID: 5, FWD: 3 };
const MAX_PLAYERS_PER_CLUB = 3;
const TOTAL_SQUAD_SIZE = 15;

// Leagues State
let userLeagues = [
  { 
    id: 'global', 
    name: 'Ethiopian Premier League (Global)', 
    code: 'GLOBAL', 
    type: 'classic',
    members: [{ name: managerName, team: 'Gulit FC', points: 0, p: 0, w: 0, d: 0, l: 0, h2hPts: 0 }] 
  }
];
let activeLeagueId = 'global';
let leagueViewMode = 'classic';

// ==========================================
// 3. FPL SELLING PRICE RULE (50% Profit Retention)
// ==========================================
function getSellingPrice(player) {
  const purchasePrice = player.purchasePrice ?? player.price;
  const currentPrice = player.price;
  if (currentPrice > purchasePrice) {
    const profit = currentPrice - purchasePrice;
    const profitKeep = Math.floor((profit + 0.00001) * 10 / 2) / 10;
    return parseFloat((purchasePrice + profitKeep).toFixed(1));
  }
  return currentPrice;
}

// ==========================================
// 4. AUTO-PICK 15 SQUAD & STARTERS
// ==========================================
function autoPickFullSquad() {
  mySquad = [];
  bankBalance = 100.0;

  const sortedMarket = [...playerMarket].sort((a, b) => a.price - b.price);
  
  const counts = { GKP: 0, DEF: 0, MID: 0, FWD: 0 };
  const clubCounts = {};

  for (let p of sortedMarket) {
    if (mySquad.length >= 15) break;
    const club = p.club;
    if ((clubCounts[club] || 0) >= MAX_PLAYERS_PER_CLUB) continue;
    if (counts[p.pos] < SQUAD_LIMITS[p.pos] && bankBalance >= p.price) {
      mySquad.push({
        ...p,
        purchasePrice: p.price,
        isStarter: false,
        benchOrder: 0,
        isCaptain: false,
        isViceCaptain: false,
        gwPoints: 0,
        minutes: 0,
        stats: { goals: 0, assists: 0, cleanSheet: 0, goalsConceded: 0, yellow: 0 }
      });
      bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
      counts[p.pos]++;
      clubCounts[club] = (clubCounts[club] || 0) + 1;
    }
  }

  autoAssignStarters();
  draftSquad = JSON.parse(JSON.stringify(mySquad));
  saveData();
  renderAll();
  showNotification("⚡ Auto-picked 15 squad within £100.0m budget!");
}

function autoAssignStarters() {
  if (!mySquad || mySquad.length === 0) return;

  mySquad.forEach(p => { p.isStarter = false; p.benchOrder = 0; });

  const gks = mySquad.filter(p => p.pos === 'GKP').sort((a, b) => b.price - a.price);
  const defs = mySquad.filter(p => p.pos === 'DEF').sort((a, b) => b.price - a.price);
  const mids = mySquad.filter(p => p.pos === 'MID').sort((a, b) => b.price - a.price);
  const fwds = mySquad.filter(p => p.pos === 'FWD').sort((a, b) => b.price - a.price);

  if (gks.length > 0) gks[0].isStarter = true;
  for (let i = 0; i < Math.min(3, defs.length); i++) defs[i].isStarter = true;
  for (let i = 0; i < Math.min(2, mids.length); i++) mids[i].isStarter = true;
  if (fwds.length > 0) fwds[0].isStarter = true;

  const unpickedOutfield = [
    ...defs.filter(p => !p.isStarter),
    ...mids.filter(p => !p.isStarter),
    ...fwds.filter(p => !p.isStarter)
  ].sort((a, b) => b.price - a.price);

  let added = 0;
  for (let p of unpickedOutfield) {
    if (added >= 4) break;
    p.isStarter = true;
    added++;
  }

  const benchOutfield = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP').sort((a, b) => b.price - a.price);
  benchOutfield.forEach((p, idx) => { p.benchOrder = idx + 1; });

  const starters = mySquad.filter(p => p.isStarter).sort((a, b) => b.price - a.price);
  if (starters.length > 0) {
    mySquad.forEach(p => { p.isCaptain = false; p.isViceCaptain = false; });
    starters[0].isCaptain = true;
    if (starters[1]) starters[1].isViceCaptain = true;
    else starters[0].isViceCaptain = true;
  }
}

// ==========================================
// 5. STORAGE & INITIALIZATION
// ==========================================
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      mySquad = data.mySquad || [];
      draftSquad = data.draftSquad || JSON.parse(JSON.stringify(mySquad));
      bankBalance = data.bankBalance ?? 100.0;
      totalPoints = data.totalPoints ?? 0;
      gameweek = data.gameweek ?? 1;
      chipsUsed = data.chipsUsed || chipsUsed;
      activeChip = data.activeChip || null;
      gwHistory = data.gwHistory || [];
      lastGwEvents = data.lastGwEvents || [];
      freeTransfers = data.freeTransfers ?? 1;
      currentGwHits = data.currentGwHits ?? 0;
      if (data.playerMarket) playerMarket = data.playerMarket;
      if (data.userLeagues) userLeagues = data.userLeagues;

      syncLeagueData();
      renderAll();
      return;
    }
  } catch (e) {
    console.warn("Storage restricted", e);
  }
  resetSquad();
}

function saveData() {
  syncLeagueData();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      mySquad, draftSquad, bankBalance, totalPoints, gameweek, chipsUsed, activeChip, gwHistory, lastGwEvents,
      freeTransfers, currentGwHits, playerMarket, userLeagues
    }));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

function syncLeagueData() {
  userLeagues.forEach(league => {
    let member = league.members.find(m => m.name === managerName);
    if (member) member.points = totalPoints;
    else league.members.push({ name: managerName, team: 'Gulit FC', points: totalPoints, p: gameweek - 1, w: 0, d: 0, l: 0, h2hPts: 0 });
  });
}

function resetSquad() {
  mySquad = [];
  draftSquad = [];
  bankBalance = 100.0;
  totalPoints = 0;
  gameweek = 1;
  chipsUsed = { wc: false, tc: false, bb: false, fh: false };
  activeChip = null;
  gwHistory = [];
  lastGwEvents = [];
  freeTransfers = 1;
  currentGwHits = 0;
  pendingTransfersCount = 0;
  saveData();
  renderAll();
}

// ==========================================
// 6. UI RENDER & TAB NAVIGATION
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
// 7. PITCH & INTERACTIVE SUBSTITUTIONS
// ==========================================
function isValidFormation(starters) {
  if (starters.length !== 11) return false;
  const gk = starters.filter(p => p.pos === 'GKP').length;
  const def = starters.filter(p => p.pos === 'DEF').length;
  const mid = starters.filter(p => p.pos === 'MID').length;
  const fwd = starters.filter(p => p.pos === 'FWD').length;
  return gk === 1 && def >= 3 && def <= 5 && mid >= 2 && mid <= 5 && fwd >= 1 && fwd <= 3;
}

function startSwap(id) {
  pendingSubId = id;
  activeModalId = null;
  renderPitch();
  showNotification("🔄 Tap another player to execute the substitution!");
}

function executeSwap(id1, id2) {
  if (id1 === id2) { pendingSubId = null; renderPitch(); return; }
  const p1 = mySquad.find(p => p.id === id1);
  const p2 = mySquad.find(p => p.id === id2);

  if (!p1 || !p2) { pendingSubId = null; renderPitch(); return; }

  if ((p1.pos === 'GKP' && p2.pos !== 'GKP') || (p2.pos === 'GKP' && p1.pos !== 'GKP')) {
    pendingSubId = null;
    showNotification("Goalkeepers can only swap with the bench Goalkeeper!");
    renderPitch();
    return;
  }

  const status1 = p1.isStarter;
  p1.isStarter = p2.isStarter;
  p2.isStarter = status1;

  if (!isValidFormation(mySquad.filter(p => p.isStarter))) {
    p2.isStarter = p1.isStarter;
    p1.isStarter = status1;
    showNotification("Invalid FPL Formation! Must maintain 1 GKP, 3-5 DEF, 2-5 MID, 1-3 FWD.");
  }

  const outfieldBench = mySquad.filter(x => !x.isStarter && x.pos !== 'GKP');
  outfieldBench.forEach((p, idx) => { p.benchOrder = idx + 1; });

  pendingSubId = null;
  saveData();
  renderPitch();
}

function renderPitch() {
  const container = document.getElementById('pitch-container');
  if (!container) return;

  if (mySquad.length < 15) {
    container.innerHTML = `
      <div class="bg-white rounded-xl shadow-md p-6 text-center">
        <div class="text-4xl mb-2">⚽</div>
        <h3 class="font-black text-fpl-purple text-lg mb-1">Incomplete Squad (${mySquad.length}/15 Players)</h3>
        <p class="text-xs text-gray-500 mb-4">You have £${bankBalance}m available in your bank to select your squad or use Auto-Pick.</p>
        <div class="flex gap-2 justify-center">
          <button onclick="autoPickFullSquad()" class="bg-fpl-purple text-fpl-green font-black text-xs px-4 py-2.5 rounded-lg shadow hover:opacity-90">
            ⚡ Auto-Pick 15 Squad (£100m)
          </button>
          <button onclick="switchTab('transfers')" class="bg-fpl-green text-fpl-purple font-black text-xs px-4 py-2.5 rounded-lg shadow">
            🛒 Go to Market
          </button>
        </div>
      </div>
    `;
    return;
  }

  const starters = mySquad.filter(p => p.isStarter);
  const benchGkp = mySquad.find(p => !p.isStarter && p.pos === 'GKP');
  const benchOutfield = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => a.benchOrder - b.benchOrder);

  const chipLabels = { wc: 'Wildcard', tc: 'Triple Captain', bb: 'Bench Boost', fh: 'Free Hit' };

  container.innerHTML = `
    <div class="bg-white rounded-lg shadow-sm p-2 mb-3">
      <div class="flex gap-2 mb-2">
        ${['wc', 'tc', 'bb', 'fh'].map(c => `
          <button onclick="promptChip('${c}')" ${chipsUsed[c] || activeChip ? 'disabled' : ''} 
            class="flex-1 py-1.5 text-[9px] font-bold rounded ${chipsUsed[c] ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : activeChip === c ? 'bg-fpl-purple text-fpl-green' : 'bg-white border border-gray-300 text-fpl-purple hover:bg-gray-50'}">
            ${chipLabels[c]}
          </button>
        `).join('')}
      </div>
      <button onclick="autoAssignStarters(); saveData(); renderPitch();" class="w-full bg-fpl-purple text-fpl-green text-xs font-bold py-1.5 rounded shadow-sm">
        ⚡ Auto-Select Best Starting XI
      </button>
      ${activeChip ? `<div class="mt-2 text-center text-xs font-bold text-fpl-purple bg-fpl-green py-1 rounded">⚡ Active Chip: ${chipLabels[activeChip]}</div>` : ''}
    </div>

    ${pendingSubId ? `<div class="bg-amber-400 text-fpl-dark text-xs p-2 text-center font-bold mb-2 rounded-lg shadow animate-pulse">🔄 Select player to swap with ${mySquad.find(p => p.id === pendingSubId)?.name} (Tap card)</div>` : ''}
    
    <!-- Pitch Display -->
    <div class="football-pitch rounded-t-2xl p-3 flex flex-col justify-around min-h-[340px] mb-1">
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <!-- Bench Display -->
    <div class="bg-white rounded-b-2xl p-3 shadow-md border border-gray-200">
      <div class="text-[10px] text-fpl-purple font-black uppercase mb-2 flex justify-between px-1">
        <span>Substitutes (Auto-Sub Priority Order)</span>
        ${activeChip === 'bb' ? '<span class="text-green-600 font-bold">Bench Boost Active ⚡</span>' : ''}
      </div>
      <div class="grid grid-cols-4 gap-1 text-center">
        <div class="flex flex-col items-center">
          <span class="text-[8px] font-bold text-gray-400 mb-1">GK</span>
          ${benchGkp ? cardHtml(benchGkp) : ''}
        </div>
        ${benchOutfield.map((p, idx) => `
          <div class="flex flex-col items-center">
            <span class="text-[8px] font-bold text-fpl-purple mb-1">Sub ${idx + 1}</span>${cardHtml(p)}
          </div>
        `).join('')}
      </div>
    </div>
    
    ${renderModal()}
    ${renderChipConfirmModal()}
  `;
}

function cardHtml(p) {
  let isCap = p.isCaptain ? '<div class="absolute -top-2 -right-1 bg-black text-fpl-green text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-fpl-green shadow z-10">C</div>' : '';
  let isVice = p.isViceCaptain ? '<div class="absolute -top-2 -right-1 bg-white text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow z-10">V</div>' : '';

  const isPendingTarget = pendingSubId && pendingSubId !== p.id;
  const colors = clubColors[p.club] || { primary: "#37003c", secondary: "#00ff85", accent: "#ffffff" };

  return `
    <div onclick="handleCardClick(${p.id})" class="player-card relative text-center w-[74px] p-1.5 cursor-pointer select-none rounded-lg transition-transform ${isPendingTarget ? 'ring-2 ring-amber-400 scale-105 bg-amber-500/20' : ''}">
      ${isCap} ${isVice}
      <div class="mx-auto w-8 h-8 rounded-full flex items-center justify-center shadow-md mb-1 relative overflow-hidden border border-white/30" style="background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});">
        <span class="text-[9px] font-black" style="color: ${colors.accent};">${p.club.split(' ').map(w => w[0]).join('')}</span>
      </div>
      <div class="text-white text-[9px] font-bold truncate px-0.5">${p.name.split(' ').pop()}</div>
      <div class="flex justify-between items-center bg-black/40 rounded px-1 mt-1 text-[8px]">
        <span class="text-gray-300">£${p.price}m</span>
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

function renderModal() {
  if (!activeModalId) return '';
  const p = mySquad.find(x => x.id === activeModalId);
  if (!p) return '';

  const sellVal = getSellingPrice(p);

  return `
    <div class="fixed inset-0 bg-fpl-dark/80 flex items-end justify-center z-50">
      <div class="bg-white w-full rounded-t-2xl p-5 shadow-2xl">
        <div class="flex justify-between items-center mb-2 border-b pb-2">
          <div class="font-black text-lg text-fpl-purple">${p.name} <span class="text-xs font-normal text-gray-500">(${p.club})</span></div>
          <button onclick="activeModalId=null; renderPitch();" class="text-gray-400 font-bold text-xl">&times;</button>
        </div>
        
        <div class="bg-gray-50 border rounded-lg p-3 mb-3 text-xs space-y-2">
          <div class="flex justify-between items-center border-b pb-1">
            <span class="font-bold text-gray-500 uppercase text-[9px]">Position & Team</span>
            <span class="font-bold text-fpl-purple">${p.pos} | ${p.club}</span>
          </div>
          <div class="flex justify-between items-center border-b pb-1">
            <span class="font-bold text-gray-500 uppercase text-[9px]">Valuation</span>
            <span class="font-black text-fpl-dark">Cost: £${p.purchasePrice || p.price}m | Sell: £${sellVal}m</span>
          </div>
        </div>

        <button onclick="startSwap(${p.id})" class="w-full bg-fpl-green text-fpl-purple py-3 rounded-lg text-sm font-black mb-2 shadow">🔄 Swap / Substitute</button>
        <button onclick="setCap(${p.id}, true)" class="w-full bg-fpl-purple text-white py-2.5 rounded-lg text-xs font-bold mb-2">👑 Make Captain (2x Points)</button>
        <button onclick="setCap(${p.id}, false)" class="w-full bg-white border border-fpl-purple text-fpl-purple py-2.5 rounded-lg text-xs font-bold">⭐ Make Vice-Captain</button>
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
// 8. REAL FPL TRANSFERS & DRAFTING MODE
// ==========================================
function renderMarket() {
  const container = document.getElementById('tab-transfers');
  if (!container) return;

  const squadToUse = draftSquad.length > 0 ? draftSquad : mySquad;
  const squadSize = squadToUse.length;

  // Calculate pending transfers & hits
  const currentFree = freeTransfers;
  const isGw1 = (gameweek === 1);
  const hitsIncurred = isGw1 ? 0 : Math.max(0, (pendingTransfersCount - currentFree) * 4);

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-fpl-purple text-white p-3 flex justify-between items-center">
        <div>
          <span class="font-black text-sm block">Transfer Market</span>
          <span class="text-[10px] text-gray-300">Gameweek ${gameweek} ${isGw1 ? '(Unlimited Free Transfers)' : ''}</span>
        </div>
        <div class="flex gap-2 text-xs">
          <span class="bg-fpl-green text-fpl-purple px-2 py-0.5 rounded font-bold">Bank: £${bankBalance}M</span>
          <span class="bg-white/20 text-white px-2 py-0.5 rounded font-bold">Squad: ${squadSize}/15</span>
        </div>
      </div>
      
      ${pendingTransfersCount > 0 ? `
        <div class="bg-amber-50 p-3 border-b border-amber-200 flex justify-between items-center text-xs">
          <div>
            <span class="font-black text-amber-900 block">Pending Transfers: ${pendingTransfersCount}</span>
            <span class="text-[10px] text-amber-700">${isGw1 ? 'No point hits in Gameweek 1' : hitsIncurred > 0 ? `Point Hit: -${hitsIncurred} pts` : 'Within Free Transfer limit'}</span>
          </div>
          <div class="flex gap-2">
            <button onclick="cancelPendingTransfers()" class="bg-gray-200 text-gray-700 px-2.5 py-1 rounded font-bold">Cancel</button>
            <button onclick="confirmTransfers()" class="bg-fpl-purple text-fpl-green px-3 py-1 rounded font-black shadow">Confirm</button>
          </div>
        </div>
      ` : ''}

      <div class="p-2 bg-gray-50 text-xs text-gray-500 font-bold border-b flex justify-between px-4">
        <span class="w-2/3">Player & Fixture</span>
        <span class="w-1/3 text-right">Price / Action</span>
      </div>

      <div class="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
        ${playerMarket.map(p => {
          const owned = squadToUse.find(s => s.id === p.id);
          const sellVal = owned ? getSellingPrice(owned) : p.price;

          return `
            <div class="p-3 flex justify-between items-center bg-white hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">${p.pos}</div>
                <div>
                  <div class="font-bold text-sm text-fpl-dark">${p.name}</div>
                  <div class="text-[10px] text-gray-500">${p.club} • Form: ${p.form}</div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="font-black text-fpl-purple mb-0.5">£${p.price}m</span>
                <button onclick="${owned ? `draftSell(${p.id})` : `draftBuy(${p.id})`}" 
                  class="px-4 py-1 rounded text-xs font-bold shadow-sm ${owned ? 'bg-white border border-red-500 text-red-500' : 'bg-fpl-green text-fpl-purple'}">
                  ${owned ? 'Sell' : 'Buy'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function draftBuy(id) {
  const p = playerMarket.find(x => x.id === id);
  if (!p) return;

  const currentSquad = draftSquad.length > 0 ? draftSquad : mySquad;

  if (currentSquad.length >= 15) return showNotification("Squad is full (15 players). Sell a player first!");
  if (bankBalance < p.price) return showNotification(`Insufficient funds! Need £${p.price}m (Bank: £${bankBalance}m)`);

  const samePos = currentSquad.filter(x => x.pos === p.pos).length;
  if (samePos >= SQUAD_LIMITS[p.pos]) return showNotification(`Max ${SQUAD_LIMITS[p.pos]} ${p.pos}s allowed.`);

  const sameClub = currentSquad.filter(x => x.club === p.club).length;
  if (sameClub >= MAX_PLAYERS_PER_CLUB) return showNotification(`Max 3 players from ${p.club} allowed.`);

  if (draftSquad.length === 0) draftSquad = JSON.parse(JSON.stringify(mySquad));

  draftSquad.push({
    ...p,
    purchasePrice: p.price,
    isStarter: false,
    benchOrder: 0,
    isCaptain: false,
    isViceCaptain: false,
    gwPoints: 0,
    minutes: 0,
    stats: { goals: 0, assists: 0, cleanSheet: 0, goalsConceded: 0, yellow: 0 }
  });

  bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  pendingTransfersCount++;
  renderMarket();
}

function draftSell(id) {
  if (draftSquad.length === 0) draftSquad = JSON.parse(JSON.stringify(mySquad));

  const p = draftSquad.find(x => x.id === id);
  if (!p) return;

  const sellVal = getSellingPrice(p);
  draftSquad = draftSquad.filter(x => x.id !== id);
  bankBalance = parseFloat((bankBalance + sellVal).toFixed(1));
  pendingTransfersCount++;
  renderMarket();
}

function confirmTransfers() {
  if (draftSquad.length < 15) return showNotification("You must have a full 15-player squad before confirming!");

  mySquad = JSON.parse(JSON.stringify(draftSquad));
  draftSquad = [];

  const isGw1 = (gameweek === 1);
  if (!isGw1) {
    const hits = Math.max(0, (pendingTransfersCount - freeTransfers) * 4);
    currentGwHits += hits;
    freeTransfers = Math.max(0, freeTransfers - pendingTransfersCount);
  }

  pendingTransfersCount = 0;
  autoAssignStarters();
  saveData();
  renderAll();
  showNotification("✅ Transfers confirmed successfully!");
}

function cancelPendingTransfers() {
  draftSquad = [];
  pendingTransfersCount = 0;
  loadData();
  renderMarket();
  showNotification("Pending transfers canceled.");
}

// ==========================================
// 9. LEAGUES & POINTS
// ==========================================
function renderLeagues() {
  const container = document.getElementById('tab-leagues');
  if (!container) return;

  const activeLeague = userLeagues.find(l => l.id === activeLeagueId) || userLeagues[0];
  const sortedMembers = [...activeLeague.members].sort((a, b) => b.points - a.points);

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 class="font-black text-fpl-purple text-base mb-3">${activeLeague.name}</h2>
      <div class="space-y-2">
        ${sortedMembers.map((m, idx) => `
          <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
            <span class="font-black text-gray-500 w-6">#${idx + 1}</span>
            <div class="flex-1">
              <div class="font-bold text-sm text-fpl-dark">${m.team}</div>
              <div class="text-[10px] text-gray-500">${m.name}</div>
            </div>
            <span class="font-black text-fpl-purple">${m.points} pts</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPoints() {
  const container = document.getElementById('tab-points');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
      <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Overall Points</div>
      <div class="text-4xl font-black text-fpl-green mb-4">${totalPoints}</div>
      <button onclick="simulateGameweek()" class="w-full bg-fpl-purple text-fpl-green font-black py-3 rounded-lg shadow">
        ⚽ Simulate Gameweek ${gameweek}
      </button>
    </div>
  `;
}

// ==========================================
// 10. GAMEWEEK SIMULATION
// ==========================================
function simulateGameweek() {
  if (mySquad.length < 15) return showNotification("Must have 15 players in squad to play Gameweek!");

  let gwTotal = 0;

  mySquad.forEach(p => {
    let minutes = Math.random() > 0.1 ? 90 : 0;
    let pts = minutes > 0 ? Math.floor(Math.random() * 8) + 2 : 0;
    p.minutes = minutes;
    p.gwPoints = pts;
  });

  // Strict FPL Auto-Sub logic
  const starterGkp = mySquad.find(p => p.isStarter && p.pos === 'GKP');
  const benchGkp = mySquad.find(p => !p.isStarter && p.pos === 'GKP');
  if (starterGkp && starterGkp.minutes === 0 && benchGkp && benchGkp.minutes > 0) {
    starterGkp.isStarter = false;
    benchGkp.isStarter = true;
  }

  const cap = mySquad.find(p => p.isCaptain) || mySquad.find(p => p.isStarter);
  const capMult = activeChip === 'tc' ? 3 : 2;

  mySquad.filter(p => p.isStarter || activeChip === 'bb').forEach(p => {
    let mult = (cap && p.id === cap.id) ? capMult : 1;
    gwTotal += (p.gwPoints * mult);
  });

  // Apply hit penalties
  gwTotal -= currentGwHits;

  totalPoints += Math.max(0, gwTotal);
  gwHistory.push({ gameweek, points: gwTotal });

  gameweek++;
  currentGwHits = 0;
  freeTransfers = Math.min(5, freeTransfers + 1);

  saveData();
  renderAll();
  showNotification(`Gameweek ${gameweek - 1} complete! Score: ${gwTotal} pts`);
}

function promptChip(c) {
  activeChip = c;
  saveData();
  renderPitch();
}

function updateHeader() {
  const bEl = document.getElementById('bank-balance');
  const sEl = document.getElementById('squad-count');
  const pEl = document.getElementById('total-points');
  const gEl = document.getElementById('gw-number');

  if (bEl) bEl.innerText = `${bankBalance}M`;
  if (sEl) sEl.innerText = `${mySquad.length}/15`;
  if (pEl) pEl.innerText = totalPoints;
  if (gEl) gEl.innerText = gameweek;
}

function showNotification(msg) {
  if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg);
  else alert(msg);
}

document.addEventListener('DOMContentLoaded', loadData);
