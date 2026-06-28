const { buildAssembly, defaultParameters } = require('./src/model');

function getParameterDefinitions() {
  return [
    { name: 'bodyLength', type: 'float', initial: defaultParameters.bodyLength, caption: 'Body length' },
    { name: 'bodyWidth', type: 'float', initial: defaultParameters.bodyWidth, caption: 'Body width' },
    { name: 'bodyHeight', type: 'float', initial: defaultParameters.bodyHeight, caption: 'Body height' },
    { name: 'wall', type: 'float', initial: defaultParameters.wall, caption: 'Wall thickness' },
    { name: 'inletDiameter', type: 'float', initial: defaultParameters.inletDiameter, caption: 'Inlet diameter' },
    { name: 'stageWidth', type: 'float', initial: defaultParameters.stageWidth, caption: 'Stage width' },
    { name: 'showCutaway', type: 'checkbox', checked: defaultParameters.showCutaway, caption: 'Show cutaway' },
    { name: 'showStages', type: 'checkbox', checked: defaultParameters.showStages, caption: 'Show stages' }
  ];
}

function main(params = {}) {
  return buildAssembly({ ...defaultParameters, ...params });
}

module.exports = { main, getParameterDefinitions };
