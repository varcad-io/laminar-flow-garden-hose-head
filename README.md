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
```

Open `index.js` in varcad.io or another JSCAD viewer to inspect the model.

## Current Status

Implemented:

- source inventory notes in `docs/source-inventory.md`
- modular JSCAD files under `src/`
- parametric body, cap, inlet, stage blockouts, lens holder, and screw bosses
- widget metadata in `widgets.json`

Not implemented yet:

- exact dimensions from source STL/CAD files
- hose-thread geometry
- diffuser cross-hatch internals
- straightener channel lattice
- lens/nozzle curvature tuning
- gasket compression details

