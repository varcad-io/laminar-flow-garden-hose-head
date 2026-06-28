const { geometries } = require('@jscad/modeling');
const { main } = require('../index');

const parts = ['assembly', 'base', 'cap', 'lensHolder', 'straightener', 'diffuser', 'lens'];

for (const part of parts) {
  const geometry = main({ part });
  const type = geometries.geom3.isA(geometry) ? 'geom3' : typeof geometry;

  if (type !== 'geom3') {
    throw new Error(`Expected main({ part: "${part}" }) to return geom3, received ${type}`);
  }

  const polygons = geometries.geom3.toPolygons(geometry);

  if (polygons.length < 1) {
    throw new Error(`Expected generated ${part} model to contain polygons`);
  }

  console.log(`Generated ${part} ${type} with ${polygons.length} polygons`);
}
