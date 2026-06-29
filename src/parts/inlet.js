import { colorize, subtract, cylinder, orientedTranslate } from '../geometry/primitives.js';
import { baseSizeForVariant } from '../geometry/dimensions.js';
import { palette } from '../geometry/palette.js';

export function inlet(params) {
  const [baseLength, , bodyHeight] = baseSizeForVariant(params);
  const inletOuter = cylinder({
    height: params.inletLength,
    radius: params.inletDiameter / 2,
    segments: 64
  });
  const inletBore = cylinder({
    height: params.inletLength + 2,
    radius: params.inletDiameter / 2 - params.wall,
    segments: 64
  });

  return colorize(
    palette.body,
    orientedTranslate(
      [-baseLength / 2 - params.inletLength / 2 + params.wall, 0, bodyHeight * 0.2],
      subtract(inletOuter, inletBore)
    )
  );
}
