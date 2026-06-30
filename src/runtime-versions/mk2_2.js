import gardenaStl from "../../assets/reference-stls/mk2_2/mk22-gardena.stl";
import lensStl from "../../assets/reference-stls/mk2_2/lens-8mm.stl";
import threeQuarterGhtStl from "../../assets/reference-stls/mk2_2/mk22-34ght.stl";
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
