import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function readVector(buffer, offset) {
  return [
    buffer.readFloatLE(offset),
    buffer.readFloatLE(offset + 4),
    buffer.readFloatLE(offset + 8)
  ];
}

function triangleSignedVolume(a, b, c) {
  return (
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0])
  ) / 6;
}

function measureBinaryStl(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 84) {
    throw new Error(`Not enough data for STL header: ${filePath}`);
  }

  const triangleCount = buffer.readUInt32LE(80);
  const expectedLength = 84 + triangleCount * 50;
  if (expectedLength > buffer.length) {
    throw new Error(`Binary STL length mismatch for ${filePath}`);
  }

  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  let vertexCount = 0;
  let signedVolume = 0;

  for (let i = 0; i < triangleCount; i += 1) {
    const triangleOffset = 84 + i * 50;
    const triangle = [];
    for (let vertexIndex = 0; vertexIndex < 3; vertexIndex += 1) {
      const vertex = readVector(buffer, triangleOffset + 12 + vertexIndex * 12);
      triangle.push(vertex);
      for (let axis = 0; axis < 3; axis += 1) {
        min[axis] = Math.min(min[axis], vertex[axis]);
        max[axis] = Math.max(max[axis], vertex[axis]);
      }
      vertexCount += 1;
    }
    signedVolume += triangleSignedVolume(triangle[0], triangle[1], triangle[2]);
  }

  return {
    triangleCount,
    vertexCount,
    min,
    max,
    size: max.map((value, axis) => value - min[axis]),
    center: max.map((value, axis) => (value + min[axis]) / 2),
    volume: Math.abs(signedVolume)
  };
}

function measureAsciiStl(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  let vertexCount = 0;
  let signedVolume = 0;
  let triangle = [];

  for (const match of text.matchAll(/vertex\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)/g)) {
    const vertex = [Number(match[1]), Number(match[2]), Number(match[3])];
    triangle.push(vertex);
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], vertex[axis]);
      max[axis] = Math.max(max[axis], vertex[axis]);
    }
    vertexCount += 1;
    if (triangle.length === 3) {
      signedVolume += triangleSignedVolume(triangle[0], triangle[1], triangle[2]);
      triangle = [];
    }
  }

  if (vertexCount === 0) {
    throw new Error(`ASCII STL contained no vertices: ${filePath}`);
  }

  return {
    triangleCount: vertexCount / 3,
    vertexCount,
    min,
    max,
    size: max.map((value, axis) => value - min[axis]),
    center: max.map((value, axis) => (value + min[axis]) / 2),
    volume: Math.abs(signedVolume)
  };
}

function isProbablyBinaryStl(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 84) return false;
  const triangleCount = buffer.readUInt32LE(80);
  return 84 + triangleCount * 50 === buffer.length;
}

function measureStl(filePath) {
  const absolutePath = path.resolve(filePath);
  const stats = fs.statSync(absolutePath);
  const measurement = isProbablyBinaryStl(absolutePath)
    ? measureBinaryStl(absolutePath)
    : measureAsciiStl(absolutePath);

  return {
    file: path.relative(process.cwd(), absolutePath),
    bytes: stats.size,
    ...measurement
  };
}

function findStlFiles(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...findStlFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.stl')) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const target = process.argv[2] || 'references/printables-1319709/files/model';
  const targetPath = path.resolve(target);
  const files = fs.statSync(targetPath).isDirectory() ? findStlFiles(targetPath) : [targetPath];
  const measurements = files.map(measureStl);
  console.log(JSON.stringify(measurements, null, 2));
}

export { measureStl };
