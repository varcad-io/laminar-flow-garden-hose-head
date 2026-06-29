import { colorize, union, subtract, rotate, box, roundedBox, translate } from '../geometry/primitives.js';
import { referenceDimensions } from '../geometry/dimensions.js';
import { palette } from '../geometry/palette.js';
import { getGoldCenter } from '../goldState.js';

export function stageBlock(params, name, x, color) {
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

export function stages(params) {
  const spacing = params.stageDepth + params.wall * 2;
  return union(
    stageBlock(params, 'diffuser', -spacing / 2, palette.stages),
    stageBlock(params, 'straightener', spacing / 2, [0.16, 0.62, 0.55, 1])
  );
}

export function straightenerStage(params) {
  const [stageX, stageY, stageZ] = referenceDimensions.stageStraightener.size;
  const block = roundedBox([stageX, stageY, stageZ], [0, 0, 0], 1.2);
  const channels = [];
  const grid = 9;
  const pitchX = stageX / (grid + 1);
  const pitchZ = stageZ / (grid + 1);
  const channelWidth = Math.min(pitchX, pitchZ) * 0.86;

  for (let ix = 1; ix <= grid; ix += 1) {
    for (let iz = 1; iz <= grid; iz += 1) {
      const x = -stageX / 2 + pitchX * ix;
      const z = -stageZ / 2 + pitchZ * iz;
      channels.push(roundedBox([channelWidth, stageY + 2, channelWidth], [x, 0, z], channelWidth * 0.25));
    }
  }

  return colorize([0.16, 0.62, 0.55, 1], subtract(block, union(channels)));
}

export function diffuserStage(params) {
  const [stageX, stageY, stageZ] = referenceDimensions.stageDiffuserCrosshatch.size;
  const frame = roundedBox([stageX, stageY, stageZ], [0, 0, 0], 1.2);
  const slots = [];
  const slotCount = 13;
  const slotWidth = 4.1;
  const diagonalLength = Math.sqrt(stageX * stageX + stageY * stageY) + 8;

  for (let i = 0; i < slotCount; i += 1) {
    const offset = -stageY / 2 + ((i + 0.5) * stageY) / slotCount;
    slots.push(rotate([Math.PI / 4, 0, 0], box([diagonalLength, slotWidth, stageZ + 2], [0, offset, 0])));
    slots.push(rotate([-Math.PI / 4, 0, 0], box([diagonalLength, slotWidth, stageZ + 2], [0, offset, 0])));
  }

  return colorize(palette.stages, subtract(frame, union(slots)));
}

export function positionedDiffuserStage(params) {
  return translate(getGoldCenter("diffuserStage"), diffuserStage(params));
}

export function positionedStraightenerStage(params) {
  return translate(
    getGoldCenter("straightenerStage"),
    rotate([0, 0, -Math.PI / 2], straightenerStage(params))
  );
}

export function positionedStages(params) {
  return union(
    positionedDiffuserStage(params),
    positionedStraightenerStage(params)
  );
}
