# STEP Inspection

Source file:

`references/printables-1319709/files/model/12-Laminar Flow v131.step`

Initial observations:

- The file is ASCII STEP, ISO-10303-21.
- It was exported by Autodesk Translation Framework v14.10.0.0.
- The schema is `AUTOMOTIVE_DESIGN`.
- The file is large enough that exact feature extraction should be handled by a STEP parser rather than ad hoc string matching.
- It contains many B-spline surfaces as well as analytic entities, which means the lens/nozzle and transition surfaces are likely best derived from source sketches or sectional profiles rather than inferred only from STL triangles.

Practical next use:

- Use the STEP file to identify exact profile sketches, inlet features, lens/nozzle surfaces, and chamber boundaries.
- Keep STL measurement reports for fast bounding-box and volume checks.
- Use the STEP as the source of truth for feature placement once a reliable parser/viewer workflow is chosen.

