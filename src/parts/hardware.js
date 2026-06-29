import { colorize, union, translate, rotate, cylinder, orientPoint } from '../geometry/primitives.js';
import { baseSizeForVariant, screwPatternPositions } from '../geometry/dimensions.js';
import { palette } from '../geometry/palette.js';

export function screwBosses(params) {
  const [, , bodyHeight] = baseSizeForVariant(params);
  const bosses = screwPatternPositions(params, bodyHeight / 2 + params.wall)
    .map((position) => translate(
      orientPoint(position),
      rotate([0, Math.PI / 2, 0], cylinder({ height: params.wall * 3, radius: params.wall * 1.9, segments: 32 }))
    ));

  return colorize(palette.hardware, union(bosses));
}
