import modeling from '@jscad/modeling';
import { colorize, union, subtract, cylinder, box, roundedBox, translate } from '../geometry/primitives.js';
import { baseSizeForVariant, referenceDimensions, screwPatternPositions } from '../geometry/dimensions.js';
import { palette } from '../geometry/palette.js';
import { laminarGoldState } from '../goldState.js';

const { hullChain } = modeling.hulls;

const uniformExitChamberShape = Object.freeze({
  xSpanFractionOfBodyHeight: 12 / referenceDimensions.baseGardena.size[2],
  straightenerSideYFractionOfBodyWidth: 0.64,
  straightenerSideZFractionOfBodyLength: 0.64,
  capSideYFractionOfBodyWidth: 0.42,
  capSideZFractionOfBodyLength: 0.48,
  sliceThicknessMm: 0.8,
});

export function deriveUniformExitChamberPlacement(params) {
  const [bodyLength, bodyWidth, bodyHeight] = baseSizeForVariant(params);
  const sceneSpan = {
    x: bodyHeight * uniformExitChamberShape.xSpanFractionOfBodyHeight,
    straightenerSideY: bodyWidth * uniformExitChamberShape.straightenerSideYFractionOfBodyWidth,
    straightenerSideZ: bodyLength * uniformExitChamberShape.straightenerSideZFractionOfBodyLength,
    capSideY: bodyWidth * uniformExitChamberShape.capSideYFractionOfBodyWidth,
    capSideZ: bodyLength * uniformExitChamberShape.capSideZFractionOfBodyLength,
  };
  const maxX = laminarGoldState.bodyCapSeamX;
  const minX = maxX - sceneSpan.x;
  return {
    min: [minX, -sceneSpan.straightenerSideY / 2, -sceneSpan.straightenerSideZ / 2],
    max: [maxX, sceneSpan.straightenerSideY / 2, sceneSpan.straightenerSideZ / 2],
    center: [(minX + maxX) / 2, 0, 0],
    sceneSpan,
  };
}

export function uniformExitChamberVolume(params) {
  const placement = deriveUniformExitChamberPlacement(params);
  const sliceThickness = Math.min(
    uniformExitChamberShape.sliceThicknessMm,
    placement.sceneSpan.x / 2,
  );
  const straightenerSide = translate(
    [placement.min[0] + sliceThickness / 2, 0, 0],
    box(
      [
        placement.sceneSpan.straightenerSideZ,
        placement.sceneSpan.straightenerSideY,
        sliceThickness,
      ],
      [0, 0, 0],
    ),
  );
  const capSide = translate(
    [placement.max[0] - sliceThickness / 2, 0, 0],
    box(
      [
        placement.sceneSpan.capSideZ,
        placement.sceneSpan.capSideY,
        sliceThickness,
      ],
      [0, 0, 0],
    ),
  );
  return colorize(palette.cavity, hullChain(straightenerSide, capSide));
}

export function flowBodyShell(params) {
  return base(params);
}

export function base(params) {
  const [baseLength, bodyWidth, bodyHeight] = baseSizeForVariant(params);
  const chamberLength = baseLength - params.wall * 7;
  const chamberWidth = bodyWidth - params.wall * 5;
  const chamberHeight = bodyHeight - params.wall * 2.6;

  const outer = roundedBox([baseLength, bodyWidth, bodyHeight], [0, 0, 0], 2.5);
  const mainChamber = box([
    chamberLength + params.wall * 1.2,
    chamberWidth + params.wall * 1.6,
    chamberHeight + params.wall * 0.9
  ], [params.wall * 1.15, 0, params.wall * 3.0]);

  const topOpening = box([
    referenceDimensions.cap.size[0] - params.wall * 4,
    bodyWidth - params.wall * 4,
    bodyHeight * 0.72
  ], [baseLength / 2 - referenceDimensions.cap.size[0] / 2, 0, bodyHeight * 0.28]);

  const entryChamber = roundedBox([
    Math.max(params.inletLength * 1.35, 52),
    bodyWidth - params.wall * 6,
    bodyHeight - params.wall * 8
  ], [-baseLength * 0.25, 0, params.wall * 1.2], 2);

  const exitChamber = roundedBox([
    baseLength * 0.39,
    bodyWidth - params.wall * 6,
    bodyHeight - params.wall * 7.2
  ], [baseLength * 0.24, 0, params.wall * 1.2], 2);

  const undersideRelief = roundedBox([
    baseLength - params.wall * 6.8,
    bodyWidth - params.wall * 6,
    bodyHeight * 0.72
  ], [0, 0, -bodyHeight * 0.18], 2);

  const sideReliefs = [
    [-baseLength * 0.27, -bodyWidth * 0.44, -bodyHeight * 0.02],
    [baseLength * 0.27, -bodyWidth * 0.44, -bodyHeight * 0.02],
    [-baseLength * 0.27, bodyWidth * 0.44, -bodyHeight * 0.02],
    [baseLength * 0.27, bodyWidth * 0.44, -bodyHeight * 0.02]
  ].map((position) => roundedBox([
    baseLength * 0.34,
    bodyWidth * 0.34,
    bodyHeight * 0.74
  ], position, 2));

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

  const inletBore = cylinder({
    height: params.inletLength + params.wall * 6,
    radius: Math.max(params.inletDiameter / 2 - params.wall, 6),
    segments: 64
  });

  const nutTrapCuts = screwPatternPositions(params, bodyHeight / 2 - params.wall * 2)
    .map((position) => box([params.wall * 2.4, params.wall * 2.4, params.wall * 2.2], position));

  const cutaway = params.showCutaway
    ? box([baseLength + 4, bodyWidth / 2, bodyHeight + 8], [0, -bodyWidth / 4, 8])
    : null;

  const cuts = cutaway
    ? union(mainChamber, topOpening, entryChamber, exitChamber, undersideRelief, ...sideReliefs, stagePocket, outletCut, inletBore, ...nutTrapCuts, cutaway)
    : union(mainChamber, topOpening, entryChamber, exitChamber, undersideRelief, ...sideReliefs, stagePocket, outletCut, inletBore, ...nutTrapCuts);
  return colorize(palette.body, subtract(outer, cuts));
}
