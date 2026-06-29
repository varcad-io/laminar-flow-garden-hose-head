import { flowBodyShell } from '../parts/base.js';
import { inlet } from '../parts/inlet.js';
import {
  positionedDiffuserStage,
  positionedStraightenerStage
} from '../parts/stages.js';
import { positionedLensHolder } from '../parts/lensHolder.js';
import { positionedLens } from '../parts/lens.js';
import { positionedCap } from '../parts/cap.js';
import { screwBosses } from '../parts/hardware.js';
import { laminarGoldState } from '../goldState.js';
import { exitChamberMarker } from '../parts/flowDebug.js';

const STRAIGHTENER_EXPLOSION_CENTER_X = 56;
const sceneCenterOffset = [-STRAIGHTENER_EXPLOSION_CENTER_X, 0, 0];
const centeredExplosionOffset = (x) => [x - STRAIGHTENER_EXPLOSION_CENTER_X, 0, 0];

export function createAssemblyParts(params) {
  return [
    {
      id: 'bodyShell',
      label: 'Body Shell',
      group: 'body',
      geometry: flowBodyShell(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      explosionOffset: centeredExplosionOffset(0),
      visible: true,
      exportable: true
    },
    {
      id: 'inlet',
      label: 'Inlet',
      group: 'body',
      geometry: inlet(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      explosionOffset: centeredExplosionOffset(18),
      visible: true,
      exportable: true
    },
    {
      id: 'diffuserStage',
      label: 'Diffuser Stage',
      group: 'flowStage',
      geometry: positionedDiffuserStage(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      referenceOrientation: laminarGoldState.orientation.diffuser,
      explosionOffset: centeredExplosionOffset(42),
      visible: Boolean(params.showStages),
      exportable: true
    },
    {
      id: 'straightenerStage',
      label: 'Straightener Stage',
      group: 'flowStage',
      geometry: positionedStraightenerStage(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      referenceOrientation: laminarGoldState.orientation.straightener,
      explosionOffset: centeredExplosionOffset(56),
      visible: Boolean(params.showStages),
      exportable: true
    },
    {
      id: 'uniformExitChamber',
      label: 'Uniform Exit Chamber',
      group: 'flowFeature',
      geometry: exitChamberMarker(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      referenceOrientation: 'identity',
      explosionOffset: centeredExplosionOffset(64),
      visible: Boolean(params.showStages),
      exportable: false
    },
    {
      id: 'lensHolder',
      label: 'Lens Holder',
      group: 'optics',
      geometry: positionedLensHolder(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      referenceOrientation: laminarGoldState.orientation.lensHolder,
      explosionOffset: centeredExplosionOffset(72),
      visible: true,
      exportable: true
    },
    {
      id: 'lens',
      label: 'Lens',
      group: 'optics',
      geometry: positionedLens(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      referenceOrientation: laminarGoldState.orientation.lens,
      explosionOffset: centeredExplosionOffset(92),
      visible: true,
      exportable: true
    },
    {
      id: 'cap',
      label: 'Cap',
      group: 'closure',
      geometry: positionedCap(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      referenceOrientation: laminarGoldState.orientation.cap,
      explosionOffset: centeredExplosionOffset(120),
      visible: true,
      exportable: true
    },
    {
      id: 'screwBosses',
      label: 'Screw Bosses',
      group: 'hardware',
      geometry: screwBosses(params),
      transformRole: 'explode',
      constructedOffset: sceneCenterOffset,
      explosionOffset: centeredExplosionOffset(136),
      visible: true,
      exportable: true
    }
  ];
}
