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

This repository does not yet include the original STL/3MF/G-code assets. The
first JSCAD milestone uses the public model description and visible file
inventory to build a parametric architecture. Exact mesh matching should follow
after downloading the source files and measuring:

- bounding boxes for each printable part
- screw boss and nut-trap placement
- inlet thread standard and major/minor diameters
- chamber depths and widths
- stage clearances
- lens slot and gasket compression dimensions

