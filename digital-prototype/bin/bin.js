/* ============================================================
   EcoLoop Kids — Physical Bin Unit render interactions
   Mirrors the concept sketch: mounted screen + row of bins +
   rinsing bin. "Must press setting to open bin"; rinsing = water.
   ============================================================ */

const MASCOTS = {
  plastic: { name: "Pip the Pal",      emoji: "🧴", msg: "Great choice! Press the setting to open my bin." },
  paper:   { name: "Papy the Paper",   emoji: "📄", msg: "Flatten me first, then press to open the bin." },
  glass:   { name: "Glassy Shimmy",    emoji: "🫙", msg: "Rinse me if sticky, then press to open the bin." },
  metal:   { name: "Metty Bendy",      emoji: "🥫", msg: "Empty me out, then press to open the bin." },
  ewaste:  { name: "Eddy the Electric",emoji: "🔌", msg: "Ask an adult, then press to open the bin." },
  rinse:   { name: "Rinsing Bin",      emoji: "🚰", msg: "Wash your item here with water + soap until squeaky clean!" }
};

const $ = (id) => document.getElementById(id);
let activeStation = null;
let idleTimer = null;

function clearLights() {
  document.querySelectorAll(".station").forEach(s => {
    s.classList.remove("lit");
    const mouth = s.querySelector(".slot-mouth");
    if (mouth) mouth.classList.remove("open");
  });
  $("sinkWater").classList.remove("on");
}

function showIdle() {
  $("scrIdle").classList.add("active");
  $("scrActive").classList.remove("active");
  clearLights();
  activeStation = null;
}

function selectStation(stationEl) {
  const material = stationEl.dataset.material;
  const m = MASCOTS[material];

  clearLights();
  stationEl.classList.add("lit");
  activeStation = stationEl;

  // update mounted screen
  $("scrIdle").classList.remove("active");
  $("scrActive").classList.add("active");
  $("scrMascot").textContent = m.emoji;
  $("scrTitle").textContent = m.name;
  $("scrMsg").textContent = m.msg;

  const openBtn = $("openBtn");
  if (material === "rinse") {
    // rinsing bin: turn on the water, no "open bin" needed
    $("sinkWater").classList.add("on");
    openBtn.textContent = "Water running 🚰";
    openBtn.disabled = true;
  } else {
    openBtn.textContent = "Press to open bin ⚙️";
    openBtn.disabled = false;
  }

  resetIdleTimer();
}

// "must press setting to open bin"
function openActiveBin() {
  if (!activeStation) return;
  const mouth = activeStation.querySelector(".slot-mouth");
  if (mouth) mouth.classList.add("open");
  $("scrMsg").textContent = "Bin open — pop your item in! ♻️";
  $("openBtn").textContent = "Bin is open ✅";
  $("openBtn").disabled = true;

  // auto-close + return to idle after a moment
  setTimeout(() => {
    if (mouth) mouth.classList.remove("open");
  }, 2600);
  resetIdleTimer();
}

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(showIdle, 9000);
}

// ---- wire up ----
document.querySelectorAll(".station").forEach(st => {
  st.addEventListener("click", () => selectStation(st));
});
$("openBtn").addEventListener("click", (e) => { e.stopPropagation(); openActiveBin(); });

// tap the idle video to "play" (little pulse)
$("scrVideo").addEventListener("click", (e) => {
  e.stopPropagation();
  const play = $("scrVideo").querySelector(".play");
  play.textContent = play.textContent === "▶" ? "⏸" : "▶";
});

showIdle();
