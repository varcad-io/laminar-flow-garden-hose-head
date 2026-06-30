import gardenaStl from "../../assets/reference-stls/mk2_1/mk21-gardena.stl";
import lensStl from "../../assets/reference-stls/mk2_1/lens-8mm.stl";
import threeQuarterGhtStl from "../../assets/reference-stls/mk2_1/mk21-34ght.stl";
import { createReferenceMonolithAssemblyApi } from "../referenceMonolithAssemblyCore.js";

const api = createReferenceMonolithAssemblyApi({
  bodyGardena: gardenaStl,
  bodySecondary: threeQuarterGhtStl,
  lens: lensStl,
  secondaryBaseVariant: "threeQuarterGht",
});

export const buildAssemblyScene = (params = {}) => api.buildAssemblyScene(params);
export const buildAssembly = (params = {}) => api.buildAssembly(params);
export const buildPart = (params = {}) => api.buildPart(params);
export const createAssemblyParts = (params = {}) => api.createAssemblyParts(params);
