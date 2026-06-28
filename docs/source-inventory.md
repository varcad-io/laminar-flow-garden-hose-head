# Source Inventory

Reference model:

- Name: Laminar Flow Garden Hose Head (mk3)
- Printables model id: `1319709`
- Source URL: https://www.printables.com/model/1319709-laminar-flow-garden-hose-head-mk3
- Author handle: `smysnk`
- Published/updated on Printables: June 2025

## Observed Model Metadata

The public Printables page reports:

- 18 total files
- 5 print files
- approximately 584 g total printable material
- PET/PETG-oriented settings
- 0.4 mm nozzle
- 0.25 mm layer height
- Prusa MK4S print profile

Direct browser-visible print-file names include:

- `stage-straightener_0.4n_0.25mm_PETG_MK4S_5h32m`
- `cap_0.4n_0.25mm_PETG_MK4S_2h22m`
- `v5_0.4n_0.25mm_PETG_MK4S_9h19m`
- `lens-holder_0.4n_0.25mm_PETG_MK4S_39m`

The page also describes these individually printable parts:

- Base
- Cap
- Lens Holder
- Lens Holder Gasket
- Stage - Diffuser
- Stage - Straightener
- Lens

## Functional Architecture

The design is broken into staged flow regions:

1. Entry chamber
2. Diffuser stage
3. Straightener stage
4. Exit chamber
5. Lens/nozzle

Important design intent captured from the model description:

- use a short, wide body rather than a long skinny one
- avoid an inlet aligned directly with the outlet
- feed water from the side at roughly 90 degrees
- increase exit chamber volume before the lens
- keep diffuser and straightener stages discrete and swappable
- keep the lens removable for iteration

## Conversion Notes

The original Printables model/source and print files are cached locally under
`references/printables-1319709/files/`. That directory is git-ignored because it
contains large third-party binary assets. The committed manifests under
`references/printables-1319709/manifests/` record the expected file names,
sizes, and SHA-256 hashes.

The first JSCAD milestone still uses the public model description and visible
file inventory to build a parametric architecture. Exact mesh matching should
now follow by measuring:

- bounding boxes for each printable part
- screw boss and nut-trap placement
- inlet thread standard and major/minor diameters
- chamber depths and widths
- stage clearances
- lens slot and gasket compression dimensions

## Measured Bounding Boxes

The current generated model defaults are based on
`references/printables-1319709/manifests/stl-measurements.json`.

| File | Bounding box, mm |
| --- | ---: |
| `01-base-gardena.stl` | 145.1 x 119.0 x 138.5 |
| `02-base-34-ght.stl` | 125.0 x 119.0 x 138.5 |
| `03-cap.stl` | 119.0 x 119.0 x 23.0 |
| `04-cap-lens-holder.stl` | 80.0 x 45.0 x 14.25 |
| `05-stage-straightener.stl` | 95.8 x 45.0 x 95.8 |
| `06-stage-diffuser-aligned.stl` | 95.8 x 45.0 x 95.8 |
| `08-stage-diffuser-crosshatch.stl` | 95.8 x 95.8 x 45.0 |
| `09-lens-8mm.stl` | 38.2 x 38.2 x 5.25 |

## Development Workflows

- `npm run measure:stl` regenerates STL bounding-box and volume measurements.
- `npm run compare:geometry` compares generated JSCAD parts to cached STL references.
- `npm run export:stl -- --part base --out dist/base.stl` exports one generated part.
- `npm run preview:summary` creates a lightweight SVG preview summary.
