import { translate } from '../geometry/primitives.js';

export function clamp01(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }
  return Math.max(0, Math.min(1, numeric));
}

export function applyExplosion(part, explode) {
  const amount = clamp01(explode);
  const constructedOffset = part.constructedOffset || [0, 0, 0];
  const explosionOffset = part.explosionOffset || [0, 0, 0];
  return translate([
    constructedOffset[0] + explosionOffset[0] * amount,
    constructedOffset[1] + explosionOffset[1] * amount,
    constructedOffset[2] + explosionOffset[2] * amount
  ], part.geometry);
}
