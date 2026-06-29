import modeling from '@jscad/modeling';
import { colorize, subtract, box, translate, union } from '../geometry/primitives.js';
import { referenceDimensions } from '../geometry/dimensions.js';
import { palette } from '../geometry/palette.js';
import { getGoldCenter } from '../goldState.js';

const { hullChain } = modeling.hulls;

export function lensHolder(params) {
  const [holderLength, holderWidth, holderHeight] = referenceDimensions.lensHolder.size;
  const capDepth = holderHeight * 0.22;
  const neckDepth = holderHeight * 0.12;
  const neckWidth = holderWidth * 0.58;
  const railWidth = holderWidth * 0.16;
  const railInset = holderWidth * 0.5 - railWidth * 0.5;
  const railSpan = holderHeight - capDepth * 2;

  const topOuter = box([
    holderLength,
    holderWidth,
    capDepth
  ], [0, 0, holderHeight * 0.5 - capDepth * 0.5]);
  const topInner = box([
    holderLength,
    neckWidth,
    neckDepth
  ], [0, 0, holderHeight * 0.22]);
  const bottomOuter = box([
    holderLength,
    holderWidth,
    capDepth
  ], [0, 0, -holderHeight * 0.5 + capDepth * 0.5]);
  const bottomInner = box([
    holderLength,
    neckWidth,
    neckDepth
  ], [0, 0, -holderHeight * 0.22]);

  const leftRail = box([
    holderLength,
    railWidth,
    railSpan
  ], [0, -railInset, 0]);
  const rightRail = box([
    holderLength,
    railWidth,
    railSpan
  ], [0, railInset, 0]);

  const holder = union(
    hullChain(topOuter, topInner),
    hullChain(bottomOuter, bottomInner),
    leftRail,
    rightRail
  );

  const slot = box([
    holderLength + 2,
    params.lensWidth * 0.64,
    holderHeight - capDepth * 1.05
  ], [0, 0, 0]);

  return colorize(palette.cap, subtract(holder, slot));
}

export function positionedLensHolder(params) {
  return translate(getGoldCenter("lensHolder"), lensHolder(params));
}
