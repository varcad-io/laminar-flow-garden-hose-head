export const referenceDimensions = {
  baseGardena: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/01-base-gardena.stl',
    size: [145.1, 119, 138.5]
  },
  baseThreeQuarterGht: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/02-base-34-ght.stl',
    size: [124.994, 119, 138.5]
  },
  cap: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/03-cap.stl',
    size: [119, 119, 23]
  },
  lensHolder: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/04-cap-lens-holder.stl',
    size: [80, 45, 14.25]
  },
  stageStraightener: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/05-stage-straightener.stl',
    size: [95.8, 45, 95.8]
  },
  stageDiffuserAligned: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/06-stage-diffuser-aligned.stl',
    size: [95.8, 45, 95.8]
  },
  stageDiffuserCrosshatch: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/08-stage-diffuser-crosshatch.stl',
    size: [95.8, 95.8, 45]
  },
  lens: {
    sourceFile: 'scenarios/laminar-flow-garden-hose-head/assets/reference-stls/mk3/09-lens-8mm.stl',
    size: [38.2, 38.2, 5.25]
  }
};

export const defaultParameters = {
  bodyLength: referenceDimensions.baseGardena.size[0],
  bodyWidth: referenceDimensions.baseGardena.size[1],
  bodyHeight: referenceDimensions.baseGardena.size[2],
  wall: 3.5,
  inletDiameter: 27,
  inletLength: 42,
  stageWidth: referenceDimensions.stageStraightener.size[0],
  stageHeight: referenceDimensions.stageStraightener.size[2],
  stageDepth: referenceDimensions.stageStraightener.size[1],
  lensWidth: referenceDimensions.lens.size[0],
  lensHeight: referenceDimensions.lens.size[2],
  baseVariant: 'gardena',
  part: 'assembly',
  explode: 0,
  showCutaway: false,
  showStages: true
};

export function baseSizeForVariant(params) {
  if (params.baseVariant === 'threeQuarterGht') {
    return referenceDimensions.baseThreeQuarterGht.size;
  }
  return [
    Number(params.bodyLength) || referenceDimensions.baseGardena.size[0],
    Number(params.bodyWidth) || referenceDimensions.baseGardena.size[1],
    Number(params.bodyHeight) || referenceDimensions.baseGardena.size[2]
  ];
}

export function screwPatternPositions(params, z) {
  const [, bodyWidth] = baseSizeForVariant(params);
  const bodyLength = referenceDimensions.cap.size[0];
  const inset = params.wall * 3.5;
  const x = bodyLength / 2 - inset;
  const y = bodyWidth / 2 - inset;

  return [
    [-x, -y, z],
    [0, -y, z],
    [x, -y, z],
    [-x, y, z],
    [0, y, z],
    [x, y, z],
    [-x, 0, z],
    [x, 0, z]
  ];
}
