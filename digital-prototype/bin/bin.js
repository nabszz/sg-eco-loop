/* ============================================================
   EcoLoop Kids — Community Recycling Bin (digital render)
   The interactive PROGRAM now runs INSIDE the unit's big screen.

   Community-use rules:
   - Reward is per-drop only (NOT accumulated across children).
   - No running total is shown on a sidebar/status bar.
   - Two reward modes: EZ-Link money (100 g = $1) OR points.
   ============================================================ */

/* ---------- Reward config ---------- */
// Community bin: each child collects their own reward, nothing is stored.
const REWARD = {
  ezlink: {
    key: "ezlink",
    label: "EZ-Link cents",
    // 100 g = $1  ->  1 g = 1 cent
    perGram: 1,
    format: (v) => `${v}¢`,
    collectTitle: "Tap your EZ-Link card",
    collectIcon: "💳",
    collectHow: "Hold your card on the reader below to collect your cents.",
    collectedMsg: (v) => `${v}¢ added to your EZ-Link card!`
  },
  points: {
    key: "points",
    label: "Eco points",
    // points scale so a small item still feels rewarding for little kids
    perGram: 0.5,
    format: (v) => `${v} pts`,
    collectTitle: "Scan your EcoLoop tag",
    collectIcon: "🏷️",
    collectHow: "Show your school tag or QR to the scanner to collect your points.",
    collectedMsg: (v) => `${v} eco points collected!`
  }
};

let rewardMode = "ezlink"; // default; toggled on the idle screen

/* ---------- Mascot data ---------- */
const MASCOTS = {
  plastic: {
    name: "Pip the Pal",
    material: "Plastic",
    color: "#4aa3ff",
    emoji: "🧴",
    cls: "m-plastic",
    desc: "Hi hi! I'm Pip! Empty me and dry me, then I can become a brand new bottle. Wheee!",
    examples: ["Water bottles", "Shampoo bottles", "Yoghurt cups", "Plastic cups"],
    washMsg: "Uh-oh, Pip feels sticky! Give me a quick rinse, please!",
    washSteps: [
      "Pour out any leftover drink.",
      "Rinse my inside with a little water.",
      "Shake me so I'm nice and dry.",
      "Yay! Pip is ready to recycle!"
    ],
    // Fun facts rotate daily (one shown per day)
    facts: [
      "A plastic bottle can turn into cosy jacket fabric!",
      "Recycling one bottle saves enough energy to light a bulb for hours.",
      "Plastic can be melted and reshaped again and again.",
      "Squishing bottles flat helps more fit in the truck.",
      "Caps can be recycled too — keep them on for me!",
      "Some playground slides are made from recycled plastic!",
      "A bottle in nature can take 450 years to break down."
    ]
  },
  paper: {
    name: "Papy the Paper",
    material: "Paper",
    color: "#f6b23b",
    emoji: "📄",
    cls: "m-paper",
    desc: "Hello friend! I'm Papy! Flatten me so I'm nice and thin, and keep me dry, okay?",
    examples: ["Newspaper", "Cardboard", "Story books", "Paper bags"],
    washMsg: "Oh dear, Papy got wet and greasy! Paper can't be washed — keep only the clean bits.",
    washSteps: [
      "Shake off any crumbs.",
      "Tear away wet or greasy parts.",
      "Flatten the clean, dry paper.",
      "Yay! Papy is ready to recycle!"
    ],
    facts: [
      "One recycled paper stack can save a whole tree!",
      "Paper can be recycled about 5 to 7 times.",
      "Recycled paper becomes new books and boxes.",
      "Flattening boxes saves lots of space.",
      "Wet paper can't be recycled, so keep me dry!",
      "Egg cartons are made from recycled paper!",
      "Making new paper from old paper uses less water."
    ]
  },
  glass: {
    name: "Glassy Shimmy",
    material: "Glass",
    color: "#57c785",
    emoji: "🫙",
    cls: "m-glass",
    desc: "Sparkle sparkle! I'm Glassy! Rinse me and pop off my lid so I shine for recycling.",
    examples: ["Jam jars", "Glass bottles", "Sauce jars", "Drink bottles"],
    washMsg: "Ooh, Glassy is a bit sticky! A quick rinse and I'll sparkle again!",
    washSteps: [
      "Pour out anything inside me.",
      "Rinse me with water.",
      "Twist off and keep my lid.",
      "Yay! Glassy is ready to recycle!"
    ],
    facts: [
      "Glass can be recycled forever and never wears out!",
      "A recycled jar can become a new jar in about a month.",
      "Glass is made from sand — cool, right?",
      "Recycling glass saves lots of energy.",
      "Different colours of glass get sorted separately.",
      "A glass bottle can take a very, very long time in nature.",
      "Rinsing me keeps the recycling clean for everyone!"
    ]
  },
  metal: {
    name: "Metty Bendy",
    material: "Metal",
    color: "#c0c6d0",
    emoji: "🥫",
    cls: "m-metal",
    desc: "Clink clank! I'm Metty! Cans like me can be recycled again and again. Rinse me first!",
    examples: ["Drink cans", "Food tins", "Foil trays", "Bottle caps"],
    washMsg: "Uh-oh, Metty is messy! Rinse me and I'll be shiny clean!",
    washSteps: [
      "Empty out leftover food or drink.",
      "Rinse me with water.",
      "Squash me a little to save space.",
      "Yay! Metty is ready to recycle!"
    ],
    facts: [
      "A can can be recycled and back on a shelf in 60 days!",
      "Recycling cans saves a huge amount of energy.",
      "Metal can be recycled over and over forever.",
      "A magnet helps machines sort steel cans.",
      "Squashing cans helps more fit in the bin.",
      "Old cans can become bicycle parts!",
      "Foil trays can be recycled if they're clean."
    ]
  },
  ewaste: {
    name: "Eddy the Electric",
    material: "E-waste",
    color: "#a97bff",
    emoji: "🔌",
    cls: "m-ewaste",
    desc: "Zap! I'm Eddy! Old batteries and gadgets belong with me — never the normal bin. Ask an adult!",
    examples: ["Old batteries", "Cables", "Broken toys", "Old phones"],
    washMsg: "Careful! Eddy must stay dry. Never wash me — just make sure I'm safe.",
    washSteps: [
      "Never put me in water.",
      "Wipe me with a dry cloth.",
      "Ask an adult to help with batteries.",
      "Yay! Eddy is ready to recycle safely!"
    ],
    facts: [
      "Old phones have tiny bits of real gold inside!",
      "Batteries must be recycled specially, never binned.",
      "E-waste parts can become new gadgets.",
      "Always ask an adult to help with e-waste.",
      "Recycling metals from gadgets saves mining.",
      "Broken toys with wires count as e-waste too.",
      "Keeping e-waste out of normal bins protects nature."
    ]
  }
};

// Rough weight ranges per material (grams) for the demo weigh-in
const WEIGHT_RANGES = {
  plastic: [15, 60],
  paper:   [20, 120],
  glass:   [180, 450],
  metal:   [25, 90],
  ewaste:  [40, 250]
};

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Day of year -> so the fun fact changes each day
function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}
function factForToday(material) {
  const facts = MASCOTS[material].facts;
  return facts[dayOfYear() % facts.length];
}

/* ---------- Build the cute mascot character markup ---------- */
// Layers a face (eyes + cheeks + smile + little arms) over the material emoji.
function mascotCharacter(material, size) {
  const m = MASCOTS[material];
  return `
    <div class="char ${m.cls}" style="--c:${m.color}; --size:${size}px">
      <div class="char-arm left">👋</div>
      <div class="char-arm right">✋</div>
      <div class="char-body">${m.emoji}</div>
      <div class="char-face">
        <span class="eye left"></span>
        <span class="eye right"></span>
        <span class="cheek left"></span>
        <span class="cheek right"></span>
        <span class="smile"></span>
      </div>
    </div>`;
}

/* ---------- State ---------- */
let current = null;                 // current material key
let lastReward = { value: 0, grams: 0, collected: false };
let idleTimer = null;

/* ---------- Views ---------- */
const VIEW_KEYS = ["idle", "mascot", "washing", "reward", "collect", "done"];
function showView(key) {
  VIEW_KEYS.forEach(k => {
    const el = $("view-" + k);
    if (el) el.classList.toggle("active", k === key);
  });
  resetIdleTimer();
}

/* ---------- Station lights (physical bins) ---------- */
function clearLights() {
  document.querySelectorAll(".station").forEach(s => {
    s.classList.remove("lit");
    const mouth = s.querySelector(".slot-mouth");
    if (mouth) mouth.classList.remove("open");
  });
  const sink = $("sinkWater");
  if (sink) sink.classList.remove("on");
}
function lightStation(material) {
  clearLights();
  const st = document.querySelector(`.station[data-material="${material}"]`);
  if (st) st.classList.add("lit");
}

/* ---------- Reward mode toggle ---------- */
function setRewardMode(mode) {
  rewardMode = mode;
  document.querySelectorAll(".mode-btn").forEach(b => {
    b.classList.toggle("on", b.dataset.mode === mode);
  });
  const r = REWARD[mode];
  $("modeNote").textContent = `Reward today: ${r.label}. Collected by each child at the end — nothing is stored on this community bin.`;
}

/* ---------- Idle ---------- */
function goIdle() {
  current = null;
  lastReward = { value: 0, grams: 0, collected: false };
  clearLights();
  showView("idle");
}

/* ---------- Open a mascot ---------- */
function openMascot(material) {
  current = material;
  const m = MASCOTS[material];

  $("mascotChar").innerHTML = mascotCharacter(material, 120);
  $("mascotName").textContent = m.name;
  const matEl = $("mascotMaterial");
  matEl.textContent = m.material;
  matEl.style.background = m.color;
  $("mascotDesc").textContent = m.desc;

  // Daily fun fact
  $("factText").textContent = factForToday(material);

  // examples
  const ex = $("mascotExamples");
  ex.innerHTML = "";
  m.examples.forEach(e => {
    const chip = document.createElement("span");
    chip.className = "example-chip";
    chip.textContent = e;
    ex.appendChild(chip);
  });

  // reset sub panels
  $("itemCheck").classList.remove("hidden");
  $("dispenseBox").classList.add("hidden");
  $("washBox").classList.add("hidden");

  lightStation(material);
  showView("mascot");
}

/* ---------- Clean path ---------- */
function chooseClean() {
  $("itemCheck").classList.add("hidden");
  $("washBox").classList.add("hidden");
  $("dispenseBox").classList.remove("hidden");
}

/* ---------- Dirty path ---------- */
function chooseDirty() {
  const m = MASCOTS[current];
  $("itemCheck").classList.add("hidden");
  $("dispenseBox").classList.add("hidden");

  $("dirtyAlert").textContent = m.washMsg;

  const stepsEl = $("washSteps");
  stepsEl.innerHTML = "";
  m.washSteps.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "wash-step";
    const num = document.createElement("span");
    num.className = "num";
    num.style.background = m.color;
    num.textContent = i + 1;
    const txt = document.createElement("span");
    txt.textContent = s;
    row.appendChild(num);
    row.appendChild(txt);
    stepsEl.appendChild(row);
  });

  $("washBox").classList.remove("hidden");
}

/* ---------- Washing animation ---------- */
function goWash() {
  showView("washing");
  $("washingChar").innerHTML = mascotCharacter(current, 90);
  $("washingText").textContent = "Scrub scrub scrub...";
  $("btnAfterWash").classList.add("hidden");

  clearLights();
  const sink = $("sinkWater");
  if (sink) sink.classList.add("on");

  const water = $("waterStream");
  water.classList.add("on");

  const bubbles = $("bubbles");
  bubbles.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const b = document.createElement("span");
    b.style.left = randInt(40, 150) + "px";
    b.style.animationDelay = (Math.random() * 1.2) + "s";
    bubbles.appendChild(b);
  }

  const bar = $("washBar");
  bar.style.width = "0%";
  let pct = 0;
  const timer = setInterval(() => {
    pct += 4;
    bar.style.width = pct + "%";
    if (pct >= 100) {
      clearInterval(timer);
      water.classList.remove("on");
      $("washingText").textContent = "All squeaky clean! ✨";
      $("btnAfterWash").classList.remove("hidden");
    }
  }, 55);
}

/* ---------- Dispense + weigh + show (uncollected) reward ---------- */
function dispense() {
  const m = MASCOTS[current];
  showView("reward");

  lightStation(current);
  const st = document.querySelector(`.station[data-material="${current}"]`);
  if (st) {
    const mouth = st.querySelector(".slot-mouth");
    if (mouth) mouth.classList.add("open");
  }

  $("rewardChar").innerHTML = mascotCharacter(current, 96);
  $("rewardText").textContent = `Thank you! ${m.name} is home! ♻️`;

  // weigh in
  const [lo, hi] = WEIGHT_RANGES[current];
  const grams = randInt(lo, hi);
  const r = REWARD[rewardMode];
  const value = Math.max(1, Math.round(grams * r.perGram));

  lastReward = { value, grams, collected: false };

  animateNumber($("itemWeight"), 0, grams, 700);
  $("rewardValueLabel").textContent = r.label;
  animateNumber($("itemReward"), 0, value, 700, (v) => r.format(v));

  launchConfetti();
}

/* ---------- Collect incentive interface ---------- */
function goCollect() {
  const r = REWARD[rewardMode];
  showView("collect");
  $("collectIcon").textContent = r.collectIcon;
  $("collectTitle").textContent = r.collectTitle;
  $("collectHow").textContent = r.collectHow;
  $("collectAmount").textContent = r.format(lastReward.value);
  $("collectReader").classList.remove("reading", "done");
  $("btnDoCollect").disabled = false;
  $("btnDoCollect").textContent = "Collect my reward";
}

function doCollect() {
  if (lastReward.collected) return;
  const r = REWARD[rewardMode];
  const reader = $("collectReader");
  const btn = $("btnDoCollect");

  btn.disabled = true;
  btn.textContent = "Collecting...";
  reader.classList.add("reading");

  setTimeout(() => {
    lastReward.collected = true;
    reader.classList.remove("reading");
    reader.classList.add("done");
    showDone();
  }, 1400);
}

function showDone() {
  const r = REWARD[rewardMode];
  showView("done");
  $("doneChar").innerHTML = mascotCharacter(current, 96);
  $("doneMsg").textContent = r.collectedMsg(lastReward.value);
  $("doneSub").textContent = "Nothing is saved on this bin — your reward went straight to you. See you next time!";
  launchConfetti();
}

/* ---------- Utilities ---------- */
function animateNumber(el, from, to, dur, fmt) {
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / dur, 1);
    const v = Math.round(from + (to - from) * t);
    el.textContent = fmt ? fmt(v) : v;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function launchConfetti() {
  const c = $("confetti");
  if (!c) return;
  c.innerHTML = "";
  const colors = ["#4aa3ff", "#f6b23b", "#57c785", "#ff5a5a", "#a97bff", "#ffe14d"];
  for (let i = 0; i < 36; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = colors[randInt(0, colors.length - 1)];
    s.style.animationDuration = (1 + Math.random() * 1.4) + "s";
    s.style.animationDelay = (Math.random() * 0.4) + "s";
    c.appendChild(s);
  }
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  // Return to idle after inactivity (community kiosk hygiene)
  idleTimer = setTimeout(goIdle, 45000);
}

/* ---------- Wire up ---------- */
function init() {
  // physical stations open the program on the big screen
  document.querySelectorAll(".station").forEach(st => {
    st.addEventListener("click", () => {
      const mat = st.dataset.material;
      if (mat === "rinse") { goWashFromStation(); return; }
      openMascot(mat);
    });
  });

  // welcome mascot icons (inside the screen) — only the buttons are clickable
  document.querySelectorAll(".welcome-item[data-open]").forEach(el => {
    el.addEventListener("click", () => openMascot(el.dataset.open));
  });

  // reward mode toggle
  document.querySelectorAll(".mode-btn").forEach(b => {
    b.addEventListener("click", () => setRewardMode(b.dataset.mode));
  });

  $("btnClean").addEventListener("click", chooseClean);
  $("btnDirty").addEventListener("click", chooseDirty);
  $("btnDispense").addEventListener("click", dispense);
  $("btnWash").addEventListener("click", goWash);
  $("btnAfterWash").addEventListener("click", dispense);
  $("btnBack").addEventListener("click", goIdle);
  $("btnToCollect").addEventListener("click", goCollect);
  $("btnDoCollect").addEventListener("click", doCollect);
  $("btnAgain").addEventListener("click", goIdle);

  // idle video pulse
  const vid = $("scrVideo");
  if (vid) vid.addEventListener("click", () => {
    const play = vid.querySelector(".play");
    if (play) play.textContent = play.textContent === "▶" ? "⏸" : "▶";
  });

  // fill mascot preview characters in idle + build examples
  document.querySelectorAll(".welcome-char").forEach(el => {
    el.innerHTML = mascotCharacter(el.dataset.open, 64);
  });

  setRewardMode(rewardMode);
  goIdle();
}

// tapping the rinse station jumps straight into washing the current item (or plastic default)
function goWashFromStation() {
  if (!current) current = "plastic";
  goWash();
}

document.addEventListener("DOMContentLoaded", init);
