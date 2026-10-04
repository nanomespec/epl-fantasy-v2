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
// ==========================================
// 1. CLUB COLORS (All 16 Ethiopian Premier League Clubs)
// ==========================================
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
  "Welayta Dicha": { primary: "#0000FF", secondary: "#FFFFFF", accent: "#FF0000" },
  "Ethio Electric": { primary: "#FFD700", secondary: "#CC0000", accent: "#000000" },
  "Ethiopian Insurance": { primary: "#003399", secondary: "#FFFFFF", accent: "#FFD700" },
  "Welwalo Adigrat": { primary: "#FF0000", secondary: "#FFD700", accent: "#FFFFFF" },
  "Hadiya Hossana": { primary: "#008000", secondary: "#FF0000", accent: "#FFFFFF" },
  "Negele Arsi": { primary: "#008080", secondary: "#FFD700", accent: "#FFFFFF" },
  "Sheger Ketema": { primary: "#4B0082", secondary: "#FFD700", accent: "#FFFFFF" }
};

// ==========================================
// 2. COMPLETE EPL PLAYER MARKET (16 TEAMS)
// ==========================================
let playerMarket = [
  // ------------------------------------------
  // SAINT GEORGE (Kidus Giorgis)
  // ------------------------------------------
  { id: 101, name: "T. Yohannes", club: "Saint George", pos: "GKP", price: 5.0, form: 5.1, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 102, name: "K. Kueth", club: "Saint George", pos: "GKP", price: 4.5, form: 4.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 103, name: "B. Genetu", club: "Saint George", pos: "GKP", price: 4.5, form: 3.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 104, name: "A. Nesru", club: "Saint George", pos: "DEF", price: 5.5, form: 5.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 105, name: "B. Tarekegn", club: "Saint George", pos: "DEF", price: 5.0, form: 5.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 106, name: "S. Mustefa", club: "Saint George", pos: "DEF", price: 5.5, form: 6.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 107, name: "A. Getachew", club: "Saint George", pos: "DEF", price: 5.0, form: 4.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 108, name: "T. Hailemichael", club: "Saint George", pos: "DEF", price: 5.0, form: 4.9, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 109, name: "H. Yohanes", club: "Saint George", pos: "DEF", price: 4.8, form: 4.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 110, name: "T. Niguse", club: "Saint George", pos: "DEF", price: 4.8, form: 4.6, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 111, name: "P. Kentiba", club: "Saint George", pos: "DEF", price: 4.5, form: 4.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 112, name: "A. Mubarek", club: "Saint George", pos: "DEF", price: 4.5, form: 4.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 113, name: "T. Assefa", club: "Saint George", pos: "DEF", price: 4.5, form: 4.1, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 114, name: "B. Bekele", club: "Saint George", pos: "DEF", price: 4.5, form: 4.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 115, name: "B. Kifle", club: "Saint George", pos: "DEF", price: 4.5, form: 3.9, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 116, name: "Y. Yemane", club: "Saint George", pos: "DEF", price: 4.5, form: 4.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 117, name: "M. Pawlos", club: "Saint George", pos: "DEF", price: 4.5, form: 3.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 118, name: "A. Atula", club: "Saint George", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 119, name: "B. Ashamo", club: "Saint George", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 120, name: "A. Yohannes", club: "Saint George", pos: "MID", price: 6.0, form: 5.4, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 121, name: "H. Gulilat", club: "Saint George", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 122, name: "A. Hailu", club: "Saint George", pos: "MID", price: 5.5, form: 4.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 123, name: "Y. Gosaye", club: "Saint George", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 124, name: "F. Abdela", club: "Saint George", pos: "MID", price: 5.0, form: 4.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 125, name: "Y. Tesfaye", club: "Saint George", pos: "MID", price: 5.0, form: 4.3, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 126, name: "B. Alemayehu", club: "Saint George", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 127, name: "F. Adamu", club: "Saint George", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 128, name: "Y. Setgen", club: "Saint George", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 129, name: "E. Selesh", club: "Saint George", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 130, name: "B. Endale", club: "Saint George", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 131, name: "T. Teshome", club: "Saint George", pos: "FWD", price: 7.5, form: 7.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 132, name: "F. Tilahun", club: "Saint George", pos: "FWD", price: 7.0, form: 6.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 133, name: "B. Kuich", club: "Saint George", pos: "FWD", price: 7.0, form: 6.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 134, name: "T. Kedir", club: "Saint George", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 135, name: "A. Anter", club: "Saint George", pos: "FWD", price: 6.0, form: 5.0, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 136, name: "T. Birhanu", club: "Saint George", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 137, name: "A. Erbo", club: "Saint George", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },
  { id: 138, name: "K. Aklilu", club: "Saint George", pos: "FWD", price: 5.5, form: 4.5, status: 'a', nextOpp: "CBE SA (H)", fdr: 3 },

  // ------------------------------------------
  // HAWASSA CITY
  // ------------------------------------------
  { id: 201, name: "S. Habtamu", club: "Hawassa City", pos: "GKP", price: 4.5, form: 4.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 202, name: "M. Ginbo", club: "Hawassa City", pos: "GKP", price: 4.0, form: 4.0, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 203, name: "D. Tefera", club: "Hawassa City", pos: "GKP", price: 4.0, form: 3.9, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 204, name: "A. Walelign", club: "Hawassa City", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 205, name: "S. Wodesa", club: "Hawassa City", pos: "DEF", price: 5.0, form: 5.2, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 206, name: "E. Kasahun", club: "Hawassa City", pos: "DEF", price: 4.5, form: 4.6, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 207, name: "D. Zerfu", club: "Hawassa City", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 208, name: "D. Abera", club: "Hawassa City", pos: "DEF", price: 4.5, form: 4.2, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 209, name: "E. Semayat", club: "Hawassa City", pos: "DEF", price: 4.5, form: 4.1, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 210, name: "M. Markos", club: "Hawassa City", pos: "DEF", price: 4.5, form: 4.0, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 211, name: "H. Kassahun", club: "Hawassa City", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 212, name: "W. Maereg", club: "Hawassa City", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 213, name: "G. Bekele", club: "Hawassa City", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 214, name: "B. Tadele", club: "Hawassa City", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 215, name: "S. Gacho", club: "Hawassa City", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 216, name: "Y. Degife", club: "Hawassa City", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 217, name: "F. Desalegn", club: "Hawassa City", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 218, name: "A. Demissie", club: "Hawassa City", pos: "MID", price: 6.5, form: 6.1, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 219, name: "D. Tadessa", club: "Hawassa City", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 220, name: "M. Tomas", club: "Hawassa City", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 221, name: "W. Hailu", club: "Hawassa City", pos: "MID", price: 6.0, form: 5.6, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 222, name: "A. Alemu", club: "Hawassa City", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 223, name: "T. Solomon", club: "Hawassa City", pos: "MID", price: 5.5, form: 5.1, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 224, name: "Y. Biruck", club: "Hawassa City", pos: "MID", price: 5.0, form: 4.2, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 225, name: "N. Shagamo", club: "Hawassa City", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 226, name: "A. Reshad", club: "Hawassa City", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 227, name: "S. Bekele", club: "Hawassa City", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 228, name: "B. Belay", club: "Hawassa City", pos: "FWD", price: 7.0, form: 6.5, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 229, name: "T. Hefemo", club: "Hawassa City", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 230, name: "E. Eshetu", club: "Hawassa City", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 231, name: "G. Kebede", club: "Hawassa City", pos: "FWD", price: 7.5, form: 7.1, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 232, name: "Z. Kedire", club: "Hawassa City", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 233, name: "Y. Tsegaye", club: "Hawassa City", pos: "FWD", price: 5.5, form: 4.5, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 234, name: "C. Awish", club: "Hawassa City", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 235, name: "M. Endrias", club: "Hawassa City", pos: "FWD", price: 5.0, form: 4.1, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },
  { id: 236, name: "A. Eliyas", club: "Hawassa City", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Sidama (H)", fdr: 3 },

  // ------------------------------------------
  // ETHIO ELECTRIC
  // ------------------------------------------
  { id: 301, name: "N. Alionzi", club: "Ethio Electric", pos: "GKP", price: 4.5, form: 4.9, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 302, name: "Y. Morou", club: "Ethio Electric", pos: "GKP", price: 4.0, form: 4.0, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 303, name: "A. Tesfaye", club: "Ethio Electric", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 304, name: "K. Haile", club: "Ethio Electric", pos: "GKP", price: 4.0, form: 3.7, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 305, name: "B. Woldeyohannes", club: "Ethio Electric", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 306, name: "D. Kiyar", club: "Ethio Electric", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 307, name: "B. Asresehegn", club: "Ethio Electric", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 308, name: "A. Tiruneh", club: "Ethio Electric", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 309, name: "A. Aliu", club: "Ethio Electric", pos: "DEF", price: 4.0, form: 4.1, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 310, name: "G. Hailu", club: "Ethio Electric", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 311, name: "D. Nebret", club: "Ethio Electric", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 312, name: "H. Tameru", club: "Ethio Electric", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 313, name: "H. Shewalem", club: "Ethio Electric", pos: "MID", price: 5.5, form: 5.1, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 314, name: "B. Meleyo", club: "Ethio Electric", pos: "MID", price: 5.5, form: 5.2, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 315, name: "H. Gebrehiwot", club: "Ethio Electric", pos: "MID", price: 5.0, form: 4.6, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 316, name: "N. Dubale", club: "Ethio Electric", pos: "MID", price: 5.0, form: 4.4, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 317, name: "M. Reshid", club: "Ethio Electric", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 318, name: "A. Bedru", club: "Ethio Electric", pos: "MID", price: 4.5, form: 4.1, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 319, name: "B. Medhin", club: "Ethio Electric", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 320, name: "H. Jaleto", club: "Ethio Electric", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 321, name: "N. Tesfaye", club: "Ethio Electric", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 322, name: "E. Nebiyat", club: "Ethio Electric", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 323, name: "A. Habtamu", club: "Ethio Electric", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 324, name: "E. Gebremariyam", club: "Ethio Electric", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 325, name: "A. Tesfaye", club: "Ethio Electric", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 326, name: "H. Husen", club: "Ethio Electric", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 327, name: "A. Hussen", club: "Ethio Electric", pos: "FWD", price: 5.0, form: 4.2, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 328, name: "A. Negash", club: "Ethio Electric", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },
  { id: 329, name: "B. Eylachew", club: "Ethio Electric", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Fasil (A)", fdr: 4 },

  // ------------------------------------------
  // MECHAL SC (Defense Force SC)
  // ------------------------------------------
  { id: 401, name: "D. Mamo", club: "Mechal", pos: "GKP", price: 5.0, form: 5.0, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 402, name: "F. Getahun", club: "Mechal", pos: "GKP", price: 4.5, form: 4.2, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 403, name: "R. Nasser", club: "Mechal", pos: "DEF", price: 5.5, form: 5.8, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 404, name: "K. Markneh", club: "Mechal", pos: "DEF", price: 5.5, form: 5.9, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 405, name: "A. Tamene", club: "Mechal", pos: "DEF", price: 5.5, form: 6.2, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 406, name: "A. Tesfaye", club: "Mechal", pos: "DEF", price: 5.0, form: 4.8, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 407, name: "Y. Bayeh", club: "Mechal", pos: "DEF", price: 5.0, form: 5.1, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 408, name: "D. Derese", club: "Mechal", pos: "DEF", price: 4.5, form: 4.2, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 409, name: "M. Negash", club: "Mechal", pos: "DEF", price: 4.5, form: 4.0, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 410, name: "E. Fikru", club: "Mechal", pos: "DEF", price: 4.5, form: 3.9, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 411, name: "G. Panom", club: "Mechal", pos: "MID", price: 7.0, form: 6.8, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 412, name: "G. Hagos", club: "Mechal", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 413, name: "A. Yigzaw", club: "Mechal", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 414, name: "B. Belay", club: "Mechal", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 415, name: "M. Teshome", club: "Mechal", pos: "MID", price: 5.5, form: 4.8, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 416, name: "T. Wolde", club: "Mechal", pos: "MID", price: 5.0, form: 4.3, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 417, name: "Y. Tesfaye", club: "Mechal", pos: "MID", price: 5.0, form: 4.1, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 418, name: "A. Nasir", club: "Mechal", pos: "FWD", price: 9.0, form: 8.5, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 419, name: "C. Gugesa", club: "Mechal", pos: "FWD", price: 7.5, form: 7.0, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 420, name: "D. Tefera", club: "Mechal", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 421, name: "T. Debele", club: "Mechal", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },
  { id: 422, name: "H. Ayele", club: "Mechal", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Coffee (H)", fdr: 2 },

  // ------------------------------------------
  // ETHIOPIAN INSURANCE SC
  // ------------------------------------------
  { id: 501, name: "A. Nuri", club: "Ethiopian Insurance", pos: "GKP", price: 5.0, form: 5.2, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 502, name: "F. Gebremichael", club: "Ethiopian Insurance", pos: "GKP", price: 4.5, form: 4.5, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 503, name: "B. Adugna", club: "Ethiopian Insurance", pos: "GKP", price: 4.0, form: 3.9, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 504, name: "G. Ezkiel", club: "Ethiopian Insurance", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 505, name: "A. Kedir", club: "Ethiopian Insurance", pos: "GKP", price: 4.0, form: 3.7, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 506, name: "I. Abdul-Ganiyu", club: "Ethiopian Insurance", pos: "DEF", price: 5.0, form: 5.4, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 507, name: "W. Tut", club: "Ethiopian Insurance", pos: "DEF", price: 4.5, form: 4.8, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 508, name: "N. Gebreselassie", club: "Ethiopian Insurance", pos: "DEF", price: 4.5, form: 4.6, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 509, name: "M. Solomon", club: "Ethiopian Insurance", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 510, name: "M. Adane", club: "Ethiopian Insurance", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 511, name: "Y. Kassaye", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 512, name: "R. Yesuf", club: "Ethiopian Insurance", pos: "DEF", price: 4.5, form: 4.4, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 513, name: "A. Leul", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 514, name: "Y. Mohamed", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 515, name: "B. Kekaleb", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 516, name: "D. Abay", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 517, name: "T. Gashaw", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 518, name: "A. Muluneh", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 519, name: "R. Husien", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 520, name: "W. Usman", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 521, name: "Y. Segebo", club: "Ethiopian Insurance", pos: "DEF", price: 4.0, form: 3.5, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 522, name: "D. Damisse", club: "Ethiopian Insurance", pos: "MID", price: 6.0, form: 5.6, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 523, name: "B. Afutu", club: "Ethiopian Insurance", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 524, name: "M. Otolu", club: "Ethiopian Insurance", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 525, name: "D. Awlachew", club: "Ethiopian Insurance", pos: "MID", price: 5.0, form: 4.6, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 526, name: "B. Belachew", club: "Ethiopian Insurance", pos: "MID", price: 5.0, form: 4.4, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 527, name: "A. Mohammed", club: "Ethiopian Insurance", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 528, name: "K. Dawit", club: "Ethiopian Insurance", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 529, name: "W. Gezahegn", club: "Ethiopian Insurance", pos: "FWD", price: 7.0, form: 6.6, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 530, name: "A. Nkurunziza", club: "Ethiopian Insurance", pos: "FWD", price: 6.5, form: 6.0, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 531, name: "S. Saliso", club: "Ethiopian Insurance", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 532, name: "B. Mulugeta", club: "Ethiopian Insurance", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 533, name: "A. Kayiwa", club: "Ethiopian Insurance", pos: "FWD", price: 6.0, form: 5.1, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 534, name: "A. Dereje", club: "Ethiopian Insurance", pos: "FWD", price: 5.5, form: 4.5, status: 'a', nextOpp: "Adama (A)", fdr: 3 },
  { id: 535, name: "F. Roba", club: "Ethiopian Insurance", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Adama (A)", fdr: 3 },

  // ------------------------------------------
  // COMMERCIAL BANK OF ETHIOPIA (CBE SA)
  // ------------------------------------------
  { id: 601, name: "A. Desta", club: "CBE SA", pos: "GKP", price: 5.0, form: 5.2, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 602, name: "G. Jobe", club: "CBE SA", pos: "GKP", price: 4.5, form: 4.4, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 603, name: "G. Desta", club: "CBE SA", pos: "GKP", price: 4.0, form: 3.9, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 604, name: "P. Chol", club: "CBE SA", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 605, name: "C. Amankwah", club: "CBE SA", pos: "DEF", price: 5.5, form: 5.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 606, name: "Y. Legesse", club: "CBE SA", pos: "DEF", price: 5.0, form: 5.0, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 607, name: "E. Yohannes", club: "CBE SA", pos: "DEF", price: 5.0, form: 4.9, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 608, name: "A. Diakham", club: "CBE SA", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 609, name: "T. Tamirat", club: "CBE SA", pos: "DEF", price: 4.5, form: 4.2, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 610, name: "M. Elias", club: "CBE SA", pos: "DEF", price: 4.5, form: 4.1, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 611, name: "Y. Jemal", club: "CBE SA", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 612, name: "A. Megersa", club: "CBE SA", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 613, name: "A. Teklu", club: "CBE SA", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 614, name: "O. Kumera", club: "CBE SA", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 615, name: "Z. Abebe", club: "CBE SA", pos: "MID", price: 6.5, form: 6.2, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 616, name: "A. Tsegaye", club: "CBE SA", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 617, name: "B. Kassahun", club: "CBE SA", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 618, name: "M. Washe", club: "CBE SA", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 619, name: "B. Katise", club: "CBE SA", pos: "MID", price: 5.5, form: 4.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 620, name: "B. Bitsuamlak", club: "CBE SA", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 621, name: "F. Geberetsadik", club: "CBE SA", pos: "MID", price: 5.0, form: 4.3, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 622, name: "S. Chuhu", club: "CBE SA", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 623, name: "Y. Kidane", club: "CBE SA", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 624, name: "A. Ahmed", club: "CBE SA", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 625, name: "K. Dawit", club: "CBE SA", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 626, name: "S. Dejene", club: "CBE SA", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 627, name: "D. Yohannes", club: "CBE SA", pos: "FWD", price: 8.0, form: 7.5, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 628, name: "H. Shafi", club: "CBE SA", pos: "FWD", price: 7.5, form: 6.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 629, name: "T. Birhanu", club: "CBE SA", pos: "FWD", price: 7.0, form: 6.2, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 630, name: "F. Fereja", club: "CBE SA", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 631, name: "N. Daniel", club: "CBE SA", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 632, name: "S. Peter", club: "CBE SA", pos: "FWD", price: 6.0, form: 5.0, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 633, name: "E. Legamo", club: "CBE SA", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 634, name: "D. Solomon", club: "CBE SA", pos: "FWD", price: 5.5, form: 4.5, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 635, name: "H. Dewamu", club: "CBE SA", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 636, name: "T. Mekonnen", club: "CBE SA", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "St. George (A)", fdr: 4 },
  { id: 637, name: "H. Ermias", club: "CBE SA", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "St. George (A)", fdr: 4 },

  // ------------------------------------------
  // SIDAMA COFFEE (Sidama Bunna FC)
  // ------------------------------------------
  { id: 701, name: "C. Lo Ndoye", club: "Sidama Coffee", pos: "GKP", price: 5.0, form: 5.3, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 702, name: "E. Kalyowa", club: "Sidama Coffee", pos: "GKP", price: 4.5, form: 4.4, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 703, name: "M. Muze", club: "Sidama Coffee", pos: "GKP", price: 4.0, form: 3.9, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 704, name: "A. Marene", club: "Sidama Coffee", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 705, name: "S. Ledamo", club: "Sidama Coffee", pos: "GKP", price: 4.0, form: 3.7, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 706, name: "Y. Baye", club: "Sidama Coffee", pos: "DEF", price: 5.0, form: 5.0, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 707, name: "D. Demu", club: "Sidama Coffee", pos: "DEF", price: 4.5, form: 4.6, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 708, name: "A. Mussie", club: "Sidama Coffee", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 709, name: "F. Mengistu", club: "Sidama Coffee", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 710, name: "D. Alemu", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 711, name: "F. Nguema", club: "Sidama Coffee", pos: "DEF", price: 4.5, form: 4.4, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 712, name: "M. Kassa", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 713, name: "F. Maja", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 714, name: "M. Tumicha", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 715, name: "Y. Matiwas", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 716, name: "F. Chunesa", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 717, name: "T. Tesefaye", club: "Sidama Coffee", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 718, name: "K. Aucho", club: "Sidama Coffee", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 719, name: "S. Dagnachew", club: "Sidama Coffee", pos: "MID", price: 7.0, form: 6.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 720, name: "A. Achiso", club: "Sidama Coffee", pos: "MID", price: 5.5, form: 5.2, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 721, name: "F. Tewoldebirhan", club: "Sidama Coffee", pos: "MID", price: 5.0, form: 4.6, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 722, name: "R. Nasir", club: "Sidama Coffee", pos: "MID", price: 5.0, form: 4.4, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 723, name: "M. Asfaw", club: "Sidama Coffee", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 724, name: "S. Berasa", club: "Sidama Coffee", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 725, name: "E. Dejene", club: "Sidama Coffee", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 726, name: "A. Yalew", club: "Sidama Coffee", pos: "FWD", price: 8.5, form: 8.0, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 727, name: "M. Tafesse", club: "Sidama Coffee", pos: "FWD", price: 7.5, form: 7.1, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 728, name: "T. Bejrond", club: "Sidama Coffee", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 729, name: "B. Bekele", club: "Sidama Coffee", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 730, name: "B. Nago", club: "Sidama Coffee", pos: "FWD", price: 6.0, form: 5.0, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 731, name: "H. Tadesse", club: "Sidama Coffee", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 732, name: "A. Mubarak", club: "Sidama Coffee", pos: "FWD", price: 5.5, form: 4.5, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 733, name: "A. Asfaw", club: "Sidama Coffee", pos: "FWD", price: 5.0, form: 4.1, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 734, name: "E. Rondie", club: "Sidama Coffee", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 735, name: "Y. Kano", club: "Sidama Coffee", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 736, name: "M. Asfaw", club: "Sidama Coffee", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 737, name: "A. Eyasu", club: "Sidama Coffee", pos: "FWD", price: 5.0, form: 3.7, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },
  { id: 738, name: "D. Demissie", club: "Sidama Coffee", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Hawassa (A)", fdr: 3 },

  // ------------------------------------------
  // WELAYTA DICHA SC
  // ------------------------------------------
  { id: 801, name: "K. Ndiaye", club: "Welayta Dicha", pos: "GKP", price: 4.5, form: 4.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 802, name: "A. Yishak", club: "Welayta Dicha", pos: "GKP", price: 4.0, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 803, name: "A. Habte", club: "Welayta Dicha", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 804, name: "M. Bogale", club: "Welayta Dicha", pos: "DEF", price: 4.5, form: 4.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 805, name: "W. Kifle", club: "Welayta Dicha", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 806, name: "N. Nasero", club: "Welayta Dicha", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 807, name: "A. Abel", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 808, name: "B. Elias", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 809, name: "S. Solomon", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 810, name: "A. Amtataw", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 811, name: "K. Abebe", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 812, name: "B. Hizkel", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 813, name: "K. Kebede", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 814, name: "M. Tesfaye", club: "Welayta Dicha", pos: "DEF", price: 4.0, form: 3.5, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 815, name: "T. Tadesse", club: "Welayta Dicha", pos: "MID", price: 5.5, form: 5.2, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 816, name: "K. Assefa", club: "Welayta Dicha", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 817, name: "M. Addisu", club: "Welayta Dicha", pos: "MID", price: 5.0, form: 4.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 818, name: "E. Tesfaye", club: "Welayta Dicha", pos: "MID", price: 5.0, form: 4.4, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 819, name: "K. Kirkos", club: "Welayta Dicha", pos: "MID", price: 4.5, form: 4.1, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 820, name: "M. Nikole", club: "Welayta Dicha", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 821, name: "A. Okejepha", club: "Welayta Dicha", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 822, name: "S. Ibrahim", club: "Welayta Dicha", pos: "MID", price: 5.0, form: 4.3, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 823, name: "C. Mengistu", club: "Welayta Dicha", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 824, name: "M. Ufayisa", club: "Welayta Dicha", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 825, name: "C. Ufayisa", club: "Welayta Dicha", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 826, name: "Y. Darza", club: "Welayta Dicha", pos: "FWD", price: 6.5, form: 6.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 827, name: "M. Solomon", club: "Welayta Dicha", pos: "FWD", price: 6.0, form: 5.5, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 828, name: "Y. Elias", club: "Welayta Dicha", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 829, name: "T. Hilemariam", club: "Welayta Dicha", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 830, name: "A. Almayhu", club: "Welayta Dicha", pos: "FWD", price: 5.0, form: 4.2, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 831, name: "Y. Solomon", club: "Welayta Dicha", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 832, name: "A. Olisa", club: "Welayta Dicha", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 833, name: "M. Daniel", club: "Welayta Dicha", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },

  // ------------------------------------------
  // ETHIOPIAN COFFEE SC (Ethiopia Bunna)
  // ------------------------------------------
  { id: 901, name: "I. Danlad", club: "Ethiopian Coffee", pos: "GKP", price: 5.0, form: 5.1, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 902, name: "T. Kibatu", club: "Ethiopian Coffee", pos: "GKP", price: 4.5, form: 4.2, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 903, name: "M. Ayano", club: "Ethiopian Coffee", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 904, name: "R. James", club: "Ethiopian Coffee", pos: "DEF", price: 5.0, form: 5.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 905, name: "F. Ibrahim", club: "Ethiopian Coffee", pos: "DEF", price: 4.5, form: 4.6, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 906, name: "W. Getu", club: "Ethiopian Coffee", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 907, name: "N. Sisay", club: "Ethiopian Coffee", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 908, name: "S. Muhammed", club: "Ethiopian Coffee", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 909, name: "T. Tadesse", club: "Ethiopian Coffee", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 910, name: "F. Tariku", club: "Ethiopian Coffee", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 911, name: "B. Alemayehu", club: "Ethiopian Coffee", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 912, name: "N. Frew", club: "Ethiopian Coffee", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 913, name: "R. Miftah", club: "Ethiopian Coffee", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 914, name: "Y. Tariku", club: "Ethiopian Coffee", pos: "MID", price: 6.5, form: 6.2, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 915, name: "M. Tsegaye", club: "Ethiopian Coffee", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 916, name: "O. Jul", club: "Ethiopian Coffee", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 917, name: "M. Kiros", club: "Ethiopian Coffee", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 918, name: "D. Nwachukwu", club: "Ethiopian Coffee", pos: "MID", price: 6.0, form: 5.4, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 919, name: "E. Shumbeza", club: "Ethiopian Coffee", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 920, name: "M. Bedaso", club: "Ethiopian Coffee", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 921, name: "K. Feleke", club: "Ethiopian Coffee", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 922, name: "Z. Abate", club: "Ethiopian Coffee", pos: "FWD", price: 7.5, form: 7.1, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 923, name: "S. Adamu", club: "Ethiopian Coffee", pos: "FWD", price: 7.0, form: 6.5, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 924, name: "A. Admasu", club: "Ethiopian Coffee", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 925, name: "B. Getachew", club: "Ethiopian Coffee", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 926, name: "T. Mbonyumwami", club: "Ethiopian Coffee", pos: "FWD", price: 6.5, form: 5.9, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 927, name: "A. Samuel", club: "Ethiopian Coffee", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 928, name: "H. Ashenafi", club: "Ethiopian Coffee", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 929, name: "H. Sultan", club: "Ethiopian Coffee", pos: "FWD", price: 5.0, form: 4.2, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 930, name: "Y. Sisay", club: "Ethiopian Coffee", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 931, name: "K. Arebo", club: "Ethiopian Coffee", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },
  { id: 932, name: "B. Berhanu", club: "Ethiopian Coffee", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Mechal (A)", fdr: 4 },

  // ------------------------------------------
  // ADAMA CITY FC
  // ------------------------------------------
  { id: 1001, name: "A. Markos", club: "Adama City", pos: "GKP", price: 4.5, form: 4.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1002, name: "N. Tefera", club: "Adama City", pos: "GKP", price: 4.0, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1003, name: "D. Teshome", club: "Adama City", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1004, name: "J. Adugna", club: "Adama City", pos: "GKP", price: 4.0, form: 3.7, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1005, name: "M. Awol", club: "Adama City", pos: "DEF", price: 4.5, form: 4.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1006, name: "M. Kasim", club: "Adama City", pos: "DEF", price: 5.0, form: 5.2, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1007, name: "S. Yohannes", club: "Adama City", pos: "DEF", price: 4.5, form: 4.4, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1008, name: "E. Mathias", club: "Adama City", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1009, name: "M. Birhane", club: "Adama City", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1010, name: "A. Mohammed", club: "Adama City", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1011, name: "H. Kasahun", club: "Adama City", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1012, name: "M. Safa", club: "Adama City", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1013, name: "M. Feydu", club: "Adama City", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1014, name: "W. Taye", club: "Adama City", pos: "DEF", price: 4.0, form: 3.5, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1015, name: "H. Sherifa", club: "Adama City", pos: "MID", price: 5.5, form: 5.1, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1016, name: "A. Sisay", club: "Adama City", pos: "MID", price: 5.0, form: 4.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1017, name: "E. Legese", club: "Adama City", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1018, name: "S. Dari", club: "Adama City", pos: "MID", price: 5.0, form: 4.4, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1019, name: "B. Ayiten", club: "Adama City", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1020, name: "B. Seife", club: "Adama City", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1021, name: "G. Wado", club: "Adama City", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1022, name: "S. Abule", club: "Adama City", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1023, name: "Y. Eshetu", club: "Adama City", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1024, name: "M. Shemsu", club: "Adama City", pos: "MID", price: 4.5, form: 3.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1025, name: "M. Birhane", club: "Adama City", pos: "MID", price: 4.5, form: 3.5, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1026, name: "A. Sani", club: "Adama City", pos: "FWD", price: 6.5, form: 6.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1027, name: "A. Shimelis", club: "Adama City", pos: "FWD", price: 6.0, form: 5.4, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1028, name: "N. Nuri", club: "Adama City", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1029, name: "M. Kporvi", club: "Adama City", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1030, name: "A. Hussien", club: "Adama City", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1031, name: "D. Hotessa", club: "Adama City", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1032, name: "A. Sefa", club: "Adama City", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },
  { id: 1033, name: "S. Reshid", club: "Adama City", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Insurance (H)", fdr: 3 },

  // ------------------------------------------
  // FASIL KENEMA SC
  // ------------------------------------------
  { id: 1101, name: "M. Pouaty", club: "Fasil Kenema", pos: "GKP", price: 5.0, form: 5.1, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1102, name: "A. Kasaye", club: "Fasil Kenema", pos: "GKP", price: 4.5, form: 4.2, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1103, name: "Y. Derso", club: "Fasil Kenema", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1104, name: "M. Ayeru", club: "Fasil Kenema", pos: "GKP", price: 4.0, form: 3.7, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1105, name: "M. Debebe", club: "Fasil Kenema", pos: "DEF", price: 5.0, form: 5.2, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1106, name: "G. Wasswa", club: "Fasil Kenema", pos: "DEF", price: 4.5, form: 4.8, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1107, name: "A. Aman", club: "Fasil Kenema", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1108, name: "D. Fitsum", club: "Fasil Kenema", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1109, name: "K. Dagne", club: "Fasil Kenema", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1110, name: "A. Tilahun", club: "Fasil Kenema", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1111, name: "B. Amanuel", club: "Fasil Kenema", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1112, name: "F. Kasa", club: "Fasil Kenema", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1113, name: "Y. Fisseha", club: "Fasil Kenema", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1114, name: "Y. Yohannis", club: "Fasil Kenema", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1115, name: "H. Tekeste", club: "Fasil Kenema", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1116, name: "A. Mudesir", club: "Fasil Kenema", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1117, name: "A. Yohannis", club: "Fasil Kenema", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1118, name: "A. Eyayu", club: "Fasil Kenema", pos: "MID", price: 5.0, form: 4.4, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1119, name: "B. Gizaw", club: "Fasil Kenema", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1120, name: "B. Shemena", club: "Fasil Kenema", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1121, name: "Z. Solomon", club: "Fasil Kenema", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1122, name: "J. Mulu", club: "Fasil Kenema", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1123, name: "E. Hailu", club: "Fasil Kenema", pos: "MID", price: 4.5, form: 3.6, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1124, name: "H. Nega", club: "Fasil Kenema", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1125, name: "W. Gebremichael", club: "Fasil Kenema", pos: "MID", price: 4.5, form: 3.5, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1126, name: "A. Gidey", club: "Fasil Kenema", pos: "FWD", price: 7.5, form: 7.0, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1127, name: "D. Awoke", club: "Fasil Kenema", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1128, name: "K. Zelalem", club: "Fasil Kenema", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1129, name: "N. Gebregiorgis", club: "Fasil Kenema", pos: "FWD", price: 6.0, form: 5.0, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1130, name: "A. Murad", club: "Fasil Kenema", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1131, name: "N. Masresha", club: "Fasil Kenema", pos: "FWD", price: 5.5, form: 4.5, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1132, name: "R. Amoussou", club: "Fasil Kenema", pos: "FWD", price: 6.0, form: 5.1, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1133, name: "T. Eyasu", club: "Fasil Kenema", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1134, name: "J. Philip", club: "Fasil Kenema", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Electric (H)", fdr: 2 },
  { id: 1135, name: "Y. Birhanu", club: "Fasil Kenema", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Electric (H)", fdr: 2 },

  // ------------------------------------------
  // WELWALO ADIGRAT UNIVERSITY FC
  // ------------------------------------------
  { id: 1201, name: "J. Mutakubwa", club: "Welwalo Adigrat", pos: "GKP", price: 4.5, form: 4.5, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1202, name: "S. Bereket", club: "Welwalo Adigrat", pos: "GKP", price: 4.0, form: 3.9, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1203, name: "K. Mulugeta", club: "Welwalo Adigrat", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1204, name: "C. Damtew", club: "Welwalo Adigrat", pos: "DEF", price: 4.5, form: 4.4, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1205, name: "M. Ramathan", club: "Welwalo Adigrat", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1206, name: "B. Endale", club: "Welwalo Adigrat", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1207, name: "E. Zewdu", club: "Welwalo Adigrat", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1208, name: "T. Geleta", club: "Welwalo Adigrat", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1209, name: "H. Tilahun", club: "Welwalo Adigrat", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1210, name: "B. Habtamu", club: "Welwalo Adigrat", pos: "MID", price: 5.0, form: 4.8, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1211, name: "S. Mengistu", club: "Welwalo Adigrat", pos: "MID", price: 4.5, form: 4.2, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1212, name: "Y. Alemu", club: "Welwalo Adigrat", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1213, name: "N. Getachew", club: "Welwalo Adigrat", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1214, name: "F. Tadesse", club: "Welwalo Adigrat", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1215, name: "F. Bayo", club: "Welwalo Adigrat", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1216, name: "A. Yohannes", club: "Welwalo Adigrat", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1217, name: "D. Fikadu", club: "Welwalo Adigrat", pos: "FWD", price: 5.5, form: 4.5, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },
  { id: 1218, name: "H. Mulugeta", club: "Welwalo Adigrat", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Bahir Dar (A)", fdr: 4 },

  // ------------------------------------------
  // BAHIR DAR KENEMA FC
  // ------------------------------------------
  { id: 1301, name: "P. S. Ndiaye", club: "Bahir Dar City", pos: "GKP", price: 5.0, form: 5.3, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1302, name: "Y. Mequanint", club: "Bahir Dar City", pos: "GKP", price: 4.5, form: 4.2, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1303, name: "N. Belsti", club: "Bahir Dar City", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1304, name: "M. Kassa", club: "Bahir Dar City", pos: "DEF", price: 5.0, form: 5.1, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1305, name: "W. Dereje", club: "Bahir Dar City", pos: "DEF", price: 4.5, form: 4.6, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1306, name: "F. Fitalew", club: "Bahir Dar City", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1307, name: "B. Doumbia", club: "Bahir Dar City", pos: "DEF", price: 4.5, form: 4.4, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1308, name: "K. Yohanes", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1309, name: "G. Anemut", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1310, name: "Y. Yemata", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1311, name: "B. Worku", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1312, name: "K. Bayelign", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1313, name: "G. Disasa", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1314, name: "M. Agegnehu", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1315, name: "T. Addis", club: "Bahir Dar City", pos: "DEF", price: 4.0, form: 3.5, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1316, name: "B. Tigabu", club: "Bahir Dar City", pos: "MID", price: 6.5, form: 6.0, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1317, name: "H. Yebeltal", club: "Bahir Dar City", pos: "MID", price: 6.0, form: 5.5, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1318, name: "H. Lijalem", club: "Bahir Dar City", pos: "MID", price: 5.5, form: 5.0, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1319, name: "B. Semu", club: "Bahir Dar City", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1320, name: "F. Alemu", club: "Bahir Dar City", pos: "MID", price: 5.0, form: 4.4, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1321, name: "A. Getachew", club: "Bahir Dar City", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1322, name: "A. Tefera", club: "Bahir Dar City", pos: "FWD", price: 7.0, form: 6.5, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1323, name: "W. Belete", club: "Bahir Dar City", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1324, name: "Y. Dereje", club: "Bahir Dar City", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1325, name: "S. Osei", club: "Bahir Dar City", pos: "FWD", price: 6.5, form: 5.6, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1326, name: "K. Boateng", club: "Bahir Dar City", pos: "FWD", price: 6.0, form: 5.0, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1327, name: "A. Sale", club: "Bahir Dar City", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1328, name: "A. Abbas", club: "Bahir Dar City", pos: "FWD", price: 5.0, form: 4.1, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1329, name: "F. Ahmed", club: "Bahir Dar City", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },
  { id: 1330, name: "D. Gebre", club: "Bahir Dar City", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Welwalo (H)", fdr: 2 },

  // ------------------------------------------
  // HADIYA HOSSANA FC
  // ------------------------------------------
  { id: 1401, name: "A. Owusu", club: "Hadiya Hossana", pos: "GKP", price: 4.5, form: 4.6, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1402, name: "Y. Bekele", club: "Hadiya Hossana", pos: "GKP", price: 4.0, form: 4.0, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1403, name: "B. Zeleke", club: "Hadiya Hossana", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1404, name: "D. Nigussie", club: "Hadiya Hossana", pos: "DEF", price: 4.5, form: 4.7, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1405, name: "D. Wondimu", club: "Hadiya Hossana", pos: "DEF", price: 4.0, form: 4.2, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1406, name: "K. Coulibaly", club: "Hadiya Hossana", pos: "DEF", price: 4.5, form: 4.5, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1407, name: "D. Desalegn", club: "Hadiya Hossana", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1408, name: "N. Moges", club: "Hadiya Hossana", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1409, name: "H. Arfichu", club: "Hadiya Hossana", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1410, name: "K. Wubshet", club: "Hadiya Hossana", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1411, name: "A. Elias", club: "Hadiya Hossana", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1412, name: "M. Kebela", club: "Hadiya Hossana", pos: "MID", price: 5.5, form: 5.1, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1413, name: "E. Alemayehu", club: "Hadiya Hossana", pos: "MID", price: 5.0, form: 4.6, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1414, name: "M. Mishamo", club: "Hadiya Hossana", pos: "MID", price: 5.0, form: 4.5, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1415, name: "E. Abayneh", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 4.1, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1416, name: "T. Anley", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1417, name: "S. Getachew", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1418, name: "S. Temesgen", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1419, name: "A. Derbe", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1420, name: "T. Seboka", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1421, name: "M. Ayele", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 3.6, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1422, name: "E. Ahmed", club: "Hadiya Hossana", pos: "MID", price: 4.5, form: 3.5, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1423, name: "O. Oukri", club: "Hadiya Hossana", pos: "FWD", price: 7.0, form: 6.2, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1424, name: "T. Gizaw", club: "Hadiya Hossana", pos: "FWD", price: 6.0, form: 5.4, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1425, name: "C. Teshita", club: "Hadiya Hossana", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1426, name: "B. Beyene", club: "Hadiya Hossana", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1427, name: "D. Wamisho", club: "Hadiya Hossana", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1428, name: "T. Tsedeke", club: "Hadiya Hossana", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Negele (A)", fdr: 3 },
  { id: 1429, name: "J. Kemal", club: "Hadiya Hossana", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Negele (A)", fdr: 3 },

  // ------------------------------------------
  // NEGELE ARSI FC
  // ------------------------------------------
  { id: 1501, name: "A. Iddrisu", club: "Negele Arsi", pos: "GKP", price: 4.5, form: 4.5, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1502, name: "E. Teshome", club: "Negele Arsi", pos: "GKP", price: 4.0, form: 3.9, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1503, name: "A. Ketema", club: "Negele Arsi", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1504, name: "R. Selalo", club: "Negele Arsi", pos: "DEF", price: 4.5, form: 4.4, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1505, name: "D. Melese", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1506, name: "P. Eboussi", club: "Negele Arsi", pos: "DEF", price: 4.5, form: 4.3, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1507, name: "T. Bekele", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1508, name: "M. Fikre", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1509, name: "F. Petros", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1510, name: "A. Wuro", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1511, name: "B. Tsegaye", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1512, name: "B. Boka", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1513, name: "F. Shibiru", club: "Negele Arsi", pos: "DEF", price: 4.0, form: 3.5, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1514, name: "A. Markos", club: "Negele Arsi", pos: "MID", price: 5.0, form: 4.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1515, name: "D. Tefera", club: "Negele Arsi", pos: "MID", price: 4.5, form: 4.2, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1516, name: "B. Wolde", club: "Negele Arsi", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1517, name: "Z. Feleke", club: "Negele Arsi", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1518, name: "F. Tewoldemariyam", club: "Negele Arsi", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1519, name: "A. Kemal", club: "Negele Arsi", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1520, name: "A. Fanta", club: "Negele Arsi", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1521, name: "B. Bekure", club: "Negele Arsi", pos: "MID", price: 4.5, form: 3.6, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1522, name: "H. Kemal", club: "Negele Arsi", pos: "FWD", price: 6.0, form: 5.2, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1523, name: "D. Araya", club: "Negele Arsi", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1524, name: "K. Bezuneh", club: "Negele Arsi", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1525, name: "G. Dubale", club: "Negele Arsi", pos: "FWD", price: 5.0, form: 4.1, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1526, name: "K. Jima", club: "Negele Arsi", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1527, name: "M. Melaku", club: "Negele Arsi", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1528, name: "E. Befikadu", club: "Negele Arsi", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1529, name: "N. Solomon", club: "Negele Arsi", pos: "FWD", price: 5.0, form: 3.7, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1530, name: "D. Gemechu", club: "Negele Arsi", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },
  { id: 1531, name: "T. Nura", club: "Negele Arsi", pos: "FWD", price: 5.0, form: 3.6, status: 'a', nextOpp: "Hossana (H)", fdr: 3 },

  // ------------------------------------------
  // SHEGER KETEMA FC
  // ------------------------------------------
  { id: 1601, name: "B. Negash", club: "Sheger Ketema", pos: "GKP", price: 4.5, form: 4.5, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1602, name: "A. Belay", club: "Sheger Ketema", pos: "GKP", price: 4.0, form: 3.9, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1603, name: "M. Yegele", club: "Sheger Ketema", pos: "GKP", price: 4.0, form: 3.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1604, name: "G. Desalegn", club: "Sheger Ketema", pos: "DEF", price: 4.5, form: 4.4, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1605, name: "A. Ayele", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 4.0, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1606, name: "K. Beyene", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 3.9, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1607, name: "F. Alemayehu", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 3.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1608, name: "M. Hailu", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1609, name: "T. Sisay", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1610, name: "S. Mamo", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 3.7, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1611, name: "O. Mohammed", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 3.6, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1612, name: "H. Adugna", club: "Sheger Ketema", pos: "DEF", price: 4.0, form: 3.5, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1613, name: "N. Zeleke", club: "Sheger Ketema", pos: "MID", price: 5.0, form: 4.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1614, name: "Z. Keder", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 4.2, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1615, name: "A. Abdo", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 4.0, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1616, name: "M. Milkiyas", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 3.9, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1617, name: "A. Hizkiel", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1618, name: "A. Regasa", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 3.7, status: 'a', nextOpp: "Sheger (A)", fdr: 3 },
  { id: 1619, name: "M. Gali", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 3.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1620, name: "E. Miftah", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 3.6, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1621, name: "B. Abrha", club: "Sheger Ketema", pos: "MID", price: 4.5, form: 3.5, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1622, name: "B. Fikre", club: "Sheger Ketema", pos: "FWD", price: 6.5, form: 5.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1623, name: "C. Lam", club: "Sheger Ketema", pos: "FWD", price: 5.5, form: 4.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1624, name: "B. Shura", club: "Sheger Ketema", pos: "FWD", price: 5.5, form: 4.6, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1625, name: "Y. Mekonen", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 4.1, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1626, name: "J. Miesa", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 4.0, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1627, name: "G. Mamo", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 3.9, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1628, name: "Y. Yitagesu", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1629, name: "M. Habetamu", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 3.7, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1630, name: "D. Kassaw", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 3.8, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1631, name: "Y. Tarekegn", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 3.6, status: 'a', nextOpp: "Dicha (A)", fdr: 3 },
  { id: 1632, name: "M. Nuredin", club: "Sheger Ketema", pos: "FWD", price: 5.0, form: 3.5, status: 'a', nextOpp: "Dicha (A)", fdr: 3 }
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
let freeTransfers = 1;
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
// 4. AUTO-PICK 11 STARTERS & BENCH ASSIGNMENT
// ==========================================
function autoAssignStarters() {
  if (!mySquad || mySquad.length === 0) return;

  mySquad.forEach(p => { p.isStarter = false; p.benchOrder = 0; });

  const gks = mySquad.filter(p => p.pos === 'GKP').sort((a, b) => b.price - a.price || b.form - a.form);
  const defs = mySquad.filter(p => p.pos === 'DEF').sort((a, b) => b.price - a.price || b.form - a.form);
  const mids = mySquad.filter(p => p.pos === 'MID').sort((a, b) => b.price - a.price || b.form - a.form);
  const fwds = mySquad.filter(p => p.pos === 'FWD').sort((a, b) => b.price - a.price || b.form - a.form);

  // 1. Mandatory base starters (1 GKP, 3 DEF, 2 MID, 1 FWD = 7 players)
  if (gks.length > 0) gks[0].isStarter = true;
  for (let i = 0; i < Math.min(3, defs.length); i++) defs[i].isStarter = true;
  for (let i = 0; i < Math.min(2, mids.length); i++) mids[i].isStarter = true;
  if (fwds.length > 0) fwds[0].isStarter = true;

  // 2. Fill remaining 4 outfield starter spots up to 11 total starters
  const unpickedOutfield = mySquad
    .filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => b.price - a.price || b.form - a.form);

  for (let p of unpickedOutfield) {
    const currentStarters = mySquad.filter(x => x.isStarter).length;
    if (currentStarters >= 11) break;

    const currentDefs = mySquad.filter(x => x.isStarter && x.pos === 'DEF').length;
    const currentMids = mySquad.filter(x => x.isStarter && x.pos === 'MID').length;
    const currentFwds = mySquad.filter(x => x.isStarter && x.pos === 'FWD').length;

    if (p.pos === 'DEF' && currentDefs < 5) { p.isStarter = true; }
    else if (p.pos === 'MID' && currentMids < 5) { p.isStarter = true; }
    else if (p.pos === 'FWD' && currentFwds < 3) { p.isStarter = true; }
  }

  // 3. Assign Bench Orders (Bench GKP = 0, Outfield Bench = 1, 2, 3)
  const benchOutfield = mySquad
    .filter(p => !p.isStarter && p.pos !== 'GKP')
    .sort((a, b) => b.price - a.price);

  benchOutfield.forEach((p, idx) => { p.benchOrder = idx + 1; });

  // 4. Set Captain & Vice-Captain
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
      
      const fwdsCount = mySquad.filter(p => p.pos === 'FWD').length;
      if (mySquad.length < 15 || fwdsCount === 0) {
        resetSquad();
        return;
      }

      autoAssignStarters();
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
  // Correctly select 15 FPL players: 2 GKPs, 5 DEFs, 5 MIDs, 3 FWDs
  const initialGkps = playerMarket.filter(p => p.pos === 'GKP').slice(0, 2);
  const initialDefs = playerMarket.filter(p => p.pos === 'DEF').slice(0, 5);
  const initialMids = playerMarket.filter(p => p.pos === 'MID').slice(0, 5);
  const initialFwds = playerMarket.filter(p => p.pos === 'FWD').slice(0, 3);

  const initialSquadList = [...initialGkps, ...initialDefs, ...initialMids, ...initialFwds];

  mySquad = initialSquadList.map(p => ({
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

function updateHeader() {
  const managerElem = document.getElementById('header-manager-name');
  const gwElem = document.getElementById('header-gw');
  const ptsElem = document.getElementById('header-pts');
  const bankElem = document.getElementById('header-bank');

  if (managerElem) managerElem.textContent = managerName;
  if (gwElem) gwElem.textContent = `GW ${gameweek}`;
  if (ptsElem) ptsElem.textContent = `${totalPoints} pts`;
  if (bankElem) bankElem.textContent = `£${bankBalance}m`;
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
  showNotification("⚡ Starting 11 auto-selected with strict FPL formation!");
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
        ⚡ Auto-Pick Starting XI (11 Players)
      </button>
      ${activeChip ? `<div class="mt-2 text-center text-xs font-bold text-fpl-purple bg-fpl-green py-1 rounded">⚡ Active Chip: ${chipLabels[activeChip]}</div>` : ''}
    </div>

    ${pendingSubId ? `<div class="bg-fpl-purple text-fpl-green text-xs p-2 text-center font-bold mb-3 rounded-lg shadow">🔄 Select player to swap with</div>` : ''}
    
    <!-- Pitch Graphic -->
    <div class="football-pitch rounded-t-2xl p-3 flex flex-col justify-around min-h-[360px] mb-1">
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'GKP').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'DEF').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'MID').map(cardHtml).join('')}</div>
      <div class="flex justify-center gap-1.5">${starters.filter(p => p.pos === 'FWD').map(cardHtml).join('')}</div>
    </div>

    <!-- Bench Container -->
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
        <!-- Outfield Subs -->
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

  const origP1Starter = p1.isStarter;
  const origP2Starter = p2.isStarter;

  p1.isStarter = origP2Starter;
  p2.isStarter = origP1Starter;

  if (!isValidFormation(mySquad.filter(p => p.isStarter))) {
    p1.isStarter = origP1Starter;
    p2.isStarter = origP2Starter;
    showNotification("Invalid FPL formation! Must have exactly 11 starters: 1 GKP, 3-5 DEF, 2-5 MID, 1-3 FWD.");
    pendingSubId = null;
    renderPitch();
    return;
  }

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
  if (bankBalance < player.price) {
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
      showNotification("⚠️️ Extra transfer used! -4 point hit applied.");
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

  bankBalance = parseFloat((bankBalance - p.price).toFixed(1));
  
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

    if (p.status === 'i' || p.status === 's') {
      minutes = 0;
    } else {
      const minRoll = Math.random();
      if (minRoll > 0.15) minutes = 90;
      else if (minRoll > 0.05) minutes = Math.floor(Math.random() * 59) + 1;
      else minutes = 0;
    }

    p.minutes = minutes;

    if (minutes > 0) {
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

      if (goals > 0) lastGwEvents.push(`⚽ GOAL! ${p.name} (${p.club}) scores ${goals > 1 ? 'a brace' : ''}!`);
      if (assists > 0) lastGwEvents.push(`🎯 ASSIST! ${p.name} (${p.club}) delivers a goal pass.`);
      if (yellow > 0) lastGwEvents.push(`🟨 YELLOW CARD for ${p.name} (${p.club}).`);

      let pts = 0;
      pts += (minutes >= 60 ? 2 : 1);

      if (cleanSheet === 1) {
        if (p.pos === 'GKP' || p.pos === 'DEF') pts += 4;
        else if (p.pos === 'MID') pts += 1;
      }

      if ((p.pos === 'GKP' || p.pos === 'DEF') && minutes >= 60) {
        pts -= Math.floor(goalsConceded / 2);
      }

      if (p.pos === 'GKP' || p.pos === 'DEF') pts += (goals * 6);
      else if (p.pos === 'MID') pts += (goals * 5);
      else if (p.pos === 'FWD') pts += (goals * 4);

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
    const starterGkp = mySquad.find(p => p.isStarter && p.pos === 'GKP');
    const benchGkp = mySquad.find(p => !p.isStarter && p.pos === 'GKP');

    if (starterGkp && starterGkp.minutes === 0 && benchGkp && benchGkp.minutes > 0) {
      starterGkp.isStarter = false;
      benchGkp.isStarter = true;
      lastGwEvents.push(`🔄 AUTO-SUB: ${benchGkp.name} (${benchGkp.gwPoints} pts) replaced GKP ${starterGkp.name} (0 mins).`);
    }

    const missingStarters = mySquad.filter(p => p.isStarter && p.pos !== 'GKP' && p.minutes === 0);
    const benchCandidates = mySquad.filter(p => !p.isStarter && p.pos !== 'GKP')
      .sort((a, b) => a.benchOrder - b.benchOrder);

    for (let missing of missingStarters) {
      for (let benchP of benchCandidates) {
        if (!benchP.isStarter && benchP.minutes > 0) {
          missing.isStarter = false;
          benchP.isStarter = true;

          const testStarters = mySquad.filter(p => p.isStarter);
          if (isValidFormation(testStarters)) {
            lastGwEvents.push(`🔄 AUTO-SUB: ${benchP.name} (Sub ${benchP.benchOrder}) replaced ${missing.name} (0 mins).`);
            break;
          } else {
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

  freeTransfers = Math.min(5, freeTransfers + 1);
  transfersMade = 0;
  transferCostPenalty = 0;

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

  // 5. Free Hit Restoration & Active Chip Clearing
  if (activeChip === 'fh' && preFreeHitSquad) {
    mySquad = JSON.parse(JSON.stringify(preFreeHitSquad));
    preFreeHitSquad = null;
    lastGwEvents.push("🔄 Free Hit active: Squad restored to pre-Free Hit selection.");
  }

  if (activeChip) {
    chipsUsed[activeChip] = true;
    activeChip = null;
  }

  saveData();
  renderAll();
  showNotification(`Gameweek ${gameweek - 1} simulated! GW Total: ${gwTotal} pts`);
}

document.addEventListener('DOMContentLoaded', loadData);
