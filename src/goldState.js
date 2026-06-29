export const laminarGoldState = {
  flowAxis: "x",
  bodyCapSeamX: 64.75,
  stageCavityStartX: -40.0,
  primaryCenterline: {
    y: 0,
    z: 0,
  },
  orientation: {
    cap: "z:+180deg",
    diffuser: "identity",
    straightener: "z:+90deg",
    lensHolder: "identity",
    lens: "identity",
  },
  placements: {
    diffuserStage: {
      min: [-25.25, -47.9, -47.9],
      max: [19.75, 47.9, 47.9],
      center: [-2.75, 0, 0],
      size: [45.0, 95.8, 95.8],
    },
    straightenerStage: {
      min: [19.75, -47.9, -47.9],
      max: [64.75, 47.9, 47.9],
      center: [42.25, 0, 0],
      size: [45.0, 95.8, 95.8],
    },
    uniformExitChamber: {
      min: [52.75, -38.08, -46.432],
      max: [64.75, 38.08, 46.432],
      center: [58.75, 0, 0],
      size: [12.0, 76.16, 92.864],
    },
    cap: {
      min: [64.75, -59.5, -59.5],
      max: [87.75, 59.5, 59.5],
      center: [76.25, 0, 0],
      size: [23.0, 119.0, 119.0],
    },
    lensHolder: {
      min: [85.25, -22.5, -40.0],
      max: [99.5, 22.5, 40.0],
      center: [92.375, 0, 0],
      size: [14.25, 45.0, 80.0],
    },
    lens: {
      min: [90.25, -19.1, -19.1],
      max: [95.5, 19.1, 19.1],
      center: [92.875, 0, 0],
      size: [5.25, 38.2, 38.2],
    },
  },
  resolvedGapsMm: {
    entryToDiffuser: 2.0,
    diffuserToStraightener: 0.0,
    straightenerToCapSeam: 0.0,
  },
  heuristics: {
    regressionFloor: {
      minimumWeightedScore: 0.85,
      requiredAssemblyChecks: [
        "gold_state_metadata_present",
        "primary_stack_centerline_alignment",
        "cap_orientation_matches_gold",
        "diffuser_orientation_matches_gold",
        "straightener_orientation_matches_gold",
        "uniform_exit_chamber_geometry_present",
        "diffuser_to_straightener_contact",
        "straightener_to_cap_seam_contact",
        "lens_holder_mount_alignment",
        "lens_seated_alignment",
      ],
    },
  },
};

export function getGoldPlacement(id) {
  return laminarGoldState.placements[id] || null;
}

export function getGoldCenter(id) {
  return getGoldPlacement(id)?.center || [0, 0, 0];
}

export function getGoldConstructedOffset(id) {
  return [...getGoldCenter(id)];
}
