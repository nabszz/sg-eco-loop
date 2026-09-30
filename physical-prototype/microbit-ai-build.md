# Making it Physical — micro:bit + ElecFreaks AI Smart Lens

This guide turns the digital prototype into a working physical demo bin using a
**BBC micro:bit** and the **ELECFREAKS micro:bit AI Smart Lens Kit** (Planet X
series, part EF05045) — the camera that lets the bin actually *see* and
recognise the material a child holds up.

> Sources for the hardware facts below: ELECFREAKS AI Smart Lens Kit product and
> wiki pages, and reseller listings (elecfreaks.com, kiwi-electronics.com,
> amazon). The AI Lens uses a Kendryte **K210** processor with a built-in
> **1.3" screen**, connects to a micro:bit expansion board over **RJ11**, is
> programmed in **MakeCode** (blocks), and supports **machine-learning object /
> card recognition** plus colour, face, line and ball recognition. Content was
> rephrased for compliance with licensing restrictions.

---

## 1. What each part does (mapping digital → physical)

| Digital prototype feature | Physical part that does it |
|---------------------------|----------------------------|
| "AI detects the material" | **ELECFREAKS AI Smart Lens** (K210 camera) running a trained model |
| The brain / decision logic | **BBC micro:bit** (V2 recommended) programmed in MakeCode |
| "Bin lights up" for the chosen material | micro:bit LED display + external LEDs / Neopixels |
| "Press to open bin" / flap opens | **servo motor** per bin (driven via the expansion board) |
| "Motion sensor under each bin" | PIR or ultrasonic sensor (Planet X series) |
| Rinsing bin water on motion | servo/relay + small pump or just an LED "water" indicator for the demo |
| The big touchscreen program | keep the **web prototype** on a tablet/monitor beside the bin |

Key idea: the **AI Lens sees the item → tells the micro:bit which material →
the micro:bit lights the right bin and opens that flap.** The polished
touchscreen UI you already built stays as the on-screen experience next to it.

---

## 2. Shopping list (core)

| Item | Notes |
|------|-------|
| BBC micro:bit V2 | The controller/brain |
| ELECFREAKS AI Smart Lens Kit (EF05045) | The AI camera + 1.3" screen |
| micro:bit expansion board with **RJ11 / Planet X** ports | e.g. ELECFREAKS "Wukong", "Nezha", or Planet X breakout — the Lens needs an RJ11 port |
| Servo motors ×5 | One flap per material bin (SG90/MG90 size for a demo) |
| PIR or ultrasonic sensors ×5 (optional) | Child-presence per bin |
| LEDs / NeoPixel strip | "Light up the correct bin" |
| Battery pack / USB power | Power micro:bit + servos (servos may need their own supply) |
| Cardboard / foam board / 3D-printed parts | The bin body for the demo |

Check the exact expansion board has the **RJ11 port** the AI Lens plugs into —
that's the main compatibility requirement.

---

## 3. How the AI recognition works (the important bit)

The AI Lens does the "seeing." You have two realistic options:

### Option A — Machine Learning "teach it yourself" (recommended for materials)
The Lens supports **on-device machine learning**: you show it examples of each
class and it learns to tell them apart.
1. In MakeCode, add the **ELECFREAKS PlanetX-AI** extension.
2. Put the Lens into **machine-learning / classification** mode.
3. Teach it classes: `plastic`, `paper`, `glass`, `metal`, `ewaste` — hold up a
   few real examples of each and capture them under each class number.
4. The Lens then reports **which class** it currently sees (e.g. class 1..5).

Reality check for a school demo: lighting, angle and similar-looking items make
material classification hard. To make it reliable, either
- restrict to a few clearly different demo items per class, or
- use **card / tag recognition** instead (Option B).

### Option B — Card / colour recognition (most reliable for a demo)
The Lens reliably recognises **cards, colours, and simple tags**. Attach a
coloured tag or recognition card to each practice item (blue = plastic, yellow =
paper, green = glass, grey = metal, purple = e-waste — matching your mascots).
The Lens reads the tag → micro:bit knows the material instantly. This is the
most dependable choice for a live audience.

> Recommendation: build with **Option B (cards/colours)** for a guaranteed-to-work
> demo, and show **Option A (ML)** as the "real product" concept.

---

## 4. Program flow (MakeCode, on the micro:bit)

Pseudocode of the loop — rebuild this with MakeCode blocks:

```
on start:
    connect AI Lens on its RJ11 port
    set Lens mode = machine-learning  (or card recognition)
    all bin LEDs off; all flaps closed (servo = closed angle)

forever:
    result = AI Lens.recognisedClass()      # 1..5, or "none"
    if result == "none":
        show idle animation on micro:bit LEDs
    else:
        material = classToMaterial(result)   # 1->plastic, 2->paper, ...
        lightBin(material)                    # turn on that bin's LED
        show material icon on Lens 1.3" screen
        # "press to open" — wait for button A (or auto after a pause)
        if button A pressed:
            openFlap(material)                # servo to open angle
            pause 3 seconds
            closeFlap(material)               # servo back to closed
            playHappyTone()                   # friendly beep
            lightBin(off)
```

Helper mapping:
```
classToMaterial: 1=plastic, 2=paper, 3=glass, 4=metal, 5=ewaste
openAngle = 90°, closedAngle = 0°   (tune to your flap)
```

For the **rinsing bin**: if you add a "dirty" detection (e.g. a second card, or
a manual button), light the rinsing bin LED and prompt "rinse me first" on the
screen — mirroring the digital prototype's rinse-prompt behaviour.

---

## 5. Wiring (demo-level)

- **AI Lens → expansion board:** single RJ11 cable into the Planet X / RJ11 port.
- **Servos → expansion board servo headers:** one per bin (S/V/G pins).
- **LEDs / NeoPixels → a digital pin** (e.g. P0) or the board's addressable-LED port.
- **PIR/ultrasonic (optional) → digital pins** (P1, P2, …).
- **Power:** micro:bit via USB or battery; **give servos their own 5–6 V supply**
  with a common ground, so they don't brown-out the micro:bit.

Keep all electronics away from any real water in the rinsing bay. For a first
demo, simulate "water" with a blue LED instead of a real pump.

---

## 6. Keeping the beautiful touchscreen too

The micro:bit + Lens handle the *physical* sensing and actuation. The web
prototype you already have is the *screen*. Two easy ways to combine them:

- **Simplest:** run the web prototype full-screen on a **tablet/monitor** mounted
  above the bins. The micro:bit independently lights bins and opens flaps. The
  two run side by side (not talking to each other). This is enough for a
  compelling demo.
- **Connected (advanced):** send the micro:bit's detected material to the web
  page over **Web Serial** (micro:bit USB serial → a browser using the Web Serial
  API) or over **Web Bluetooth**. Then the on-screen mascot reacts to what the
  Lens physically saw. This is a bigger coding step — do it only after the
  standalone pieces work.

---

## 7. Suggested build order

1. Get the micro:bit blinking in MakeCode (hello world).
2. Add the PlanetX-AI extension; get the AI Lens to print a recognised class.
3. Map classes → materials; light the correct LED per class.
4. Add one servo flap; open/close it on button A.
5. Repeat servos/LEDs for all 5 bins.
6. Add the "press to open" and rinse-prompt behaviour.
7. Build the cardboard/foam bin body; mount Lens, LEDs, servos.
8. Stand the tablet with the web prototype next to it.
9. (Optional) connect them with Web Serial/Bluetooth.

---

## 8. Honest limitations for a school demo

- **Material ML is genuinely hard** (a clear plastic cup vs a glass cup looks
  similar to a camera). Use distinct demo items or the card/colour method.
- **Servos are weak** — flaps must be light (card/foam), not heavy doors.
- **Power:** don't run 5 servos off the micro:bit alone; use a separate supply.
- The micro:bit has limited memory; keep the program simple and offload the
  "seeing" to the Lens (it does the AI on its own K210 chip).
- Real EZ-Link crediting and load-cell weighing are **not** part of this kit;
  keep those simulated on the touchscreen as in the digital prototype.

---

## 9. Where to look next

- ELECFREAKS AI Smart Lens Kit product page and the Planet X **AI Lens wiki**
  (search "ELECFREAKS AI Lens wiki EF05045").
- The **PlanetX-AI MakeCode extension** on GitHub (`elecfreaks/pxt-PlanetX-AI`)
  — add this URL as an extension inside MakeCode to get the AI Lens blocks.
- ELECFREAKS tutorials on using the AI Lens for recognition and with servos
  (e.g. their manipulator/robotics guides show the same Lens → action pattern).
