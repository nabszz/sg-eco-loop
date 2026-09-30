/* ============================================================================
   EcoLoop Kids - Recycling Bin (micro:bit, MakeCode JavaScript)
   ----------------------------------------------------------------------------
   Complete program for the physical bin. Runs on a BBC micro:bit in MakeCode.
   No extra extensions are required for this button-driven version.

   WHAT IT DOES (matches the digital prototype):
     1. The child SELECTS a material (Plastic, Paper, Glass, Metal, E-waste).
        The micro:bit screen shows the material's letter.
     2. CLEAN/DIRTY check: shake to mark the item dirty.
        - Dirty -> shows WASH and blinks: rinse at the rinsing bin first.
        - Clean -> it is accepted.
     3. OPEN THE BIN: the correct flap SERVO opens, a happy tune plays, the item
        is "weighed" and a REWARD is shown (100 g = $1 -> 1 g = 1 cent), then the
        flap closes and it returns to idle.

   CONTROLS:
     Button A  -> cycle to the next material (Plastic -> Paper -> ... -> E-waste)
     Button B  -> open the bin (accept + reward), or prompt rinse if dirty
     Shake     -> toggle the item between CLEAN and DIRTY

   WIRING:
     - One servo per material flap on a pin. Defaults: P0, P1, P2, P8, P12.
     - Give the servos their OWN 5-6V supply, sharing GND with the micro:bit.

   HOW TO USE (copy-paste ready):
     - Go to makecode.microbit.org -> New Project
     - Click the {} JavaScript button (top of the editor)
     - Select all existing code and DELETE it, then paste this whole file
     - Switch back to Blocks (optional), then Download to the micro:bit
============================================================================ */

// ------------------------------- CONFIG --------------------------------------
// Materials in order (index 0..4). The letter is shown on the LED display.
const MATERIALS = ["Plastic", "Paper", "Glass", "Metal", "E-waste"]
const LETTERS = ["P", "Pa", "G", "M", "E"]

// One servo pin per material flap:
const SERVO_PINS = [AnalogPin.P0, AnalogPin.P1, AnalogPin.P2, AnalogPin.P8, AnalogPin.P12]
const OPEN_ANGLE = 90
const CLOSED_ANGLE = 0

// Reward rule from the concept: 100 g = $1  ->  1 g = 1 cent.
// Fake per-material demo weights in grams (glass/e-waste heavier).
const DEMO_GRAMS = [30, 45, 250, 60, 120]   // plastic, paper, glass, metal, e-waste

// ------------------------------- STATE ---------------------------------------
let current = 0        // index of the currently selected material (0..4)
let dirty = false      // is the current item marked dirty?

// ----------------------------- HELPERS ---------------------------------------
function showMaterial() {
    basic.showString(LETTERS[current])
}

function allFlapsClosed() {
    for (let i = 0; i < SERVO_PINS.length; i++) {
        pins.servoWritePin(SERVO_PINS[i], CLOSED_ANGLE)
    }
}

function goIdle() {
    dirty = false
    basic.showIcon(IconNames.Heart)
}

// Dirty item: tell the child to rinse it themselves. Do NOT accept it.
function promptRinse() {
    basic.showString("WASH")
    for (let i = 0; i < 3; i++) {
        showMaterial()
        basic.pause(250)
        basic.clearScreen()
        basic.pause(250)
    }
    music.playTone(Note.G4, 300)   // gentle "uh-oh"
    showMaterial()
}

// Clean + correct: open the flap, weigh, reward, close, return to idle.
function acceptAndReward() {
    // 1) open the correct flap
    pins.servoWritePin(SERVO_PINS[current], OPEN_ANGLE)
    music.playTone(Note.C5, 200)   // "accepted" beep
    basic.showIcon(IconNames.Yes)
    basic.pause(2500)

    // 2) close the flap again
    pins.servoWritePin(SERVO_PINS[current], CLOSED_ANGLE)

    // 3) weigh + reward (grams == cents because 100 g = $1)
    const cents = DEMO_GRAMS[current]
    basic.showString("+" + cents + "c")
    music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once)

    // 4) back to idle
    basic.pause(500)
    goIdle()
}

function nextMaterial() {
    current = (current + 1) % MATERIALS.length
    dirty = false
    showMaterial()
}

function toggleDirty() {
    dirty = !dirty
    basic.showIcon(dirty ? IconNames.Sad : IconNames.Happy)
    basic.pause(500)
    showMaterial()
}

// The "press to open bin" action.
function openTheBin() {
    if (dirty) {
        promptRinse()        // must be rinsed first
    } else {
        acceptAndReward()    // clean -> accept + reward
    }
}

// ------------------------------- SETUP ---------------------------------------
allFlapsClosed()
goIdle()

// ------------------------------ CONTROLS -------------------------------------
// Button A: choose the material
input.onButtonPressed(Button.A, function () {
    nextMaterial()
})

// Button B: open the bin (or rinse prompt if dirty)
input.onButtonPressed(Button.B, function () {
    openTheBin()
})

// Shake: toggle clean / dirty for the current item
input.onGesture(Gesture.Shake, function () {
    toggleDirty()
})
