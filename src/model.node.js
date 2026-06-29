import fs from "node:fs";
import path from "node:path";
import { deserialize as deserializeStl } from "@jscad/stl-deserializer";
import { createReferenceStlAssemblyApi } from "./referenceStlAssemblyCore.js";
import { createReferenceMonolithAssemblyApi } from "./referenceMonolithAssemblyCore.js";
import {
  assertReferenceVersionAvailable,
  defaultParameters,
  referenceBaseVariantOptions,
  referenceVersionOptions,
  resolveReferenceBaseVariant,
} from "./referenceVersionRegistry.js";

const repoRoot = path.resolve(import.meta.dirname, "../../..");

function unwrapGeometry(value) {
  if (Array.isArray(value)) {
    return value.find(Boolean) || null;
  }
  return value || null;
}

function loadStlGeometry(relativePath) {
  const absolutePath = path.resolve(repoRoot, relativePath);
  const geometry = unwrapGeometry(
    deserializeStl({ output: "geometry" }, fs.readFileSync(absolutePath)),
  );
  if (!geometry) {
    throw new Error(`Unable to deserialize STL geometry from ${relativePath}`);
  }
  return geometry;
}

const mk3Api = createReferenceStlAssemblyApi({
  baseGardena: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/01-base-gardena.stl"),
  baseThreeQuarterGht: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/02-base-34-ght.stl"),
  cap: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/03-cap.stl"),
  lensHolder: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/04-cap-lens-holder.stl"),
  straightener: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/05-stage-straightener.stl"),
  diffuser: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/08-stage-diffuser-crosshatch.stl"),
  lens: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/09-lens-8mm.stl"),
});

const referenceApis = Object.freeze({
  mk3: mk3Api,
  mk2_2: createReferenceMonolithAssemblyApi({
    bodyGardena: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_2/mk22-gardena.stl"),
    bodySecondary: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_2/mk22-34ght.stl"),
    lens: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_2/lens-8mm.stl"),
    secondaryBaseVariant: "threeQuarterGht",
  }),
  mk2_1: createReferenceMonolithAssemblyApi({
    bodyGardena: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_1/mk21-gardena.stl"),
    bodySecondary: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_1/mk21-34ght.stl"),
    lens: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_1/lens-8mm.stl"),
    secondaryBaseVariant: "threeQuarterGht",
  }),
  mk2_0: createReferenceMonolithAssemblyApi({
    bodyGardena: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_0/mk20-gardena.stl"),
    bodySecondary: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_0/mk20-34-npt.stl"),
    lens: loadStlGeometry("scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_0/lens-8mm.stl"),
    secondaryBaseVariant: "threeQuarterNpt",
  }),
});

function resolveReferenceApi(params = {}) {
  const version = typeof params === "string"
    ? params
    : assertReferenceVersionAvailable(params);
  return referenceApis[version] || mk3Api;
}

function withResolvedReferenceSelection(params = {}) {
  const version = assertReferenceVersionAvailable(params);
  const resolved = {
    ...defaultParameters,
    ...params,
    version,
  };
  return {
    ...resolved,
    baseVariant: resolveReferenceBaseVariant(resolved),
  };
}

export function buildAssemblyScene(params = {}) {
  const resolvedParams = withResolvedReferenceSelection(params);
  return resolveReferenceApi(resolvedParams).buildAssemblyScene(resolvedParams);
}

export function buildAssembly(params = {}) {
  const resolvedParams = withResolvedReferenceSelection(params);
  return resolveReferenceApi(resolvedParams).buildAssembly(resolvedParams);
}

export function buildPart(params = {}) {
  const resolvedParams = withResolvedReferenceSelection(params);
  return resolveReferenceApi(resolvedParams).buildPart(resolvedParams);
}

export function createAssemblyParts(params = {}) {
  const resolvedParams = withResolvedReferenceSelection(params);
  return resolveReferenceApi(resolvedParams).createAssemblyParts(resolvedParams);
}

export const {
  base,
  cap,
  diffuserStage,
  exitChamberMarker,
  flowBodyShell,
  inlet,
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
  screwBosses,
  stages,
  straightenerStage,
  toGeometry,
} = mk3Api;

export {
  defaultParameters,
  referenceBaseVariantOptions,
  referenceVersionOptions,
};
