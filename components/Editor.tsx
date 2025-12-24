
import React, { useState } from 'react';
import { AddonType, AddonContent } from '../types';
import { generateMinecraftContent } from '../services/geminiService';
import { Wand2, Save, Trash2, Code, Eye, RefreshCw } from 'lucide-react';
import Previewer from './Previewer';

interface EditorProps {
  content: AddonContent;
  onUpdate: (updated: AddonContent) => void;
  onDelete: (id: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'behavior' | 'resource' | 'preview'>('behavior');

  const handleAICompose = async () => {
    if (!content.name || !content.description) {
      alert("Please provide a name and description first!");
      return;
    }
    setLoading(true);
    try {
      const result = await generateMinecraftContent(content.type, content.name, content.description);
      onUpdate({
        ...content,
        behaviorJson: result.behavior_json,
        resourceJson: result.resource_json
      });
    } catch (error) {
      console.error("AI Generation failed", error);
      alert("Generation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={content.name}
            onChange={(e) => onUpdate({ ...content, name: e.target.value })}
            className="bg-transparent text-xl font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2"
            placeholder="Name..."
          />
          <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 text-xs font-mono rounded-full uppercase">
            {content.type}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAICompose}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded transition"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            AI Magic
          </button>
          <button
            onClick={() => onDelete(content.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition"
            title="Delete item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Main Section */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar / Controls */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-700 p-4 space-y-4 bg-slate-900/50">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
            <textarea
              value={content.description}
              onChange={(e) => onUpdate({ ...content, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm h-32 resize-none focus:outline-none focus:border-blue-500"
              placeholder="Describe what this does..."
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Views</label>
            <button
              onClick={() => setActiveTab('behavior')}
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition ${activeTab === 'behavior' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <Code className="w-4 h-4" /> Behavior JSON
            </button>
            <button
              onClick={() => setActiveTab('resource')}
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition ${activeTab === 'resource' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <Code className="w-4 h-4" /> Resource JSON
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 transition ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <Eye className="w-4 h-4" /> Structure Preview
            </button>
          </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 bg-slate-950 relative overflow-auto">
          {activeTab === 'behavior' && (
            <textarea
              value={content.behaviorJson}
              onChange={(e) => onUpdate({ ...content, behaviorJson: e.target.value })}
              className="w-full h-full p-4 bg-transparent text-emerald-400 code-font text-sm resize-none focus:outline-none whitespace-pre"
              spellCheck={false}
            />
          )}
          {activeTab === 'resource' && (
            <textarea
              value={content.resourceJson}
              onChange={(e) => onUpdate({ ...content, resourceJson: e.target.value })}
              className="w-full h-full p-4 bg-transparent text-blue-400 code-font text-sm resize-none focus:outline-none whitespace-pre"
              spellCheck={false}
            />
          )}
          {activeTab === 'preview' && (
            <Previewer content={content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
