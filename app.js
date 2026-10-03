// 1. Initialize Telegram WebApp SDK
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  tg.ready();
}

// 2. Ethiopian Premier League Default Squad Dataset
const playerMarket = [
  { id: 1, name: "S. Bahiru", pos: "GKP", fixture: "NEG (H)" },
  { id: 2, name: "A. Nuri", pos: "GKP", fixture: "SHE (H)" },
  { id: 3, name: "A. K. Frimpong", pos: "DEF", fixture: "NEG (H)" },
  { id: 4, name: "E. Frimpong", pos: "DEF", fixture: "NEG (H)" },
  { id: 5, name: "A. Tefera", pos: "DEF", fixture: "SHE (H)" },
  { id: 6, name: "S. Bereket", pos: "DEF", fixture: "SID (A)" },
  { id: 7, name: "Y. Endale", pos: "DEF", fixture: "WOL (A)" },
  { id: 8, name: "B. Belay", pos: "MID", fixture: "NEG (H)" },
  { id: 9, name: "E. Tadesse", pos: "MID", fixture: "SHE (H)" },
  { id: 10, name: "A. Gidey", pos: "MID", fixture: "SID (A)" },
  { id: 11, name: "G. Panom", pos: "MID", fixture: "HAW (A)" },
  { id: 12, name: "A. Okutu", pos: "FWD", fixture: "NEG (H)" },
  { id: 13, name: "H. Konkoni", pos: "FWD", fixture: "SHE (H)" },
  { id: 14, name: "D. Nathaniel", pos: "FWD", fixture: "SID (A)" },
  { id: 15, name: "B. Gugsa", pos: "FWD", fixture: "WOL (A)" }
];

// 3. User Squad State Management
let mySquad = playerMarket.map((player, index) => ({
  ...player,
  isStarter: index < 11,
  isCaptain: index === 11 // Default Captain: A. Okutu
}));

// 4. Render HTML for individual player card
function createPlayerCard(player) {
  return `
    <div class="bg-[#242f3d] border border-gray-700 rounded-lg p-2 text-center min-w-[72px] shadow-md flex flex-col items-center">
      <div class="text-[9px] text-blue-400 font-bold uppercase tracking-wider">
        ${player.pos} ${player.isCaptain ? '⭐' : ''}
      </div>
      <div class="text-xs font-bold text-white my-0.5 truncate max-w-[68px]">
        ${player.name}
      </div>
      <div class="text-[9px] text-gray-400">
        ${player.fixture}
      </div>
    </div>
  `;
}

// 5. Pitch Rendering Logic
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
    <!-- MAIN PITCH FORMATION -->
    <div class="flex flex-col justify-around h-full space-y-3 my-auto">
      <div class="flex justify-center gap-2">${gkps.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${defs.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${mids.map(createPlayerCard).join('')}</div>
      <div class="flex justify-center gap-2 flex-wrap">${fwds.map(createPlayerCard).join('')}</div>
    </div>

    <!-- BENCH SECTION -->
    <div class="mt-4 p-3 bg-[#242f3d]/60 border border-gray-700 rounded-xl text-center">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Substitutes</p>
      <div class="flex justify-center gap-2 flex-wrap">
        ${bench.map(createPlayerCard).join('')}
      </div>
    </div>
  `;
}

// 6. Boot Application
document.addEventListener('DOMContentLoaded', renderPitch);
renderPitch();
