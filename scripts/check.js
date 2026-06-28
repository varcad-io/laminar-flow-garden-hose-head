const { geometries } = require('@jscad/modeling');
const { main } = require('../index');

const geometry = main();
const type = geometries.geom3.isA(geometry) ? 'geom3' : typeof geometry;

if (type !== 'geom3') {
  throw new Error(`Expected main() to return geom3, received ${type}`);
}

const polygons = geometries.geom3.toPolygons(geometry);

if (polygons.length < 1) {
  throw new Error('Expected generated model to contain polygons');
}

console.log(`Generated ${type} with ${polygons.length} polygons`);
