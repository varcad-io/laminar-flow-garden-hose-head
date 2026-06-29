import modeling from '@jscad/modeling';

export const { colorize } = modeling.colors;
export const { union, subtract } = modeling.booleans;
export const { translate, rotate } = modeling.transforms;
export const { cuboid, cylinder, roundedCuboid } = modeling.primitives;

export function orientPoint([x, y, z]) {
  return [z, y, -x];
}

export function orientSize([x, y, z]) {
  return [z, y, x];
}

export function orientedTranslate(offset, geometry) {
  return translate(orientPoint(offset), geometry);
}

export function box(size, center = [0, 0, 0]) {
  return translate(orientPoint(center), cuboid({ size: orientSize(size) }));
}

export function roundedBox(size, center = [0, 0, 0], radius = 2) {
  const orientedSize = orientSize(size);
  return translate(orientPoint(center), roundedCuboid({
    size: orientedSize,
    roundRadius: Math.min(radius, ...size.map((value) => value / 2 - 0.1)),
    segments: 16
  }));
}
