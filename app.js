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

const managerName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Nate Wolde';

// ==========================================
// 2. STATE MANAGEMENT & STORAGE
// ==========================================
const STORAGE_KEY = 'efpl_official_v12';

const clubColors = {
  Arsenal: { primary: "#EF0107", secondary: "#FFFFFF", accent: "#063672" },
  AstonVilla: { primary: "#95BFE5", secondary: "#670E36", accent: "#FEE505" },
  Bournemouth: { primary: "#DA291C", secondary: "#000000", accent: "#FFFFFF" },
  Brentford: { primary: "#E30613", secondary: "#FFFFFF", accent: "#000000" },
  Brighton: { primary: "#0057B8", secondary: "#FFFFFF", accent: "#FFCD00" },
  Chelsea: { primary: "#034694", secondary: "#FFFFFF", accent: "#DBA111" },
  CrystalPalace: { primary: "#1B458F", secondary: "#C41230", accent: "#A7A5A6" },
  Everton: { primary: "#003399", secondary: "#FFFFFF", accent: "#003399" },
  Fulham: { primary: "#FFFFFF", secondary: "#000000", accent: "#CC0000" },
  Ipswich: { primary: "#0000FF", secondary: "#FFFFFF", accent: "#FF0000" },
  Leicester: { primary: "#0053A0", secondary: "#FDBE11", accent: "#FFFFFF" },
  Liverpool: { primary: "#C8102E", secondary: "#00B2A9", accent: "#FDE100" },
  ManCity: { primary: "#6CABDD", secondary: "#FFFFFF", accent: "#1C2C5B" },
  ManUtd: { primary: "#DA291C", secondary: "#FFFFFF", accent: "#000000" },
  Newcastle: { primary: "#241F20", secondary: "#FFFFFF", accent: "#F1B733" },
  NottmForest: { primary: "#DD0000", secondary: "#FFFFFF", accent: "#DD0000" },
  Southampton: { primary: "#D71921", secondary: "#FFFFFF", accent: "#130F14" },
  Spurs: { primary: "#132257", secondary: "#FFFFFF", accent: "#132257" },
  WestHam: { primary: "#7A263A", secondary: "#1BB1E7", accent: "#F3A91D" },
  Wolves: { primary: "#FDB913", secondary: "#231F20", accent: "#231F20" }
};

// Global Market Player Pool for Transfers
const globalPlayerPool = [
  { id: 101, name: "David Raya", club: "Arsenal", pos: "GKP", price: 5.5, gwPoints: 6 },
  { id: 102, name: "Alisson Becker", club: "Liverpool", pos: "GKP", price: 5.5, gwPoints: 7 },
  { id: 103, name: "Ederson", club: "ManCity", pos: "GKP", price: 5.5, gwPoints: 4 },
  { id: 104, name: "Bart Verbruggen", club: "Brighton", pos: "GKP", price: 4.5, gwPoints: 2 },
  { id: 105, name: "Gabriel Magalhães", club: "Arsenal", pos: "DEF", price: 6.2, gwPoints: 8 },
  { id: 106, name: "William Saliba", club: "Arsenal", pos: "DEF", price: 6.0, gwPoints: 6 },
  { id: 107, name: "Trent Alexander-Arnold", club: "Liverpool", pos: "DEF", price: 7.0, gwPoints: 9 },
  { id: 108, name: "Josko Gvardiol", club: "ManCity", pos: "DEF", price: 6.0, gwPoints: 5 },
  { id: 109, name: "Pedro Porro", club: "Spurs", pos: "DEF", price: 5.5, gwPoints: 3 },
  { id: 110, name: "Antonee Robinson", club: "Fulham", pos: "DEF", price: 4.7, gwPoints: 2 },
  { id: 111, name: "Mohamed Salah", club: "Liverpool", pos: "MID", price: 12.8, gwPoints: 12 },
  { id: 112, name: "Cole Palmer", club: "Chelsea", pos: "MID", price: 10.8, gwPoints: 10 },
  { id: 113, name: "Bukayo Saka", club: "Arsenal", pos: "MID", price: 10.1, gwPoints: 7 },
  { id: 114, name: "Bryan Mbeumo", club: "Brentford", pos: "MID", price: 7.8, gwPoints: 6 },
  { id: 115, name: "Morgan Rogers", club: "AstonVilla", pos: "MID", price: 5.4, gwPoints: 3 },
  { id: 116, name: "Phil Foden", club: "ManCity", pos: "MID", price: 9.3, gwPoints: 2 },
  { id: 117, name: "Erling Haaland", club: "ManCity", pos: "FWD", price: 15.3, gwPoints: 13 },
  { id: 118, name: "Ollie Watkins", club: "AstonVilla", pos: "FWD", price: 9.0, gwPoints: 8 },
  { id: 119, name: "Chris Wood", club: "NottmForest", pos: "FWD", price: 6.5, gwPoints: 5 },
  { id: 120, name: "Nicolas Jackson", club: "Chelsea", pos: "FWD", price: 7.9, gwPoints: 6 },
  { id: 121, name: "Dominic Solanke", club: "Spurs", pos: "FWD", price: 7.5, gwPoints: 4 }
];

let currentTab = 'pitch';
let bank = 1.0;
let freeTransfers = 1;
let mySquad = [];
let pendingSubId = null;
let activeModalPlayerId = null;
let activeChip = null;
let chipsUsed = { wc: false, tc: false, bb: false, fh: false };
let pendingChipToConfirm = null;

// Transfer state
let transferOutPlayer = null;
let transferSearch = '';
let transferPosFilter = 'ALL';
let pendingTransfersCount = 0;

function getInitialSquad() {
  return [
    { id: 1, name: "Raya", club: "Arsenal", pos: "GKP", price: 5.5, gwPoints: 6, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 2, name: "Verbruggen", club: "Brighton", pos: "GKP", price: 4.5, gwPoints: 2, isStarter: false, isCaptain: false, isViceCaptain: false, status: "a", benchOrder: 0 },
    { id: 3, name: "Gabriel", club: "Arsenal", pos: "DEF", price: 6.2, gwPoints: 8, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 4, name: "Gvardiol", club: "ManCity", pos: "DEF", price: 6.0, gwPoints: 5, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 5, name: "Alexander-Arnold", club: "Liverpool", pos: "DEF", price: 7.0, gwPoints: 9, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 6, name: "Robinson", club: "Fulham", pos: "DEF", price: 4.7, gwPoints: 2, isStarter: false, isCaptain: false, isViceCaptain: false, status: "a", benchOrder: 1 },
    { id: 7, name: "Porro", club: "Spurs", pos: "DEF", price: 5.5, gwPoints: 3, isStarter: false, isCaptain: false, isViceCaptain: false, status: "a", benchOrder: 2 },
    { id: 8, name: "Salah", club: "Liverpool", pos: "MID", price: 12.8, gwPoints: 12, isStarter: true, isCaptain: true, isViceCaptain: false, status: "a" },
    { id: 9, name: "Palmer", club: "Chelsea", pos: "MID", price: 10.8, gwPoints: 10, isStarter: true, isCaptain: false, isViceCaptain: true, status: "a" },
    { id: 10, name: "Saka", club: "Arsenal", pos: "MID", price: 10.1, gwPoints: 7, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 11, name: "Mbeumo", club: "Brentford", pos: "MID", price: 7.8, gwPoints: 6, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 12, name: "Rogers", club: "AstonVilla", pos: "MID", price: 5.4, gwPoints: 3, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 13, name: "Haaland", club: "ManCity", pos: "FWD", price: 15.3, gwPoints: 13, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 14, name: "Wood", club: "NottmForest", pos: "FWD", price: 6.5, gwPoints: 5, isStarter: true, isCaptain: false, isViceCaptain: false, status: "a" },
    { id: 15, name: "Jackson", club: "Chelsea", pos: "FWD", price: 7.9, gwPoints: 6, isStarter: false, isCaptain: false, isViceCaptain: false, status: "a", benchOrder: 3 }
  ];
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      mySquad = parsed.mySquad || getInitialSquad();
      chipsUsed = parsed.chipsUsed || { wc: false, tc: false, bb: false, fh: false };
      activeChip = parsed.activeChip || null;
      bank = parsed.bank ?? 1.0;
      freeTransfers = parsed.freeTransfers ?? 1;
    } catch (e) {
      mySquad = getInitialSquad();
    }
  } else {
    mySquad = getInitialSquad();
  }
  updateHeaderInfo();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    mySquad,
    chipsUsed,
    activeChip,
    bank,
    freeTransfers
  }));
  updateHeaderInfo();
}

function updateHeaderInfo() {
  const displayName = document.getElementById('user-display-name');
  if (displayName) displayName.innerText = managerName.toUpperCase();
  
  const bankInfo = document.getElementById('header-bank-info');
  if (bankInfo) bankInfo.innerText = `£${bank.toFixed(1)}m | ${freeTransfers} FT`;
}

// ==========================================
// 3. TAB SWITCHING SYSTEM
// ==========================================
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`nav-${tab}`);
  if (activeBtn) activeBtn.classList.add('active');
  renderMain();
}

function renderMain() {
  const container = document.getElementById('app-container');
  if (!container) return;

  if (currentTab === 'pitch') renderPitch(container);
  else if (currentTab === 'points') renderPointsView(container);
  else if (currentTab === 'transfers') renderTransfersView(container);
  else if (currentTab === 'leagues') renderLeaguesView(container);
}

// ==========================================
// 4. KIT & GRAPHICS RENDERER
// ==========================================
function getKitSvg(clubName, isGkp = false) {
  const colors = clubColors[clubName] || { primary: "#37003c", secondary: "#00ff85", accent: "#ffffff" };
  
  if (isGkp) {
    return `
      <svg viewBox="0 0 64 64" class="w-10 h-10 player-card-shadow mx-auto">
        <path d="M14 16 L22 8 L42 8 L50 16 L60 24 L52 34 L46 28 L46 56 L18 56 L18 28 L12 34 L4 24 Z" fill="#00e676" stroke="#004d40" stroke-width="1" />
        <path d="M14 16 L22 8 L28 18 L18 28 Z" fill="#00b0ff" opacity="0.8" />
        <path d="M50 16 L42 8 L36 18 L46 28 Z" fill="#00b0ff" opacity="0.8" />
        <path d="M22 8 L32 16 L42 8" fill="none" stroke="#ffffff" stroke-width="2" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 64 64" class="w-10 h-10 player-card-shadow mx-auto">
      <path d="M14 16 L22 8 L42 8 L50 16 L60 24 L52 34 L46 28 L46 56 L18 56 L18 28 L12 34 L4 24 Z" fill="${colors.primary}" stroke="#ffffff" stroke-width="0.8" />
      <path d="M14 16 L4 24 L12 34 L18 28 Z" fill="${colors.secondary}" />
      <path d="M50 16 L60 24 L52 34 L46 28 Z" fill="${colors.secondary}" />
      <rect x="26" y="16" width="4" height="40" fill="${colors.secondary}" opacity="0.85" />
      <rect x="34" y="16" width="4" height="40" fill="${colors.secondary}" opacity="0.85" />
      <path d="M22 8 L32 15 L42 8" fill="none" stroke="${colors.accent}" stroke-width="2" />
    </svg>
  `;
}

function cardHtml(p) {
  const isCap = p.isCaptain 
    ? `<div class="absolute -top-1.5 -right-1.5 bg-yellow-400 text-fpl-purple font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-fpl-purple shadow-md z-20">C</div>` 
    : '';

  const isVice = p.isViceCaptain 
    ? `<div class="absolute -top-1.5 -right-1.5 bg-white text-fpl-purple font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-fpl-purple shadow-md z-20">V</div>` 
    : '';

  const kitSvg = getKitSvg(p.club, p.pos === 'GKP');
  const surname = p.name.split(' ').pop();
  const isSelectedForSub = pendingSubId === p.id;

  return `
    <div onclick="handleCardClick(${p.id})" class="relative text-center w-[76px] cursor-pointer group select-none transition-transform active:scale-95 ${isSelectedForSub ? 'ring-2 ring-yellow-300 rounded-lg scale-105' : ''}">
      ${isCap}
      ${isVice}
      
      <div class="relative py-1">
        ${kitSvg}
      </div>

      <div class="rounded-md overflow-hidden shadow-lg border border-black/20">
        <div class="player-name-badge text-[9px] font-black truncate px-1 py-0.5 uppercase tracking-tighter">
          ${surname}
        </div>
        <div class="flex justify-between items-center bg-gray-100 text-[8px] font-black px-1 py-0.5 border-t border-gray-300">
          <span class="text-gray-600">£${p.price}m</span>
          <span class="text-fpl-purple font-extrabold bg-fpl-green px-1 rounded-sm">${p.gwPoints ?? 0}</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 5. VIEW 1: PICK TEAM (PITCH VIEW)
// ==========================================
function renderPitch(container) {
  const starters = mySquad.filter(p => p.isStarter);
  const benchGkp = mySquad.find(p => !p.isStarter && p.pos === 'GKP');
  const benchOutfield = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => a.benchOrder - b.benchOrder);

  const chipLabels = { wc: 'Wildcard', tc: 'Triple Captain', bb: 'Bench Boost', fh: 'Free Hit' };

  container.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm p-2 mb-3 border border-gray-200">
      <div class="flex gap-1.5 mb-2">
        ${['wc', 'tc', 'bb', 'fh'].map(c => `
          <button onclick="promptChip('${c}')" ${chipsUsed[c] || activeChip ? 'disabled' : ''} 
            class="flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${chipsUsed[c] ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : activeChip === c ? 'bg-fpl-purple text-fpl-green shadow-md' : 'bg-gray-50 border border-gray-300 text-fpl-purple hover:bg-fpl-purple/5'}">
            ${chipLabels[c]}
          </button>
        `).join('')}
      </div>
      <button onclick="handleAutoPickUI()" class="w-full bg-fpl-purple text-fpl-green text-xs font-black py-2 rounded-lg shadow hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-1">
        <span>⚡</span> AUTO-PICK STARTING 11
      </button>
      ${activeChip ? `<div class="mt-2 text-center text-xs font-black text-fpl-purple bg-fpl-green py-1 rounded-lg border border-fpl-purple/20">⚡ Active Chip: ${chipLabels[activeChip]}</div>` : ''}
    </div>

    ${pendingSubId ? `<div class="bg-fpl-purple text-fpl-green text-xs p-2 text-center font-black mb-3 rounded-xl shadow-lg border border-fpl-green/30 animate-pulse">🔄 Select player to swap with</div>` : ''}
    
    <div class="pitch-bg rounded-t-2xl p-3 flex flex-col justify-between min-h-[420px] mb-0">
      <div class="pitch-lines"></div>
      <div class="relative z-10 flex justify-center gap-2 pt-2">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="relative z-10 flex justify-center gap-2">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="relative z-10 flex justify-center gap-2">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="relative z-10 flex justify-center gap-2 pb-2">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <div class="bg-gradient-to-b from-gray-900 to-fpl-dark rounded-b-2xl p-3 shadow-xl border-t-2 border-fpl-green">
      <div class="text-[10px] text-fpl-green font-black uppercase mb-2 flex justify-between items-center px-1 tracking-wider">
        <span>Substitutes Bench</span>
        ${activeChip === 'bb' ? '<span class="text-fpl-green font-black animate-bounce">Bench Boost Active ⚡</span>' : ''}
      </div>
      <div class="grid grid-cols-4 gap-2 text-center">
        <div class="flex flex-col items-center bg-white/5 p-1.5 rounded-xl border border-white/10">
          <span class="text-[8px] font-black text-gray-400 mb-1 uppercase tracking-widest">GKP</span>
          ${benchGkp ? cardHtml(benchGkp) : ''}
        </div>
        ${benchOutfield.map((p, idx) => `
          <div class="flex flex-col items-center bg-white/5 p-1.5 rounded-xl border border-white/10">
            <div class="flex items-center gap-1 mb-1">
              <button onclick="shiftBenchOrder(${p.id}, -1)" class="text-[9px] px-1 bg-white/10 text-white rounded font-black hover:bg-fpl-green hover:text-fpl-purple">‹</button>
              <span class="text-[8px] font-black text-fpl-green uppercase tracking-wider">Sub ${idx + 1}</span>
              <button onclick="shiftBenchOrder(${p.id}, 1)" class="text-[9px] px-1 bg-white/10 text-white rounded font-black hover:bg-fpl-green hover:text-fpl-purple">›</button>
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

// ==========================================
// 6. VIEW 2: GAMEWEEK POINTS
// ==========================================
function renderPointsView(container) {
  let totalPoints = 0;
  const starters = mySquad.filter(p => p.isStarter);

  starters.forEach(p => {
    let multiplier = 1;
    if (p.isCaptain) multiplier = activeChip === 'tc' ? 3 : 2;
    totalPoints += (p.gwPoints || 0) * multiplier;
  });

  if (activeChip === 'bb') {
    mySquad.filter(p => !p.isStarter).forEach(p => {
      totalPoints += (p.gwPoints || 0);
    });
  }

  container.innerHTML = `
    <div class="bg-fpl-purple text-white rounded-2xl p-4 shadow-xl mb-4 border border-fpl-green/30 text-center relative overflow-hidden">
      <div class="text-[10px] uppercase font-black tracking-widest text-fpl-green mb-1">GAMEWEEK 1 SCORE</div>
      <div class="text-5xl font-black text-white my-1">${totalPoints}</div>
      <div class="text-xs font-bold text-gray-300">Average: 48 pts | Highest: 112 pts</div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 font-black text-xs text-fpl-purple uppercase tracking-wider">
        Squad Breakdown
      </div>
      <div class="divide-y divide-gray-100">
        ${mySquad.map(p => {
          let pts = p.gwPoints || 0;
          let badge = '';
          if (p.isStarter && p.isCaptain) {
            const mult = activeChip === 'tc' ? 3 : 2;
            pts *= mult;
            badge = `<span class="bg-yellow-400 text-fpl-purple text-[9px] font-black px-1.5 py-0.5 rounded ml-1">C (${mult}x)</span>`;
          } else if (p.isStarter && p.isViceCaptain) {
            badge = `<span class="bg-gray-200 text-fpl-purple text-[9px] font-black px-1.5 py-0.5 rounded ml-1">V</span>`;
          }

          return `
            <div class="flex items-center justify-between p-3 ${!p.isStarter ? 'bg-gray-50/60 opacity-75' : ''}">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black px-1.5 py-0.5 rounded ${p.isStarter ? 'bg-fpl-purple text-fpl-green' : 'bg-gray-300 text-gray-700'}">${p.pos}</span>
                <div>
                  <div class="text-xs font-black text-gray-900 flex items-center">${p.name}${badge}</div>
                  <div class="text-[10px] text-gray-500 font-bold">${p.club}</div>
                </div>
              </div>
              <div class="text-sm font-black text-fpl-purple bg-fpl-green/20 px-2.5 py-1 rounded-lg">
                ${pts} pts
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// 7. VIEW 3: TRANSFERS MARKET
// ==========================================
function renderTransfersView(container) {
  const filteredPool = globalPlayerPool.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(transferSearch.toLowerCase()) || p.club.toLowerCase().includes(transferSearch.toLowerCase());
    const matchesPos = transferPosFilter === 'ALL' || p.pos === transferPosFilter;
    const notInSquad = !mySquad.some(sq => sq.id === p.id);
    return matchesSearch && matchesPos && notInSquad;
  });

  container.innerHTML = `
    <div class="bg-white rounded-xl p-3 shadow-sm mb-3 border border-gray-200">
      <div class="text-xs font-black text-fpl-purple uppercase tracking-wider mb-2">
        ${transferOutPlayer ? `Replacing: <span class="text-fpl-pink">${transferOutPlayer.name} (£${transferOutPlayer.price}m)</span>` : 'Select a player from your squad to transfer out'}
      </div>
      
      <!-- Current Squad List for Transferring Out -->
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        ${mySquad.map(p => `
          <button onclick="setTransferOut(${p.id})" class="flex-shrink-0 p-2 rounded-xl border text-left transition-all ${transferOutPlayer?.id === p.id ? 'bg-fpl-purple text-white border-fpl-green shadow-md scale-105' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}">
            <div class="text-[9px] font-black ${transferOutPlayer?.id === p.id ? 'text-fpl-green' : 'text-gray-500'} uppercase">${p.pos} •${p.club}</div>
            <div class="text-xs font-black truncate max-w-[80px]">${p.name}</div>
            <div class="text-[10px] font-bold">£${p.price}m</div>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Search & Position Filter Header -->
    <div class="bg-white rounded-xl p-3 shadow-sm mb-3 border border-gray-200">
      <input type="text" placeholder="Search player or club..." value="${transferSearch}" oninput="handleTransferSearch(this.value)" 
        class="w-full bg-gray-100 text-xs font-bold p-2.5 rounded-lg mb-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-fpl-purple">
      
      <div class="flex gap-1">
        ${['ALL', 'GKP', 'DEF', 'MID', 'FWD'].map(pos => `
          <button onclick="setTransferPosFilter('${pos}')" class="flex-1 py-1 text-[10px] font-black rounded-md ${transferPosFilter === pos ? 'bg-fpl-purple text-fpl-green' : 'bg-gray-100 text-gray-600'}">${pos}</button>
        `).join('')}
      </div>
    </div>

    <!-- Available Transfer Market Pool -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 font-black text-xs text-fpl-purple uppercase tracking-wider">
        Transfer Market
      </div>
      <div class="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
        ${filteredPool.map(p => `
          <div class="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black px-1.5 py-0.5 rounded bg-fpl-purple text-fpl-green">${p.pos}</span>
              <div>
                <div class="text-xs font-black text-gray-900">${p.name}</div>
                <div class="text-[10px] text-gray-500 font-bold">${p.club}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-xs font-black text-fpl-purple">£${p.price}m</div>
                <div class="text-[9px] text-gray-400 font-bold">${p.gwPoints} pts</div>
              </div>
              <button onclick="buyPlayer(${p.id})" ${!transferOutPlayer ? 'disabled' : ''} class="bg-fpl-green text-fpl-purple font-black text-xs px-3 py-1.5 rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 active:scale-95">
                BUY
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setTransferOut(id) {
  transferOutPlayer = mySquad.find(p => p.id === id);
  renderMain();
}

function handleTransferSearch(val) {
  transferSearch = val;
  renderMain();
}

function setTransferPosFilter(pos) {
  transferPosFilter = pos;
  renderMain();
}

function buyPlayer(marketId) {
  if (!transferOutPlayer) return;
  const target = globalPlayerPool.find(p => p.id === marketId);
  if (!target) return;

  if (target.pos !== transferOutPlayer.pos) {
    alert(`Position mismatch! You must swap a ${transferOutPlayer.pos} for another ${transferOutPlayer.pos}.`);
    return;
  }

  const costDifference = target.price - transferOutPlayer.price;
  if (bank - costDifference < 0) {
    alert("Insufficient bank funds for this transfer!");
    return;
  }

  // Perform Transfer
  bank -= costDifference;
  if (freeTransfers > 0) {
    freeTransfers -= 1;
  }

  const newPlayer = {
    ...target,
    isStarter: transferOutPlayer.isStarter,
    isCaptain: transferOutPlayer.isCaptain,
    isViceCaptain: transferOutPlayer.isViceCaptain,
    benchOrder: transferOutPlayer.benchOrder
  };

  mySquad = mySquad.map(p => p.id === transferOutPlayer.id ? newPlayer : p);
  transferOutPlayer = null;

  saveState();
  renderMain();
  alert(`Transfer complete! Added ${target.name} to your squad.`);
}

// ==========================================
// 8. VIEW 4: LEAGUES & STANDINGS
// ==========================================
function renderLeaguesView(container) {
  const mockStandings = [
    { rank: 1, manager: "Nate Wolde", team: "Gulit FC", gw: 78, total: 112 },
    { rank: 2, manager: "Alex Mercer", team: "Salah-brate", gw: 64, total: 98 },
    { rank: 3, manager: "Daniel K.", team: "Haaland-ia", gw: 52, total: 89 },
    { rank: 4, manager: "Muni G.", team: "No Rice No Party", gw: 49, total: 84 },
    { rank: 5, manager: "Sami T.", team: "KDB Magic", gw: 41, total: 72 }
  ];

  container.innerHTML = `
    <!-- League Header Card -->
    <div class="bg-gradient-to-r from-fpl-purple to-fpl-dark text-white p-4 rounded-2xl shadow-xl mb-3 border border-fpl-green/30">
      <div class="text-[10px] font-black uppercase text-fpl-green tracking-widest">Global & Private Leagues</div>
      <div class="text-xl font-black mt-1">Ethiopian Premier Fantasy League</div>
      <div class="text-xs text-gray-200 mt-1">Code to Join: <span class="bg-black/30 font-mono px-2 py-0.5 rounded text-fpl-green font-bold">ETH-WIN-2026</span></div>
    </div>

    <!-- Join Private League Action -->
    <div class="bg-white rounded-xl p-3 shadow-sm mb-3 border border-gray-200 flex gap-2">
      <input type="text" id="league-code-input" placeholder="Enter League Code..." class="flex-1 bg-gray-100 text-xs font-bold p-2.5 rounded-lg border border-gray-200 focus:outline-none">
      <button onclick="joinLeague()" class="bg-fpl-purple text-fpl-green text-xs font-black px-4 py-2 rounded-lg shadow">JOIN</button>
    </div>

    <!-- Standings Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 font-black text-xs text-fpl-purple uppercase tracking-wider flex justify-between">
        <span>Leaderboard</span>
        <span>GW / Total</span>
      </div>
      <div class="divide-y divide-gray-100">
        ${mockStandings.map(s => `
          <div class="flex items-center justify-between p-3 ${s.manager === managerName ? 'bg-fpl-green/10 font-bold' : ''}">
            <div class="flex items-center gap-3">
              <span class="text-xs font-black text-fpl-purple w-4 text-center">#${s.rank}</span>
              <div>
                <div class="text-xs font-black text-gray-900">${s.team}</div>
                <div class="text-[10px] text-gray-500">${s.manager}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs font-black text-fpl-purple">${s.total} pts</span>
              <span class="block text-[9px] text-gray-400 font-bold">(+${s.gw} GW)</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function joinLeague() {
  const input = document.getElementById('league-code-input');
  if (input && input.value.trim()) {
    alert(`Successfully joined league: ${input.value.trim().toUpperCase()}`);
    input.value = '';
  }
}

// ==========================================
// 9. EVENT HANDLERS & MODAL LOGIC
// ==========================================
function handleCardClick(id) {
  if (!pendingSubId) {
    activeModalPlayerId = id;
    renderMain();
  } else {
    if (pendingSubId === id) {
      pendingSubId = null;
      renderMain();
      return;
    }

    const p1 = mySquad.find(p => p.id === pendingSubId);
    const p2 = mySquad.find(p => p.id === id);

    if (p1.isStarter === p2.isStarter) {
      pendingSubId = id;
      renderMain();
      return;
    }

    if ((p1.pos === 'GKP' || p2.pos === 'GKP') && p1.pos !== p2.pos) {
      alert("Goalkeepers can only be swapped with Goalkeepers!");
      pendingSubId = null;
      renderMain();
      return;
    }

    // Formation Validation
    const starters = mySquad.filter(p => p.isStarter);
    const starterOutfield = starters.filter(p => p.id !== p1.id && p.id !== p2.id);
    const incomingPlayer = p1.isStarter ? p2 : p1;
    
    let defCount = starterOutfield.filter(p => p.pos === 'DEF').length + (incomingPlayer.pos === 'DEF' ? 1 : 0);
    let midCount = starterOutfield.filter(p => p.pos === 'MID').length + (incomingPlayer.pos === 'MID' ? 1 : 0);
    let fwdCount = starterOutfield.filter(p => p.pos === 'FWD').length + (incomingPlayer.pos === 'FWD' ? 1 : 0);

    if (defCount < 3 || midCount < 2 || fwdCount < 1) {
      alert("Invalid formation! Min requirements: 3 DEF, 2 MID, 1 FWD.");
      pendingSubId = null;
      renderMain();
      return;
    }

    p1.isStarter = !p1.isStarter;
    p2.isStarter = !p2.isStarter;

    if (!p1.isStarter) p1.benchOrder = p2.benchOrder || 1;
    if (!p2.isStarter) p2.benchOrder = p1.benchOrder || 1;

    pendingSubId = null;
    saveState();
    renderMain();
  }
}

function startSub(id) {
  activeModalPlayerId = null;
  pendingSubId = id;
  renderMain();
}

function makeCaptain(id) {
  mySquad.forEach(p => {
    if (p.id === id) {
      p.isCaptain = true;
      p.isViceCaptain = false;
    } else if (p.isCaptain) {
      p.isCaptain = false;
    }
  });
  activeModalPlayerId = null;
  saveState();
  renderMain();
}

function makeViceCaptain(id) {
  mySquad.forEach(p => {
    if (p.id === id) {
      p.isViceCaptain = true;
      p.isCaptain = false;
    } else if (p.isViceCaptain) {
      p.isViceCaptain = false;
    }
  });
  activeModalPlayerId = null;
  saveState();
  renderMain();
}

function shiftBenchOrder(id, direction) {
  const outfieldBench = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => a.benchOrder - b.benchOrder);
  
  const idx = outfieldBench.findIndex(p => p.id === id);
  if (idx === -1) return;

  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= outfieldBench.length) return;

  const temp = outfieldBench[idx].benchOrder;
  outfieldBench[idx].benchOrder = outfieldBench[targetIdx].benchOrder;
  outfieldBench[targetIdx].benchOrder = temp;

  saveState();
  renderMain();
}

function handleAutoPickUI() {
  const gkps = mySquad.filter(p => p.pos === 'GKP').sort((a, b) => b.gwPoints - a.gwPoints);
  const defs = mySquad.filter(p => p.pos === 'DEF').sort((a, b) => b.gwPoints - a.gwPoints);
  const mids = mySquad.filter(p => p.pos === 'MID').sort((a, b) => b.gwPoints - a.gwPoints);
  const fwds = mySquad.filter(p => p.pos === 'FWD').sort((a, b) => b.gwPoints - a.gwPoints);

  mySquad.forEach(p => { p.isStarter = false; });

  gkps[0].isStarter = true;
  gkps[1].benchOrder = 0;

  const selectedOutfield = [
    ...defs.slice(0, 3),
    ...mids.slice(0, 4),
    ...fwds.slice(0, 2),
    ...[...defs.slice(3), ...mids.slice(4), ...fwds.slice(2)].sort((a, b) => b.gwPoints - a.gwPoints).slice(0, 1)
  ];

  selectedOutfield.forEach(p => { p.isStarter = true; });

  const remainingBench = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => b.gwPoints - a.gwPoints);

  remainingBench.forEach((p, i) => { p.benchOrder = i + 1; });

  saveState();
  renderMain();
}

function promptChip(chipKey) {
  pendingChipToConfirm = chipKey;
  renderMain();
}

function confirmChip() {
  if (pendingChipToConfirm) {
    activeChip = pendingChipToConfirm;
    chipsUsed[pendingChipToConfirm] = true;
    pendingChipToConfirm = null;
    saveState();
    renderMain();
  }
}

function closeModal() {
  activeModalPlayerId = null;
  pendingChipToConfirm = null;
  renderMain();
}

function renderModal() {
  if (!activeModalPlayerId) return '';
  const p = mySquad.find(x => x.id === activeModalPlayerId);
  if (!p) return '';

  return `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-4 w-full max-w-xs shadow-2xl border border-gray-100 text-center relative">
        <button onclick="closeModal()" class="absolute top-3 right-3 text-gray-400 font-bold text-lg">✕</button>
        <div class="text-xs font-black text-fpl-purple uppercase tracking-widest mb-1">${p.club} • ${p.pos}</div>
        <div class="text-xl font-black text-gray-900 mb-3">${p.name}</div>
        <div class="grid grid-cols-2 gap-2 mb-4 bg-gray-50 p-2 rounded-xl text-center">
          <div><span class="block text-[10px] text-gray-500 font-bold uppercase">Price</span><span class="text-sm font-black text-fpl-purple">£${p.price}m</span></div>
          <div><span class="block text-[10px] text-gray-500 font-bold uppercase">GW Points</span><span class="text-sm font-black text-fpl-purple">${p.gwPoints}</span></div>
        </div>
        <div class="flex flex-col gap-2">
          <button onclick="startSub(${p.id})" class="w-full bg-fpl-purple text-fpl-green font-black py-2 rounded-xl text-xs uppercase shadow">Switch Player</button>
          ${p.isStarter ? `
            <button onclick="makeCaptain(${p.id})" class="w-full bg-yellow-400 text-fpl-purple font-black py-2 rounded-xl text-xs uppercase shadow">Make Captain (C)</button>
            <button onclick="makeViceCaptain(${p.id})" class="w-full bg-gray-200 text-fpl-purple font-black py-2 rounded-xl text-xs uppercase shadow">Make Vice Captain (V)</button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderChipConfirmModal() {
  if (!pendingChipToConfirm) return '';
  const names = { wc: 'Wildcard', tc: 'Triple Captain', bb: 'Bench Boost', fh: 'Free Hit' };

  return `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-5 w-full max-w-xs shadow-2xl text-center relative">
        <div class="text-lg font-black text-fpl-purple mb-2">Activate ${names[pendingChipToConfirm]}?</div>
        <p class="text-xs text-gray-600 mb-4 font-medium">Are you sure you want to activate this chip for the upcoming Gameweek?</p>
        <div class="flex gap-2">
          <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 font-black py-2 rounded-xl text-xs uppercase">Cancel</button>
          <button onclick="confirmChip()" class="flex-1 bg-fpl-purple text-fpl-green font-black py-2 rounded-xl text-xs uppercase shadow">Activate</button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 10. ENTRY POINT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderMain();
});
