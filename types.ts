
export enum AddonType {
  ENTITY = 'entity',
  ITEM = 'item',
  BLOCK = 'block',
  RECIPE = 'recipe'
}

export interface AddonManifest {
  name: string;
  description: string;
  version: [number, number, number];
  uuid_bp: string;
  uuid_rp: string;
}

export interface AddonContent {
  id: string;
  name: string;
  type: AddonType;
  description: string;
  behaviorJson: string;
  resourceJson: string;
}

export interface ProjectState {
  manifest: AddonManifest;
  contents: AddonContent[];
}
