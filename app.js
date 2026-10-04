// ==========================================
// 1. ETHIOPIAN PREMIER LEAGUE DATASET
// ==========================================
const ETHIOPIAN_CLUBS = {
  "Saint George": { primary: "#FFD700", secondary: "#000080" },
  "Ethiopian Coffee": { primary: "#FF6600", secondary: "#008000" },
  "CBE SA": { primary: "#0047AB", secondary: "#FFFFFF" },
  "Mechal": { primary: "#006400", secondary: "#FFD700" },
  "Fasil Kenema": { primary: "#CC0000", secondary: "#FFCC00" },
  "Bahir Dar City": { primary: "#FF4500", secondary: "#000080" },
  "Hawassa City": { primary: "#008080", secondary: "#FFFFFF" },
  "Sidama Coffee": { primary: "#008000", secondary: "#FFD700" },
  "Adama City": { primary: "#800080", secondary: "#FFD700" },
  "Wolayta Dicha": { primary: "#0000FF", secondary: "#FFFFFF" }
};

const playerMarket = [
  // Goalkeepers (GKP) - 2 Required in Squad
  { id: 1, name: "S. Bahiru", club: "Saint George", pos: "GKP", price: 5.5, form: 5.2 },
  { id: 2, name: "F. Getahun", club: "CBE SA", pos: "GKP", price: 5.0, form: 4.8 },
  { id: 3, name: "A. Nuri", club: "Ethiopian Coffee", pos: "GKP", price: 4.5, form: 4.1 },
  { id: 4, name: "P. Sy", club: "Bahir Dar City", pos: "GKP", price: 4.5, form: 4.6 },
  { id: 5, name: "B. Negash", club: "Mechal", pos: "GKP", price: 4.0, form: 3.8 },

  // Defenders (DEF) - 5 Required in Squad
  { id: 6, name: "A. K. Frimpong", club: "Saint George", pos: "DEF", price: 5.5, form: 6.0 },
  { id: 7, name: "F. Jamal", club: "CBE SA", pos: "DEF", price: 5.0, form: 5.2 },
  { id: 8, name: "W. Birhanu", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, form: 4.5 },
  { id: 9, name: "M. Wondimu", club: "Mechal", pos: "DEF", price: 4.5, form: 4.8 },
  { id: 10, name: "Y. Kasaye", club: "Fasil Kenema", pos: "DEF", price: 4.5, form: 4.2 },
  { id: 11, name: "F. Kassa", club: "Bahir Dar City", pos: "DEF", price: 4.5, form: 5.0 },
  { id: 12, name: "A. Tefera", club: "Ethiopian Coffee", pos: "DEF", price: 4.0, form: 3.9 },
  { id: 13, name: "H. Lemma", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 4.1 },

  // Midfielders (MID) - 5 Required in Squad
  { id: 14, name: "K. Markneh", club: "Mechal", pos: "MID", price: 8.0, form: 7.8 },
  { id: 15, name: "B. Belay", club: "Saint George", pos: "MID", price: 7.5, form: 7.2 },
  { id: 16, name: "A. Gidey", club: "CBE SA", pos: "MID", price: 7.5, form: 7.0 },
  { id: 17, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, form: 6.5 },
  { id: 18, name: "C. Teshoma", club: "Ethiopian Coffee", pos: "MID", price: 6.5, form: 6.1 },
  { id: 19, name: "A. Azene", club: "Bahir Dar City", pos: "MID", price: 6.0, form: 5.8 },
  { id: 20, name: "B. Desta", club: "Fasil Kenema", pos: "MID", price: 5.5, form: 5.0 },
  { id: 21, name: "W. Tesfaye", club: "Wolayta Dicha", pos: "MID", price: 4.5, form: 4.2 },

  // Forwards (FWD) - 3 Required in Squad
  { id: 22, name: "A. Yalew", club: "Saint George", pos: "FWD", price: 8.5, form: 8.2 },
  { id: 23, name: "A. Gebremichael", club: "Saint George", pos: "FWD", price: 8.0, form: 7.5 },
  { id: 24, name: "R. Adongo", club: "CBE SA", pos: "FWD", price: 7.5, form: 7.1 },
  { id: 25, name: "G. Kebede", club: "Fasil Kenema", pos: "FWD", price: 7.5, form: 6.9 },
  { id: 26, name: "C. Gugsa", club: "Mechal", pos: "FWD", price: 7.0, form: 6.6 },
  { id: 27, name: "H. Tadesse", club: "Bahir Dar City", pos: "FWD", price: 6.0, form: 5.8 }
];

// ==========================================
// 2. FPL GAME ENGINE STATE
// ==========================================
const SQUAD_LIMITS = { GKP: 2, DEF: 5, MID: 5, FWD: 3 };
const MAX_PER_CLUB = 3;

let gameState = {
  mySquad: [],            // 15 Players
  bank: 100.0,            // £100.0m Initial Budget
  totalPoints: 0,
  gameweek: 1,
  freeTransfers: 1,
  pendingTransfersCount: 0,
  currentGwHits: 0,
  activeChip: null,       // 'wc', 'fh', 'tc', 'bb'
  chipsUsed: { wc: false, fh: false, tc: false, bb: false },
  pendingSubId: null
};

// ==========================================
// 3. SQUAD VALIDATION & SELECTION
// ==========================================

// Check if Starting 11 fits official FPL formation rules
function isValidFormation(starters) {
  if (starters.length !== 11) return false;
  const gk = starters.filter(p => p.pos === 'GKP').length;
  const def = starters.filter(p => p.pos === 'DEF').length;
  const mid = starters.filter(p => p.pos === 'MID').length;
  const fwd = starters.filter(p => p.pos === 'FWD').length;

  return gk === 1 && def >= 3 && def <= 5 && mid >= 2 && mid <= 5 && fwd >= 1 && fwd <= 3;
}

// Auto-Pick 15 Squad within £100m Budget & Max 3 per Club
function autoPickSquad() {
  gameState.mySquad = [];
  gameState.bank = 100.0;

  const clubCounts = {};
  const posCounts = { GKP: 0, DEF: 0, MID: 0, FWD: 0 };
  const sorted = [...playerMarket].sort((a, b) => a.price - b.price);

  for (let p of sorted) {
    if (gameState.mySquad.length >= 15) break;

    const club = p.club;
    if ((clubCounts[club] || 0) >= MAX_PER_CLUB) continue;
    if (posCounts[p.pos] < SQUAD_LIMITS[p.pos] && gameState.bank >= p.price) {
      gameState.mySquad.push({
        ...p,
        purchasePrice: p.price,
        isStarter: false,
        benchOrder: 0,
        isCaptain: false,
        isViceCaptain: false,
        gwPoints: 0
      });
      gameState.bank = parseFloat((gameState.bank - p.price).toFixed(1));
      posCounts[p.pos]++;
      clubCounts[club] = (clubCounts[club] || 0) + 1;
    }
  }

  autoAssignStartingXI();
  renderAll();
}

// Set standard 4-4-2 / 3-5-2 default starters & captains
function autoAssignStartingXI() {
  if (gameState.mySquad.length < 15) return;

  gameState.mySquad.forEach(p => { p.isStarter = false; p.benchOrder = 0; });

  const gks = gameState.mySquad.filter(p => p.pos === 'GKP').sort((a, b) => b.price - a.price);
  const defs = gameState.mySquad.filter(p => p.pos === 'DEF').sort((a, b) => b.price - a.price);
  const mids = gameState.mySquad.filter(p => p.pos === 'MID').sort((a, b) => b.price - a.price);
  const fwds = gameState.mySquad.filter(p => p.pos === 'FWD').sort((a, b) => b.price - a.price);

  // Pick 1 GK, 4 DEF, 4 MID, 2 FWD
  gks[0].isStarter = true;
  defs.slice(0, 4).forEach(p => p.isStarter = true);
  mids.slice(0, 4).forEach(p => p.isStarter = true);
  fwds.slice(0, 2).forEach(p => p.isStarter = true);

  // Order remaining 3 outfield players on bench
  const benchOutfield = gameState.mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => b.price - a.price);
  benchOutfield.forEach((p, idx) => { p.benchOrder = idx + 1; });

  // Assign Captain & Vice Captain
  const starters = gameState.mySquad.filter(p => p.isStarter).sort((a, b) => b.price - a.price);
  gameState.mySquad.forEach(p => { p.isCaptain = false; p.isViceCaptain = false; });
  starters[0].isCaptain = true;
  starters[1].isViceCaptain = true;
}

// ==========================================
// 4. INTERACTIVE SUBSTITUTIONS
// ==========================================
function startSwap(id) {
  gameState.pendingSubId = id;
  renderPitch();
}

function executeSwap(targetId) {
  const sourceId = gameState.pendingSubId;
  if (!sourceId || sourceId === targetId) {
    gameState.pendingSubId = null;
    renderPitch();
    return;
  }

  const p1 = gameState.mySquad.find(p => p.id === sourceId);
  const p2 = gameState.mySquad.find(p => p.id === targetId);

  // Goalkeepers can only swap with Goalkeepers
  if ((p1.pos === 'GKP' && p2.pos !== 'GKP') || (p2.pos === 'GKP' && p1.pos !== 'GKP')) {
    alert("Goalkeepers can only swap with another Goalkeeper!");
    gameState.pendingSubId = null;
    renderPitch();
    return;
  }

  // Swap Starter status
  const tempStatus = p1.isStarter;
  p1.isStarter = p2.isStarter;
  p2.isStarter = tempStatus;

  // Validate formation logic (3-5 DEF, 2-5 MID, 1-3 FWD)
  const starters = gameState.mySquad.filter(p => p.isStarter);
  if (!isValidFormation(starters)) {
    // Revert if illegal formation
    p2.isStarter = p1.isStarter;
    p1.isStarter = tempStatus;
    alert("Invalid Formation! Squad must have 1 GK, 3-5 DEF, 2-5 MID, 1-3 FWD.");
  }

  // Re-index bench priority
  const benchOutfield = gameState.mySquad.filter(p => !p.isStarter && p.pos !== 'GKP');
  benchOutfield.forEach((p, idx) => { p.benchOrder = idx + 1; });

  gameState.pendingSubId = null;
  renderPitch();
}

// ==========================================
// 5. TRANSFERS & 50% PROFIT SELLING RULE
// ==========================================
function getSellingPrice(player) {
  const purchase = player.purchasePrice || player.price;
  const current = player.price;
  if (current > purchase) {
    const profit = current - purchase;
    return parseFloat((purchase + Math.floor(profit * 10 / 2) / 10).toFixed(1));
  }
  return current;
}

function buyPlayer(id) {
  const p = playerMarket.find(x => x.id === id);
  if (gameState.mySquad.length >= 15) return alert("Squad full (15/15)! Sell a player first.");
  if (gameState.bank < p.price) return alert(`Insufficient funds! Need £${p.price}m.`);

  const clubCount = gameState.mySquad.filter(x => x.club === p.club).length;
  if (clubCount >= MAX_PER_CLUB) return alert(`Max 3 players allowed from ${p.club}.`);

  const posCount = gameState.mySquad.filter(x => x.pos === p.pos).length;
  if (posCount >= SQUAD_LIMITS[p.pos]) return alert(`Max ${SQUAD_LIMITS[p.pos]} ${p.pos}s allowed.`);

  gameState.mySquad.push({
    ...p,
    purchasePrice: p.price,
    isStarter: false,
    benchOrder: 0,
    isCaptain: false,
    isViceCaptain: false,
    gwPoints: 0
  });

  gameState.bank = parseFloat((gameState.bank - p.price).toFixed(1));
  gameState.pendingTransfersCount++;
  renderAll();
}

function sellPlayer(id) {
  const p = gameState.mySquad.find(x => x.id === id);
  if (!p) return;

  const sellPrice = getSellingPrice(p);
  gameState.mySquad = gameState.mySquad.filter(x => x.id !== id);
  gameState.bank = parseFloat((gameState.bank + sellPrice).toFixed(1));
  gameState.pendingTransfersCount++;
  renderAll();
}

function confirmTransfers() {
  if (gameState.mySquad.length < 15) return alert("Must have 15 players in squad before confirming!");

  // Gameweek 1 has no point hit penalty
  if (gameState.gameweek > 1) {
    const extraTransfers = Math.max(0, gameState.pendingTransfersCount - gameState.freeTransfers);
    const hitPoints = extraTransfers * 4;
    gameState.currentGwHits += hitPoints;
    gameState.freeTransfers = Math.max(0, gameState.freeTransfers - gameState.pendingTransfersCount);
  }

  gameState.pendingTransfersCount = 0;
  autoAssignStartingXI();
  renderAll();
  alert("Transfers confirmed!");
}

// ==========================================
// 6. GAMEWEEK SIMULATION & SCORING
// ==========================================
function simulateGameweek() {
  if (gameState.mySquad.length < 15) return alert("Pick 15 players first!");

  let gwScore = 0;

  // 1. Calculate individual player points from match statistics
  gameState.mySquad.forEach(p => {
    let minutes = Math.random() > 0.1 ? 90 : 0; // 90% appearance chance
    let points = 0;

    if (minutes > 0) {
      points += minutes >= 60 ? 2 : 1; // Appearance points
      
      // Random goals / assists / clean sheets
      const goals = Math.floor(Math.random() * 2);
      const assists = Math.floor(Math.random() * 2);
      const cleanSheet = Math.random() > 0.5;

      if (p.pos === 'FWD') points += goals * 4;
      if (p.pos === 'MID') points += goals * 5 + (cleanSheet ? 1 : 0);
      if (p.pos === 'DEF' || p.pos === 'GKP') points += goals * 6 + (cleanSheet ? 4 : 0);

      points += assists * 3;
    }
    p.gwPoints = points;
    p.minutes = minutes;
  });

  // 2. FPL Auto-Sub: If starter played 0 mins, swap top available bench player
  const starterGkp = gameState.mySquad.find(p => p.isStarter && p.pos === 'GKP');
  const benchGkp = gameState.mySquad.find(p => !p.isStarter && p.pos === 'GKP');
  if (starterGkp && starterGkp.minutes === 0 && benchGkp && benchGkp.minutes > 0) {
    starterGkp.isStarter = false;
    benchGkp.isStarter = true;
  }

  // 3. Tally points (Applying Captain multipliers & Bench Boost)
  const cap = gameState.mySquad.find(p => p.isCaptain) || gameState.mySquad.find(p => p.isStarter);
  const capMult = gameState.activeChip === 'tc' ? 3 : 2;

  gameState.mySquad.filter(p => p.isStarter || gameState.activeChip === 'bb').forEach(p => {
    const multiplier = (cap && p.id === cap.id) ? capMult : 1;
    gwScore += (p.gwPoints * multiplier);
  });

  // Deduct transfer hits
  gwScore -= gameState.currentGwHits;

  gameState.totalPoints += Math.max(0, gwScore);
  gameState.gameweek++;
  gameState.currentGwHits = 0;
  gameState.freeTransfers = Math.min(5, gameState.freeTransfers + 1); // Max 5 rollable transfers
  gameState.activeChip = null;

  renderAll();
  alert(`Gameweek ${gameState.gameweek - 1} finished! Total Score: ${gwScore} pts`);
}

// ==========================================
// 7. RENDER FUNCTIONS
// ==========================================
function renderPitch() {
  const pitchEl = document.getElementById('pitch-view');
  if (!pitchEl) return;

  if (gameState.mySquad.length < 15) {
    pitchEl.innerHTML = `
      <div style="text-align:center; padding: 20px;">
        <h3>Incomplete Squad (${gameState.mySquad.length}/15)</h3>
        <p>Bank Balance: £${gameState.bank}m</p>
        <button onclick="autoPickSquad()">⚡ Auto-Pick Ethiopian Premier League Squad</button>
      </div>
    `;
    return;
  }

  const starters = gameState.mySquad.filter(p => p.isStarter);
  const bench = gameState.mySquad.filter(p => !p.isStarter);

  pitchEl.innerHTML = `
    <div style="background: #2e8b57; padding: 15px; border-radius: 12px; color: white;">
      <h4 style="text-align:center; margin-bottom: 10px;">STARTING XI</h4>
      <div style="display:flex; justify-content:space-around;">
        ${starters.map(p => renderPlayerCard(p)).join('')}
      </div>
      <h4 style="text-align:center; margin-top: 20px;">BENCH</h4>
      <div style="display:flex; justify-content:space-around; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
        ${bench.map(p => renderPlayerCard(p)).join('')}
      </div>
    </div>
  `;
}

function renderPlayerCard(p) {
  const isSelected = gameState.pendingSubId === p.id;
  const clubColor = ETHIOPIAN_CLUBS[p.club]?.primary || '#333';

  return `
    <div onclick="${gameState.pendingSubId ? `executeSwap(${p.id})` : `startSwap(${p.id})`}" 
      style="border: ${isSelected ? '2px solid yellow' : '1px solid #ccc'}; padding: 6px; border-radius: 6px; background: ${clubColor}; text-align: center; cursor: pointer; min-width: 65px;">
      <small style="display:block; font-weight:bold;">${p.pos}</small>
      <strong style="font-size: 11px;">${p.name}</strong>
      ${p.isCaptain ? '<span style="background:gold; color:black; font-size:9px; border-radius:50%; padding:2px 4px;">C</span>' : ''}
      <div style="font-size: 10px; margin-top:2px;">£${p.price}m</div>
    </div>
  `;
}

function renderAll() {
  renderPitch();
  const bankEl = document.getElementById('bank-display');
  const ptsEl = document.getElementById('points-display');
  if (bankEl) bankEl.innerText = `£${gameState.bank}m`;
  if (ptsEl) ptsEl.innerText = `${gameState.totalPoints} pts`;
}

document.addEventListener('DOMContentLoaded', () => {
  autoPickSquad();
});
