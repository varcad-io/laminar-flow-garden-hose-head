import fs from 'fs';
import path from 'path';
import { serialize } from '@jscad/stl-serializer';
import { defaultParameters, buildPart } from '../src/model.js';

function takeArg(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

const part = takeArg('--part', 'assembly');
const outputPath = takeArg('--out', path.join('dist', `${part}.stl`));
const geometry = buildPart({ ...defaultParameters, part });
const serialized = serialize({ binary: true }, geometry);

function toBuffer(chunk) {
  if (Buffer.isBuffer(chunk)) return chunk;
  if (chunk instanceof ArrayBuffer) return Buffer.from(chunk);
  if (ArrayBuffer.isView(chunk)) return Buffer.from(chunk.buffer);
  return Buffer.from(String(chunk));
}

const payload = Array.isArray(serialized)
  ? Buffer.concat(serialized.map(toBuffer))
  : toBuffer(serialized);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, payload);

console.log(`Wrote ${outputPath}`);
