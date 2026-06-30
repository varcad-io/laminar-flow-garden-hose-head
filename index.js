import cadRuntime from "@varcad/cad-runtime";
import {
  assertReferenceVersionAvailable,
  defaultParameters,
  referenceBaseVariantOptions,
  referenceVersionOptions,
  resolveReferenceBaseVariant,
} from "./src/referenceVersionRegistry.js";

const VERSION_MODULE_PATHS = Object.freeze({
  mk3: "/src/runtime-versions/mk3.js",
  mk2_2: "/src/runtime-versions/mk2_2.js",
  mk2_1: "/src/runtime-versions/mk2_1.js",
  mk2_0: "/src/runtime-versions/mk2_0.js",
});

const resolveVersionModulePath = (params = {}) => {
  const version = assertReferenceVersionAvailable(params);
  return VERSION_MODULE_PATHS[version] || VERSION_MODULE_PATHS[defaultParameters.version];
};

const resolveSelection = (variables = {}) => {
  const version = assertReferenceVersionAvailable(variables);
  const resolved = {
    ...defaultParameters,
    ...variables,
    version,
  };
  return {
    ...resolved,
    baseVariant: resolveReferenceBaseVariant(resolved),
  };
};

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

export async function main({ variables = {} } = {}) {
  const resolved = resolveSelection(variables);
  const modulePath = resolveVersionModulePath(resolved);
  const selectedModule = await cadRuntime.importModule(modulePath, { fromPath: "/index.js" });
  if (typeof selectedModule?.buildPart !== "function") {
    throw new Error(`Selected laminar runtime module does not export buildPart: ${modulePath}`);
  }
  return selectedModule.buildPart(resolved);
}
