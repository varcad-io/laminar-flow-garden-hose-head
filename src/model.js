const { colorize } = require('@jscad/modeling').colors;
const { union, subtract } = require('@jscad/modeling').booleans;
const { translate, rotate } = require('@jscad/modeling').transforms;
const { cuboid, cylinder } = require('@jscad/modeling').primitives;

const defaultParameters = {
  bodyLength: 170,
  bodyWidth: 105,
  bodyHeight: 62,
  wall: 3.5,
  inletDiameter: 27,
  inletLength: 42,
  stageWidth: 68,
  stageHeight: 38,
  stageDepth: 14,
  lensWidth: 58,
  lensHeight: 18,
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

function flowBodyShell(params) {
  const outer = box([params.bodyLength, params.bodyWidth, params.bodyHeight]);
  const inner = box([
    params.bodyLength - params.wall * 2,
    params.bodyWidth - params.wall * 2,
    params.bodyHeight - params.wall * 2
  ], [0, 0, params.wall]);

  const outletCut = box([
    params.wall * 4,
    params.lensWidth,
    params.lensHeight
  ], [params.bodyLength / 2 - params.wall, 0, 4]);

  const cutaway = params.showCutaway
    ? box([params.bodyLength + 4, params.bodyWidth / 2, params.bodyHeight + 8], [0, -params.bodyWidth / 4, 8])
    : null;

  const cuts = cutaway ? union(inner, outletCut, cutaway) : union(inner, outletCut);
  return colorize(palette.body, subtract(outer, cuts));
}

function cap(params) {
  const capThickness = params.wall * 2.4;
  const plate = box([
    params.bodyLength + params.wall * 2,
    params.bodyWidth + params.wall * 2,
    capThickness
  ], [0, 0, params.bodyHeight / 2 + capThickness / 2 + 1]);

  const rebate = box([
    params.bodyLength - params.wall * 3,
    params.bodyWidth - params.wall * 3,
    capThickness + 2
  ], [0, 0, params.bodyHeight / 2 + capThickness / 2 + 1]);

  return colorize(palette.cap, subtract(plate, rebate));
}

function inlet(params) {
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
      [-params.bodyLength / 2 - params.inletLength / 2 + params.wall, 0, params.bodyHeight * 0.2],
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
  return colorize(
    palette.cavity,
    box([
      params.bodyLength * 0.22,
      params.stageWidth,
      params.stageHeight
    ], [params.bodyLength * 0.28, 0, 0])
  );
}

function lensHolder(params) {
  const holder = box([
    params.wall * 5,
    params.lensWidth + params.wall * 5,
    params.lensHeight + params.wall * 5
  ], [params.bodyLength / 2 + params.wall * 2, 0, 0]);

  const slot = box([
    params.wall * 5 + 2,
    params.lensWidth,
    params.lensHeight
  ], [params.bodyLength / 2 + params.wall * 2, 0, 0]);

  const lens = box([
    params.wall * 1.5,
    params.lensWidth,
    params.lensHeight * 0.65
  ], [params.bodyLength / 2 + params.wall * 5.5, 0, 0]);

  return union(
    colorize(palette.cap, subtract(holder, slot)),
    colorize(palette.lens, lens)
  );
}

function screwBosses(params) {
  const bosses = [];
  const x = params.bodyLength / 2 - params.wall * 4;
  const y = params.bodyWidth / 2 - params.wall * 4;
  const z = params.bodyHeight / 2 + params.wall;

  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      bosses.push(translate(
        [sx * x, sy * y, z],
        cylinder({ height: params.wall * 3, radius: params.wall * 1.9, segments: 32 })
      ));
    }
  }

  return colorize(palette.hardware, union(bosses));
}

function buildAssembly(params) {
  const parts = [
    flowBodyShell(params),
    cap(params),
    inlet(params),
    lensHolder(params),
    screwBosses(params)
  ];

  if (params.showStages) {
    parts.push(stages(params));
    parts.push(exitChamberMarker(params));
  }

  return union(parts);
}

module.exports = {
  defaultParameters,
  buildAssembly,
  flowBodyShell,
  cap,
  inlet,
  stages,
  lensHolder
};
