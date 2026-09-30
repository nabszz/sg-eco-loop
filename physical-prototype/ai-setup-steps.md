# Add the AI — Step by Step (box is built)

You already have the physical box. This gets the **ELECFREAKS AI Smart Lens**
recognising items and telling the **micro:bit** which bin to light/open.

We use **card recognition** (the Lens reads a tag/card on the item). This is the
reliable way to demo — plain "material by camera" is unreliable in classroom
lighting. Each material gets its own recognition card, matching your mascots:

| Card # | Material | Mascot | Colour |
|--------|----------|--------|--------|
| 1 | Plastic | Pip | Blue |
| 2 | Paper   | Papy | Yellow |
| 3 | Glass   | Glassy | Green |
| 4 | Metal   | Metty | Grey |
| 5 | E-waste | Eddy | Purple |

---

## Step 0 — What you need on the desk
- BBC micro:bit (V2) + USB cable
- ELECFREAKS AI Smart Lens + its **RJ11 cable**
- micro:bit expansion board with an **RJ11 / Planet X port**
- (For later) 1 servo per bin + LEDs, and a separate 5–6 V supply for servos
- The AI Lens's recognition **cards** (came with the kit)
- A computer with Chrome or Edge

---

## Step 1 — Plug it together
1. Seat the **micro:bit** into the expansion board.
2. Plug the **AI Lens** into the board's **RJ11 port** with the RJ11 cable.
3. Connect the micro:bit to your computer with USB.
4. Power the board (USB or battery). The Lens's 1.3" screen should light up.

> Note which port the Lens is on (e.g. the board labels it J1/J2 or "AI").
> You pick that same port in code in Step 3.

---

## Step 2 — Open MakeCode and add the AI extension
1. Go to **makecode.microbit.org** → **New Project**.
2. Click the gear/⚙ or the **Extensions** button at the bottom of the block drawer.
3. In the search box paste this and press enter:
   ```
   https://github.com/elecfreaks/pxt-PlanetX-AI
   ```
4. Click the **PlanetX-AI** card to add it. New "AI Lens" blocks appear in the drawer.

---

## Step 3 — First test: make the Lens SEE a card
Build this tiny program first (blocks described; JS to paste is in Step 6):

- **on start:** initialise the AI Lens on its port (the port from Step 1); set
  the Lens function to **Card Recognition**.
- **forever:**
  1. "Get one image from the AI Lens" (this captures/refreshes what it sees).
  2. If it detects **card 1**, scroll `P` (plastic) on the micro:bit LEDs.
  3. Else if **card 2**, scroll `Pa`; card 3 → `G`; card 4 → `M`; card 5 → `E`.
  4. Else show a dot (nothing seen).

Flash it to the micro:bit (click **Download**, drag the .hex onto the MICROBIT
drive, or use "Connect device" + Download over USB).

**Success check:** hold card 1 in front of the Lens → micro:bit shows `P`. Try
each card. If letters change with the right cards, the AI half is working. 🎉

---

## Step 4 — Light the correct bin
Add LEDs (one per bin) or a NeoPixel strip:
- When card N is detected, turn on that bin's LED (and turn the others off).
- Also show the material's icon on the micro:bit LED grid.

If you don't have external LEDs yet, use the micro:bit's own 5x5 grid to show a
different icon per material as a stand-in.

---

## Step 5 — Open the flap ("press to open bin")
For each bin add a **servo** to its flap:
- Define `closedAngle = 0` and `openAngle = 90` (tune to your flap).
- When a card is detected AND **button A** is pressed:
  1. Move that bin's servo to `openAngle`.
  2. `pause 3000` ms.
  3. Move it back to `closedAngle`.
  4. Play a happy tone; turn the bin LED off.

**Power warning:** run the servos from a **separate 5–6 V supply** sharing
ground with the micro:bit. Don't drive 5 servos from micro:bit power alone.

---

## Step 6 — Paste-ready MakeCode JavaScript
In MakeCode click **{} JavaScript** (top toggle) and paste this, then switch
back to Blocks. Adjust the **port** and **servo pins** to match your board.

```javascript
// ---- EcoLoop Kids: AI Lens -> light bin -> open flap ----
// NOTE: block/function names can vary slightly by extension version.
// If a name doesn't autocomplete, open the "AI Lens" drawer and pick the
// matching block, then check its JS name.

let currentCard = 0

// 1) Init the AI Lens on its port. Change AIport.port1 to the port you used.
planetX_AI.initializeChip(AIport.port1)
// 2) Put it in card-recognition mode.
planetX_AI.setLensMode(planetX_AI.LensMode.CardRecognition)

basic.forever(function () {
    // 3) Capture the current view.
    planetX_AI.aiLensGetImage()

    // 4) Read the recognised card number (1..5), or 0 if none.
    if (planetX_AI.checkCard(1)) {
        currentCard = 1
        basic.showString("P")      // Plastic
    } else if (planetX_AI.checkCard(2)) {
        currentCard = 2
        basic.showString("Pa")     // Paper
    } else if (planetX_AI.checkCard(3)) {
        currentCard = 3
        basic.showString("G")      // Glass
    } else if (planetX_AI.checkCard(4)) {
        currentCard = 4
        basic.showString("M")      // Metal
    } else if (planetX_AI.checkCard(5)) {
        currentCard = 5
        basic.showString("E")      // E-waste
    } else {
        currentCard = 0
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
    }
})

// 5) "Press to open bin": button A opens the flap for the detected material.
input.onButtonPressed(Button.A, function () {
    if (currentCard == 0) return
    // Map card -> servo pin. Change pins to your wiring.
    let pin = AnalogPin.P0
    if (currentCard == 1) pin = AnalogPin.P0        // plastic
    else if (currentCard == 2) pin = AnalogPin.P1   // paper
    else if (currentCard == 3) pin = AnalogPin.P2   // glass
    else if (currentCard == 4) pin = AnalogPin.P8   // metal
    else if (currentCard == 5) pin = AnalogPin.P12  // e-waste

    pins.servoWritePin(pin, 90)     // open
    music.playTone(Note.C5, 200)    // happy beep
    basic.pause(3000)
    pins.servoWritePin(pin, 0)      // close
})
```

> The exact function names (`initializeChip`, `setLensMode`, `aiLensGetImage`,
> `checkCard`) depend on the installed PlanetX-AI version. If one doesn't exist,
> drag the equivalent block from the **AI Lens** drawer (init / set mode / get
> one image / card detected) and MakeCode will show you its real name. The
> **flow is always: init → set card mode → get image → check card**.

---

## Step 7 — Stand the touchscreen next to it
Run your web prototype full-screen on a tablet/monitor beside the box:
- `digital-prototype/kiosk/index.html` = screen only, or
- `digital-prototype/bin/bin.html` = full on-screen unit.

For the demo, the micro:bit handles the physical lighting/flaps and the tablet
shows the mascots/quiz. They don't need to talk to each other to be convincing.
(Optional/advanced later: connect them with Web Serial so the on-screen mascot
reacts to what the Lens saw.)

---

## Quick troubleshooting
- **Lens screen blank:** check the RJ11 cable is fully clicked in and the board
  is powered; re-seat the micro:bit.
- **No cards recognised:** make sure the Lens is in **Card Recognition** mode,
  hold the card ~15–30 cm away, steady, in good even light; try the kit's own
  cards first.
- **Wrong port:** the `initializeChip(AIport.portX)` must match the physical port.
- **Servo twitches / micro:bit resets:** servos need their **own power**; share
  ground with the micro:bit.
- **Block name errors in JS:** switch to Blocks, drag the real AI Lens blocks,
  then flip back to JS to copy the correct names.

---

## The one-line summary
**Init the AI Lens → set Card Recognition → each loop get one image → check which
card (1–5) → light that bin → on button A, open that bin's servo flap.** Get
Step 3 working first; everything else builds on it.
