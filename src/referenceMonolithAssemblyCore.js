import modeling from "@jscad/modeling";
import { defaultParameters } from "./geometry/dimensions.js";
import { palette } from "./geometry/palette.js";

const { union } = modeling.booleans;
const { colorize } = modeling.colors;
const { geom3 } = modeling.geometries;
const { measureBoundingBox } = modeling.measurements;
const { rotate, translate } = modeling.transforms;

const RAW_TO_SCENARIO_ROTATION = [0, Math.PI / 2, 0];
const EXPLODE_DISTANCE_MULTIPLIER = 2;

function bboxFromGeometry(geometry) {
  const bounds = measureBoundingBox(geometry);
  const min = bounds[0];
  const max = bounds[1];
  return {
    min,
    max,
    center: min.map((value, axis) => (value + max[axis]) / 2),
  };
}

function normalizeRawGeometry(geometry) {
  return rotate(RAW_TO_SCENARIO_ROTATION, geometry);
}

function centerGeometryAtOrigin(geometry) {
  const bbox = bboxFromGeometry(geometry);
  return translate(bbox.center.map((value) => -value), geometry);
}

function prepareGeometry(rawGeometry, color) {
  return colorize(
    color,
    centerGeometryAtOrigin(normalizeRawGeometry(rawGeometry)),
  );
}

function buildExplodeOffsetForGeometry(geometry, anchorCenterX = 0) {
  const center = bboxFromGeometry(geometry).center;
  return [(center[0] - anchorCenterX) * EXPLODE_DISTANCE_MULTIPLIER, 0, 0];
}

function createScenePart({
  id,
  label,
  group,
  geometry,
  constructedOffset = [0, 0, 0],
  explosionAnchorCenterX = 0,
  visible = true,
}) {
  return {
    id,
    label,
    group,
    geometry,
    transformRole: "explode",
    constructedOffset,
    explosionOffset: buildExplodeOffsetForGeometry(geometry, explosionAnchorCenterX),
    visible,
    exportable: true,
  };
}

function resolveBodyKey(params, secondaryBaseVariant) {
  return params.baseVariant === secondaryBaseVariant ? "secondary" : "gardena";
}

export function createReferenceMonolithAssemblyApi({
  bodyGardena,
  bodySecondary = null,
  lens = null,
  secondaryBaseVariant = "threeQuarterGht",
}) {
  const bodyParts = {
    gardena: prepareGeometry(bodyGardena, palette.body),
    secondary: prepareGeometry(bodySecondary || bodyGardena, palette.body),
  };
  const lensGeometry = lens ? prepareGeometry(lens, palette.lens) : null;

  function base(params = defaultParameters) {
    return bodyParts[resolveBodyKey(params, secondaryBaseVariant)] || bodyParts.gardena;
  }

  function buildAssemblyScene(params = defaultParameters) {
    const baseGeometry = base(params);
    const explosionAnchorCenterX = bboxFromGeometry(baseGeometry).center[0];
    const sceneCenterOffset = [-explosionAnchorCenterX, 0, 0];
    return {
      type: "varcad.scene",
      parts: [
        createScenePart({
          id: "bodyShell",
          label: "Body Shell",
          group: "body",
          geometry: baseGeometry,
          constructedOffset: sceneCenterOffset,
          explosionAnchorCenterX,
        }),
      ],
    };
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
      case "lens":
        return lensGeometry || base(params);
      default:
        return buildAssembly(params);
    }
  }

  function createAssemblyParts(params = defaultParameters) {
    return buildAssemblyScene(params).parts;
  }

  function toGeometry(scene) {
    if (!scene || !Array.isArray(scene.parts)) {
      return null;
    }
    const geometries = scene.parts
      .map((part) => part?.geometry)
      .filter((geometry) => geom3.isA(geometry));
    if (geometries.length === 0) {
      return null;
    }
    if (geometries.length === 1) {
      return geometries[0];
    }
    return union(...geometries);
  }

  return {
    base,
    buildAssembly,
    buildAssemblyScene,
    buildPart,
    createAssemblyParts,
    lens: () => lensGeometry,
    toGeometry,
  };
}
