# EcoLoop Kids — micro:bit code (MakeCode JavaScript)

One file: [`ecoloop-makecode.js`](ecoloop-makecode.js). It runs the whole
recycling bin on a BBC micro:bit in **MakeCode JavaScript**. No extensions are
required for this button-driven version.

## What it does
Mirrors the digital prototype on real hardware:
1. **Pick a material** — Plastic, Paper, Glass, Metal, E-waste.
2. **Clean/dirty check** — dirty items are sent to rinse first (not accepted).
3. **Open the bin + reward** — the correct servo flap opens, a tune plays, and
   a reward is shown using the concept's rule (100 g = $1 → 1 g = 1 cent).

## Controls
| Action | What it does |
|--------|--------------|
| **Button A** | Cycle to the next material |
| **Button B** | Open the bin (accept + reward), or prompt rinse if dirty |
| **Shake** | Toggle the item clean ↔ dirty |

## How to use (copy-paste)
1. Go to **makecode.microbit.org** → New Project.
2. Click the **{} JavaScript** button at the top.
3. Select all the existing code and delete it, then paste `ecoloop-makecode.js`.
4. (Optional) switch back to Blocks, then **Download** to the micro:bit.

## Wiring
- One **servo per material flap** on a pin (defaults P0, P1, P2, P8, P12).
- Power the servos from a **separate 5–6 V supply** sharing ground with the
  micro:bit (don't run several servos off micro:bit power).
- Tune `OPEN_ANGLE` / `CLOSED_ANGLE` at the top of the file to your servos.

## Note about the AI camera
The child selects the material with the **buttons** here, so it works today with
no camera. If you later add the ELECFREAKS AI Smart Lens to auto-detect the
material, add its MakeCode extension
(`https://github.com/elecfreaks/pxt-PlanetX-AI`) and replace the button-selection
with the Lens's card recognition — the rest of the program (flaps, rinse,
reward) stays the same.
