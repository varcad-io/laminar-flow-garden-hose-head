import {
  buildPart,
  defaultParameters,
  referenceBaseVariantOptions,
  referenceVersionOptions,
} from './src/model.js';

export function getParameterDefinitions() {
  return [
    {
      name: 'version',
      type: 'choice',
      values: referenceVersionOptions.map((option) => option.id),
      captions: referenceVersionOptions.map((option) => option.caption),
      initial: defaultParameters.version,
      caption: 'Reference version'
    },
    { name: 'part', type: 'choice', values: ['assembly', 'base', 'cap', 'lensHolder', 'straightener', 'diffuser', 'lens'], captions: ['Assembly', 'Base', 'Cap', 'Lens holder', 'Straightener', 'Diffuser', 'Lens'], initial: defaultParameters.part, caption: 'Part' },
    {
      name: 'baseVariant',
      type: 'choice',
      values: referenceBaseVariantOptions.map((option) => option.id),
      captions: referenceBaseVariantOptions.map((option) => option.caption),
      initial: defaultParameters.baseVariant,
      caption: 'Base variant'
    },
    { name: 'explode', type: 'float', initial: defaultParameters.explode, caption: 'Explode assembly' },
    { name: 'showStages', type: 'checkbox', checked: defaultParameters.showStages, caption: 'Show stages' }
  ];
}

export function main({ variables = {} } = {}) {
  return buildPart({ ...defaultParameters, ...variables });
}
