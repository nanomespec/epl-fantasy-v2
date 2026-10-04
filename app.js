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

const managerName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'FPL Manager';
const managerId = tgUser?.id || 'local_user';

// ==========================================
// 2. STATE & STORAGE
// ==========================================
const STORAGE_KEY = 'efpl_official_v9';

let currentGW = 1;
let totalPoints = 0;
let bank = 100.0;
let freeTransfers = 1;
let transferCostPenalty = 0;
let activeChip = null; // 'wc', 'fh', 'bb', 'tc'
let chipsUsed = { wc: false, fh: false, bb: false, tc: false };
let preFreeHitSquad = [];
let pendingSubId = null;

let mySquad = [];
let userLeagues = [];

// ==========================================
// 3. INITIAL PLAYER MARKET DATA
// ==========================================
const playerMarket = [
  // GKP
  { id: 1, name: 'Said Habtamu', team: 'Saint George', pos: 'GKP', price: 5.0, status: 'a', gwPoints: 0, totalPoints: 42, selectedBy: '28.5%' },
  { id: 2, name: 'Fasil Gebremichael', team: 'Bahir Dar', pos: 'GKP', price: 4.5, status: 'a', gwPoints: 0, totalPoints: 38, selectedBy: '18.2%' },
  { id: 3, name: 'Abebe Tilahun', team: 'Ethiopia Bunna', pos: 'GKP', price: 4.0, status: 'a', gwPoints: 0, totalPoints: 24, selectedBy: '12.1%' },

  // DEF
  { id: 4, name: 'Aschalew Tamene', team: 'Fasil Kenema', pos: 'DEF', price: 5.5, status: 'a', gwPoints: 0, totalPoints: 51, selectedBy: '35.4%' },
  { id: 5, name: 'Suleman Hamid', team: 'Saint George', pos: 'DEF', price: 5.0, status: 'a', gwPoints: 0, totalPoints: 45, selectedBy: '22.0%' },
  { id: 6, name: 'Henok Inkoom', team: 'Ethiopia Bunna', pos: 'DEF', price: 4.5, status: 'a', gwPoints: 0, totalPoints: 39, selectedBy: '15.8%' },
  { id: 7, name: 'Gitu Kebede', team: 'Bahir Dar', pos: 'DEF', price: 4.5, status: 'a', gwPoints: 0, totalPoints: 33, selectedBy: '10.3%' },
  { id: 8, name: 'Amanuel Endale', team: 'Hawassa Kenema', pos: 'DEF', price: 4.0, status: 'a', gwPoints: 0, totalPoints: 28, selectedBy: '8.4%' },

  // MID
  { id: 9, name: 'Shimelis Bekele', team: 'Defense Force', pos: 'MID', price: 8.5, status: 'a', gwPoints: 0, totalPoints: 68, selectedBy: '48.1%' },
  { id: 10, name: 'Surafel Dagnachew', team: 'Fasil Kenema', pos: 'MID', price: 7.5, status: 'a', gwPoints: 0, totalPoints: 59, selectedBy: '31.2%' },
  { id: 11, name: 'Canaan Markneh', team: 'Defense Force', pos: 'MID', price: 6.5, status: 'a', gwPoints: 0, totalPoints: 47, selectedBy: '19.6%' },
  { id: 12, name: 'Amanuel Yohannes', team: 'Ethiopia Bunna', pos: 'MID', price: 6.0, status: 'a', gwPoints: 0, totalPoints: 41, selectedBy: '14.5%' },
  { id: 13, name: 'Gatoch Panom', team: 'Saint George', pos: 'MID', price: 5.5, status: 'a', gwPoints: 0, totalPoints: 36, selectedBy: '11.0%' },

  // FWD
  { id: 14, name: 'Getaneh Kebede', team: 'Ethiopia Bunna', pos: 'FWD', price: 9.0, status: 'a', gwPoints: 0, totalPoints: 74, selectedBy: '52.3%' },
  { id: 15, name: 'Dawa Hotessa', team: 'Adama City', pos: 'FWD', price: 7.5, status: 'a', gwPoints: 0, totalPoints: 55, selectedBy: '27.9%' },
  { id: 16, name: 'Abel Yalew', team: 'Saint George', pos: 'FWD', price: 7.0, status: 'a', gwPoints: 0, totalPoints: 49, selectedBy: '21.4%' },
  { id: 17, name: 'Chernet Gugsa', team: 'Bahir Dar', pos: 'FWD', price: 6.0, status: 'a', gwPoints: 0, totalPoints: 35, selectedBy: '9.8%' }
];

// ==========================================
// 4. STORAGE & INITIALIZATION LOGIC
// ==========================================
function saveData() {
  const data = {
    currentGW,
    totalPoints,
    bank,
    freeTransfers,
    transferCostPenalty,
    activeChip,
    chipsUsed,
    preFreeHitSquad,
    mySquad,
    userLeagues
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      currentGW = parsed.currentGW || 1;
      totalPoints = parsed.totalPoints || 0;
      bank = parsed.bank ?? 100.0;
      freeTransfers = parsed.freeTransfers ?? 1;
      transferCostPenalty = parsed.transferCostPenalty || 0;
      activeChip = parsed.activeChip || null;
      chipsUsed = parsed.chipsUsed || { wc: false, fh: false, bb: false, tc: false };
      preFreeHitSquad = parsed.preFreeHitSquad || [];
      mySquad = parsed.mySquad || [];
      userLeagues = parsed.userLeagues || [];
    } catch (e) {
      console.error("Failed to load saved state, re-initializing defaults", e);
      initDefaultSquad();
    }
  } else {
    initDefaultSquad();
  }

  if (userLeagues.length === 0) {
    userLeagues = [
      {
        id: 'l1',
        name: 'Global Ethiopian League',
        type: 'classic',
        members: [
          { name: managerName, points: totalPoints, w: 0, d: 0, l: 0, h2hPts: 0 },
          { name: 'Abebe Bikila XI', points: 210, w: 3, d: 0, l: 1, h2hPts: 9 },
          { name: 'Kefyalew Strikers', points: 195, w: 2, d: 1, l: 1, h2hPts: 7 }
        ]
      },
      {
        id: 'l2',
        name: 'Addis Ababa H2H Cup',
        type: 'h2h',
        members: [
          { name: managerName, points: totalPoints, w: 2, d: 1, l: 1, h2hPts: 7 },
          { name: 'Sheger United', points: 180, w: 3, d: 0, l: 1, h2hPts: 9 }
        ]
      }
    ];
  }
}

function initDefaultSquad() {
  // Setup 15 default players (11 starters, 4 bench)
  const defaultIds = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  mySquad = defaultIds.map((id, idx) => {
    const marketP = playerMarket.find(p => p.id === id);
    const isStarter = idx !== 1 && idx !== 6 && idx !== 11 && idx !== 14; // Bench 1 GKP, 1 DEF, 1 MID, 1 FWD
    return {
      ...marketP,
      purchasePrice: marketP.price,
      isStarter: isStarter,
      isCaptain: id === 14, // Getaneh Kebede
      isViceCaptain: id === 9 // Shimelis Bekele
    };
  });

  bank = 0.5;
  saveData();
}

// ==========================================
// 5. HELPER UTILITIES
// ==========================================
function getPlayerSellValue(p) {
  const purchasePrice = p.purchasePrice || p.price;
  const profit = p.price - purchasePrice;
  if (profit <= 0) return p.price;

  // Floor profit to nearest 0.1m after 50% split (FPL rules)
  const sellableProfit = Math.floor((profit * 10) / 2) / 10;
  return parseFloat((purchasePrice + sellableProfit).toFixed(1));
}

function isValidFormation(starters) {
  if (starters.length !== 11) return false;

  const counts = { GKP: 0, DEF: 0, MID: 0, FWD: 0 };
  starters.forEach(p => {
    if (counts[p.pos] !== undefined) counts[p.pos]++;
  });

  return (
    counts.GKP === 1 &&
    counts.DEF >= 3 && counts.DEF <= 5 &&
    counts.MID >= 2 && counts.MID <= 5 &&
    counts.FWD >= 1 && counts.FWD <= 3
  );
}

function showNotification(msg) {
  const toast = document.getElementById('notification-toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  } else {
    alert(msg);
  }
}

// ==========================================
// 6. SUBSTITUTION ENGINE
// ==========================================
function executeSwap(id1, id2) {
  if (id1 === id2) {
    pendingSubId = null;
    renderPitch();
    return;
  }

  const p1 = mySquad.find(p => p.id === id1);
  const p2 = mySquad.find(p => p.id === id2);

  if (!p1 || !p2) {
    pendingSubId = null;
    renderPitch();
    return;
  }

  // Goalkeeper substitution restriction
  if (p1.pos === 'GKP' || p2.pos === 'GKP') {
    if (p1.pos !== p2.pos) {
      pendingSubId = null;
      showNotification("Goalkeepers can only be substituted for another Goalkeeper!");
      renderPitch();
      return;
    }
  }

  // Preserve initial starter statuses independently
  const p1InitialStarter = p1.isStarter;
  const p2InitialStarter = p2.isStarter;

  // Perform swap
  p1.isStarter = p2InitialStarter;
  p2.isStarter = p1InitialStarter;

  // Validate formation with new layout
  const currentStarters = mySquad.filter(p => p.isStarter);
  if (!isValidFormation(currentStarters)) {
    // Revert cleanly to initial states
    p1.isStarter = p1InitialStarter;
    p2.isStarter = p2InitialStarter;
    showNotification("Invalid formation! Must have 1 GKP, 3-5 DEF, 2-5 MID, 1-3 FWD.");
  }

  pendingSubId = null;
  saveData();
  renderPitch();
}

function handlePlayerClick(id) {
  if (!pendingSubId) {
    pendingSubId = id;
    renderPitch();
  } else {
    executeSwap(pendingSubId, id);
  }
}

function setCaptain(id) {
  mySquad.forEach(p => {
    if (p.id === id) {
      p.isCaptain = true;
      p.isViceCaptain = false;
    } else if (p.isCaptain) {
      p.isCaptain = false;
    }
  });
  saveData();
  renderPitch();
}

function setViceCaptain(id) {
  mySquad.forEach(p => {
    if (p.id === id) {
      p.isViceCaptain = true;
      p.isCaptain = false;
    } else if (p.isViceCaptain) {
      p.isViceCaptain = false;
    }
  });
  saveData();
  renderPitch();
}

// ==========================================
// 7. GAMEWEEK SIMULATION ENGINE
// ==========================================
function simulateGameweek() {
  // 1. Generate random performance points for squad players
  mySquad.forEach(p => {
    p.gwPoints = Math.floor(Math.random() * 12);
  });

  // 2. Captain & Vice-Captain Multiplier Resolution
  const capPlayer = mySquad.find(p => p.isCaptain);

  // Captain is active if present, played (> 0 points), and available
  const capActive = capPlayer && capPlayer.gwPoints > 0 && capPlayer.status !== 'i' && capPlayer.status !== 's';
  const activeMultiplier = activeChip === 'tc' ? 3 : 2;

  // 3. Auto-Substitutions with Formation Rules (Skipped if Bench Boost active)
  if (activeChip !== 'bb') {
    let bench = mySquad.filter(p => !p.isStarter);

    bench.forEach(sub => {
      if (sub.gwPoints === 0) return; // Bench player didn't play

      // Find starter with 0 pts whose replacement maintains a legal formation
      const candidateIndex = mySquad.findIndex(s => {
        if (!s.isStarter || s.gwPoints > 0) return false;

        // Test temporary substitution
        s.isStarter = false;
        sub.isStarter = true;
        const valid = isValidFormation(mySquad.filter(x => x.isStarter));

        // Revert test
        s.isStarter = true;
        sub.isStarter = false;
        return valid;
      });

      if (candidateIndex !== -1) {
        mySquad[candidateIndex].isStarter = false;
        sub.isStarter = true;
        showNotification(`Auto-sub: ${sub.name} (${sub.gwPoints} pts) replaced ${mySquad[candidateIndex].name}`);
      }
    });
  }

  // 4. Calculate Net Gameweek Score
  let rawGwTotal = 0;
  mySquad.forEach(p => {
    let mult = 1;

    if (p.isCaptain && capActive) {
      mult = activeMultiplier;
    } else if (p.isViceCaptain && !capActive) {
      mult = activeMultiplier; // Vice-Captain receives multiplier if Captain is inactive
    }

    if (p.isStarter || activeChip === 'bb') {
      rawGwTotal += (p.gwPoints * mult);
    }
  });

  // Deduct transfer penalties from Gameweek total
  const penalty = transferCostPenalty || 0;
  const netGwPoints = Math.max(0, rawGwTotal - penalty);

  totalPoints += netGwPoints;
  currentGW += 1;

  // 5. Update Mini-League Standings & AI Opponents
  if (Array.isArray(userLeagues)) {
    userLeagues.forEach(league => {
      if (!league.members) return;

      league.members.forEach(member => {
        member.p = (member.p || 0) + 1; // Increment played matches

        let memberGwScore = netGwPoints;

        // Simulate dynamic GW points for non-user AI league members
        if (member.name !== managerName) {
          memberGwScore = Math.floor(Math.random() * 45) + 30; // Simulated GW score (30-75)
          member.points = (member.points || 0) + memberGwScore;
        } else {
          member.points = (member.points || 0) + netGwPoints;
        }

        // H2H Outcome Calculation
        const oppScore = Math.floor(Math.random() * 40) + 35;
        if (memberGwScore > oppScore) {
          member.w = (member.w || 0) + 1;
          member.h2hPts = (member.h2hPts || 0) + 3;
        } else if (memberGwScore === oppScore) {
          member.d = (member.d || 0) + 1;
          member.h2hPts = (member.h2hPts || 0) + 1;
        } else {
          member.l = (member.l || 0) + 1;
        }
      });

      // Sort League Standings
      if (league.type === 'classic') {
        league.members.sort((a, b) => (b.points || 0) - (a.points || 0));
      } else if (league.type === 'h2h') {
        league.members.sort((a, b) => (b.h2hPts || 0) - (a.h2hPts || 0));
      }
    });
  }

  // 6. Reset Chip State & Restore Free Hit Squad
  if (activeChip === 'fh') {
    if (typeof preFreeHitSquad !== 'undefined' && preFreeHitSquad.length > 0) {
      mySquad = JSON.parse(JSON.stringify(preFreeHitSquad));

      // Re-sync restored squad with updated market prices
      mySquad.forEach(sp => {
        const mp = playerMarket.find(m => m.id === sp.id);
        if (mp) sp.price = mp.price;
      });
      preFreeHitSquad = [];
    }
  }

  activeChip = null;
  transferCostPenalty = 0;
  freeTransfers = Math.min(2, freeTransfers + 1); // Accumulate max 2 FTs

  saveData();
  renderAll();
  showNotification(`GW ${currentGW - 1} Complete! Net Points: ${netGwPoints} (Hits: -${penalty})`);
}

// ==========================================
// 8. TRANSFERS & MARKET LOGIC
// ==========================================
function buyPlayer(id) {
  if (mySquad.length >= 15) {
    showNotification("Squad full! Sell a player first.");
    return;
  }

  const marketP = playerMarket.find(p => p.id === id);
  if (!marketP) return;

  if (bank < marketP.price) {
    showNotification("Insufficient funds in bank!");
    return;
  }

  bank = parseFloat((bank - marketP.price).toFixed(1));
  mySquad.push({
    ...marketP,
    purchasePrice: marketP.price,
    isStarter: false,
    isCaptain: false,
    isViceCaptain: false
  });

  // Calculate transfer cost penalties
  if (activeChip !== 'wc' && activeChip !== 'fh') {
    if (freeTransfers > 0) {
      freeTransfers--;
    } else {
      transferCostPenalty += 4;
    }
  }

  saveData();
  renderAll();
  showNotification(`Bought ${marketP.name} for £${marketP.price}m`);
}

function sellPlayer(id) {
  const idx = mySquad.findIndex(p => p.id === id);
  if (idx === -1) return;

  const player = mySquad[idx];
  const sellValue = getPlayerSellValue(player);

  bank = parseFloat((bank + sellValue).toFixed(1));
  mySquad.splice(idx, 1);

  saveData();
  renderAll();
  showNotification(`Sold ${player.name} for £${sellValue}m`);
}

// ==========================================
// 9. CHIPS SYSTEM
// ==========================================
function activateChip(chipKey) {
  if (chipsUsed[chipKey]) {
    showNotification("This chip has already been used!");
    return;
  }

  if (activeChip === chipKey) {
    // Cancel chip
    activeChip = null;
    showNotification("Chip deactivated.");
  } else {
    activeChip = chipKey;
    chipsUsed[chipKey] = true;

    if (chipKey === 'fh') {
      preFreeHitSquad = JSON.parse(JSON.stringify(mySquad));
    }

    showNotification(`Activated ${chipKey.toUpperCase()} Chip for GW ${currentGW}!`);
  }

  saveData();
  renderAll();
}

// ==========================================
// 10. RENDERING ENGINE
// ==========================================
function renderHeader() {
  const nameEl = document.getElementById('manager-name');
  const gwEl = document.getElementById('current-gw');
  const ptsEl = document.getElementById('total-pts');
  const bankEl = document.getElementById('bank-val');
  const ftEl = document.getElementById('free-transfers');

  if (nameEl) nameEl.textContent = managerName;
  if (gwEl) gwEl.textContent = `GW ${currentGW}`;
  if (ptsEl) ptsEl.textContent = `${totalPoints} pts`;
  if (bankEl) bankEl.textContent = `£${bank.toFixed(1)}m`;
  if (ftEl) ftEl.textContent = freeTransfers;
}

function renderPitch() {
  const pitchContainer = document.getElementById('pitch-view');
  const benchContainer = document.getElementById('bench-view');
  if (!pitchContainer || !benchContainer) return;

  pitchContainer.innerHTML = '';
  benchContainer.innerHTML = '';

  const starters = mySquad.filter(p => p.isStarter);
  const bench = mySquad.filter(p => !p.isStarter);

  // Group starters by line
  const lines = {
    GKP: starters.filter(p => p.pos === 'GKP'),
    DEF: starters.filter(p => p.pos === 'DEF'),
    MID: starters.filter(p => p.pos === 'MID'),
    FWD: starters.filter(p => p.pos === 'FWD')
  };

  Object.keys(lines).forEach(pos => {
    const row = document.createElement('div');
    row.className = `pitch-row ${pos.toLowerCase()}-row`;

    lines[pos].forEach(p => {
      row.appendChild(createPlayerCard(p, true));
    });

    pitchContainer.appendChild(row);
  });

  // Render Bench
  bench.forEach(p => {
    benchContainer.appendChild(createPlayerCard(p, false));
  });
}

function createPlayerCard(p, isStarter) {
  const card = document.createElement('div');
  card.className = `player-card ${pendingSubId === p.id ? 'selected-sub' : ''}`;

  let capBadge = '';
  if (p.isCaptain) capBadge = '<span class="badge cap">C</span>';
  if (p.isViceCaptain) capBadge = '<span class="badge vc">V</span>';

  card.innerHTML = `
    ${capBadge}
    <div class="player-pos">${p.pos}</div>
    <div class="player-name">${p.name}</div>
    <div class="player-team">${p.team}</div>
    <div class="player-pts">${p.gwPoints ?? 0} pts</div>
    <div class="card-actions">
      <button onclick="handlePlayerClick(${p.id})">${pendingSubId === p.id ? 'Cancel' : 'Sub'}</button>
      <button onclick="setCaptain(${p.id})">C</button>
      <button onclick="setViceCaptain(${p.id})">V</button>
    </div>
  `;
  return card;
}

function renderMarket() {
  const marketList = document.getElementById('market-list');
  if (!marketList) return;

  marketList.innerHTML = '';

  playerMarket.forEach(p => {
    const owned = mySquad.find(sp => sp.id === p.id);
    const item = document.createElement('div');
    item.className = 'market-item';

    item.innerHTML = `
      <div class="market-info">
        <strong>${p.name}</strong> (${p.pos} - ${p.team})
        <div>£${p.price}m | Total: ${p.totalPoints} pts</div>
      </div>
      <div class="market-action">
        ${owned 
          ? `<button class="btn-sell" onclick="sellPlayer(${p.id})">Sell (£${getPlayerSellValue(owned)}m)</button>`
          : `<button class="btn-buy" onclick="buyPlayer(${p.id})">Buy (£${p.price}m)</button>`
        }
      </div>
    `;
    marketList.appendChild(item);
  });
}

function renderLeagues() {
  const leagueContainer = document.getElementById('league-view');
  if (!leagueContainer) return;

  leagueContainer.innerHTML = '';

  userLeagues.forEach(l => {
    const sec = document.createElement('div');
    sec.className = 'league-section';
    sec.innerHTML = `<h3>${l.name} (${l.type.toUpperCase()})</h3>`;

    const table = document.createElement('table');
    table.className = 'league-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Manager</th>
          <th>Pts</th>
          <th>W-D-L</th>
        </tr>
      </thead>
      <tbody>
        ${l.members.map(m => `
          <tr class="${m.name === managerName ? 'user-row' : ''}">
            <td>${m.name}</td>
            <td>${l.type === 'h2h' ? (m.h2hPts || 0) : (m.points || 0)}</td>
            <td>${m.w || 0}-${m.d \vert{}\vert{} 0}-${m.l || 0}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
    sec.appendChild(table);
    leagueContainer.appendChild(sec);
  });
}

function renderChips() {
  const chipsContainer = document.getElementById('chips-view');
  if (!chipsContainer) return;

  chipsContainer.innerHTML = `
    <button class="chip-btn ${chipsUsed.wc ? 'used' : ''} ${activeChip === 'wc' ? 'active' : ''}" 
      onclick="activateChip('wc')" ${chipsUsed.wc && activeChip !== 'wc' ? 'disabled' : ''}>
      Wildcard
    </button>
    <button class="chip-btn ${chipsUsed.fh ? 'used' : ''} ${activeChip === 'fh' ? 'active' : ''}" 
      onclick="activateChip('fh')" ${chipsUsed.fh && activeChip !== 'fh' ? 'disabled' : ''}>
      Free Hit
    </button>
    <button class="chip-btn ${chipsUsed.bb ? 'used' : ''} ${activeChip === 'bb' ? 'active' : ''}" 
      onclick="activateChip('bb')" ${chipsUsed.bb && activeChip !== 'bb' ? 'disabled' : ''}>
      Bench Boost
    </button>
    <button class="chip-btn ${chipsUsed.tc ? 'used' : ''} ${activeChip === 'tc' ? 'active' : ''}" 
      onclick="activateChip('tc')" ${chipsUsed.tc && activeChip !== 'tc' ? 'disabled' : ''}>
      Triple Captain
    </button>
  `;
}

function renderAll() {
  renderHeader();
  renderPitch();
  renderMarket();
  renderLeagues();
  renderChips();
}

// ==========================================
// 11. APP INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderAll();

  const simBtn = document.getElementById('sim-gw-btn');
  if (simBtn) {
    simBtn.addEventListener('click', () => {
      simulateGameweek();
    });
  }
});
