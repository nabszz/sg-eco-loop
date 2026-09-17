/* ============================================================
   EcoLoop Kids — AI Organisational Recycling Bin (digital prototype)
   Reward rule: 100g = $1  ->  1g = 1 cent
   ============================================================ */

// ---------- Mascot data ----------
const MASCOTS = {
  plastic: {
    name: "Pip the Pal",
    material: "Plastic",
    color: "#4aa3ff",
    emoji: "🧴",
    desc: "Hi! I'm Pip the Pal. I keep bottles and containers ready for a brand new life. Make sure I'm empty and dry before you drop me in!",
    examples: ["Water bottles", "Shampoo bottles", "Food containers", "Plastic cups"],
    washMsg: "Oh no, Pip is dirty! Wash him quick to be recycled squeaky clean.",
    washSteps: [
      "Empty out any leftover liquid or food.",
      "Rinse the inside with a little water.",
      "Shake off the water so Pip is dry.",
      "Now Pip is ready to be recycled!"
    ]
  },
  paper: {
    name: "Papy the Paper",
    material: "Paper",
    color: "#f6b23b",
    emoji: "📄",
    desc: "Hello! I'm Papy the Paper. Flatten me down so I take up less space. Keep me clean and dry, please!",
    examples: ["Newspaper", "Cardboard", "Notebooks", "Paper bags"],
    washMsg: "Oh no, Papy is soggy and greasy! Paper can't be washed, so wipe off crumbs and keep the clean parts.",
    washSteps: [
      "Shake off any food crumbs.",
      "Tear away and bin greasy or wet parts.",
      "Flatten the clean, dry paper.",
      "Now Papy is ready to be recycled!"
    ]
  },
  glass: {
    name: "Glassy Shimmy",
    material: "Glass",
    color: "#57c785",
    emoji: "🫙",
    desc: "Sparkle sparkle! I'm Glassy Shimmy. Rinse me out and remove my lid so I shine bright for recycling.",
    examples: ["Jam jars", "Glass bottles", "Sauce jars", "Drink bottles"],
    washMsg: "Oh no, Glassy is sticky! Rinse her quick to be recycled squeaky clean.",
    washSteps: [
      "Pour out anything left inside.",
      "Rinse the jar with water.",
      "Twist off and keep the metal lid.",
      "Now Glassy is ready to be recycled!"
    ]
  },
  metal: {
    name: "Metty Bendy",
    material: "Metal",
    color: "#c0c6d0",
    emoji: "🥫",
    desc: "Clink clank! I'm Metty Bendy. Cans and tins like me can be recycled again and again. Rinse me first!",
    examples: ["Drink cans", "Food tins", "Foil trays", "Bottle caps"],
    washMsg: "Oh no, Metty is messy! Rinse him quick to be recycled squeaky clean.",
    washSteps: [
      "Empty out leftover food or drink.",
      "Rinse the can with water.",
      "Squash it a little to save space.",
      "Now Metty is ready to be recycled!"
    ]
  },
  ewaste: {
    name: "Eddy the Electric",
    material: "E-waste",
    color: "#a97bff",
    emoji: "🔌",
    desc: "Zap! I'm Eddy the Electric. Old batteries and gadgets belong with me, never in the normal bin. Ask an adult to help!",
    examples: ["Old batteries", "Cables", "Broken toys", "Old phones"],
    washMsg: "Wait! Eddy should never get wet. Just make sure he is dry and safe.",
    washSteps: [
      "Do NOT wash electronics with water.",
      "Wipe the outside with a dry cloth.",
      "Ask an adult to help remove batteries.",
      "Now Eddy is ready to be recycled!"
    ]
  }
};

// Rough weight ranges per material (in grams) for the demo weigh-in
const WEIGHT_RANGES = {
  plastic: [15, 60],
  paper:   [20, 120],
  glass:   [180, 450],
  metal:   [25, 90],
  ewaste:  [40, 250]
};

// ---------- State ----------
let current = null;       // current material key
let totals = { weight: 0, cents: 0, count: 0 };

// ---------- Element refs ----------
const $ = (id) => document.getElementById(id);
const views = {
  welcome: $("viewWelcome"),
  mascot: $("viewMascot"),
  washing: $("viewWashing"),
  success: $("viewSuccess")
};

function showView(key) {
  Object.values(views).forEach(v => v.classList.remove("active"));
  views[key].classList.add("active");
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function updateTotals() {
  $("totalWeight").textContent = totals.weight;
  $("totalCents").textContent = totals.cents;
  $("acceptedCount").textContent = totals.count;
}

// ---------- Bin lighting ----------
function clearLights() {
  document.querySelectorAll(".bin").forEach(b => { b.classList.remove("lit", "sensor-active"); });
  $("rinseBin").classList.remove("lit");
}
function lightBin(material) {
  clearLights();
  const bin = document.querySelector(`.bin[data-material="${material}"]`);
  if (bin) { bin.classList.add("lit"); }
}

// ---------- Open a mascot ----------
function openMascot(material) {
  current = material;
  const m = MASCOTS[material];

  $("mascotAvatar").textContent = m.emoji;
  $("mascotName").textContent = m.name;
  const matEl = $("mascotMaterial");
  matEl.textContent = m.material;
  matEl.style.background = m.color;
  $("mascotDesc").textContent = m.desc;

  const ex = $("mascotExamples");
  ex.innerHTML = "";
  m.examples.forEach(e => {
    const chip = document.createElement("span");
    chip.className = "example-chip";
    chip.textContent = e;
    ex.appendChild(chip);
  });

  // reset sub-panels
  $("itemCheck").classList.remove("hidden");
  $("dispenseBox").classList.add("hidden");
  $("washBox").classList.add("hidden");

  // wash step number color to match mascot
  document.documentElement.style.setProperty("--plastic", MASCOTS.plastic.color);

  lightBin(material);
  showView("mascot");
}

// ---------- Clean path ----------
function chooseClean() {
  $("itemCheck").classList.add("hidden");
  $("washBox").classList.add("hidden");
  $("dispenseBox").classList.remove("hidden");
}

// ---------- Dirty path ----------
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

// ---------- Washing animation ----------
function goWash() {
  const m = MASCOTS[current];
  showView("washing");
  $("washingMascot").textContent = m.emoji;
  $("washingText").textContent = "Scrub scrub scrub...";
  $("btnAfterWash").classList.add("hidden");

  // light rinse bin
  clearLights();
  $("rinseBin").classList.add("lit");

  // water on
  const water = $("waterStream");
  water.classList.add("on");

  // bubbles
  const bubbles = $("bubbles");
  bubbles.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const b = document.createElement("span");
    b.style.left = randInt(60, 150) + "px";
    b.style.animationDelay = (Math.random() * 1.2) + "s";
    bubbles.appendChild(b);
  }

  // progress bar
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
  }, 60);
}

// ---------- Dispense + reward ----------
function dispense() {
  const m = MASCOTS[current];
  showView("success");

  // light the correct bin again
  lightBin(current);
  const bin = document.querySelector(`.bin[data-material="${current}"]`);
  if (bin) bin.classList.add("sensor-active");

  $("successMascot").textContent = m.emoji;
  $("successText").textContent = `Thank you! ${m.name} is home!`;

  // weigh in
  const [lo, hi] = WEIGHT_RANGES[current];
  const grams = randInt(lo, hi);
  const cents = grams; // 1g = 1 cent (100g = $1)

  // count up weight animation
  animateNumber($("itemWeight"), 0, grams, 700);
  animateNumber($("itemCents"), 0, cents, 700);

  // open the bin lid
  const binOpen = $("binOpen");
  binOpen.classList.remove("open");
  setTimeout(() => binOpen.classList.add("open"), 400);

  // confetti
  launchConfetti();

  // add to totals after weigh-in finishes
  setTimeout(() => {
    totals.weight += grams;
    totals.cents += cents;
    totals.count += 1;
    updateTotals();
  }, 720);
}

function animateNumber(el, from, to, dur) {
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(from + (to - from) * t);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function launchConfetti() {
  const c = $("confetti");
  c.innerHTML = "";
  const colors = ["#4aa3ff", "#f6b23b", "#57c785", "#ff5a5a", "#a97bff", "#ffe14d"];
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = colors[randInt(0, colors.length - 1)];
    s.style.animationDuration = (1 + Math.random() * 1.5) + "s";
    s.style.animationDelay = (Math.random() * 0.4) + "s";
    c.appendChild(s);
  }
}

// ---------- Reset to home ----------
function goHome() {
  current = null;
  clearLights();
  $("binOpen").classList.remove("open");
  showView("welcome");
}

// ---------- Wire up events ----------
document.querySelectorAll(".bin").forEach(bin => {
  bin.addEventListener("click", () => openMascot(bin.dataset.material));
});

$("btnClean").addEventListener("click", chooseClean);
$("btnDirty").addEventListener("click", chooseDirty);
$("btnDispense").addEventListener("click", dispense);
$("btnWash").addEventListener("click", goWash);
$("btnAfterWash").addEventListener("click", dispense);
$("btnAgain").addEventListener("click", goHome);
$("btnBack").addEventListener("click", goHome);

// init
updateTotals();
showView("welcome");
