import fs from 'fs';
import path from 'path';
import { generatedMetrics } from './compare-geometry.js';

const parts = ['base', 'cap', 'lensHolder', 'straightener', 'diffuser', 'lens'];
const metrics = parts.map(generatedMetrics);
const width = 960;
const height = 560;
const padding = 44;
const cardWidth = 280;
const cardHeight = 130;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const cards = metrics.map((metric, index) => {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const x = padding + col * (cardWidth + 24);
  const y = 118 + row * (cardHeight + 28);
  const [sx, sy, sz] = metric.size;
  const maxSize = Math.max(sx, sy, sz);
  const scale = 58 / maxSize;
  const blockW = Math.max(10, sx * scale);
  const blockH = Math.max(10, sz * scale);
  const blockD = Math.max(4, sy * scale * 0.45);
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${cardWidth}" height="${cardHeight}" rx="10" fill="#102033" stroke="#2f7bc7" stroke-width="1"/>
      <text x="18" y="30" fill="#e8f3ff" font-size="18" font-family="Arial, sans-serif" font-weight="700">${escapeXml(metric.part)}</text>
      <text x="18" y="55" fill="#95b6d6" font-size="12" font-family="Arial, sans-serif">${escapeXml(metric.size.join(' x '))} mm</text>
      <text x="18" y="75" fill="#95b6d6" font-size="12" font-family="Arial, sans-serif">${metric.polygonCount} generated polygons</text>
      <g transform="translate(188 72)">
        <polygon points="0,0 ${blockW},0 ${blockW + blockD},${-blockD} ${blockD},${-blockD}" fill="#54a6dd"/>
        <polygon points="${blockW},0 ${blockW},${blockH} ${blockW + blockD},${blockH - blockD} ${blockW + blockD},${-blockD}" fill="#3175b4"/>
        <rect x="0" y="0" width="${blockW}" height="${blockH}" fill="#8ed1f2"/>
      </g>
    </g>`;
}).join('\n');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#07111f"/>
  <text x="${padding}" y="58" fill="#f5fbff" font-size="30" font-family="Arial, sans-serif" font-weight="700">Laminar Hose Head JSCAD Preview Summary</text>
  <text x="${padding}" y="86" fill="#98aec4" font-size="15" font-family="Arial, sans-serif">Generated from measured Printables reference dimensions</text>
  ${cards}
</svg>
`;

const outputPath = path.join('dist', 'preview-summary.svg');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, svg);
console.log(`Wrote ${outputPath}`);
