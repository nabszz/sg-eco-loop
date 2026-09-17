# Electronics & Wiring

Control architecture and firmware behaviour for the prototype. Low-voltage
throughout; keep all electronics away from the water bay.

## 1. System architecture
```
        +---------------------------+
        |  Touchscreen (HDMI + USB) |
        +-------------+-------------+
                      |
             +--------+--------+
             |   SBC / mini-PC |  <- runs the UI (digital-prototype/kiosk)
             |  (Raspberry Pi) |
             +--------+--------+
                      | USB / GPIO / I2C
        +-------------+--------------------------------+
        |             |            |          |        |
   +----+----+   +----+----+  +----+----+ +---+----+ +-+------+
   | Sensor  |   | Load    |  | Flap    | | LED    | | Water  |
   | hub     |   | cells   |  | motors  | | strips | | valve  |
   | (PIR ×6)|   | (HX711) |  | (servo) | |        | |        |
   +---------+   +---------+  +---------+ +--------+ +--------+
```
- The SBC runs the kiosk UI and the control logic.
- A microcontroller (Arduino/ESP32) can act as an I/O hub for the motors,
  sensors, and LEDs, talking to the SBC over USB serial. This keeps real-time
  motor/sensor handling off the SBC.

## 2. Per-station wiring (×5 material bins)
| Signal | Component | Connection |
|--------|-----------|------------|
| Presence | PIR motion sensor | Digital in (one GPIO each) |
| Weight | Load cell + HX711 | I2C-like clock/data pair per cell |
| Flap open/close | Servo (or DC motor + driver) | PWM out |
| Flap position | Limit switch | Digital in |
| Highlight | LED strip segment | Addressable data line (WS2812) |

## 3. Rinsing bay wiring
| Signal | Component | Connection |
|--------|-----------|------------|
| Presence | PIR motion sensor | Digital in |
| Water | Solenoid valve / pump | Relay or MOSFET out |
| Optional | Soap pump | Relay/MOSFET out |

## 4. Power
- Single mains inlet -> surge protector -> PSU.
- 5 V rail: SBC, sensors, LEDs.
- 6–12 V rail: servos/motors, valve (separate supply to avoid brownout).
- Common ground between SBC, MCU, and driver boards.
- **RCD/GFCI** protection; water bay circuits isolated and fused.

## 5. Firmware / control behaviour
Event flow for a correct recycling action:
1. **Idle:** screen plays educational video / eco quiz. LEDs dim/breathing.
2. **Child taps a material on screen** (or motion sensor wakes a bin):
   - That bin's LED strip lights up (matches the on-screen mascot colour).
   - Screen shows the mascot + prep instructions.
3. **Clean check:**
   - If dirty -> screen shows wash steps -> guides child to the **rinsing bay**;
     motion at the bay opens the water valve for N seconds.
4. **"Press to open bin" (setting):** child presses the on-screen button ->
   controller drives that station's flap motor open (limit switch confirms).
5. **Item dropped:** load cell measures the delta weight once settled.
   - Optional camera does an AI material/contamination check before accepting.
6. **Reward:** weight -> cents at **1 g = 1 cent (100 g = $1)**; screen shows the
   credit; NFC tap-in associates it with the child's card (demo: simulated).
7. **Flap closes** after a timeout or when the slot is clear; return to idle.

## 6. Safety interlocks (firmware)
- Flap reverses if the limit switch/current sensing detects an obstruction.
- Flap will not open unless the previous cycle completed and the slot is clear.
- E-waste flap requires staff unlock (PIN on screen or physical key).
- Water valve has a hard max-on timeout and closes on power loss (normally-closed).
- Watchdog resets the MCU if serial link to the SBC drops.

## 7. Data / integration (prototype)
- Log each accepted item: material, grams, cents, timestamp (local DB / CSV).
- Daily totals feed the on-screen counters (matches the digital kiosk UI).
- EZ-Link crediting is a partner integration; prototype simulates or vouchers.
