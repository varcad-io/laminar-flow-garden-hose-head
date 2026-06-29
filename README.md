# Laminar Flow Garden Hose Head

This repository is a JSCAD implementation of a staged laminar-flow garden hose
head with selectable reference versions. The default version is inspired by the
Printables mk3 model:

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
yarn reference:laminar:measure
yarn reference:laminar:profile
yarn reference:laminar:compare
yarn reference:laminar:heuristics
yarn reference:laminar:verify
```

Open `index.js` in varcad.io or another JSCAD viewer to inspect the model.

## Current Status

Implemented:

- modular JSCAD files under `src/`
- local Printables reference cache under ignored repo-root `references/printables-1319709/`
- tracked part-mapping and normalization manifest in `/docs/laminar-flow-garden-hose-head-mk3-reference-manifest.json`
- STL deserialization and reference-profile workflows under `/scripts/`
- reference-sized parametric body, cap, inlet, stage blockouts, lens holder, and screw bosses
- per-part rendering through the `part` parameter
- geometry comparison reports against normalized STL-derived reference profiles
- offline design heuristics driven by reference geometry plus authored construction semantics
- tracked gold-state assembly target plus regression-floor validation
- body-derived uniform exit chamber geometry for the accepted stack target
- widget metadata in `widgets.json`

Not implemented yet:

- hose-thread geometry
- exact base front-silhouette parity
- exact lens-holder top-profile parity
- exact straightener channel lattice parity
- exact lens internal-profile parity
- gasket compression details

## Reference Geometry

The raw source-of-truth files live under ignored repo-root `references/` and are
normalized into the scenario world frame with the transform declared in:

- [/Users/josh/play/varcad.io/docs/laminar-flow-garden-hose-head-mk3-reference-manifest.json](/Users/josh/play/varcad.io/docs/laminar-flow-garden-hose-head-mk3-reference-manifest.json)

That normalization keeps the heuristics pipeline in the same x-axis frame as
the authored assembly and exploded-view behavior.

The current defaults are still based on the cached Printables files:

| Part | Measured bounding box |
| --- | ---: |
| Base, Gardena | 145.1 x 119.0 x 138.5 mm |
| Base, 3/4 GHT | 125.0 x 119.0 x 138.5 mm |
| Cap | 119.0 x 119.0 x 23.0 mm |
| Lens holder | 80.0 x 45.0 x 14.25 mm |
| Straightener stage | 95.8 x 45.0 x 95.8 mm |
| Diffuser stage, crosshatch | 95.8 x 95.8 x 45.0 mm |
| Lens | 38.2 x 38.2 x 5.25 mm |

Run `yarn reference:laminar:measure` to regenerate raw and normalized STL
measurements under `dist/laminar-flow-garden-hose-head/`.

## Reference Versions

Tracked reference version inventory now lives in:

- [/Users/josh/play/varcad.io/docs/laminar-flow-garden-hose-head-reference-versions.v1.json](/Users/josh/play/varcad.io/docs/laminar-flow-garden-hose-head-reference-versions.v1.json)

The scenario widget now exposes a `version` dropdown with:

- `mk3`
- `mk2_2`
- `mk2_1`
- `mk2_0`

Reference STL inputs are staged by version under:

- `/scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/`
- `/scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_2/`
- `/scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_1/`
- `/scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_0/`

Shared upstream mk2 CAD source files are staged separately under:

- `/scenarios/laminar-flow-garden-hose-head/assets/reference-sources/mk2/`

## Reference Profile

`yarn reference:laminar:profile` deserializes the original STL files into raw
triangle geometry, normalizes them into the scenario frame, and emits:

- `dist/laminar-flow-garden-hose-head/reference-profile.json`
- `dist/laminar-flow-garden-hose-head/reference-profile.md`

The profile contains:

- normalized mesh stats
- x-axis section probes at canonical slice stations
- silhouette occupancy sets for top/side/front views
- declared assembly-level part ordering for the laminar flow stack

## Geometry Comparison

`yarn reference:laminar:compare` writes:

- `dist/laminar-flow-garden-hose-head/geometry-comparison.json`
- `dist/laminar-flow-garden-hose-head/geometry-comparison.md`
- `dist/laminar-flow-garden-hose-head/geometry-artifacts/*`

The comparison consumes the prebuilt reference profile instead of reparsing the
STLs for every run. It compares generated JSCAD parts against the normalized
reference geometry artifacts:

- bounding box
- volume and surface area
- material ratio
- x-axis section density
- top/side/front silhouettes

## Construction Semantics And Design Heuristics

The scenario now exposes authored construction semantics in:

- [/Users/josh/play/varcad.io/scenarios/laminar-flow-garden-hose-head/index.semantics.js](/Users/josh/play/varcad.io/scenarios/laminar-flow-garden-hose-head/index.semantics.js)

That gives the heuristics layer named assemblies and parts such as:

- `body_assembly`
- `flow_path`
- `diffuser_stage`
- `straightener_stage`
- `lens_holder`

`yarn reference:laminar:heuristics` emits:

- `dist/laminar-flow-garden-hose-head/design-heuristics.json`
- `dist/laminar-flow-garden-hose-head/design-heuristics.md`

The initial heuristic set checks:

- per-part bbox parity
- per-part volume envelope drift
- x-axis section-density similarity
- silhouette similarity
- semantics-level flow-axis and stage-order wiring
- gold-state centerline, stage contact, cap seam, optics alignment, and exit-chamber checks

These workflows are intentionally offline. They are not part of the showcase
widget render path.

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
