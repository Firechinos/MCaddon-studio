
import React, { useState, useCallback } from 'react';
import { AddonType, ProjectState, AddonContent } from './types';
import Editor from './components/Editor';
import { exportProject } from './utils/zipExporter';
import { 
  Hammer, 
  Package, 
  Sword, 
  Box, 
  ChefHat, 
  Plus, 
  Download, 
  Layout,
  Settings,
  ChevronRight,
  RefreshCw,
  Trash2
} from 'lucide-react';

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectState>({
    manifest: {
      name: "My Epic Addon",
      description: "Created with MCAddon Studio AI",
      version: [1, 0, 0],
      uuid_bp: crypto.randomUUID(),
      uuid_rp: crypto.randomUUID()
    },
    contents: []
  });

  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const [view, setView] = useState<'editor' | 'manifest'>('editor');

  const addContent = (type: AddonType) => {
    const id = crypto.randomUUID();
    const newContent: AddonContent = {
      id,
      name: `New ${type}`,
      type,
      description: "",
      behaviorJson: "{\n  \"format_version\": \"1.20.0\",\n  \"minecraft:item\": {\n    \"description\": {\n      \"identifier\": \"my_addon:new_item\"\n    },\n    \"components\": {}\n  }\n}",
      resourceJson: "{}"
    };
    setProject(prev => ({
      ...prev,
      contents: [...prev.contents, newContent]
    }));
    setActiveContentId(id);
    setView('editor');
  };

  const updateContent = (updated: AddonContent) => {
    setProject(prev => ({
      ...prev,
      contents: prev.contents.map(c => c.id === updated.id ? updated : c)
    }));
  };

  const deleteContent = (id: string) => {
    const contentToDelete = project.contents.find(c => c.id === id);
    if (window.confirm(`Are you sure you want to delete "${contentToDelete?.name || 'this item'}"?`)) {
      setProject(prev => ({
        ...prev,
        contents: prev.contents.filter(c => c.id !== id)
      }));
      if (activeContentId === id) setActiveContentId(null);
    }
  };

  const activeContent = project.contents.find(c => c.id === activeContentId);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Left Sidebar: Content List */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Hammer className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-lg font-bold leading-none">MCAddon Studio</h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">AI-Powered Creator</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Manifest Link */}
          <button
            onClick={() => setView('manifest')}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition ${view === 'manifest' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <div className="flex items-center gap-2 font-medium">
              <Settings className="w-5 h-5" />
              Manifest Settings
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Creation Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase px-2">Create New</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addContent(AddonType.ENTITY)} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
                <Layout className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-semibold">Entity</span>
              </button>
              <button onClick={() => addContent(AddonType.ITEM)} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
                <Sword className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-semibold">Item</span>
              </button>
              <button onClick={() => addContent(AddonType.BLOCK)} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
                <Box className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-semibold">Block</span>
              </button>
              <button onClick={() => addContent(AddonType.RECIPE)} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
                <ChefHat className="w-5 h-5 text-red-400" />
                <span className="text-[10px] font-semibold">Recipe</span>
              </button>
            </div>
          </div>

          {/* Project Contents */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase px-2">Your Content</h3>
            {project.contents.length === 0 ? (
              <p className="text-xs text-slate-600 italic px-2">Nothing created yet.</p>
            ) : (
              <div className="space-y-1">
                {project.contents.map(c => (
                  <div key={c.id} className="group relative">
                    <button
                      onClick={() => {
                        setActiveContentId(c.id);
                        setView('editor');
                      }}
                      className={`w-full text-left p-3 pr-10 rounded-lg text-sm transition border ${activeContentId === c.id && view === 'editor' ? 'bg-blue-600 border-blue-500 text-white' : 'hover:bg-slate-800 text-slate-400 border-transparent'}`}
                    >
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-[10px] opacity-70 uppercase tracking-wider">{c.type}</div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteContent(c.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Export */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <button
            onClick={() => exportProject(project)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg shadow-blue-900/20"
          >
            <Download className="w-5 h-5" />
            Export .mcaddon
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-hidden">
          {view === 'manifest' ? (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-blue-600/10 rounded-xl">
                  <Package className="w-10 h-10 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Pack Manifest</h2>
                  <p className="text-slate-500">Global metadata for your Add-on</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 p-8 rounded-2xl border border-slate-800">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Pack Name</label>
                    <input
                      type="text"
                      value={project.manifest.name}
                      onChange={(e) => setProject(p => ({ ...p, manifest: { ...p.manifest, name: e.target.value } }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Description</label>
                    <textarea
                      value={project.manifest.description}
                      onChange={(e) => setProject(p => ({ ...p, manifest: { ...p.manifest, description: e.target.value } }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition h-32 resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                   <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Version</label>
                    <div className="flex gap-2">
                      {[0, 1, 2].map(i => (
                        <input
                          key={i}
                          type="number"
                          value={project.manifest.version[i]}
                          onChange={(e) => {
                            const newVersion = [...project.manifest.version];
                            newVersion[i] = parseInt(e.target.value) || 0;
                            setProject(p => ({ ...p, manifest: { ...p.manifest, version: newVersion as any } }));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-center"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Behavior Pack UUID</label>
                    <div className="flex gap-2">
                      <input readOnly value={project.manifest.uuid_bp} className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-500 text-xs font-mono" />
                      <button onClick={() => setProject(p => ({ ...p, manifest: { ...p.manifest, uuid_bp: crypto.randomUUID() } }))} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition"><RefreshCw className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-2">Resource Pack UUID</label>
                    <div className="flex gap-2">
                      <input readOnly value={project.manifest.uuid_rp} className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-500 text-xs font-mono" />
                      <button onClick={() => setProject(p => ({ ...p, manifest: { ...p.manifest, uuid_rp: crypto.randomUUID() } }))} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition"><RefreshCw className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeContent ? (
            <Editor
              content={activeContent}
              onUpdate={updateContent}
              onDelete={deleteContent}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 bg-slate-900 rounded-full border border-slate-800 animate-pulse">
                <Hammer className="w-16 h-16 text-slate-700" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-300">Ready to create?</h3>
                <p className="text-slate-500 mt-1 max-w-sm">Select a tool on the left or create a new entity, item, or block to get started with your Minecraft masterpiece.</p>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => addContent(AddonType.ITEM)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition">
                   <Plus className="w-5 h-5" /> Start with an Item
                 </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
