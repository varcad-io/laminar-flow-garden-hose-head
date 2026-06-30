import gardenaStl from "../../assets/reference-stls/mk2_0/mk20-gardena.stl";
import lensStl from "../../assets/reference-stls/mk2_0/lens-8mm.stl";
import threeQuarterNptStl from "../../assets/reference-stls/mk2_0/mk20-34-npt.stl";
import { createReferenceMonolithAssemblyApi } from "../referenceMonolithAssemblyCore.js";

const api = createReferenceMonolithAssemblyApi({
  bodyGardena: gardenaStl,
  bodySecondary: threeQuarterNptStl,
  lens: lensStl,
  secondaryBaseVariant: "threeQuarterNpt",
});

export const buildAssemblyScene = (params = {}) => api.buildAssemblyScene(params);
export const buildAssembly = (params = {}) => api.buildAssembly(params);
export const buildPart = (params = {}) => api.buildPart(params);
export const createAssemblyParts = (params = {}) => api.createAssemblyParts(params);
