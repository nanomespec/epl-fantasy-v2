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
const STORAGE_KEY = 'efpl_official_v10';

// Club Kit & Crest Colors (Ethiopian Premier League)
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
  { id: 3, name: "T. Yigezu", club: "Bahir Dar City", pos: "GKP", price: 4.8, form: 4.6, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 4, name: "M. Tilahun", club: "Fasil Kenema", pos: "GKP", price: 5.0, form: 4.9, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 5, name: "B. Desta", club: "Hawassa City", pos: "GKP", price: 4.5, form: 3.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },

  // Defenders (DEF)
  { id: 6, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 6.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 7, name: "E. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 5.8, status: 'i', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 8, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, form: 4.5, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 9, name: "S. Bereket", club: "CBE SA", pos: "DEF", price: 5.0, form: 4.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 10, name: "Y. Endale", club: "Fasil Kenema", pos: "DEF", price: 5.0, form: 3.5, status: 's', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 11, name: "D. Girma", club: "Bahir Dar City", pos: "DEF", price: 4.5, form: 5.0, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 12, name: "K. Asrat", club: "Adama City", pos: "DEF", price: 4.5, form: 4.2, status: 'a', nextOpp: "Wolayta (A)", fdr: 3 },
  { id: 13, name: "H. Lemma", club: "Sidama Coffee", pos: "DEF", price: 4.8, form: 4.7, status: 'a', nextOpp: "Mechal (H)", fdr: 3 },

  // Midfielders (MID)
  { id: 14, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.0, form: 7.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 15, name: "E. Tadesse", club: "Ethiopian Coffee", pos: "MID", price: 7.5, form: 7.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 16, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.5, form: 6.9, status: 'd', nextOpp: "St. George (A)", fdr: 4 },
  { id: 17, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, form: 6.1, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 18, name: "F. Alemu", club: "Bahir Dar City", pos: "MID", price: 6.5, form: 5.9, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 19, name: "M. Mekonnen", club: "Hawassa City", pos: "MID", price: 6.0, form: 5.2, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 20, name: "T. Kebede", club: "Adama City", pos: "MID", price: 6.5, form: 5.5, status: 'a', nextOpp: "Wolayta (A)", fdr: 3 },
  { id: 21, name: "W. Tesfaye", club: "Wolayta Dicha", pos: "MID", price: 5.5, form: 4.8, status: 'a', nextOpp: "Adama (H)", fdr: 3 },

  // Forwards (FWD)
  { id: 22, name: "A. Okutu", club: "Saint George", pos: "FWD", price: 9.0, form: 8.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 23, name: "H. Konkoni", club: "Ethiopian Coffee", pos: "FWD", price: 8.0, form: 7.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 24, name: "D. Nathaniel", club: "CBE SA", pos: "FWD", price: 8.5, form: 7.4, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 25, name: "B. Gugsa", club: "Fasil Kenema", pos: "FWD", price: 8.0, form: 5.9, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 26, name: "O. Okiki", club: "Bahir Dar City", pos: "FWD", price: 7.5, form: 6.8, status: 'a', nextOpp: "Hawassa (H)", fdr: 2 },
  { id: 27, name: "S. Getachew", club: "Sidama Coffee", pos: "FWD", price: 7.0, form: 6.2, status: 'a', nextOpp: "Mechal (H)", fdr: 3 }
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
let lastGwEvents = [];

// FPL Squad Constraints
const SQUAD_LIMITS = { GKP: 2, DEF: 5, MID: 5, FWD: 3 };
const MAX_PLAYERS_PER_CLUB = 3;
const TOTAL_SQUAD_SIZE = 15;

// FPL Transfer State
let freeTransfers = 1; // Can bank up to 5 FTs
let transfersMade = 0;
let transferCostPenalty = 0;

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
// 3. FPL PRICE & VALUE CALCULATIONS
// ==========================================
// Real FPL Selling Price Rule:
// Profit is halved (rounded down to nearest £0.1m). Loss is deducted 1:1.
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
// 4. AUTO-PICK STARTERS & BENCH ASSIGNMENT
// ==========================================
function autoAssignStarters() {
  if (!mySquad || mySquad.length === 0) return;

  mySquad.forEach(p => { p.isStarter = false; p.benchOrder = 0; });

  const gks = mySquad.filter(p => p.pos === 'GKP').sort((a, b) => b.price - a.price || b.form - a.form);
  const defs = mySquad.filter(p => p.pos === 'DEF').sort((a, b) => b.price - a.price || b.form - a.form);
  const mids = mySquad.filter(p => p.pos === 'MID').sort((a, b) => b.price - a.price || b.form - a.form);
  const fwds = mySquad.filter(p => p.pos === 'FWD').sort((a, b) => b.price - a.price || b.form - a.form);

  // Mandatory starters: 1 GKP, 3 DEF, 2 MID, 1 FWD
  if (gks.length > 0) gks[0].isStarter = true;
  for (let i = 0; i < Math.min(3, defs.length); i++) defs[i].isStarter = true;
  for (let i = 0; i < Math.min(2, mids.length); i++) mids[i].isStarter = true;
  if (fwds.length > 0) fwds[0].isStarter = true;

  // Fill remaining 4 outfield starter spots
  const unpickedOutfield = [
    ...defs.filter(p => !p.isStarter),
    ...mids.filter(p => !p.isStarter),
    ...fwds.filter(p => !p.isStarter)
  ].sort((a, b) => b.price - a.price || b.form - a.form);

  let added = 0;
  for (let p of unpickedOutfield) {
    if (added >= 4) break;
    const currentDefs = mySquad.filter(x => x.isStarter && x.pos === 'DEF').length;
    const currentMids = mySquad.filter(x => x.isStarter && x.pos === 'MID').length;
    const currentFwds = mySquad.filter(x => x.isStarter && x.pos === 'FWD').length;

    if (p.pos === 'DEF' && currentDefs < 5) { p.isStarter = true; added++; }
    else if (p.pos === 'MID' && currentMids < 5) { p.isStarter = true; added++; }
    else if (p.pos === 'FWD' && currentFwds < 3) { p.isStarter = true; added++; }
  }

  // Assign Bench Orders (Bench GKP = 0, Outfield Bench = 1, 2, 3)
  const benchOutfield = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => b.price - a.price);
  benchOutfield.forEach((p, idx) => { p.benchOrder = idx + 1; });

  // Set Captain & Vice-Captain
  const starters = mySquad.filter(p => p.isStarter).sort((a, b) => b.price - a.price);
  if (starters.length > 0) {
    mySquad.forEach(p => { p.isCaptain = false; p.isViceCaptain = false; });
    starters[0].isCaptain = true;
    if (starters[1]) starters[1].isViceCaptain = true;
    else starters[0].isViceCaptain = true;
  }
}

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
      lastGwEvents = data.lastGwEvents || [];
      freeTransfers = data.freeTransfers ?? 1;
      transfersMade = data.transfersMade ?? 0;
      transferCostPenalty = data.transferCostPenalty ?? 0;
      if (data.playerMarket) playerMarket = data.playerMarket;
      if (data.userLeagues) userLeagues = data.userLeagues;
      
      if (!mySquad.some(p => p.isStarter)) {
        autoAssignStarters();
      }

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
      mySquad, preFreeHitSquad, bankBalance, totalPoints, gameweek, chipsUsed, activeChip, gwHistory, lastGwEvents,
      freeTransfers, transfersMade, transferCostPenalty, playerMarket, userLeagues
    }));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

function syncLeagueData() {
  userLeagues.forEach(league => {
    let member = league.members.find(m => m.name === managerName);
    if (member) {
      member.points = totalPoints;
    } else {
      league.members.push({ name: managerName, team: 'Gulit FC', points: totalPoints, p: gameweek - 1, w: 0, d: 0, l: 0, h2hPts: 0 });
    }
  });
}

function resetSquad() {
  mySquad = playerMarket.slice(0, 15).map(p => ({
    ...p,
    purchasePrice: p.price,
    isStarter: false,
    benchOrder: 0,
    isCaptain: false,
    isViceCaptain: false,
    gwPoints: 0,
    minutes: 0,
    stats: { goals: 0, assists: 0, cleanSheet: 0, goalsConceded: 0, yellow: 0 }
  }));

  autoAssignStarters();

  bankBalance = 1.0;
  totalPoints = 0;
  gameweek = 1;
  chipsUsed = { wc: false, tc: false, bb: false, fh: false };
  activeChip = null;
  preFreeHitSquad = null;
  gwHistory = [];
  lastGwEvents = [];
  freeTransfers = 1;
  transfersMade = 0;
  transferCostPenalty = 0;
  userLeagues = [
    { 
      id: 'global', 
      name: 'Ethiopian Premier League (Global)', 
      code: 'GLOBAL', 
      type: 'classic',
      members: [{ name: managerName, team: 'Gulit FC', points: 0, p: 0, w: 0, d: 0, l: 0, h2hPts: 0 }] 
    }
  ];
  saveData();
  renderAll();
}

// ==========================================
// 5. NAVIGATION & RENDER
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
// 6. CHIPS & MODALS
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
  if (window.Telegram?.WebApp?.showAlert) {
    window.Telegram.WebApp.showAlert(msg);
  } else {
    alert(msg);
  }
}

// ==========================================
// 7. PITCH, BENCH ORDERING & FORMATION VALIDATION
// ==========================================
function isValidFormation(starters) {
  if (starters.length !== 11) return false;
  const gk = starters.filter(p => p.pos === 'GKP').length;
  const def = starters.filter(p => p.pos === 'DEF').length;
  const mid = starters.filter(p => p.pos === 'MID').length;
  const fwd = starters.filter(p => p.pos === 'FWD').length;
  return gk === 1 && def >= 3 && def <= 5 && mid >= 2 && mid <= 5 && fwd >= 1 && fwd <= 3;
}

function shiftBenchOrder(id, direction) {
  const p = mySquad.find(x => x.id === id);
  if (!p || p.isStarter || p.pos === 'GKP') return;

  const outfieldBench = mySquad.filter(x => !x.isStarter && x.pos !== 'GKP')
    .sort((a, b) => a.benchOrder - b.benchOrder);

  const currIdx = outfieldBench.findIndex(x => x.id === id);
  const targetIdx = currIdx + direction;

  if (targetIdx >= 0 && targetIdx < outfieldBench.length) {
    const swapPlayer = outfieldBench[targetIdx];
    const tempOrder = p.benchOrder;
    p.benchOrder = swapPlayer.benchOrder;
    swapPlayer.benchOrder = tempOrder;
    saveData();
    renderPitch();
  }
}

function handleAutoPickUI() {
  autoAssignStarters();
  saveData();
  renderPitch();
  showNotification("⚡ Starting XI auto-selected with strict FPL formation!");
}

function renderPitch() {
  const container = document.getElementById('pitch-container');
  if (!container) return;

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
      <button onclick="handleAutoPickUI()" class="w-full bg-fpl-purple text-fpl-green text-xs font-bold py-1.5 rounded shadow-sm hover:opacity-90">
        ⚡ Auto-Pick Best Starting XI
      </button>
      ${activeChip ? `<div class="mt-2 text-center text-xs font-bold text-fpl-purple bg-fpl-green py-1 rounded">⚡ Active Chip: ${chipLabels[activeChip]}</div>` : ''}
    </div>

    ${pendingSubId ? `<div class="bg-fpl-purple text-fpl-green text-xs p-2 text-center font-bold mb-3 rounded-lg shadow">🔄 Select player to swap with</div>` : ''}
    
    <!-- Pitch Graphic -->
    <div class="football-pitch rounded-t-2xl p-3 flex flex-col justify-around min-h-[340px] mb-1">
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <!-- Bench Container with FPL Sub Priorities -->
    <div class="bg-white rounded-b-2xl p-3 shadow-md border border-gray-200">
      <div class="text-[10px] text-fpl-purple font-black uppercase mb-2 flex justify-between px-1">
        <span>Substitutes (Auto-Sub Priority)</span>
        ${activeChip === 'bb' ? '<span class="text-green-600 font-bold">Bench Boost Active ⚡</span>' : ''}
      </div>
      <div class="grid grid-cols-4 gap-1 text-center">
        <!-- GK Sub -->
        <div class="flex flex-col items-center">
          <span class="text-[8px] font-bold text-gray-400 mb-1">GK</span>
          ${benchGkp ? cardHtml(benchGkp) : ''}
        </div>
        <!-- Outfield Subs (Priority 1, 2, 3) -->
        ${benchOutfield.map((p, idx) => `
          <div class="flex flex-col items-center">
            <div class="flex items-center gap-1 mb-1">
              <button onclick="shiftBenchOrder(${p.id}, -1)" class="text-[8px] px-1 bg-gray-200 rounded font-black hover:bg-gray-300">‹</button>
              <span class="text-[8px] font-bold text-fpl-purple">Sub ${idx + 1}</span>
              <button onclick="shiftBenchOrder(${p.id}, 1)" class="text-[8px] px-1 bg-gray-200 rounded font-black hover:bg-gray-300">›</button>
            </div>
            ${cardHtml(p)}
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

  if (!p1 || !p2) { pendingSubId = null; renderPitch(); return; }

  if (p1.pos === 'GKP' || p2.pos === 'GKP') {
    if (p1.pos !== p2.pos) {
      pendingSubId = null;
      showNotification("Goalkeepers can only swap with another Goalkeeper!");
      renderPitch();
      return;
    }
  }

  const status1 = p1.isStarter;
  p1.isStarter = p2.isStarter;
  p2.isStarter = status1;

  if (!isValidFormation(mySquad.filter(p => p.isStarter))) {
    p2.isStarter = p1.isStarter;
    p1.isStarter = status1;
    showNotification("Invalid FPL formation! Must have 1 GKP, 3-5 DEF, 2-5 MID, 1-3 FWD.");
  }

  // Normalize bench orders for outfield subs
  const outfieldBench = mySquad.filter(x => !x.isStarter && x.pos !== 'GKP');
  outfieldBench.forEach((p, idx) => { p.benchOrder = idx + 1; });

  pendingSubId = null;
  saveData();
  renderPitch();
}

function renderModal() {
  if (!activeModalId) return '';
  const p = mySquad.find(x => x.id === activeModalId);
  const stats = p.stats || { goals: 0, assists: 0, cleanSheet: 0, goalsConceded: 0, yellow: 0 };
  
  let statusText = '<span class="text-green-600 font-bold">🟢 Available (100% Chance)</span>';
  if (p.status === 'i') statusText = '<span class="text-red-600 font-bold">❌ Injured (0% Chance)</span>';
  else if (p.status === 's') statusText = '<span class="text-amber-600 font-bold">⛔ Suspended</span>';
  else if (p.status === 'd') statusText = '<span class="text-yellow-600 font-bold">⚠️ Doubtful (75% Chance)</span>';

  let fdrBg = 'bg-green-500 text-white';
  if (p.fdr >= 4) fdrBg = 'bg-red-600 text-white';
  else if (p.fdr === 3) fdrBg = 'bg-gray-400 text-white';

  const purchasePrice = p.purchasePrice || p.price;
  const sellVal = getSellingPrice(p);

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
          <div class="flex justify-between items-center border-b pb-2">
            <span class="font-bold text-gray-500 uppercase text-[9px]">Next Fixture (FDR)</span>
            <span class="px-2 py-0.5 rounded font-black ${fdrBg}">${p.nextOpp} (FDR ${p.fdr})</span>
          </div>
          <div class="flex justify-between items-center border-b pb-2">
            <span class="font-bold text-gray-500 uppercase text-[9px]">FPL Valuation</span>
            <span class="font-black text-fpl-dark">Bought: £${purchasePrice}m | Current: £${p.price}m | Sell: <span class="text-green-600">£${sellVal}m</span></span>
          </div>
          <div class="flex justify-around text-center pt-1">
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Goals</div><div class="font-black text-fpl-purple">${stats.goals}</div></div>
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Assists</div><div class="font-black text-fpl-purple">${stats.assists}</div></div>
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Clean Sheet</div><div class="font-black text-fpl-purple">${stats.cleanSheet}</div></div>
            <div><div class="font-bold text-gray-400 text-[9px] uppercase">Conceded</div><div class="font-black text-red-500">${stats.goalsConceded || 0}</div></div>
          </div>
        </div>

        <button onclick="pendingSubId=${p.id}; activeModalId=null; renderPitch();" class="w-full bg-gray-100 text-fpl-purple py-3 rounded-lg text-sm font-bold mb-3 shadow-sm border border-gray-200">🔄 Swap / Substitute</button>
        <button onclick="setCap(${p.id}, true)" class="w-full bg-fpl-purple text-white py-3 rounded-lg text-sm font-bold mb-3 shadow-sm">👑 Make Captain (2x)</button>
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
        <div class="text-xs text-gray-500 font-bold uppercase mb-1">Confirm FPL Chip</div>
        <div class="font-black text-fpl-purple text-xl mb-2">Play ${chipConfirmModal.toUpperCase()}?</div>
        <p class="text-xs text-gray-600 mb-5">This chip will apply to Gameweek ${gameweek}.</p>
        <button onclick="confirmChipPlay()" class="w-full bg-fpl-green text-fpl-purple py-3 rounded-lg text-sm font-black mb-2">Confirm</button>
        <button onclick="cancelChipPlay()" class="w-full bg-gray-100 text-gray-600 py-2.5 rounded-lg text-sm font-bold">Cancel</button>
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
// 8. MARKET & REAL FPL TRANSFER SYSTEM
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
          <span class="bg-white/20 text-white px-2 py-0.5 rounded font-bold">FT: ${freeTransfers}/5</span>
        </div>
      </div>
      
      ${transferCostPenalty > 0 ? `<div class="bg-red-50 text-red-600 text-xs px-4 py-2 font-bold border-b border-red-100 flex justify-between items-center"><span>⚠️ Transfer Hits Deducted:</span><span>-${transferCostPenalty} pts</span></div>` : ''}

      <div class="p-2 bg-gray-50 text-xs text-gray-500 font-bold border-b flex justify-between px-4">
        <span class="w-2/3">Player & Fixture</span>
        <span class="w-1/3 text-right">Price / Action</span>
      </div>

      <div class="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto">
        ${playerMarket.map(p => {
          const owned = mySquad.find(s => s.id === p.id);
          let badge = '';
          if (p.status === 'i') badge = '<span class="text-[9px] bg-red-100 text-red-600 font-bold px-1 rounded ml-1">INJ</span>';
          if (p.status === 's') badge = '<span class="text-[9px] bg-amber-100 text-amber-700 font-bold px-1 rounded ml-1">SUS</span>';
          
          let fdrColor = 'bg-green-100 text-green-700';
          if (p.fdr >= 4) fdrColor = 'bg-red-100 text-red-700';
          else if (p.fdr === 3) fdrColor = 'bg-gray-200 text-gray-700';

          const sellVal = owned ? getSellingPrice(owned) : p.price;

          return `
            <div class="p-3 flex justify-between items-center bg-white hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">${p.pos}</div>
                <div>
                  <div class="font-bold text-sm text-fpl-dark flex items-center">${p.name}${badge}</div>
                  <div class="text-[10px] text-gray-500">${p.club} • Form: ${p.form}</div>
                  <div class="mt-1"><span class="text-[9px] px-1.5 py-0.5 rounded font-bold ${fdrColor}">vs ${p.nextOpp}</span></div>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="font-black text-fpl-purple mb-0.5">£${p.price}m</span>${owned ? `<span class="text-[9px] text-gray-400 font-bold mb-1">Sell: £${sellVal}m</span>` : ''}
                <button onclick="${owned ? `sellPlayer(${p.id})` : `buyPlayer(${p.id})`}" 
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

function canAddPlayer(player) {
  if (mySquad.some(p => p.id === player.id)) {
    return { success: false, message: `${player.name} is already in your squad.` };
  }
  if (mySquad.length >= TOTAL_SQUAD_SIZE) {
    return { success: false, message: "Squad is full (15 players). Sell a player first!" };
  }
  if (bankBalance < player.price && activeChip !== 'wc' && activeChip !== 'fh') {
    return { success: false, message: `Insufficient budget. Need £${player.price}m (Bank: £${bankBalance}m).` };
  }
  const currentPosCount = mySquad.filter(p => p.pos === player.pos).length;
  if (currentPosCount >= SQUAD_LIMITS[player.pos]) {
    return { success: false, message: `Max position limit reached for ${player.pos}s.` };
  }
  const currentClubCount = mySquad.filter(p => p.club === player.club).length;
  if (currentClubCount >= MAX_PLAYERS_PER_CLUB) {
    return { success: false, message: `Max 3 players allowed from ${player.club}.` };
  }
  return { success: true };
}

function buyPlayer(id) {
  const p = playerMarket.find(x => x.id === id);
  if (!p) return;

  const validation = canAddPlayer(p);
  if (!validation.success) {
    return showNotification(validation.message);
  }

  if (activeChip !== 'wc' && activeChip !== 'fh') {
    if (freeTransfers > 0) {
      freeTransfers--;
    } else {
      transferCostPenalty += 4;
      showNotification("⚠️ Extra transfer used! -4 point hit applied.");
    }
    transfersMade++;
  }

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

  if (activeChip !== 'wc' && activeChip !== 'fh') {
    bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  }
  
  autoAssignStarters();
  saveData();
  renderAll();
  showNotification(`Bought ${p.name} for £${p.price}m.`);
}

function sellPlayer(id) {
  if (mySquad.length <= 11) return showNotification("Must maintain at least 11 players!");
  
  const p = mySquad.find(x => x.id === id);
  if (!p) return;

  if (activeChip !== 'wc' && activeChip !== 'fh') {
    if (freeTransfers > 0) {
      freeTransfers--;
    } else {
      transferCostPenalty += 4;
      showNotification("⚠️ Extra transfer used! -4 point hit applied.");
    }
    transfersMade++;
  }

  const sellValue = getSellingPrice(p);
  mySquad = mySquad.filter(x => x.id !== id);

  bankBalance = parseFloat((bankBalance + sellValue).toFixed(1));
  
  autoAssignStarters();
  saveData();
  renderAll();
  showNotification(`Sold ${p.name}. £${sellValue}m returned to bank.`);
}

// ==========================================
// 9. MINI-LEAGUES
// ==========================================
function renderLeagues() {
  const container = document.getElementById('tab-leagues');
  if (!container) return;

  const activeLeague = userLeagues.find(l => l.id === activeLeagueId) || userLeagues[0];
  const sortedMembersClassic = [...activeLeague.members].sort((a, b) => b.points - a.points);
  const sortedMembersH2H = [...activeLeague.members].sort((a, b) => b.h2hPts - a.h2hPts || b.points - a.points);

  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex gap-2 overflow-x-auto">
        ${userLeagues.map(l => `
          <button onclick="switchLeague('${l.id}')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${l.id === activeLeagueId ? 'bg-fpl-purple text-fpl-green shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}">
            ${l.name}
          </button>
        `).join('')}
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex justify-between items-center mb-3 border-b pb-2">
          <div>
            <h2 class="font-black text-fpl-purple text-base">${activeLeague.name}</h2>
            <div class="text-[10px] text-gray-400 font-mono">Code: <span class="bg-gray-100 px-1 py-0.5 rounded text-fpl-dark font-bold">${activeLeague.code}</span></div>
          </div>
          <div class="flex gap-2">
            <button onclick="openCreateLeagueModal()" class="bg-fpl-green text-fpl-purple px-3 py-1.5 rounded-lg text-xs font-black shadow-sm">+ Create</button>
            <button onclick="openJoinLeagueModal()" class="bg-gray-100 text-fpl-purple border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold">Join</button>
          </div>
        </div>

        <div class="flex bg-gray-100 p-1 rounded-lg mb-3">
          <button onclick="setLeagueViewMode('classic')" class="flex-1 py-1 text-xs font-bold rounded ${leagueViewMode === 'classic' ? 'bg-fpl-purple text-fpl-green shadow' : 'text-gray-600'}">Classic</button>
          <button onclick="setLeagueViewMode('h2h')" class="flex-1 py-1 text-xs font-bold rounded ${leagueViewMode === 'h2h' ? 'bg-fpl-purple text-fpl-green shadow' : 'text-gray-600'}">Head-to-Head</button>
        </div>

        ${leagueViewMode === 'classic' ? `
          <div class="space-y-2">
            ${sortedMembersClassic.map((m, idx) => {
              const isMe = m.name === managerName;
              return `
                <div class="flex items-center gap-3 p-3 rounded-lg border ${isMe ? 'bg-fpl-purple/5 border-fpl-purple/30' : 'bg-gray-50 border-gray-200'}">
                  <div class="font-black text-lg w-6 text-center ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-gray-400'}">${idx + 1}</div>
                  <div class="flex-1">
                    <div class="font-bold text-sm text-fpl-dark flex items-center gap-1.5">
                      ${m.team} ${isMe ? '<span class="text-[9px] bg-fpl-purple text-fpl-green px-1.5 py-0.2 rounded font-black">YOU</span>' : ''}
                    </div>
                    <div class="text-[10px] text-gray-500">Manager: ${m.name}</div>
                  </div>
                  <div class="font-black text-base text-fpl-purple">${m.points} pts</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-gray-50 text-gray-500 border-b">
                <tr>
                  <th class="p-2">Pos</th>
                  <th class="p-2">Team</th>
                  <th class="p-2 text-center">P</th>
                  <th class="p-2 text-center">W</th>
                  <th class="p-2 text-center">D</th>
                  <th class="p-2 text-center">L</th>
                  <th class="p-2 text-right">Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${sortedMembersH2H.map((m, idx) => {
                  const isMe = m.name === managerName;
                  return `
                    <tr class="${isMe ? 'bg-fpl-purple/5 font-bold' : ''}">
                      <td class="p-2 font-black">${idx + 1}</td>
                      <td class="p-2">${m.team} ${isMe ? '(You)' : ''}</td>
                      <td class="p-2 text-center text-gray-600">${m.p || 0}</td>
                      <td class="p-2 text-center text-green-600">${m.w || 0}</td>
                      <td class="p-2 text-center text-gray-500">${m.d || 0}</td>
                      <td class="p-2 text-center text-red-600">${m.l || 0}</td>
                      <td class="p-2 text-right font-black text-fpl-purple">${m.h2hPts || 0}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
    ${renderLeagueModals()}
  `;
}

function setLeagueViewMode(mode) { leagueViewMode = mode; renderLeagues(); }
function switchLeague(id) { activeLeagueId = id; renderLeagues(); }

let leagueModalType = null;
function openCreateLeagueModal() { leagueModalType = 'create'; renderLeagues(); }
function openJoinLeagueModal() { leagueModalType = 'join'; renderLeagues(); }
function closeLeagueModal() { leagueModalType = null; renderLeagues(); }

function handleCreateLeague(e) {
  e.preventDefault();
  const name = document.getElementById('new-league-name').value.trim();
  if (!name) return;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const newLeague = {
    id: 'league_' + Date.now(),
    name, code, type: 'classic',
    members: [{ name: managerName, team: 'Gulit FC', points: totalPoints, p: gameweek - 1, w: 0, d: 0, l: 0, h2hPts: 0 }]
  };
  userLeagues.push(newLeague);
  activeLeagueId = newLeague.id;
  closeLeagueModal();
  saveData();
  showNotification(`League "${name}" created! Code: ${code}`);
}

function handleJoinLeague(e) {
  e.preventDefault();
  const code = document.getElementById('join-league-code').value.trim().toUpperCase();
  const league = userLeagues.find(l => l.code === code);
  if (!league) return showNotification("Invalid code!");
  if (league.members.some(m => m.name === managerName)) return showNotification("Already joined!");
  
  league.members.push({ name: managerName, team: 'Gulit FC', points: totalPoints, p: gameweek - 1, w: 0, d: 0, l: 0, h2hPts: 0 });
  activeLeagueId = league.id;
  closeLeagueModal();
  saveData();
  showNotification(`Joined ${league.name}!`);
}

function renderLeagueModals() {
  if (!leagueModalType) return '';
  return `
    <div class="fixed inset-0 bg-fpl-dark/80 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-5 w-80 shadow-2xl">
        ${leagueModalType === 'create' ? `
          <div class="font-black text-fpl-purple text-lg mb-3">Create Private League</div>
          <form onsubmit="handleCreateLeague(event)">
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">League Name</label>
            <input type="text" id="new-league-name" required placeholder="e.g. Addis Ballers" class="w-full border rounded-lg p-2 text-sm mb-4">
            <button type="submit" class="w-full bg-fpl-green text-fpl-purple py-2.5 rounded-lg text-sm font-black mb-2 shadow">Create</button>
            <button type="button" onclick="closeLeagueModal()" class="w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold">Cancel</button>
          </form>
        ` : `
          <div class="font-black text-fpl-purple text-lg mb-3">Join Private League</div>
          <form onsubmit="handleJoinLeague(event)">
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">6-Digit Code</label>
            <input type="text" id="join-league-code" required placeholder="e.g. AB72X9" class="w-full border rounded-lg p-2 text-sm uppercase mb-4 tracking-widest font-mono">
            <button type="submit" class="w-full bg-fpl-purple text-fpl-green py-2.5 rounded-lg text-sm font-black mb-2 shadow">Join</button>
            <button type="button" onclick="closeLeagueModal()" class="w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold">Cancel</button>
          </form>
        `}
      </div>
    </div>
  `;
}

// ==========================================
// 10. POINTS & MATCH TICKER
// ==========================================
function renderPoints() {
  const container = document.getElementById('tab-points');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-fpl-purple text-white p-4 text-center">
          <div class="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Total Points</div>
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

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 class="font-bold text-sm text-fpl-purple uppercase mb-3 border-b pb-2">⚡ Live Match Ticker</h3>
        ${lastGwEvents.length === 0 ? '<div class="text-xs text-gray-400 text-center py-3">Simulate GW to see events.</div>' : `
          <div class="space-y-2 max-h-48 overflow-y-auto text-xs">
            ${lastGwEvents.map(ev => `
              <div class="p-2 rounded bg-gray-50 border border-gray-100 flex items-center justify-between text-gray-700">${ev}</div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// ==========================================
// 11. GAMEWEEK SIMULATION & STRICT FPL AUTO-SUBS
// ==========================================
function simulateGameweek() {
  const fixturePool = [
    { opp: "St. George (H)", fdr: 3 },
    { opp: "Ethiopian Coffee (A)", fdr: 4 },
    { opp: "CBE SA (H)", fdr: 2 },
    { opp: "Fasil Kenema (A)", fdr: 4 },
    { opp: "Mechal (H)", fdr: 2 },
    { opp: "Bahir Dar City (A)", fdr: 3 },
    { opp: "Hawassa City (H)", fdr: 2 }
  ];

  lastGwEvents = [`📢 Gameweek ${gameweek} kickoff across the league!`];

  // 1. Simulate Player Performance & Minutes Played
  mySquad.forEach(p => {
    let goals = 0;
    let assists = 0;
    let cleanSheet = 0;
    let goalsConceded = 0;
    let yellow = 0;
    let minutes = 0;

    // Roll player availability/minutes
    if (p.status === 'i' || p.status === 's') {
      minutes = 0;
    } else {
      const minRoll = Math.random();
      if (minRoll > 0.15) minutes = 90; // 85% plays full match
      else if (minRoll > 0.05) minutes = Math.floor(Math.random() * 59) + 1; // Sub appearance (<60 min)
      else minutes = 0; // Unused sub / 0 mins
    }

    p.minutes = minutes;

    if (minutes > 0) {
      // Roll Match Goals Conceded for Team
      goalsConceded = Math.floor(Math.random() * 3);

      if (p.pos === 'FWD') {
        if (Math.random() > 0.45) goals = Math.random() > 0.8 ? 2 : 1;
        if (Math.random() > 0.6) assists = 1;
      } else if (p.pos === 'MID') {
        if (Math.random() > 0.55) goals = Math.random() > 0.85 ? 2 : 1;
        if (Math.random() > 0.5) assists = 1;
        if (minutes >= 60 && goalsConceded === 0) cleanSheet = 1;
      } else if (p.pos === 'DEF' || p.pos === 'GKP') {
        if (minutes >= 60 && goalsConceded === 0) cleanSheet = 1;
        if (Math.random() > 0.85) goals = 1;
        if (Math.random() > 0.75) assists = 1;
      }

      if (Math.random() > 0.8) yellow = 1;

      // Event Ticker
      if (goals > 0) lastGwEvents.push(`⚽ GOAL! ${p.name} (${p.club}) scores ${goals > 1 ? 'a brace' : ''}!`);
      if (assists > 0) lastGwEvents.push(`🎯 ASSIST! ${p.name} (${p.club}) delivers a goal pass.`);
      if (yellow > 0) lastGwEvents.push(`🟨 YELLOW CARD for ${p.name} (${p.club}).`);

      // FPL Point Calculations
      let pts = 0;
      // Appearance points
      pts += (minutes >= 60 ? 2 : 1);

      // Clean sheet points (only if played >= 60 mins)
      if (cleanSheet === 1) {
        if (p.pos === 'GKP' || p.pos === 'DEF') pts += 4;
        else if (p.pos === 'MID') pts += 1;
      }

      // Goals Conceded Penalty (-1 per 2 goals conceded for DEF/GKP if >= 60 mins)
      if ((p.pos === 'GKP' || p.pos === 'DEF') && minutes >= 60) {
        pts -= Math.floor(goalsConceded / 2);
      }

      // Goals Scored
      if (p.pos === 'GKP' || p.pos === 'DEF') pts += (goals * 6);
      else if (p.pos === 'MID') pts += (goals * 5);
      else if (p.pos === 'FWD') pts += (goals * 4);

      // Assists & Cards
      pts += (assists * 3);
      pts -= (yellow * 1);

      p.gwPoints = Math.max(0, pts);
      p.stats = { goals, assists, cleanSheet, goalsConceded, yellow };
    } else {
      p.gwPoints = 0;
      p.stats = { goals: 0, assists: 0, cleanSheet: 0, goalsConceded: 0, yellow: 0 };
    }

    p.form = parseFloat(((p.form * 2 + p.gwPoints) / 3).toFixed(1));
  });

  // 2. Official FPL Auto-Substitutions Process
  if (activeChip !== 'bb') {
    // A. Goalkeeper Auto-Sub
    const starterGkp = mySquad.find(p => p.isStarter && p.pos === 'GKP');
    const benchGkp = mySquad.find(p => !p.isStarter && p.pos === 'GKP');

    if (starterGkp && starterGkp.minutes === 0 && benchGkp && benchGkp.minutes > 0) {
      starterGkp.isStarter = false;
      benchGkp.isStarter = true;
      lastGwEvents.push(`🔄 AUTO-SUB: ${benchGkp.name} (${benchGkp.gwPoints} pts) replaced GKP ${starterGkp.name} (0 mins).`);
    }

    // B. Outfield Auto-Subs (Strict Bench Priority 1 -> 2 -> 3 + Formation Check)
    const missingStarters = mySquad.filter(p => p.isStarter && p.pos !== 'GKP' && p.minutes === 0);
    const benchCandidates = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
      .sort((a, b) => a.benchOrder - b.benchOrder);

    for (let missing of missingStarters) {
      for (let benchP of benchCandidates) {
        if (!benchP.isStarter && benchP.minutes > 0) {
          // Check formation validity if we swap
          missing.isStarter = false;
          benchP.isStarter = true;

          const testStarters = mySquad.filter(p => p.isStarter);
          if (isValidFormation(testStarters)) {
            lastGwEvents.push(`🔄 AUTO-SUB: ${benchP.name} (Sub ${benchP.benchOrder}) replaced ${missing.name} (0 mins).`);
            break; // Successfully substituted
          } else {
            // Revert swap if formation becomes invalid (e.g. fewer than 3 defenders)
            missing.isStarter = true;
            benchP.isStarter = false;
          }
        }
      }
    }
  }

  // 3. Captain / Vice-Captain Fallback Logic
  let capPlayer = mySquad.find(p => p.isCaptain);
  let vicePlayer = mySquad.find(p => p.isViceCaptain);

  let capMultiplier = (activeChip === 'tc' ? 3 : 2);

  let activeCap = null;
  if (capPlayer && capPlayer.minutes > 0 && capPlayer.isStarter) {
    activeCap = capPlayer;
  } else if (vicePlayer && vicePlayer.minutes > 0 && vicePlayer.isStarter) {
    activeCap = vicePlayer;
    lastGwEvents.push(`👑 VICE-CAPTAIN MULTIPLIER: ${vicePlayer.name} awarded ${capMultiplier}x points (Captain ${capPlayer?.name || 'N/A'} played 0 mins).`);
  } else {
    lastGwEvents.push(`⚠️ Neither Captain nor Vice-Captain played minutes.`);
  }

  // 4. Total Gameweek Score Calculation
  let gwTotal = 0;
  mySquad.forEach(p => {
    let mult = 1;
    if (activeCap && p.id === activeCap.id) mult = capMultiplier;
    
    if (p.isStarter || activeChip === 'bb') {
      gwTotal += (p.gwPoints * mult);
    }
  });

  gwTotal -= transferCostPenalty;

  totalPoints += gwTotal;
  gwHistory.push({ gameweek, points: gwTotal });

  // Update Mini-Leagues Score & H2H Results
  userLeagues.forEach(l => {
    l.members.forEach(m => {
      m.p = (m.p || 0) + 1;
      const oppScore = Math.floor(Math.random() * 40) + 35;
      if (m.name === managerName) {
        if (gwTotal > oppScore) { m.w = (m.w || 0) + 1; m.h2hPts = (m.h2hPts || 0) + 3; }
        else if (gwTotal === oppScore) { m.d = (m.d || 0) + 1; m.h2hPts = (m.h2hPts || 0) + 1; }
        else { m.l = (m.l || 0) + 1; }
      } else {
        const dScore = Math.floor(Math.random() * 45) + 30;
        if (m.points > dScore) { m.w = (m.w || 0) + 1; m.h2hPts = (m.h2hPts || 0) + 3; }
        else if (m.points === dScore) { m.d = (m.d || 0) + 1; m.h2hPts = (m.h2hPts || 0) + 1; }
        else { m.l = (m.l || 0) + 1; }
      }
    });
  });

  gameweek++;

  // FPL Rule: Accumulate free transfers up to a max of 5
  freeTransfers = Math.min(5, freeTransfers + 1);
  transfersMade = 0;
  transferCostPenalty = 0;

  // Market updates
  playerMarket.forEach(p => {
    let rand = Math.random();
    if (rand < 0.05) p.status = 'i';
    else if (rand < 0.08) p.status = 's';
    else if (rand < 0.12) p.status = 'd';
    else p.status = 'a';

    if (p.form >= 7.5 && Math.random() > 0.4) {
      p.price = parseFloat((p.price + 0.1).toFixed(1));
    } else if ((p.form <= 4.0 || p.status === 'i') && Math.random() > 0.5 && p.price > 4.5) {
      p.price = parseFloat((p.price - 0.1).toFixed(1));
    }

    const nextFixture = fixturePool[Math.floor(Math.random() * fixturePool.length)];
    p.nextOpp = nextFixture.opp;
    p.fdr = nextFixture.fdr;
  });

  mySquad.forEach(sMember => {
    const marketMatch = playerMarket.find(m => m.id === sMember.id);
    if (marketMatch) {
      sMember.price = marketMatch.price;
      sMember.nextOpp = marketMatch.nextOpp;
      sMember.fdr = marketMatch.fdr;
    }
  });

  // Revert Free Hit if played
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
  showNotification(`Gameweek ${gameweek - 1} finished! Check your team score and match ticker.`);
}

function updateHeader() {
  document.getElementById('bank-balance').innerText = `${bankBalance}M`;
  document.getElementById('squad-count').innerText = `${mySquad.length}/15`;
  document.getElementById('total-points').innerText = totalPoints;
  document.getElementById('gw-number').innerText = gameweek;
}

// Initialize application on load
document.addEventListener('DOMContentLoaded', loadData);

