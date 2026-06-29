import gardenaBaseStl from "../assets/reference-stls/mk3/01-base-gardena.stl";
import threeQuarterBaseStl from "../assets/reference-stls/mk3/02-base-34-ght.stl";
import capStl from "../assets/reference-stls/mk3/03-cap.stl";
import lensHolderStl from "../assets/reference-stls/mk3/04-cap-lens-holder.stl";
import straightenerStl from "../assets/reference-stls/mk3/05-stage-straightener.stl";
import diffuserStl from "../assets/reference-stls/mk3/08-stage-diffuser-crosshatch.stl";
import lensStl from "../assets/reference-stls/mk3/09-lens-8mm.stl";
import mk22GardenaStl from "../assets/reference-stls/mk2_2/mk22-gardena.stl";
import mk22LensStl from "../assets/reference-stls/mk2_2/lens-8mm.stl";
import mk22ThreeQuarterGhtStl from "../assets/reference-stls/mk2_2/mk22-34ght.stl";
import mk21GardenaStl from "../assets/reference-stls/mk2_1/mk21-gardena.stl";
import mk21LensStl from "../assets/reference-stls/mk2_1/lens-8mm.stl";
import mk21ThreeQuarterGhtStl from "../assets/reference-stls/mk2_1/mk21-34ght.stl";
import mk20GardenaStl from "../assets/reference-stls/mk2_0/mk20-gardena.stl";
import mk20LensStl from "../assets/reference-stls/mk2_0/lens-8mm.stl";
import mk20ThreeQuarterNptStl from "../assets/reference-stls/mk2_0/mk20-34-npt.stl";
import { createReferenceStlAssemblyApi } from "./referenceStlAssemblyCore.js";
import { createReferenceMonolithAssemblyApi } from "./referenceMonolithAssemblyCore.js";
import {
  assertReferenceVersionAvailable,
  defaultParameters,
  referenceBaseVariantOptions,
  referenceVersionOptions,
  resolveReferenceBaseVariant,
} from "./referenceVersionRegistry.js";

const mk3Api = createReferenceStlAssemblyApi({
  baseGardena: gardenaBaseStl,
  baseThreeQuarterGht: threeQuarterBaseStl,
  cap: capStl,
  lensHolder: lensHolderStl,
  straightener: straightenerStl,
  diffuser: diffuserStl,
  lens: lensStl,
});

const referenceApis = Object.freeze({
  mk3: mk3Api,
  mk2_2: createReferenceMonolithAssemblyApi({
    bodyGardena: mk22GardenaStl,
    bodySecondary: mk22ThreeQuarterGhtStl,
    lens: mk22LensStl,
    secondaryBaseVariant: "threeQuarterGht",
  }),
  mk2_1: createReferenceMonolithAssemblyApi({
    bodyGardena: mk21GardenaStl,
    bodySecondary: mk21ThreeQuarterGhtStl,
    lens: mk21LensStl,
    secondaryBaseVariant: "threeQuarterGht",
  }),
  mk2_0: createReferenceMonolithAssemblyApi({
    bodyGardena: mk20GardenaStl,
    bodySecondary: mk20ThreeQuarterNptStl,
    lens: mk20LensStl,
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
