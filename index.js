const { buildPart, defaultParameters } = require('./src/model');

function getParameterDefinitions() {
  return [
    { name: 'bodyLength', type: 'float', initial: defaultParameters.bodyLength, caption: 'Body length' },
    { name: 'bodyWidth', type: 'float', initial: defaultParameters.bodyWidth, caption: 'Body width' },
    { name: 'bodyHeight', type: 'float', initial: defaultParameters.bodyHeight, caption: 'Body height' },
    { name: 'wall', type: 'float', initial: defaultParameters.wall, caption: 'Wall thickness' },
    { name: 'inletDiameter', type: 'float', initial: defaultParameters.inletDiameter, caption: 'Inlet diameter' },
    { name: 'stageWidth', type: 'float', initial: defaultParameters.stageWidth, caption: 'Stage width' },
    { name: 'baseVariant', type: 'choice', values: ['gardena', 'threeQuarterGht'], captions: ['Gardena base', '3/4 GHT base'], initial: defaultParameters.baseVariant, caption: 'Base variant' },
    { name: 'part', type: 'choice', values: ['assembly', 'base', 'cap', 'lensHolder', 'straightener', 'diffuser', 'lens'], captions: ['Assembly', 'Base', 'Cap', 'Lens holder', 'Straightener', 'Diffuser', 'Lens'], initial: defaultParameters.part, caption: 'Part' },
    { name: 'showCutaway', type: 'checkbox', checked: defaultParameters.showCutaway, caption: 'Show cutaway' },
    { name: 'showStages', type: 'checkbox', checked: defaultParameters.showStages, caption: 'Show stages' }
  ];
}

function main(params = {}) {
  return buildPart({ ...defaultParameters, ...params });
}

module.exports = { main, getParameterDefinitions };
