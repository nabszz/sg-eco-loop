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
    identify: "Spot me: I'm light, I bend and crinkle, and I'm see-through or coloured. Bottles, cups and containers are me!",
    // Visual clue chips (icon + tiny word) so pre-readers learn my properties
    clues: [
      { icon: "🪶", word: "Light" },
      { icon: "🤏", word: "Bendy" },
      { icon: "👀", word: "See-through" },
      { icon: "🥤", word: "Crinkly" }
    ],
    examples: ["Water bottles", "Shampoo bottles", "Yoghurt cups", "Plastic cups"],
    washMsg: "Uh-oh, Pip feels sticky! Give me a quick rinse, please!",
    washSteps: [
      "Pour out any leftover drink.",
      "Rinse my inside with a little water.",
      "Shake me so I'm nice and dry.",
      "Yay! Pip is ready to recycle!"
    ],
    // Cartoon-flavoured fun facts, rotate daily (one shown per day)
    facts: [
      "A plastic bottle can transform into a superhero cape... okay, cosy jacket fabric!",
      "Recycle me and I could become a plastic dinosaur toy that ROARS!",
      "Like a shape-shifter, I can melt and turn into something brand new.",
      "6 bottles = enough magic to make one cosy T-shirt!",
      "Some LEGO-style bricks are made from recycled plastic — build away!",
      "Playground slides can be made from bottles like me. Wheee!",
      "Left in nature I'd nap for 450 years — recycle me so I get a new adventure!"
    ]
  },
  paper: {
    name: "Papy the Paper",
    material: "Paper",
    color: "#f6b23b",
    emoji: "📄",
    cls: "m-paper",
    desc: "Hello friend! I'm Papy! Flatten me so I'm nice and thin, and keep me dry, okay?",
    identify: "Spot me: I'm flat, I tear easily, and I go soggy when wet. Boxes, books and newspapers are me!",
    clues: [
      { icon: "📏", word: "Flat" },
      { icon: "✂️", word: "Tears easily" },
      { icon: "💧", word: "Goes soggy" },
      { icon: "🍂", word: "Rustles" }
    ],
    examples: ["Newspaper", "Cardboard", "Story books", "Paper bags"],
    washMsg: "Oh dear, Papy got wet and greasy! Paper can't be washed — keep only the clean bits.",
    washSteps: [
      "Shake off any crumbs.",
      "Tear away wet or greasy parts.",
      "Flatten the clean, dry paper.",
      "Yay! Papy is ready to recycle!"
    ],
    facts: [
      "Recycle a big stack of me and you save a whole tree — a home for cartoon owls!",
      "I can be reborn up to 7 times, like a video-game extra life!",
      "Recycled paper becomes brand new comic books and story books!",
      "Old boxes can become the cardboard castle for your toys!",
      "Egg cartons are made from recycled paper — cluck cluck!",
      "Flatten me and lots more friends fit in the truck — teamwork!",
      "Keep me dry, superhero — wet paper loses its powers!"
    ]
  },
  glass: {
    name: "Glassy Shimmy",
    material: "Glass",
    color: "#57c785",
    emoji: "🫙",
    cls: "m-glass",
    desc: "Sparkle sparkle! I'm Glassy! Rinse me and pop off my lid so I shine for recycling.",
    identify: "Spot me: I'm heavy, hard, smooth and shiny, and I can be see-through. Jars and glass bottles are me! (Careful, I can break.)",
    clues: [
      { icon: "⚖️", word: "Heavy" },
      { icon: "✨", word: "Shiny" },
      { icon: "👀", word: "See-through" },
      { icon: "⚠️", word: "Can break" }
    ],
    examples: ["Jam jars", "Glass bottles", "Sauce jars", "Drink bottles"],
    washMsg: "Ooh, Glassy is a bit sticky! A quick rinse and I'll sparkle again!",
    washSteps: [
      "Pour out anything inside me.",
      "Rinse me with water.",
      "Twist off and keep my lid.",
      "Yay! Glassy is ready to recycle!"
    ],
    facts: [
      "I can be recycled FOREVER — like a wizard who never runs out of magic!",
      "A jar can become a new jar in a month, faster than a superhero costume change!",
      "I'm made from sand — imagine a beach turned into treasure jars!",
      "I could be reborn as a shiny marble or a new bottle!",
      "Recycle me and I sparkle like a dragon's hoard of jewels!",
      "Rinse me clean so I shine like a crystal ball!",
      "My colours get sorted like sorting your crayons by colour!"
    ]
  },
  metal: {
    name: "Metty Bendy",
    material: "Metal",
    color: "#c0c6d0",
    emoji: "🥫",
    cls: "m-metal",
    desc: "Clink clank! I'm Metty! Cans like me can be recycled again and again. Rinse me first!",
    identify: "Spot me: I'm cold, shiny and I go CLINK when you tap me. Drink cans and food tins are me!",
    clues: [
      { icon: "❄️", word: "Cold" },
      { icon: "✨", word: "Shiny" },
      { icon: "🔔", word: "Goes clink" },
      { icon: "🧲", word: "Magnetic" }
    ],
    examples: ["Drink cans", "Food tins", "Foil trays", "Bottle caps"],
    washMsg: "Uh-oh, Metty is messy! Rinse me and I'll be shiny clean!",
    washSteps: [
      "Empty out leftover food or drink.",
      "Rinse me with water.",
      "Squash me a little to save space.",
      "Yay! Metty is ready to recycle!"
    ],
    facts: [
      "A can can become a new can in 60 days — like a robot rebuilding itself!",
      "Old cans can transform into a bicycle or even a rocket part!",
      "I can be recycled forever, like a robot with unlimited upgrades!",
      "A magnet zooms in to grab me — whoosh, super power!",
      "Squash me flat and I'm a tiny metal pancake, ready to travel!",
      "Recycling me saves enough energy to play cartoons for hours!",
      "Clean foil trays can join the metal team too — go team!"
    ]
  },
  ewaste: {
    name: "Eddy the Electric",
    material: "E-waste",
    color: "#a97bff",
    emoji: "🔌",
    cls: "m-ewaste",
    desc: "Zap! I'm Eddy! Old batteries and gadgets belong with me — never the normal bin. Ask an adult!",
    identify: "Spot me: I have wires, batteries, buttons or lights. Old toys, cables and phones are me! Always ask an adult.",
    clues: [
      { icon: "🔌", word: "Has plugs" },
      { icon: "🔋", word: "Batteries" },
      { icon: "💡", word: "Lights up" },
      { icon: "🧑‍🦱", word: "Ask an adult" }
    ],
    examples: ["Old batteries", "Cables", "Broken toys", "Old phones"],
    washMsg: "Careful! Eddy must stay dry. Never wash me — just make sure I'm safe.",
    washSteps: [
      "Never put me in water.",
      "Wipe me with a dry cloth.",
      "Ask an adult to help with batteries.",
      "Yay! Eddy is ready to recycle safely!"
    ],
    facts: [
      "Old phones have real gold inside — like tiny robot treasure!",
      "Recycle me and my parts could power a new game console!",
      "I'm like a robot that gets rebuilt into a brand new gadget!",
      "Batteries have secret energy — recycle them, never bin them!",
      "A recycling wizard (an adult) should always help with me!",
      "Broken robot toys with wires are part of my super team!",
      "Keep me out of normal bins to protect cartoon forests and animals!"
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

/* ---------- Draggable practice items (the side tray) ----------
   Drag one onto the screen to simulate the AI bin recognising it.
   Each item knows its real material and whether it's clean or dirty,
   so the program can auto-route and pre-set the clean/dirty check. */
const ITEMS = [
  { id: "bottle-clean", label: "Clean water bottle", emoji: "🧴", material: "plastic", dirty: false },
  { id: "bottle-dirty", label: "Dirty juice bottle", emoji: "🧃", material: "plastic", dirty: true },
  { id: "can-clean",    label: "Rinsed drink can",  emoji: "🥫", material: "metal",   dirty: false },
  { id: "can-dirty",    label: "Messy food tin",    emoji: "🍥", material: "metal",   dirty: true },
  { id: "jar-clean",    label: "Clean glass jar",   emoji: "🫙", material: "glass",   dirty: false },
  { id: "jar-dirty",    label: "Sticky jam jar",    emoji: "🍯", material: "glass",   dirty: true },
  { id: "paper-clean",  label: "Flat cardboard",    emoji: "📦", material: "paper",   dirty: false },
  { id: "paper-dirty",  label: "Greasy pizza box",  emoji: "🍕", material: "paper",   dirty: true },
  { id: "ewaste-clean", label: "Old toy phone",     emoji: "📱", material: "ewaste",  dirty: false },
  { id: "ewaste-dirty", label: "Used batteries",    emoji: "🔋", material: "ewaste",  dirty: true }
];

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
let autoFlow = false;               // true when a placed item should auto-detect + auto-reward
let pendingRinse = false;           // true when a dirty placed item is waiting for the child to rinse

/* ---------- Views ---------- */
const VIEW_KEYS = ["idle", "mascot", "game", "washing", "reward", "collect", "done"];
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
  autoFlow = false;
  pendingRinse = false;
  clearRinsePrompt();
  lastReward = { value: 0, grams: 0, collected: false };
  clearLights();
  showView("idle");
}

/* ---------- "Good job!" praise pop ---------- */
const PRAISE = ["Good job! 🎉", "Well done! ⭐", "You got it! 👏", "Super sorting! 💪", "Nice one, eco-hero! 🦸"];
function showPraise(msg) {
  const el = $("praisePop");
  if (!el) return;
  el.textContent = msg || PRAISE[randInt(0, PRAISE.length - 1)];
  el.classList.remove("show");
  // restart animation
  void el.offsetWidth;
  el.classList.add("show");
}

/* ---------- Open a mascot ----------
   preset (optional): { dirty: true|false } to pre-answer the clean/dirty check
   praise (optional): custom praise message (e.g. after a correct drag-and-drop) */
function openMascot(material, preset, praise) {
  current = material;
  const m = MASCOTS[material];

  $("mascotChar").innerHTML = mascotCharacter(material, 120);
  $("mascotName").textContent = m.name;
  const matEl = $("mascotMaterial");
  matEl.textContent = m.material;
  matEl.style.background = m.color;
  $("mascotDesc").textContent = m.desc;

  // "How to spot me" identification line (helps kids learn each material)
  $("identifyText").textContent = m.identify;

  // Visual clue chips — sensory properties for pre-readers
  const clueWrap = $("clueChips");
  if (clueWrap) {
    clueWrap.innerHTML = "";
    (m.clues || []).forEach(c => {
      const chip = document.createElement("span");
      chip.className = "clue-chip";
      chip.style.setProperty("--c", m.color);
      chip.innerHTML = `<span class="clue-emoji">${c.icon}</span><span class="clue-word">${c.word}</span>`;
      clueWrap.appendChild(chip);
    });
  }

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

  // Encouraging feedback for tapping/choosing a material
  showPraise(praise);

  // Voice cue for pre-readers: mascot greets + names its material
  speak(`${m.name}. ${m.material}.`);

  // If an item was placed, the bin auto-DETECTS clean/dirty.
  if (preset && typeof preset.dirty === "boolean") {
    if (preset.dirty) {
      // detected contamination -> the CHILD must rinse it at the rinsing bin.
      // The bin does NOT wash it for them; it prompts and waits.
      chooseDirty();
      if (autoFlow) {
        pendingRinse = true;   // resume auto-reward after the child rinses
        $("dirtyAlert").textContent = `🔎 Detected: ${MASCOTS[current].material} — but it's DIRTY! Please rinse it at the rinsing bin before recycling.`;
        // make the call-to-action button clearer that THEY need to rinse
        const wb = $("btnWash");
        if (wb) wb.textContent = "🚰 I'll rinse it at the rinsing bin →";
        // draw attention to the real rinsing bin so they go do it
        promptRinse();
        speak("Detected. It's dirty. Please take it to the rinsing bin and rinse it.");
      }
    } else {
      // detected clean & correct -> accept and auto-reward, no taps needed
      chooseClean();
      if (autoFlow) {
        $("dispenseBox").querySelector(".good-choice").textContent =
          `🔎 Detected: ${MASCOTS[current].material}, clean! Accepting…`;
        speak("Detected. Clean and correct. Accepting.");
        setTimeout(() => dispense(), 1500);  // auto-weigh + auto-reward
      }
    }
  }
}

/* ---------- Clean path ---------- */
function chooseClean() {
  $("itemCheck").classList.add("hidden");
  $("washBox").classList.add("hidden");
  $("dispenseBox").classList.remove("hidden");
  // reset the label (auto mode overwrites it with a "Detected…" message)
  const gc = $("dispenseBox").querySelector(".good-choice");
  if (gc) gc.textContent = "🎉 Great choice!";
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

/* ---------- Prompt the child to rinse at the rinsing bin themselves ---------- */
function promptRinse() {
  // light + pulse the real rinsing bin so the child knows where to go
  const rinse = document.querySelector('.station[data-material="rinse"]');
  if (rinse) {
    rinse.classList.add("lit", "needs-rinse");
  }
  // floating pointer banner toward the rinsing bin
  const el = $("praisePop");
  if (el) {
    el.textContent = "👉 Rinse it at the rinsing bin!";
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
  }
}
function clearRinsePrompt() {
  const rinse = document.querySelector('.station[data-material="rinse"]');
  if (rinse) rinse.classList.remove("needs-rinse");
}

/* ---------- Washing animation ---------- */
function goWash() {
  clearRinsePrompt();
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
      if (autoFlow && pendingRinse) {
        // the child rinsed a placed item -> now accept + reward automatically
        pendingRinse = false;
        speak("All clean! Accepting now.");
        setTimeout(() => dispense(), 1100);
      } else {
        $("btnAfterWash").classList.remove("hidden");
      }
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

/* ============================================================
   Practice item tray + drag-and-drop simulation
   Lets users drop a realistic item onto the screen so the bin
   behaves like the real AI unit (recognise material + clean/dirty).
   ============================================================ */
function buildTray() {
  const tray = $("itemTray");
  if (!tray) return;
  tray.innerHTML = "";
  ITEMS.forEach(item => {
    const el = document.createElement("button");
    el.className = "tray-item";
    el.draggable = true;
    el.dataset.item = item.id;
    el.style.setProperty("--c", MASCOTS[item.material].color);
    el.innerHTML =
      `<span class="tray-emoji">${item.emoji}</span>` +
      `<span class="tray-label">${item.label}</span>` +
      `<span class="tray-tag ${item.dirty ? "dirty" : "clean"}">${item.dirty ? "dirty" : "clean"}</span>`;

    // drag (desktop)
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.id);
      e.dataTransfer.effectAllowed = "move";
      el.classList.add("dragging");
    });
    el.addEventListener("dragend", () => el.classList.remove("dragging"));

    // tap fallback (touch / click) — same as dropping onto the bin
    el.addEventListener("click", () => simulateDrop(item.id));

    tray.appendChild(el);
  });
}

function itemById(id) { return ITEMS.find(i => i.id === id); }

// The AI bin "recognises" the item, routes to the right mascot,
// and pre-answers the clean/dirty check. Used when the bin auto-detects
// (drop onto the screen) OR when the item lands in the CORRECT bin.
function acceptItem(item) {
  const m = MASCOTS[item.material];
  const cleanWord = item.dirty ? "and it needs a rinse" : "and it's clean";
  const praise = `Good job! That's ${m.material.toLowerCase()} ${cleanWord} — ${m.name} spotted it! ✅`;

  // this is a PLACED item -> the bin auto-detects + auto-rewards
  autoFlow = true;
  openMascot(item.material, { dirty: item.dirty }, praise);

  // green flash on the matching station so kids see where it goes
  flashStation(item.material, "just-hit");
}

// Auto-detect entry point (drop on screen / tap in tray): always routes correctly.
function simulateDrop(itemId) {
  const item = itemById(itemId);
  if (!item) return;
  acceptItem(item);
}

// Dropped onto a SPECIFIC bin: grade whether it's the right material.
function dropIntoStation(itemId, material) {
  const item = itemById(itemId);
  if (!item) return;

  // rinsing bin: always fine to rinse an item here
  if (material === "rinse") { acceptItem(item); return; }

  if (material === item.material) {
    // right bin!
    acceptItem(item);
  } else {
    // wrong bin -> reject, flash red, teach where it should go
    rejectWrongBin(item, material);
  }
}

// Wrong-bin rejection: flash the bin red + explain (no scolding, just guidance).
function rejectWrongBin(item, wrongMaterial) {
  const right = MASCOTS[item.material];
  const wrong = MASCOTS[wrongMaterial];

  flashStation(wrongMaterial, "reject");

  const msg = `❌ Oops! ${item.label} is ${right.material}, not ${wrong.material}. Try the ${right.material} bin!`;
  showReject(msg);
  speak(`Incorrect. That's ${right.material}, not ${wrong.material}.`);

  // gently point to the correct bin after the red flash
  setTimeout(() => flashStation(item.material, "hint-correct"), 700);
}

// flash a station with a given effect class for a moment
function flashStation(material, cls) {
  const st = document.querySelector(`.station[data-material="${material}"]`);
  if (!st) return;
  st.classList.add(cls);
  setTimeout(() => st.classList.remove(cls), 1100);
}

// red rejection banner on the screen
function showReject(msg) {
  const el = $("rejectPop");
  if (!el) { showPraise(msg); return; }
  el.textContent = msg;
  el.classList.remove("show");
  void el.offsetWidth; // restart animation
  el.classList.add("show");
  clearTimeout(showReject._t);
  showReject._t = setTimeout(() => el.classList.remove("show"), 2600);
}

function wireDropZone() {
  // 1) The screen = "auto-detect" drop: the AI figures out the right bin.
  const zone = $("screenGlass");
  if (zone) {
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drop-hover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drop-hover"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drop-hover");
      const id = e.dataTransfer.getData("text/plain");
      if (id) simulateDrop(id);
    });
  }

  // 2) Each physical bin = a graded drop target. Drop into the RIGHT bin to
  //    accept (detects clean/dirty); the WRONG bin rejects and flashes red.
  document.querySelectorAll(".station").forEach(st => {
    st.addEventListener("dragover", (e) => { e.preventDefault(); st.classList.add("drop-over"); });
    st.addEventListener("dragleave", () => st.classList.remove("drop-over"));
    st.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      st.classList.remove("drop-over");
      const id = e.dataTransfer.getData("text/plain");
      if (id) dropIntoStation(id, st.dataset.material);
    });
  });
}

/* ============================================================
   Optional voice cues (Web Speech API) for pre-readers.
   No audio files needed. Toggleable + safely no-ops if unsupported.
   ============================================================ */
let soundOn = true;
let friendlyVoice = null;   // the nicest available voice, picked once loaded

// Voices we like best (natural, warm, kid-friendly), in order of preference.
// Modern OS "Natural"/"Online" voices sound far less robotic than the old defaults.
const PREFERRED_VOICES = [
  // Microsoft (Edge / Windows) natural neural voices — very human
  "Microsoft Ava (Natural)", "Microsoft Jenny (Natural)", "Microsoft Aria (Natural)",
  "Microsoft Sonia (Natural)", "Microsoft Michelle (Natural)", "Microsoft Ana (Natural)",
  "Microsoft Aria Online (Natural)", "Microsoft Jenny", "Microsoft Aria", "Microsoft Zira",
  // Google (Chrome / Android)
  "Google UK English Female", "Google US English",
  // Apple (Safari / macOS / iOS) — warm, natural
  "Samantha", "Karen", "Moira", "Tessa", "Ava", "Allison", "Susan"
];

function pickFriendlyVoice() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || !voices.length) return;

  // 1) exact match against our preferred list
  for (const name of PREFERRED_VOICES) {
    const v = voices.find(v => v.name === name);
    if (v) { friendlyVoice = v; return; }
  }
  // 2) any English "natural"/"online" neural voice (these sound human)
  friendlyVoice = voices.find(v => /en/i.test(v.lang) && /natural|online|neural/i.test(v.name));
  if (friendlyVoice) return;
  // 3) any English female-ish voice
  friendlyVoice = voices.find(v => /en/i.test(v.lang) && /female|woman|zira|aria|jenny|samantha|karen|moira/i.test(v.name));
  if (friendlyVoice) return;
  // 4) fall back to the first English voice, else the very first voice
  friendlyVoice = voices.find(v => /en/i.test(v.lang)) || voices[0] || null;
}

// Voices load asynchronously in most browsers.
if ("speechSynthesis" in window) {
  pickFriendlyVoice();
  window.speechSynthesis.onvoiceschanged = pickFriendlyVoice;
}

function speak(text) {
  if (!soundOn) return;
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (!friendlyVoice) pickFriendlyVoice();
    const u = new SpeechSynthesisUtterance(text);
    if (friendlyVoice) { u.voice = friendlyVoice; u.lang = friendlyVoice.lang; }
    else { u.lang = "en-US"; }
    // warm, gentle, storybook delivery (not flat/robotic)
    u.rate = 0.92;
    u.pitch = 1.15;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}
function toggleSound() {
  soundOn = !soundOn;
  const btn = $("soundBtn");
  if (btn) {
    btn.textContent = soundOn ? "🔊" : "🔈";
    btn.classList.toggle("off", !soundOn);
    btn.setAttribute("aria-label", soundOn ? "Sound on" : "Sound off");
  }
  if (!soundOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

/* ============================================================
   "Which bin?" sorting mini-game
   Shows a real item; child taps the material they think it is.
   Correct  -> celebrate + teach why, earn a star.
   Wrong    -> gentle, encouraging hint; try again (no "fail").
   Stars are per-session only and reset at idle (nothing stored).
   ============================================================ */
const MATERIAL_KEYS = ["plastic", "paper", "glass", "metal", "ewaste"];
let gameItem = null;      // the current quiz item
let gameStars = 0;        // per-session correct count
let gameRound = 0;

function goGame() {
  gameStars = 0;
  gameRound = 0;
  renderGameButtons();
  updateStars();
  nextGameItem();
  showView("game");
  speak("Which bin does it go in? Tap the right material!");
}

// build the 5 material choice buttons once
function renderGameButtons() {
  const wrap = $("gameChoices");
  if (!wrap || wrap.dataset.built) return;
  wrap.innerHTML = "";
  MATERIAL_KEYS.forEach(key => {
    const m = MASCOTS[key];
    const b = document.createElement("button");
    b.className = "game-choice";
    b.dataset.material = key;
    b.style.setProperty("--c", m.color);
    b.innerHTML = `<span class="game-choice-emoji">${m.emoji}</span><span class="game-choice-label">${m.material}</span>`;
    b.addEventListener("click", () => guessMaterial(key));
    wrap.appendChild(b);
  });
  wrap.dataset.built = "1";
}

function nextGameItem() {
  gameRound++;
  // pick a random practice item different from the last
  let pick;
  do { pick = ITEMS[randInt(0, ITEMS.length - 1)]; }
  while (gameItem && pick.id === gameItem.id && ITEMS.length > 1);
  gameItem = pick;

  $("gameItemEmoji").textContent = pick.emoji;
  $("gameItemLabel").textContent = pick.label;
  $("gameFeedback").textContent = "";
  $("gameFeedback").className = "game-feedback";
  $("gameNext").classList.add("hidden");

  // re-enable all choices
  document.querySelectorAll(".game-choice").forEach(b => {
    b.disabled = false;
    b.classList.remove("correct", "wrong");
  });

  speak(`Which bin for ${pick.label}?`);
}

function guessMaterial(key) {
  if (!gameItem) return;
  const correctKey = gameItem.material;
  const m = MASCOTS[correctKey];
  const chosen = MASCOTS[key];
  const btns = document.querySelectorAll(".game-choice");
  const fb = $("gameFeedback");

  if (key === correctKey) {
    // correct!
    gameStars++;
    updateStars();
    btns.forEach(b => { b.disabled = true; if (b.dataset.material === key) b.classList.add("correct"); });
    fb.className = "game-feedback ok";
    fb.textContent = `🎉 Yes! ${gameItem.label} is ${m.material} — ${m.name} says thank you!`;
    showPraise("Correct! ⭐");
    launchConfetti();
    speak(`Correct! That's ${m.material}.`);
    $("gameNext").classList.remove("hidden");
  } else {
    // gentle hint, let them try again
    const btn = [...btns].find(b => b.dataset.material === key);
    if (btn) { btn.classList.add("wrong"); btn.disabled = true; }
    fb.className = "game-feedback hint";
    const clue = (m.clues && m.clues[0]) ? m.clues[0].word.toLowerCase() : m.material.toLowerCase();
    fb.textContent = `Not quite — that's ${chosen.material}. Hint: this item is ${clue}. Try again! 💪`;
    speak(`Try again! Hint: it is ${clue}.`);
  }
}

function updateStars() {
  const el = $("gameStars");
  if (!el) return;
  el.innerHTML = "";
  for (let i = 0; i < gameStars; i++) {
    const s = document.createElement("span");
    s.className = "star-earned";
    s.textContent = "⭐";
    el.appendChild(s);
  }
  const label = $("gameStarLabel");
  if (label) label.textContent = gameStars === 0 ? "Sort to earn stars!" : `${gameStars} star${gameStars > 1 ? "s" : ""}!`;
}

/* ---------- Wire up ---------- */
function init() {
  // physical stations open the program on the big screen (manual explore)
  document.querySelectorAll(".station").forEach(st => {
    st.addEventListener("click", () => {
      const mat = st.dataset.material;
      if (mat === "rinse") { goWashFromStation(); return; }
      autoFlow = false;       // manual tap = interactive, keep the buttons
      openMascot(mat);
    });
  });

  // welcome mascot icons (inside the screen) — manual explore
  document.querySelectorAll(".welcome-item[data-open]").forEach(el => {
    el.addEventListener("click", () => { autoFlow = false; openMascot(el.dataset.open); });
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

  // "Which bin?" sorting mini-game
  const playBtn = $("btnPlayGame");
  if (playBtn) playBtn.addEventListener("click", goGame);
  const gameNext = $("gameNext");
  if (gameNext) gameNext.addEventListener("click", nextGameItem);
  const gameExit = $("gameExit");
  if (gameExit) gameExit.addEventListener("click", goIdle);

  // sound on/off toggle (voice cues for non-readers)
  const soundBtn = $("soundBtn");
  if (soundBtn) soundBtn.addEventListener("click", toggleSound);

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

  // friendly hero mascot that greets kids on the idle screen (rotates daily)
  const heroEl = $("heroChar");
  if (heroEl) {
    const keys = Object.keys(MASCOTS);
    const heroKey = keys[dayOfYear() % keys.length];
    heroEl.innerHTML = mascotCharacter(heroKey, 96);
  }

  // practice item tray + drop zone
  buildTray();
  wireDropZone();

  setRewardMode(rewardMode);
  goIdle();
}

// tapping the rinse station jumps straight into washing the current item (or plastic default)
function goWashFromStation() {
  if (!current) current = "plastic";
  goWash();
}

document.addEventListener("DOMContentLoaded", init);
