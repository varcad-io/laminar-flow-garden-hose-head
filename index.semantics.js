import { defineConstructionSemantics } from "@varcad/cad-runtime-jscad";
import { defaultParameters } from "./src/geometry/dimensions.js";
import { laminarGoldState } from "./src/goldState.js";

const laminarGroups = [
  {
    id: "laminar_hose_head",
    level: "macro",
    role: "laminar_hose_head",
    children: ["body_assembly", "flow_path", "optics_assembly", "closure_assembly", "hardware"],
    styleTags: ["laminar", "hose_head", "staged_flow", "printable"],
  },
  {
    id: "body_assembly",
    level: "assembly",
    role: "body_assembly",
    parent: "laminar_hose_head",
    children: ["body_shell", "inlet"],
    styleTags: ["pressure_body", "side_feed"],
  },
  {
    id: "flow_path",
    level: "assembly",
    role: "flow_path_stack",
    parent: "laminar_hose_head",
    children: ["diffuser_stage", "straightener_stage", "uniform_exit_chamber", "lens_holder", "lens"],
    styleTags: ["staged_flow", "x_axis"],
  },
  {
    id: "optics_assembly",
    level: "assembly",
    role: "optics_assembly",
    parent: "laminar_hose_head",
    children: ["lens_holder", "lens"],
    styleTags: ["retention", "outlet"],
  },
  {
    id: "closure_assembly",
    level: "assembly",
    role: "closure_assembly",
    parent: "laminar_hose_head",
    children: ["cap"],
    styleTags: ["closure", "serviceable"],
  },
  {
    id: "hardware",
    level: "assembly",
    role: "hardware",
    parent: "laminar_hose_head",
    children: ["screw_bosses"],
    styleTags: ["fasteners"],
  },
  {
    id: "body_shell",
    level: "part",
    role: "body_shell",
    parent: "body_assembly",
    referencePartId: "base",
    expectedColor: "body_blue",
    styleTags: ["primary_mass", "pressure_body"],
  },
  {
    id: "inlet",
    level: "part",
    role: "side_feed_inlet",
    parent: "body_assembly",
    attachedTo: "body_shell",
    styleTags: ["inlet", "perpendicular_feed"],
  },
  {
    id: "diffuser_stage",
    level: "part",
    role: "diffuser_stage",
    parent: "flow_path",
    referencePartId: "diffuser",
    expectedColor: "stage_teal",
    styleTags: ["crosshatch", "pressure_drop"],
  },
  {
    id: "straightener_stage",
    level: "part",
    role: "straightener_stage",
    parent: "flow_path",
    referencePartId: "straightener",
    expectedColor: "stage_green",
    styleTags: ["grid", "laminarization"],
  },
  {
    id: "lens_holder",
    level: "part",
    role: "lens_holder",
    parent: "optics_assembly",
    referencePartId: "lensHolder",
    expectedColor: "holder_blue",
    styleTags: ["retention", "serviceable"],
  },
  {
    id: "lens",
    level: "part",
    role: "exit_lens",
    parent: "optics_assembly",
    referencePartId: "lens",
    expectedColor: "lens_clear",
    styleTags: ["outlet", "spray_shaping"],
  },
  {
    id: "cap",
    level: "part",
    role: "cap",
    parent: "closure_assembly",
    referencePartId: "cap",
    expectedColor: "cap_blue",
    styleTags: ["closure", "top_access"],
  },
  {
    id: "screw_bosses",
    level: "part",
    role: "fastener_bosses",
    parent: "hardware",
    attachedTo: "body_shell",
    styleTags: ["hardware", "retention"],
  },
  {
    id: "entry_chamber",
    level: "feature",
    role: "entry_chamber",
    parent: "body_shell",
    attachedTo: "body_shell",
    styleTags: ["entry_volume", "pressure_buffer"],
  },
  {
    id: "diffuser_zone",
    level: "feature",
    role: "diffuser_zone",
    parent: "diffuser_stage",
    attachedTo: "diffuser_stage",
    styleTags: ["diffuser", "crosshatch", "staged_flow"],
  },
  {
    id: "straightener_zone",
    level: "feature",
    role: "straightener_zone",
    parent: "straightener_stage",
    attachedTo: "straightener_stage",
    styleTags: ["straightener", "grid", "staged_flow"],
  },
  {
    id: "uniform_exit_chamber",
    level: "feature",
    role: "uniform_exit_chamber",
    parent: "body_shell",
    attachedTo: "body_shell",
    styleTags: ["exit_volume", "uniform", "stabilization"],
  },
  {
    id: "lens_slot",
    level: "feature",
    role: "lens_slot",
    parent: "lens_holder",
    attachedTo: "lens_holder",
    styleTags: ["alignment", "retention"],
  },
];

export const getConstructionSemantics = defineConstructionSemantics((builder, variables = {}) => {
  const params = { ...defaultParameters, ...variables };
  const bodyLength = Number(params.bodyLength) || defaultParameters.bodyLength;
  const bodyWidth = Number(params.bodyWidth) || defaultParameters.bodyWidth;
  const bodyHeight = Number(params.bodyHeight) || defaultParameters.bodyHeight;
  const wall = Number(params.wall) || defaultParameters.wall;
  const stageDepth = Number(params.stageDepth) || defaultParameters.stageDepth;
  const diffuserCenterX = laminarGoldState.placements.diffuserStage.center[0];
  const straightenerCenterX = laminarGoldState.placements.straightenerStage.center[0];
  const uniformExitChamberCenterX = laminarGoldState.placements.uniformExitChamber.center[0];
  const capCenterX = laminarGoldState.placements.cap.center[0];
  const lensHolderCenterX = laminarGoldState.placements.lensHolder.center[0];
  const lensCenterX = laminarGoldState.placements.lens.center[0];
  const capSeamX = laminarGoldState.bodyCapSeamX;

  builder.setModel({
    modelId: "laminar_flow_garden_hose_head",
    metadata: {
      dominantMirrorAxisHint: "x",
      flowAxis: "x",
      sourceOfTruthManifest:
        "/docs/laminar-flow-garden-hose-head-mk3-reference-manifest.json",
      positionalSpecPlan:
        "/docs/laminar-flow-garden-hose-head-mk3-positional-spec-plan.md",
      positionalSpec:
        "/docs/laminar-flow-garden-hose-head-mk3-positional-spec.v1.json",
      positionalGoldState:
        "/docs/laminar-flow-garden-hose-head-mk3-gold-state.v1.json",
      heuristicsSourceOfTruth:
        "/docs/laminar-flow-garden-hose-head-mk3-gold-state.v1.json",
      sourceOfTruthProfile:
        "/dist/laminar-flow-garden-hose-head/reference-profile.json",
    },
  });

  builder.parameter({
    id: "explode",
    type: "float",
    value: Number(params.explode) || 0,
    minimum: 0,
    maximum: 1,
  });

  builder.parameter({
    id: "baseVariant",
    type: "choice",
    value: params.baseVariant || defaultParameters.baseVariant,
  });

  builder.parameter({
    id: "version",
    type: "choice",
    value: params.version || "mk3",
  });

  for (const group of laminarGroups) {
    builder.group(group);
  }

  builder.anchor({
    id: "body_center",
    on: "body_shell",
    zone: "center_mass",
    value: [0, 0, 0],
  });
  builder.anchor({
    id: "inlet_axis_center",
    on: "inlet",
    zone: "side_feed_center",
    value: [-bodyLength * 0.25, 0, 0],
  });
  builder.anchor({
    id: "diffuser_center",
    on: "diffuser_stage",
    zone: "flow_center",
    value: [diffuserCenterX, 0, 0],
  });
  builder.anchor({
    id: "diffuser_zone_center",
    on: "diffuser_zone",
    zone: "flow_center",
    value: [diffuserCenterX, 0, 0],
  });
  builder.anchor({
    id: "straightener_center",
    on: "straightener_stage",
    zone: "flow_center",
    value: [straightenerCenterX, 0, 0],
  });
  builder.anchor({
    id: "straightener_zone_center",
    on: "straightener_zone",
    zone: "flow_center",
    value: [straightenerCenterX, 0, 0],
  });
  builder.anchor({
    id: "stack_centerline",
    on: "flow_path",
    zone: "shared_centerline_yz",
    value: [0, 0],
  });
  builder.anchor({
    id: "uniform_exit_chamber_center",
    on: "uniform_exit_chamber",
    zone: "flow_center",
    value: [uniformExitChamberCenterX, 0, 0],
  });
  builder.anchor({
    id: "cap_mount_center",
    on: "cap",
    zone: "top_mount_center",
    value: [capCenterX, 0, 0],
  });
  builder.anchor({
    id: "lens_holder_center",
    on: "lens_holder",
    zone: "top_mount_center",
    value: [lensHolderCenterX, 0, 0],
  });
  builder.anchor({
    id: "lens_plane_center",
    on: "lens",
    zone: "outlet_center",
    value: [lensCenterX, 0, 0],
  });
  builder.anchor({
    id: "cap_center",
    on: "cap",
    zone: "closure_center",
    value: [capCenterX, 0, 0],
  });

  builder.landmark({
    id: "body_envelope",
    on: "body_shell",
    zone: "bbox",
    value: [bodyLength, bodyWidth, bodyHeight],
  });
  builder.landmark({
    id: "flow_stage_depth",
    on: "flow_path",
    zone: "x_span",
    value: stageDepth,
  });
  builder.landmark({
    id: "shared_stack_centerline",
    on: "flow_path",
    zone: "yz_centerline",
    value: [0, 0],
  });

  builder.relation({
    type: "feeds_into",
    from: "inlet",
    to: "diffuser_stage",
    axis: "x",
  });
  builder.relation({
    type: "feeds_into",
    from: "diffuser_stage",
    to: "straightener_stage",
    axis: "x",
  });
  builder.relation({
    type: "feeds_into",
    from: "straightener_stage",
    to: "uniform_exit_chamber",
    axis: "x",
  });
  builder.relation({
    type: "feeds_into",
    from: "uniform_exit_chamber",
    to: "lens_holder",
    axis: "x",
  });
  builder.relation({
    type: "terminates_at",
    from: "lens_holder",
    to: "lens",
    axis: "x",
  });
  builder.relation({
    type: "sealed_by",
    from: "body_shell",
    to: "cap",
  });
  builder.relation({
    type: "centered_on",
    from: "cap",
    to: "body_shell",
    axes: ["y", "z"],
  });
  builder.relation({
    type: "centered_on",
    from: "lens_holder",
    to: "cap",
    axes: ["y", "z"],
  });
  builder.relation({
    type: "centered_on",
    from: "lens",
    to: "lens_holder",
    axes: ["y", "z"],
  });
  builder.relation({
    type: "mounted_on",
    from: "lens_holder",
    to: "cap",
    plane: "top_mount_plane",
  });
  builder.relation({
    type: "seated_in",
    from: "lens",
    to: "lens_slot",
    plane: "lens_slot_plane",
  });
  builder.relation({
    type: "side_feed_into",
    from: "inlet",
    to: "entry_chamber",
    axis: "transverse_to_x",
  });

  return builder;
});

export const getLaminarConstructionSemantics = getConstructionSemantics;
