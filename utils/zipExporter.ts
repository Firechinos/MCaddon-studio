
import JSZip from 'jszip';
import { ProjectState, AddonType } from '../types';

export const exportProject = async (project: ProjectState) => {
  const zip = new JSZip();
  const { manifest, contents } = project;

  // Behavior Pack
  const bpFolder = zip.folder(`${manifest.name} BP`);
  const bpManifest = {
    format_version: 2,
    header: {
      name: `${manifest.name} BP`,
      description: manifest.description,
      uuid: manifest.uuid_bp,
      version: manifest.version,
      min_engine_version: [1, 20, 0]
    },
    modules: [
      {
        type: "data",
        uuid: crypto.randomUUID(),
        version: [1, 0, 0]
      }
    ]
  };
  bpFolder?.file("manifest.json", JSON.stringify(bpManifest, null, 2));

  // Resource Pack
  const rpFolder = zip.folder(`${manifest.name} RP`);
  const rpManifest = {
    format_version: 2,
    header: {
      name: `${manifest.name} RP`,
      description: manifest.description,
      uuid: manifest.uuid_rp,
      version: manifest.version,
      min_engine_version: [1, 20, 0]
    },
    modules: [
      {
        type: "resources",
        uuid: crypto.randomUUID(),
        version: [1, 0, 0]
      }
    ]
  };
  rpFolder?.file("manifest.json", JSON.stringify(rpManifest, null, 2));

  // Sort and Add Contents
  contents.forEach(item => {
    const typeFolder = item.type === AddonType.ENTITY ? 'entities' : 
                       item.type === AddonType.ITEM ? 'items' : 
                       item.type === AddonType.BLOCK ? 'blocks' : 'recipes';
    
    if (item.behaviorJson && item.behaviorJson.trim() !== "{}") {
      bpFolder?.folder(typeFolder)?.file(`${item.name.toLowerCase().replace(/\s+/g, '_')}.json`, item.behaviorJson);
    }
    
    if (item.resourceJson && item.resourceJson.trim() !== "{}") {
      rpFolder?.folder(typeFolder)?.file(`${item.name.toLowerCase().replace(/\s+/g, '_')}.json`, item.resourceJson);
    }
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${manifest.name.toLowerCase().replace(/\s+/g, '_')}.mcaddon`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};
