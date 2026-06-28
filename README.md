# Laminar Flow Garden Hose Head mk3

This repository is an early JSCAD implementation of a staged laminar-flow garden
hose head inspired by the Printables mk3 model:

https://www.printables.com/model/1319709-laminar-flow-garden-hose-head-mk3

The first pass is intentionally a parametric blockout. It captures the major
functional architecture before attempting full geometric parity with the
original mesh files:

- perpendicular garden-hose inlet
- short, wide clamshell base and cap
- entry chamber
- diffuser stage
- straightener stage
- large exit chamber
- removable lens holder and lens slot

## Run

```sh
npm install
npm run check
npm run compare:geometry
npm run export:stl -- --part base --out dist/base.stl
npm run preview:summary
```

Open `index.js` in varcad.io or another JSCAD viewer to inspect the model.

## Current Status

Implemented:

- source inventory notes in `docs/source-inventory.md`
- modular JSCAD files under `src/`
- local Printables reference cache manifest under `references/printables-1319709/manifests/`
- initial STEP inspection notes under `references/printables-1319709/manifests/step-inspection.md`
- STL measurement script and measured dimensions for the original parts
- reference-sized parametric body, cap, inlet, stage blockouts, lens holder, and screw bosses
- per-part rendering through the `part` parameter
- geometry comparison reports against cached STL references
- generated STL export and preview-summary workflows
- widget metadata in `widgets.json`

Not implemented yet:

- hose-thread geometry
- exact diffuser cross-hatch parity
- exact straightener channel lattice parity
- lens/nozzle curvature tuning
- gasket compression details

## Reference Measurements

The current defaults are based on the cached Printables files:

| Part | Measured bounding box |
| --- | ---: |
| Base, Gardena | 145.1 x 119.0 x 138.5 mm |
| Base, 3/4 GHT | 125.0 x 119.0 x 138.5 mm |
| Cap | 119.0 x 119.0 x 23.0 mm |
| Lens holder | 80.0 x 45.0 x 14.25 mm |
| Straightener stage | 95.8 x 45.0 x 95.8 mm |
| Diffuser stage, crosshatch | 95.8 x 95.8 x 45.0 mm |
| Lens | 38.2 x 38.2 x 5.25 mm |

Run `npm run measure:stl` to regenerate the measurement report.

## Geometry Comparison

`npm run compare:geometry` writes `dist/geometry-comparison.json`. The report
compares generated JSCAD parts against the cached Printables STL references:

- bounding box
- center
- approximate volume
- generated polygon count versus STL triangle count

The comparison is currently a development guide, not a pass/fail parity test.
The generated model is intentionally lower detail than the source meshes.

## Export And Preview

- `npm run export:stl -- --part base --out dist/base.stl`
- `npm run preview:summary`

Supported `part` values:

- `assembly`
- `base`
- `cap`
- `lensHolder`
- `straightener`
- `diffuser`
- `lens`
