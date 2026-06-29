import { defaultParameters as geometryDefaultParameters } from "./geometry/dimensions.js";

export const referenceVersionOptions = Object.freeze([
  {
    id: "mk3",
    caption: "mk3",
    sourceModelUrl:
      "https://www.printables.com/model/1319709-laminar-flow-garden-hose-head-mk3",
    staged: true,
  },
  {
    id: "mk2_2",
    caption: "mk2.2",
    sourceModelUrl:
      "https://www.printables.com/model/1315244-laminar-flow-garden-hose-head-mk2/files",
    staged: true,
  },
  {
    id: "mk2_1",
    caption: "mk2.1",
    sourceModelUrl:
      "https://www.printables.com/model/1315244-laminar-flow-garden-hose-head-mk2/files",
    staged: true,
  },
  {
    id: "mk2_0",
    caption: "mk2.0",
    sourceModelUrl:
      "https://www.printables.com/model/1315244-laminar-flow-garden-hose-head-mk2/files",
    staged: true,
  },
]);

export const referenceBaseVariantOptions = Object.freeze([
  { id: "gardena", caption: "Gardena base" },
  { id: "threeQuarterGht", caption: "3/4 GHT base" },
  { id: "threeQuarterNpt", caption: "3/4 NPT base" },
]);

export const referenceVersionRegistry = Object.freeze({
  mk3: {
    id: "mk3",
    staged: true,
    assetRoot: "scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3",
    sourceModelUrl:
      "https://www.printables.com/model/1319709-laminar-flow-garden-hose-head-mk3",
    expectedBaseVariants: ["gardena", "threeQuarterGht"],
    stagedFiles: [
      "01-base-gardena.stl",
      "02-base-34-ght.stl",
      "03-cap.stl",
      "04-cap-lens-holder.stl",
      "05-stage-straightener.stl",
      "08-stage-diffuser-crosshatch.stl",
      "09-lens-8mm.stl",
    ],
  },
  mk2_2: {
    id: "mk2_2",
    staged: true,
    assetRoot: "scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_2",
    sourceModelUrl:
      "https://www.printables.com/model/1315244-laminar-flow-garden-hose-head-mk2/files",
    expectedBaseVariants: ["gardena", "threeQuarterGht"],
    stagedFiles: [
      "mk22-gardena.stl",
      "mk22-34ght.stl",
      "lens-6mm.stl",
      "lens-7mm.stl",
      "lens-8mm.stl",
    ],
  },
  mk2_1: {
    id: "mk2_1",
    staged: true,
    assetRoot: "scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_1",
    sourceModelUrl:
      "https://www.printables.com/model/1315244-laminar-flow-garden-hose-head-mk2/files",
    expectedBaseVariants: ["gardena", "threeQuarterGht"],
    stagedFiles: [
      "mk21-gardena.stl",
      "mk21-34ght.stl",
      "lens-6mm.stl",
      "lens-7mm.stl",
      "lens-8mm.stl",
    ],
  },
  mk2_0: {
    id: "mk2_0",
    staged: true,
    assetRoot: "scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk2_0",
    sourceModelUrl:
      "https://www.printables.com/model/1315244-laminar-flow-garden-hose-head-mk2/files",
    expectedBaseVariants: ["gardena", "threeQuarterNpt"],
    stagedFiles: [
      "mk20-gardena.stl",
      "mk20-34-npt.stl",
      "lens-6mm.stl",
      "lens-7mm.stl",
      "lens-8mm.stl",
    ],
  },
});

export const defaultParameters = Object.freeze({
  version: "mk3",
  ...geometryDefaultParameters,
});

export function resolveReferenceVersion(params = {}) {
  const requestedVersion =
    typeof params.version === "string" && params.version.trim()
      ? params.version.trim()
      : defaultParameters.version;
  return referenceVersionRegistry[requestedVersion]
    ? requestedVersion
    : defaultParameters.version;
}

export function resolveReferenceBaseVariant(params = {}) {
  const requestedVersion = resolveReferenceVersion(params);
  const requestedBaseVariant =
    typeof params.baseVariant === "string" && params.baseVariant.trim()
      ? params.baseVariant.trim()
      : defaultParameters.baseVariant;
  const allowedBaseVariants =
    referenceVersionRegistry[requestedVersion]?.expectedBaseVariants || [];
  if (allowedBaseVariants.includes(requestedBaseVariant)) {
    return requestedBaseVariant;
  }
  return allowedBaseVariants[0] || defaultParameters.baseVariant;
}

export function assertReferenceVersionAvailable(params = {}) {
  const version = resolveReferenceVersion(params);
  const definition = referenceVersionRegistry[version];
  if (definition?.staged) {
    return version;
  }
  const expectedFiles = (definition?.expectedFiles || definition?.stagedFiles || []).join(", ");
  throw new Error(
    `Reference version ${version} is not staged locally yet. ` +
      `Expected files under ${definition?.assetRoot || "the scenario asset root"}: ${expectedFiles}`,
  );
}
