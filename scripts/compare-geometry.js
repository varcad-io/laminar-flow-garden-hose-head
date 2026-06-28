const fs = require('fs');
const path = require('path');
const { geometries, measurements } = require('@jscad/modeling');
const { defaultParameters, buildPart, referenceDimensions } = require('../src/model');
const { measureStl } = require('./measure-stl');

const referenceByPart = {
  base: referenceDimensions.baseGardena.sourceFile,
  cap: referenceDimensions.cap.sourceFile,
  lensHolder: referenceDimensions.lensHolder.sourceFile,
  straightener: referenceDimensions.stageStraightener.sourceFile,
  diffuser: referenceDimensions.stageDiffuserCrosshatch.sourceFile,
  lens: referenceDimensions.lens.sourceFile
};

function takeArg(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function percentDelta(generated, reference) {
  if (!Number.isFinite(reference) || reference === 0) return null;
  return round(((generated - reference) / reference) * 100);
}

function roundArray(values) {
  return values.map(round);
}

function generatedMetrics(part) {
  const geometry = buildPart({ ...defaultParameters, part });
  if (!geometries.geom3.isA(geometry)) {
    throw new Error(`Generated part ${part} did not return geom3`);
  }

  const bbox = measurements.measureBoundingBox(geometry);
  const min = bbox[0];
  const max = bbox[1];
  return {
    part,
    polygonCount: geometries.geom3.toPolygons(geometry).length,
    min: roundArray(min),
    max: roundArray(max),
    size: roundArray(max.map((value, axis) => value - min[axis])),
    center: roundArray(max.map((value, axis) => (value + min[axis]) / 2)),
    volume: round(measurements.measureVolume(geometry))
  };
}

function comparePart(part, referencePath = referenceByPart[part]) {
  if (!referencePath) {
    throw new Error(`No default reference path for part ${part}`);
  }

  const generated = generatedMetrics(part);
  const reference = measureStl(referencePath);
  const delta = {
    size: roundArray(generated.size.map((value, axis) => value - reference.size[axis])),
    volume: round(generated.volume - reference.volume),
    polygonCount: generated.polygonCount - reference.triangleCount
  };

  return {
    part,
    referenceFile: reference.file,
    note: 'Generated parts use local coordinates; Printables references use exported slicer coordinates, so absolute centers are reported but not treated as parity deltas.',
    generated,
    reference: {
      triangleCount: reference.triangleCount,
      min: roundArray(reference.min),
      max: roundArray(reference.max),
      size: roundArray(reference.size),
      center: roundArray(reference.center),
      volume: round(reference.volume)
    },
    exportedCoordinateOffset: roundArray(generated.center.map((value, axis) => value - reference.center[axis])),
    delta
  };
}

if (require.main === module) {
  const partArg = takeArg('--part', 'base');
  const outputPath = takeArg('--out', null);
  const summaryPath = takeArg('--summary-out', null);
  const maxSizeDelta = Number(takeArg('--max-size-delta', '0.25'));
  const maxVolumeDeltaPercent = Number(takeArg('--max-volume-delta-percent', '75'));
  const failOnThreshold = hasFlag('--fail-on-threshold');
  const parts = partArg === 'all'
    ? Object.keys(referenceByPart)
    : partArg.split(',').map((part) => part.trim()).filter(Boolean);

  const report = {
    generatedAt: new Date().toISOString(),
    thresholds: {
      maxSizeDelta,
      maxVolumeDeltaPercent
    },
    parts: parts.map((part) => comparePart(part))
  };

  report.summary = report.parts.map((entry) => {
    const maxAbsSizeDelta = Math.max(...entry.delta.size.map((value) => Math.abs(value)));
    const volumeDeltaPercent = percentDelta(entry.generated.volume, entry.reference.volume);
    const withinSize = maxAbsSizeDelta <= maxSizeDelta;
    const withinVolume = Math.abs(volumeDeltaPercent || 0) <= maxVolumeDeltaPercent;
    const suggestedNextTarget = !withinSize
      ? 'match bounding box'
      : !withinVolume
        ? 'reduce volume mismatch'
        : 'improve feature/detail parity';
    return {
      part: entry.part,
      generatedSize: entry.generated.size.join(' x '),
      referenceSize: entry.reference.size.join(' x '),
      maxAbsSizeDelta,
      generatedVolume: entry.generated.volume,
      referenceVolume: entry.reference.volume,
      volumeDelta: entry.delta.volume,
      volumeDeltaPercent,
      polygonDelta: entry.delta.polygonCount,
      withinSize,
      withinVolume,
      suggestedNextTarget
    };
  });

  const json = JSON.stringify(report, null, 2) + '\n';
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, json);
  }
  if (summaryPath) {
    fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
    const rows = [
      '| Part | Max bbox delta | Volume delta | Polygon delta | Next target |',
      '| --- | ---: | ---: | ---: | --- |',
      ...report.summary.map((entry) => `| ${entry.part} | ${entry.maxAbsSizeDelta} mm | ${entry.volumeDeltaPercent}% | ${entry.polygonDelta} | ${entry.suggestedNextTarget} |`)
    ];
    fs.writeFileSync(summaryPath, `${rows.join('\n')}\n`);
  }
  process.stdout.write(json);

  if (failOnThreshold) {
    const failing = report.summary.filter((entry) => !entry.withinSize || !entry.withinVolume);
    if (failing.length > 0) {
      process.stderr.write(`Geometry thresholds failed for: ${failing.map((entry) => entry.part).join(', ')}\n`);
      process.exit(1);
    }
  }
}

module.exports = { comparePart, generatedMetrics };
