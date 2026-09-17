# Bill of Materials (BOM)

Prototype-stage parts list for one demo unit. Prices are rough estimates in SGD
and will vary by supplier; treat as planning figures, not quotes.

## Compute & display
| # | Item | Qty | Est. unit (SGD) | Notes |
|---|------|-----|-----------------|-------|
| 1 | Single-board computer (Raspberry Pi 5 8GB or mini-PC) | 1 | 130 | Runs the touchscreen UI |
| 2 | 21–24" capacitive touchscreen monitor | 1 | 350 | Mounted in hood |
| 3 | microSD 64GB / SSD | 1 | 25 | OS + app |
| 4 | Speaker (amplified, small) | 1 | 25 | Mascot voice / narration |
| 5 | Power supply + surge protection | 1 | 40 | |

## Sensing
| # | Item | Qty | Est. unit (SGD) | Notes |
|---|------|-----|-----------------|-------|
| 6 | PIR / IR motion sensor | 6 | 5 | One per station + rinsing bay |
| 7 | Load cell 5 kg + HX711 amplifier | 5 | 8 | Weigh accepted items (one per bin) |
| 8 | Camera module (for AI material/contamination check) | 1 | 40 | Above/at slot, optional for prototype |
| 9 | Reed/limit switch (flap open/closed) | 5 | 2 | Flap position feedback |

## Actuation
| # | Item | Qty | Est. unit (SGD) | Notes |
|---|------|-----|-----------------|-------|
| 10 | Servo or geared DC motor (flap door) | 5 | 12 | Opens slot after "open bin" step |
| 11 | Motor driver board | 2 | 15 | Drives flaps |
| 12 | Solenoid valve / low-flow pump (rinsing tap) | 1 | 25 | Water on motion |
| 13 | LED strip (per-bin "light up") | 6 | 6 | Highlights the active bin |

## Structure & enclosure
| # | Item | Qty | Est. unit (SGD) | Notes |
|---|------|-----|-----------------|-------|
| 14 | Aluminium T-slot extrusion (per m) | ~12 | 9 | Frame |
| 15 | Powder-coated / ABS shell panels (set) | 1 | 250 | Outer body + curved hood |
| 16 | Polycarbonate window sheet | 1 | 60 | Front fill windows |
| 17 | HDPE inner bins | 5 | 15 | Removable |
| 18 | Stainless rinsing basin + tap + soap pump | 1 | 90 | Rinsing bay |
| 19 | Greywater tank | 1 | 30 | Demo (no plumbing) |
| 20 | Lockable castors | 4 | 8 | Mobility |
| 21 | Fasteners, brackets, trim, wiring, connectors | 1 | 120 | Consumables |

## EZ-Link / reward (demo)
| # | Item | Qty | Est. unit (SGD) | Notes |
|---|------|-----|-----------------|-------|
| 22 | NFC/contactless reader (card tap-in) | 1 | 45 | Identify child's card; real EZ-Link crediting needs partner/operator integration |

## Rough total
| Category | Approx (SGD) |
|----------|--------------|
| Compute & display | ~570 |
| Sensing | ~120 |
| Actuation | ~150 |
| Structure & enclosure | ~1,000 |
| Reward | ~45 |
| **Estimated prototype total** | **~1,900** |

> The real EZ-Link cashback flow (crediting cents to a stored-value card) is a
> commercial/regulatory integration with the card operator, not a hardware line
> item. For the prototype, simulate the credit on-screen and (optionally) print
> a voucher or log to an account.
