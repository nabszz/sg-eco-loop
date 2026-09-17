# EcoLoop Kids — Physical Prototype

AI Organisational Recycling Bin for **Kidztropic**. This folder holds the
build documentation for the physical machine: dimensions, materials,
electronics, wiring, and assembly notes. It is the physical counterpart to the
`digital-prototype/` render.

## Concept recap
An interactive, educational recycling station that teaches young children to
recognise recyclable materials and prep them correctly (rinse, empty, flatten)
before disposal. Each material has a mascot, a touchscreen guides the child, a
motion sensor + weight cell reward correct recycling as EZ-Link cents
(**100 g = $1**, i.e. 1 g = 1 cent).

### Mascots
| Material | Mascot | Colour |
|----------|--------|--------|
| Plastic  | Pip the Pal | Blue |
| Paper    | Papy the Paper | Yellow |
| Glass    | Glassy Shimmy | Green |
| Metal    | Metty Bendy | Grey |
| E-waste  | Eddy the Electric | Purple |

## Layout (from the concept sketch)
```
                 ______________________
                (   curved hood / top   )
                |   [ TOUCHSCREEN ]      |
                |________________________|
  ---------------------------------------------------------------
  | PLASTIC | PAPER | GLASS | METAL | E-WASTE ||  RINSING BIN   |
  |  slot   | slot  | slot  | slot  |  slot   ||  (water + soap)|
  | window  |window |window |window | window  ||   sink basin   |
  | drawer  |drawer |drawer |drawer | drawer  ||                |
  | [sensor]|[sensr]|[sensr]|[sensr]|[sensor] ||   [sensor]     |
  ---------------------------------------------------------------
                        [ base / castors ]
```
- **Top:** curved hood housing a mounted touchscreen (video clips + Kahoot-style
  eco quiz when idle; mascot + "press setting to open bin" when active).
- **Middle:** five material bins in a row. Each has a front push-slot, a clear
  window to see the fill level, a pull-out drawer to empty, and a **motion
  sensor** underneath (per the sketch).
- **Right:** the **rinsing bin** with a small sink, tap, water + soap for
  cleaning contaminated items before recycling.

## Documents in this folder
- [`build-spec.md`](build-spec.md) — dimensions, materials, structure.
- [`bill-of-materials.md`](bill-of-materials.md) — parts list with estimated costs.
- [`electronics-and-wiring.md`](electronics-and-wiring.md) — sensors, controller, wiring, firmware behaviour.
- [`assembly-notes.md`](assembly-notes.md) — step-by-step build order and safety notes.

## How physical maps to digital
| Physical part | Digital view |
|---------------|--------------|
| Mounted touchscreen | `digital-prototype/kiosk/` (the interactive UI) |
| Whole machine + bins + sensors | `digital-prototype/bin/` (the unit render) |

> Note: figures here are prototype-stage estimates for a school/mall demo unit,
> not final engineering specs. Validate loads, electrical safety, and water
> handling with a qualified person before building a public-facing unit.
