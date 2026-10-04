// Run: BOT_TOKEN=123:ABC node server.js   (use DEV=1 to test in a normal browser)
const express = require("express");
const crypto = require("crypto");
const fs = require("fs");

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const DEV = process.env.DEV === "1";
const FILE = "squads.json"; // swap for SQLite/Postgres when you grow
const BUDGET = 100;

// ---- Player data: REPLACE with real Ethiopian Premier League players/prices ----
const clubs = ["Saint George","Ethiopian Coffee","Fasil Kenema","Bahir Dar Kenema","Hawassa Kenema",
  "Sidama Bunna","Wolaitta Dicha","Adama City","Mekelle 70 Enderta","Dire Dawa City"];
const shape = { GK: 1, DEF: 3, MID: 3, FWD: 2 };
const base = { GK: 4.5, DEF: 4.5, MID: 5.5, FWD: 6.5 };
const players = [];
clubs.forEach((club, ci) => {
  for (const pos in shape) for (let i = 1; i <= shape[pos]; i++)
    players.push({ id: players.length + 1, name: `${club.split(" ")[0]} ${pos}${i}`, club, pos,
      price: +(base[pos] + (10 - ci) * 0.25 - i * 0.1).toFixed(1) });
});
const byId = Object.fromEntries(players.map(p => [p.id, p]));

// ---- Telegram initData verification ----
function verify(initData) {
  if (DEV) return { id: 0 };
  if (!initData || !BOT_TOKEN) return null;
  const p = new URLSearchParams(initData);
  const hash = p.get("hash");
  p.delete("hash");
  const str = [...p.entries()].map(([k, v]) => `${k}=${v}`).sort().join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const calc = crypto.createHmac("sha256", secret).update(str).digest("hex");
  if (calc !== hash) return null;
  if (Date.now() / 1000 - Number(p.get("auth_date")) > 86400) return null;
  try { return JSON.parse(p.get("user")); } catch { return null; }
}

// ---- Squad validation (the server is the source of truth) ----
function validate(ids, captain) {
  if (!Array.isArray(ids) || new Set(ids).size !== 11) return "Pick exactly 11 different players";
  const L = ids.map(i => byId[i]);
  if (L.some(x => !x)) return "Unknown player";
  if (L.reduce((s, x) => s + x.price, 0) > BUDGET + 1e-9) return "Over budget";
  const n = p => L.filter(x => x.pos === p).length;
  if (n("GK") !== 1 || n("DEF") < 3 || n("DEF") > 5 || n("MID") < 3 || n("MID") > 5 || n("FWD") < 1 || n("FWD") > 3)
    return "Invalid formation";
  for (const c of clubs) if (L.filter(x => x.club === c).length > 3) return `Max 3 players from ${c}`;
  if (!ids.includes(captain)) return "Captain must be in your squad";
  return "";
}

const load = () => { try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return {}; } };
const save = d => fs.writeFileSync(FILE, JSON.stringify(d, null, 1));

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/api/players", (_, res) => res.json({ budget: BUDGET, players }));

app.get("/api/squad", (req, res) => {
  const u = verify(req.get("x-init-data"));
  if (!u) return res.status(401).json({ error: "Open this app from Telegram" });
  res.json(load()[u.id] || null);
});

app.post("/api/squad", (req, res) => {
  const u = verify(req.get("x-init-data"));
  if (!u) return res.status(401).json({ error: "Open this app from Telegram" });
  const { ids, captain } = req.body;
  const err = validate(ids, captain);
  if (err) return res.status(400).json({ error: err });
  const d = load();
  d[u.id] = { ids, captain, name: u.first_name || "", savedAt: new Date().toISOString() };
  save(d);
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => console.log("Running on :" + (process.env.PORT || 3000)));
