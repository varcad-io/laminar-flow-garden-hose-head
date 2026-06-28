const { colorize } = require('@jscad/modeling').colors;
const { union, subtract } = require('@jscad/modeling').booleans;
const { translate, rotate } = require('@jscad/modeling').transforms;
const { cuboid, cylinder, roundedCuboid } = require('@jscad/modeling').primitives;

const referenceDimensions = {
  baseGardena: {
    sourceFile: 'references/printables-1319709/files/model/01-base-gardena.stl',
    size: [145.1, 119, 138.5]
  },
  baseThreeQuarterGht: {
    sourceFile: 'references/printables-1319709/files/model/02-base-34-ght.stl',
    size: [124.994, 119, 138.5]
  },
  cap: {
    sourceFile: 'references/printables-1319709/files/model/03-cap.stl',
    size: [119, 119, 23]
  },
  lensHolder: {
    sourceFile: 'references/printables-1319709/files/model/04-cap-lens-holder.stl',
    size: [80, 45, 14.25]
  },
  stageStraightener: {
    sourceFile: 'references/printables-1319709/files/model/05-stage-straightener.stl',
    size: [95.8, 45, 95.8]
  },
  stageDiffuserAligned: {
    sourceFile: 'references/printables-1319709/files/model/06-stage-diffuser-aligned.stl',
    size: [95.8, 45, 95.8]
  },
  stageDiffuserCrosshatch: {
    sourceFile: 'references/printables-1319709/files/model/08-stage-diffuser-crosshatch.stl',
    size: [95.8, 95.8, 45]
  },
  lens: {
    sourceFile: 'references/printables-1319709/files/model/09-lens-8mm.stl',
    size: [38.2, 38.2, 5.25]
  }
};

const defaultParameters = {
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
  showCutaway: false,
  showStages: true
};

const palette = {
  body: [0.12, 0.42, 0.72, 1],
  cap: [0.08, 0.26, 0.46, 1],
  stages: [0.2, 0.75, 0.68, 1],
  lens: [0.9, 0.82, 0.32, 1],
  hardware: [0.18, 0.18, 0.2, 1],
  cavity: [1, 0.25, 0.18, 0.65]
};

function box(size, center = [0, 0, 0]) {
  return translate(center, cuboid({ size }));
}

function roundedBox(size, center = [0, 0, 0], radius = 2) {
  return translate(center, roundedCuboid({
    size,
    roundRadius: Math.min(radius, ...size.map((value) => value / 2 - 0.1)),
    segments: 16
  }));
}

function baseSizeForVariant(params) {
  if (params.baseVariant === 'threeQuarterGht') {
    return referenceDimensions.baseThreeQuarterGht.size;
  }
  return [
    Number(params.bodyLength) || referenceDimensions.baseGardena.size[0],
    Number(params.bodyWidth) || referenceDimensions.baseGardena.size[1],
    Number(params.bodyHeight) || referenceDimensions.baseGardena.size[2]
  ];
}

function screwPatternPositions(params, z) {
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

function flowBodyShell(params) {
  return base(params);
}

function base(params) {
  const [baseLength, bodyWidth, bodyHeight] = baseSizeForVariant(params);
  const chamberLength = referenceDimensions.cap.size[0] - params.wall * 4;
  const chamberWidth = bodyWidth - params.wall * 5;
  const chamberHeight = bodyHeight - params.wall * 8;

  const outer = roundedBox([baseLength, bodyWidth, bodyHeight], [0, 0, 0], 2.5);
  const mainChamber = box([
    chamberLength,
    chamberWidth,
    chamberHeight
  ], [baseLength / 2 - referenceDimensions.cap.size[0] / 2, 0, params.wall * 2]);

  const stagePocket = roundedBox([
    params.stageDepth + params.wall * 2,
    params.stageWidth + params.wall * 1.2,
    params.stageHeight + params.wall * 1.2
  ], [0, 0, -params.wall], 1.5);

  const outletCut = box([
    params.wall * 4,
    params.lensWidth,
    Math.max(params.lensHeight * 3, 18)
  ], [baseLength / 2 - params.wall, 0, 0]);

  const inletBore = rotate(
    [0, Math.PI / 2, 0],
    cylinder({
      height: params.inletLength + params.wall * 6,
      radius: Math.max(params.inletDiameter / 2 - params.wall, 6),
      segments: 64
    })
  );

  const nutTrapCuts = screwPatternPositions(params, bodyHeight / 2 - params.wall * 2)
    .map((position) => box([params.wall * 2.4, params.wall * 2.4, params.wall * 2.2], position));

  const cutaway = params.showCutaway
    ? box([baseLength + 4, bodyWidth / 2, bodyHeight + 8], [0, -bodyWidth / 4, 8])
    : null;

  const cuts = cutaway
    ? union(mainChamber, stagePocket, outletCut, inletBore, ...nutTrapCuts, cutaway)
    : union(mainChamber, stagePocket, outletCut, inletBore, ...nutTrapCuts);
  return colorize(palette.body, subtract(outer, cuts));
}

function cap(params) {
  const [, bodyWidth, bodyHeight] = baseSizeForVariant(params);
  const [capLength, capWidth, capThickness] = referenceDimensions.cap.size;
  const plate = box([
    capLength,
    capWidth,
    capThickness
  ], [0, 0, bodyHeight / 2 + capThickness / 2 + 1]);

  const rebate = box([
    capLength - params.wall * 3,
    bodyWidth - params.wall * 3,
    capThickness + 2
  ], [0, 0, bodyHeight / 2 + capThickness / 2 + 1]);

  return colorize(palette.cap, subtract(plate, rebate));
}

function inlet(params) {
  const [baseLength, , bodyHeight] = baseSizeForVariant(params);
  const inletOuter = rotate(
    [0, Math.PI / 2, 0],
    cylinder({
      height: params.inletLength,
      radius: params.inletDiameter / 2,
      segments: 64
    })
  );
  const inletBore = rotate(
    [0, Math.PI / 2, 0],
    cylinder({
      height: params.inletLength + 2,
      radius: params.inletDiameter / 2 - params.wall,
      segments: 64
    })
  );

  return colorize(
    palette.body,
    translate(
      [-baseLength / 2 - params.inletLength / 2 + params.wall, 0, bodyHeight * 0.2],
      subtract(inletOuter, inletBore)
    )
  );
}

function stageBlock(params, name, x, color) {
  const block = box([
    params.stageDepth,
    params.stageWidth,
    params.stageHeight
  ], [x, 0, 0]);

  const channelCount = name === 'straightener' ? 9 : 6;
  const channelCuts = [];
  const pitch = params.stageWidth / (channelCount + 1);
  for (let i = 1; i <= channelCount; i += 1) {
    channelCuts.push(box([
      params.stageDepth + 2,
      Math.max(1.2, pitch * 0.35),
      params.stageHeight + 2
    ], [x, -params.stageWidth / 2 + pitch * i, 0]));
  }

  return colorize(color, subtract(block, union(channelCuts)));
}

function stages(params) {
  const spacing = params.stageDepth + params.wall * 2;
  return union(
    stageBlock(params, 'diffuser', -spacing / 2, palette.stages),
    stageBlock(params, 'straightener', spacing / 2, [0.16, 0.62, 0.55, 1])
  );
}

function exitChamberMarker(params) {
  const [baseLength] = baseSizeForVariant(params);
  return colorize(
    palette.cavity,
    box([
      baseLength * 0.22,
      params.stageWidth,
      params.stageHeight
    ], [baseLength * 0.28, 0, 0])
  );
}

function lensHolder(params) {
  const [baseLength] = baseSizeForVariant(params);
  const [holderLength, holderWidth, holderHeight] = referenceDimensions.lensHolder.size;
  const holder = box([
    holderLength,
    holderWidth,
    holderHeight
  ], [baseLength / 2 + holderLength / 2 - params.wall, 0, 0]);

  const slot = box([
    holderLength + 2,
    params.lensWidth,
    params.lensHeight * 1.5
  ], [baseLength / 2 + holderLength / 2 - params.wall, 0, 0]);

  return colorize(palette.cap, subtract(holder, slot));
}

function positionedLens(params) {
  const [baseLength] = baseSizeForVariant(params);
  const [holderLength] = referenceDimensions.lensHolder.size;
  return translate([baseLength / 2 + holderLength - params.wall, 0, 0], lens(params));
}

function screwBosses(params) {
  const [, , bodyHeight] = baseSizeForVariant(params);
  const bosses = screwPatternPositions(params, bodyHeight / 2 + params.wall)
    .map((position) => translate(
      position,
      cylinder({ height: params.wall * 3, radius: params.wall * 1.9, segments: 32 })
    ));

  return colorize(palette.hardware, union(bosses));
}

function straightenerStage(params) {
  const [stageX, stageY, stageZ] = referenceDimensions.stageStraightener.size;
  const block = roundedBox([stageX, stageY, stageZ], [0, 0, 0], 1.2);
  const channels = [];
  const grid = 11;
  const pitchX = stageX / (grid + 1);
  const pitchZ = stageZ / (grid + 1);
  const channelWidth = Math.min(pitchX, pitchZ) * 0.78;

  for (let ix = 1; ix <= grid; ix += 1) {
    for (let iz = 1; iz <= grid; iz += 1) {
      const x = -stageX / 2 + pitchX * ix;
      const z = -stageZ / 2 + pitchZ * iz;
      channels.push(roundedBox([channelWidth, stageY + 2, channelWidth], [x, 0, z], channelWidth * 0.25));
    }
  }

  return colorize([0.16, 0.62, 0.55, 1], subtract(block, union(channels)));
}

function diffuserStage(params) {
  const [stageX, stageY, stageZ] = referenceDimensions.stageDiffuserCrosshatch.size;
  const frame = roundedBox([stageX, stageY, stageZ], [0, 0, 0], 1.2);
  const slots = [];
  const slotCount = 12;
  const slotWidth = 4.8;
  const diagonalLength = Math.sqrt(stageX * stageX + stageY * stageY) + 8;

  for (let i = 0; i < slotCount; i += 1) {
    const offset = -stageY / 2 + ((i + 0.5) * stageY) / slotCount;
    slots.push(rotate([0, 0, Math.PI / 4], box([diagonalLength, slotWidth, stageZ + 2], [0, offset, 0])));
    slots.push(rotate([0, 0, -Math.PI / 4], box([diagonalLength, slotWidth, stageZ + 2], [0, offset, 0])));
  }

  return colorize(palette.stages, subtract(frame, union(slots)));
}

function lens(params) {
  const [lensX, lensY, lensZ] = referenceDimensions.lens.size;
  return colorize(palette.lens, roundedBox([lensX, lensY, lensZ], [0, 0, 0], 1.5));
}

function positionedStages(params) {
  const [stageX, stageY] = referenceDimensions.stageStraightener.size;
  return union(
    translate([-stageY / 2 - params.wall, 0, 0], rotate([0, 0, Math.PI / 2], diffuserStage(params))),
    translate([stageY / 2 + params.wall, 0, 0], straightenerStage(params))
  );
}

function buildAssembly(params) {
  const parts = [
    flowBodyShell(params),
    cap(params),
    inlet(params),
    lensHolder(params),
    positionedLens(params),
    screwBosses(params)
  ];

  if (params.showStages) {
    parts.push(positionedStages(params));
    parts.push(exitChamberMarker(params));
  }

  return union(parts);
}

function buildPart(params) {
  switch (params.part) {
    case 'base':
      return base(params);
    case 'cap':
      return cap(params);
    case 'lensHolder':
      return lensHolder(params);
    case 'straightener':
      return straightenerStage(params);
    case 'diffuser':
      return diffuserStage(params);
    case 'lens':
      return lens(params);
    case 'assembly':
    default:
      return buildAssembly(params);
  }
}

module.exports = {
  defaultParameters,
  referenceDimensions,
  buildAssembly,
  buildPart,
  base,
  flowBodyShell,
  cap,
  inlet,
  stages,
  straightenerStage,
  diffuserStage,
  lensHolder,
  positionedLens,
  lens
};
