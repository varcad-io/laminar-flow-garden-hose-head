import gardenaBaseStl from "../../assets/reference-stls/mk3/01-base-gardena.stl";
import threeQuarterBaseStl from "../../assets/reference-stls/mk3/02-base-34-ght.stl";
import capStl from "../../assets/reference-stls/mk3/03-cap.stl";
import lensHolderStl from "../../assets/reference-stls/mk3/04-cap-lens-holder.stl";
import straightenerStl from "../../assets/reference-stls/mk3/05-stage-straightener.stl";
import diffuserStl from "../../assets/reference-stls/mk3/08-stage-diffuser-crosshatch.stl";
import lensStl from "../../assets/reference-stls/mk3/09-lens-8mm.stl";
import { createReferenceStlAssemblyApi } from "../referenceStlAssemblyCore.js";

const api = createReferenceStlAssemblyApi({
  baseGardena: gardenaBaseStl,
  baseThreeQuarterGht: threeQuarterBaseStl,
  cap: capStl,
  lensHolder: lensHolderStl,
  straightener: straightenerStl,
  diffuser: diffuserStl,
  lens: lensStl,
});

export const buildAssemblyScene = (params = {}) => api.buildAssemblyScene(params);
export const buildAssembly = (params = {}) => api.buildAssembly(params);
export const buildPart = (params = {}) => api.buildPart(params);
export const createAssemblyParts = (params = {}) => api.createAssemblyParts(params);
