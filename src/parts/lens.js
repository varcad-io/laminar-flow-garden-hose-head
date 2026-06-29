import { colorize, roundedBox, translate } from '../geometry/primitives.js';
import { referenceDimensions } from '../geometry/dimensions.js';
import { palette } from '../geometry/palette.js';
import { getGoldCenter } from '../goldState.js';

export function lens(params) {
  const [lensX, lensY, lensZ] = referenceDimensions.lens.size;
  return colorize(palette.lens, roundedBox([lensX, lensY, lensZ], [0, 0, 0], 2.3));
}

export function positionedLens(params) {
  return translate(getGoldCenter("lens"), lens(params));
}
