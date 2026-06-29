import modeling from "@jscad/modeling";
import { defaultParameters, referenceDimensions } from "./geometry/dimensions.js";
import { palette } from "./geometry/palette.js";
import { laminarGoldState } from "./goldState.js";

const { union } = modeling.booleans;
const { colorize } = modeling.colors;
const { geom3 } = modeling.geometries;
const { measureBoundingBox } = modeling.measurements;
const { cuboid } = modeling.primitives;
const { rotate, translate } = modeling.transforms;

const RAW_TO_SCENARIO_ROTATION = [0, Math.PI / 2, 0];
const PART_ROTATIONS = Object.freeze({
  cap: [0, 0, Math.PI],
  straightener: [0, 0, Math.PI / 2],
});
const PART_COLORS = Object.freeze({
  base: palette.body,
  cap: palette.cap,
  lensHolder: palette.cap,
  straightener: [0.16, 0.62, 0.55, 1],
  diffuser: palette.stages,
  lens: palette.lens,
});
const PART_IDS = Object.freeze([
  "base",
  "cap",
  "lensHolder",
  "straightener",
  "diffuser",
  "lens",
]);
const EXPLODE_DISTANCE_MULTIPLIER = 2;

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  if (sorted.length === 0) {
    return 0;
  }
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle];
  }
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function bboxFromGeometry(geometry) {
  const bounds = measureBoundingBox(geometry);
  const min = bounds[0];
  const max = bounds[1];
  return {
    min,
    max,
    center: min.map((value, axis) => (value + max[axis]) / 2),
    size: min.map((value, axis) => max[axis] - value),
  };
}

function normalizeRawGeometry(geometry) {
  return rotate(RAW_TO_SCENARIO_ROTATION, geometry);
}

function orientReferencePart(partId, geometry) {
  const rotation = PART_ROTATIONS[partId];
  return rotation ? rotate(rotation, geometry) : geometry;
}

function centerGeometryAtOrigin(geometry) {
  const bbox = bboxFromGeometry(geometry);
  return translate(bbox.center.map((value) => -value), geometry);
}

function colorizePart(partId, geometry) {
  return colorize(PART_COLORS[partId], geometry);
}

function prepareLocalPart(partId, rawGeometry) {
  const normalized = normalizeRawGeometry(rawGeometry);
  const centered = centerGeometryAtOrigin(normalized);
  return colorizePart(partId, centered);
}

function prepareAssemblyPart(partId, rawGeometry) {
  const normalized = normalizeRawGeometry(rawGeometry);
  const oriented = orientReferencePart(partId, normalized);
  const centered = centerGeometryAtOrigin(oriented);
  return colorizePart(partId, centered);
}

function buildUniformExitChamberMarker() {
  const placement = laminarGoldState.placements.uniformExitChamber;
  return colorize(
    palette.cavity,
    translate(
      placement.center,
      cuboid({ size: placement.size }),
    ),
  );
}

function buildExplodeOffsetForGeometry(geometry, anchorCenterX = 0) {
  const center = bboxFromGeometry(geometry).center;
  return [(center[0] - anchorCenterX) * EXPLODE_DISTANCE_MULTIPLIER, 0, 0];
}

function createExplodableScenePart({
  id,
  label,
  group,
  geometry,
  constructedOffset = [0, 0, 0],
  explosionAnchorCenterX = 0,
  referenceOrientation,
  visible = true,
  exportable = true,
}) {
  return {
    id,
    label,
    group,
    geometry,
    transformRole: "explode",
    constructedOffset,
    explosionOffset: buildExplodeOffsetForGeometry(geometry, explosionAnchorCenterX),
    ...(referenceOrientation ? { referenceOrientation } : {}),
    visible,
    exportable,
  };
}

function derivePrimaryCenterline(rawReferenceGeometries) {
  const centers = ["cap", "diffuser", "straightener", "lensHolder"].map((partId) => {
    const bbox = bboxFromGeometry(normalizeRawGeometry(rawReferenceGeometries[partId]));
    return bbox.center;
  });
  return {
    y: median(centers.map((center) => center[1])),
    z: median(centers.map((center) => center[2])),
  };
}

function deriveBaseAssemblyCenter(rawGeometry, primaryCenterline) {
  const bbox = bboxFromGeometry(normalizeRawGeometry(rawGeometry));
  return [
    0,
    0,
    bbox.center[2] - primaryCenterline.z,
  ];
}

function resolveBaseGeometryKey(params) {
  return params.baseVariant === "threeQuarterGht" ? "baseThreeQuarterGht" : "baseGardena";
}

export function createReferenceStlAssemblyApi(rawReferenceGeometries) {
  const primaryCenterline = derivePrimaryCenterline(rawReferenceGeometries);
  const localParts = {
    baseGardena: prepareLocalPart("base", rawReferenceGeometries.baseGardena),
    baseThreeQuarterGht: prepareLocalPart("base", rawReferenceGeometries.baseThreeQuarterGht),
    cap: prepareLocalPart("cap", rawReferenceGeometries.cap),
    lensHolder: prepareLocalPart("lensHolder", rawReferenceGeometries.lensHolder),
    straightener: prepareLocalPart("straightener", rawReferenceGeometries.straightener),
    diffuser: prepareLocalPart("diffuser", rawReferenceGeometries.diffuser),
    lens: prepareLocalPart("lens", rawReferenceGeometries.lens),
  };
  const assemblyParts = {
    baseGardena: prepareAssemblyPart("base", rawReferenceGeometries.baseGardena),
    baseThreeQuarterGht: prepareAssemblyPart("base", rawReferenceGeometries.baseThreeQuarterGht),
    cap: prepareAssemblyPart("cap", rawReferenceGeometries.cap),
    lensHolder: prepareAssemblyPart("lensHolder", rawReferenceGeometries.lensHolder),
    straightener: prepareAssemblyPart("straightener", rawReferenceGeometries.straightener),
    diffuser: prepareAssemblyPart("diffuser", rawReferenceGeometries.diffuser),
    lens: prepareAssemblyPart("lens", rawReferenceGeometries.lens),
  };
  const uniformExitChamber = buildUniformExitChamberMarker();
  const assemblyCenters = {
    baseGardena: deriveBaseAssemblyCenter(rawReferenceGeometries.baseGardena, primaryCenterline),
    baseThreeQuarterGht: deriveBaseAssemblyCenter(
      rawReferenceGeometries.baseThreeQuarterGht,
      primaryCenterline,
    ),
    cap: [...laminarGoldState.placements.cap.center],
    lensHolder: [...laminarGoldState.placements.lensHolder.center],
    straightener: [...laminarGoldState.placements.straightenerStage.center],
    diffuser: [...laminarGoldState.placements.diffuserStage.center],
    lens: [...laminarGoldState.placements.lens.center],
  };

  function base(params = defaultParameters) {
    return localParts[resolveBaseGeometryKey(params)];
  }

  function cap() {
    return localParts.cap;
  }

  function lensHolder() {
    return localParts.lensHolder;
  }

  function straightenerStage() {
    return localParts.straightener;
  }

  function diffuserStage() {
    return localParts.diffuser;
  }

  function lens() {
    return localParts.lens;
  }

  function positionedBase(params = defaultParameters) {
    return translate(assemblyCenters[resolveBaseGeometryKey(params)], assemblyParts[resolveBaseGeometryKey(params)]);
  }

  function positionedCap(params = defaultParameters) {
    return translate(assemblyCenters.cap, assemblyParts.cap);
  }

  function positionedLensHolder(params = defaultParameters) {
    return translate(assemblyCenters.lensHolder, assemblyParts.lensHolder);
  }

  function positionedStraightenerStage(params = defaultParameters) {
    return translate(assemblyCenters.straightener, assemblyParts.straightener);
  }

  function positionedDiffuserStage(params = defaultParameters) {
    return translate(assemblyCenters.diffuser, assemblyParts.diffuser);
  }

  function positionedLens(params = defaultParameters) {
    return translate(assemblyCenters.lens, assemblyParts.lens);
  }

  function positionedStages(params = defaultParameters) {
    return union(positionedDiffuserStage(params), positionedStraightenerStage(params));
  }

  function stages(params = defaultParameters) {
    return union(
      diffuserStage(params),
      translate([referenceDimensions.stageStraightener.size[0] * 1.2, 0, 0], straightenerStage(params)),
    );
  }

  function createAssemblyParts(params = defaultParameters) {
    const explosionAnchorCenterX = bboxFromGeometry(positionedStraightenerStage(params)).center[0];
    const sceneCenterOffset = [-explosionAnchorCenterX, 0, 0];
    return [
      createExplodableScenePart({
        id: "bodyShell",
        label: "Body Shell",
        group: "body",
        geometry: positionedBase(params),
        constructedOffset: sceneCenterOffset,
        explosionAnchorCenterX,
      }),
      createExplodableScenePart({
        id: "diffuserStage",
        label: "Diffuser Stage",
        group: "flowStage",
        geometry: positionedDiffuserStage(params),
        constructedOffset: sceneCenterOffset,
        explosionAnchorCenterX,
        referenceOrientation: laminarGoldState.orientation.diffuser,
        visible: Boolean(params.showStages),
      }),
      createExplodableScenePart({
        id: "straightenerStage",
        label: "Straightener Stage",
        group: "flowStage",
        geometry: positionedStraightenerStage(params),
        constructedOffset: sceneCenterOffset,
        explosionAnchorCenterX,
        referenceOrientation: laminarGoldState.orientation.straightener,
        visible: Boolean(params.showStages),
      }),
      createExplodableScenePart({
        id: "lensHolder",
        label: "Lens Holder",
        group: "optics",
        geometry: positionedLensHolder(params),
        constructedOffset: sceneCenterOffset,
        explosionAnchorCenterX,
        referenceOrientation: laminarGoldState.orientation.lensHolder,
      }),
      createExplodableScenePart({
        id: "lens",
        label: "Lens",
        group: "optics",
        geometry: positionedLens(params),
        constructedOffset: sceneCenterOffset,
        explosionAnchorCenterX,
        referenceOrientation: laminarGoldState.orientation.lens,
      }),
      createExplodableScenePart({
        id: "cap",
        label: "Cap",
        group: "closure",
        geometry: positionedCap(params),
        constructedOffset: sceneCenterOffset,
        explosionAnchorCenterX,
        referenceOrientation: laminarGoldState.orientation.cap,
      }),
    ];
  }

  function buildAssemblyScene(params = defaultParameters) {
    return {
      type: "varcad.scene",
      parts: createAssemblyParts(params).filter((part) => part.visible !== false),
    };
  }

  function toGeometry(scene) {
    if (!scene || !Array.isArray(scene.parts)) {
      return null;
    }
    const geometries = scene.parts
      .map((part) => part?.geometry)
      .filter((geometry) => geom3.isA(geometry));
    return geometries.length > 0 ? union(geometries) : null;
  }

  function buildAssembly(params = defaultParameters) {
    return buildAssemblyScene(params);
  }

  function buildPart(params = defaultParameters) {
    if (!params.part || params.part === "assembly") {
      return buildAssembly(params);
    }

    switch (params.part) {
      case "base":
        return base(params);
      case "cap":
        return cap(params);
      case "lensHolder":
        return lensHolder(params);
      case "straightener":
        return straightenerStage(params);
      case "diffuser":
        return diffuserStage(params);
      case "lens":
        return lens(params);
      case "uniformExitChamber":
        return translate(
          laminarGoldState.placements.uniformExitChamber.center.map((value) => -value),
          uniformExitChamber,
        );
      default:
        return buildAssembly(params);
    }
  }

  const noopFeature = () => null;

  return {
    base,
    buildAssembly,
    buildAssemblyScene,
    buildPart,
    cap,
    createAssemblyParts,
    defaultParameters,
    diffuserStage,
    exitChamberMarker: noopFeature,
    flowBodyShell: base,
    inlet: noopFeature,
    lens,
    lensHolder,
    positionedBase,
    positionedCap,
    positionedDiffuserStage,
    positionedLens,
    positionedLensHolder,
    positionedStages,
    positionedStraightenerStage,
    referenceDimensions,
    screwBosses: noopFeature,
    stages,
    straightenerStage,
    toGeometry,
  };
}
