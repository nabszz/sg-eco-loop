# Assembly Notes

Suggested build order for the prototype. Do a dry-fit of the frame and
electronics on the bench before final assembly.

## Build order
1. **Frame:** cut and bolt the T-slot extrusion into the base + bin-row frame.
   Add ballast to the base and fit lockable castors.
2. **Inner bins:** fit rails/shelves for the 5 removable HDPE bins; mount a load
   cell platform under each.
3. **Front panels:** install polycarbonate windows and the slot openings; fit
   the motorised flaps with rubber trim. Test each flap by hand for free travel.
4. **Rinsing bay:** mount the stainless basin, tap, soap pump, and greywater
   tank on the right. Seal all joints; verify no leaks toward the electronics.
5. **Hood + screen:** attach the curved hood, mount the touchscreen at ~1050 mm
   centre, and route HDMI/USB down to the SBC in the service compartment.
6. **Electronics:** mount the SBC, MCU I/O hub, motor drivers, and PSU in a
   ventilated, dry enclosure at the back. Wire per `electronics-and-wiring.md`.
7. **Sensors:** fit a PIR under each station + the rinsing bay; fit load cells
   and flap limit switches. Route the LED strips along each bin front.
8. **Cable management:** label and loom all cables; keep water-bay wiring
   separate and RCD-protected.

## Bring-up / test checklist
- [ ] Screen boots and loads the kiosk UI.
- [ ] Each PIR wakes the correct bin.
- [ ] Each LED strip lights the correct colour per mascot.
- [ ] "Press to open bin" drives the correct flap; limit switch confirms.
- [ ] Flap reverses on obstruction (safety).
- [ ] Load cells read plausible weights; tare/calibration done.
- [ ] Weight -> cents math matches 100 g = $1.
- [ ] Rinsing tap runs on motion and stops on timeout.
- [ ] E-waste flap stays locked without staff unlock.
- [ ] Full happy-path demo: pick material -> (wash if dirty) -> open -> drop ->
      weigh -> reward -> return to idle.

## Calibration: load cell -> cents
1. Tare each empty bin.
2. Place a known reference mass (e.g. 500 g) and record the raw reading.
3. Compute the scale factor so grams read correctly.
4. Convert: `cents = round(grams * 1)` (since 100 g = $1 => 1 g = 1 cent).
5. Re-check with a second known mass (e.g. 1000 g -> should show 100 cents).

## Maintenance
- Empty inner bins and rinse the basin/greywater tank regularly.
- Wipe the touchscreen and windows; check flaps for jams.
- Inspect water-bay seals and RCD before each event.

## Safety sign-off (before public use)
- Electrical safety inspection (RCD, insulation, enclosure rating).
- Mechanical: no pinch points, flap force within limits, anti-tip verified.
- Water: no water near mains electronics, no slip hazard, greywater disposed properly.
- Supervision plan for young children at events.
