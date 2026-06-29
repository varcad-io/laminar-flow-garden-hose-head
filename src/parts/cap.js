import { colorize, subtract, box, rotate, translate } from '../geometry/primitives.js';
import { referenceDimensions } from '../geometry/dimensions.js';
import { palette } from '../geometry/palette.js';
import { getGoldCenter } from '../goldState.js';

export function cap(params) {
  const [capLength, capWidth, capThickness] = referenceDimensions.cap.size;
  const plate = box([
    capLength,
    capWidth,
    capThickness
  ], [0, 0, 0]);

  const rebate = box([
    capLength - params.wall * 3,
    capWidth - params.wall * 3,
    capThickness * 0.85
  ], [0, 0, 0]);

  return colorize(palette.cap, rotate([0, 0, Math.PI], subtract(plate, rebate)));
}

export function positionedCap(params) {
  return translate(getGoldCenter("cap"), cap(params));
}
