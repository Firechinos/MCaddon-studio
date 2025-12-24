
import React, { useMemo } from 'react';
import { AddonType, AddonContent } from '../types';
import { Activity, Shield, Zap, Box, Sword, Layers, Info } from 'lucide-react';

interface PreviewerProps {
  content: AddonContent;
}

const Previewer: React.FC<PreviewerProps> = ({ content }) => {
  const parsedData = useMemo(() => {
    try {
      return JSON.parse(content.behaviorJson);
    } catch (e) {
      return null;
    }
  }, [content.behaviorJson]);

  const components = useMemo(() => {
    if (!parsedData) return {};
    const rootKey = Object.keys(parsedData).find(k => k.startsWith('minecraft:')) || '';
    return parsedData[rootKey]?.components || {};
  }, [parsedData]);

  const identifier = useMemo(() => {
    if (!parsedData) return 'unknown';
    const rootKey = Object.keys(parsedData).find(k => k.startsWith('minecraft:')) || '';
    return parsedData[rootKey]?.description?.identifier || 'unknown';
  }, [parsedData]);

  const renderBlockPreview = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="scene mb-12">
        <div className="cube">
          <div className="cube__face cube__face--front"></div>
          <div className="cube__face cube__face--back"></div>
          <div className="cube__face cube__face--right"></div>
          <div className="cube__face cube__face--left"></div>
          <div className="cube__face cube__face--top"></div>
          <div className="cube__face cube__face--bottom"></div>
        </div>
      </div>
      <div className="text-center">
        <h4 className="text-xl font-bold text-blue-400">{content.name}</h4>
        <p className="text-slate-500 font-mono text-xs">{identifier}</p>
      </div>
    </div>
  );

  const renderEntityPreview = () => {
    const health = components['minecraft:health']?.value || components['minecraft:health']?.max || 'N/A';
    const speed = components['minecraft:movement']?.value || 'N/A';
    
    return (
      <div className="p-8 h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-48 h-64 bg-slate-800 rounded-3xl border-2 border-slate-700 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
             <Activity className="w-24 h-24 text-slate-700 animate-pulse" />
          </div>
          <div className="absolute -right-4 top-1/4 space-y-2">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
               <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase mb-1">
                 <Shield className="w-3 h-3" /> HP
               </div>
               <div className="text-xl font-bold">{health}</div>
            </div>
             <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
               <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase mb-1">
                 <Zap className="w-3 h-3" /> Speed
               </div>
               <div className="text-xl font-bold">{speed}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
           {Object.keys(components).slice(0, 4).map(key => (
             <div key={key} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 flex items-center gap-3">
               <div className="p-2 bg-blue-600/10 rounded-md">
                 <Info className="w-4 h-4 text-blue-500" />
               </div>
               <div className="min-w-0">
                 <div className="text-[10px] text-slate-500 uppercase font-bold truncate">{key.replace('minecraft:', '')}</div>
                 <div className="text-xs text-slate-300 truncate">Component Active</div>
               </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  const renderItemPreview = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="w-32 h-32 bg-slate-800 rounded-2xl border-4 border-slate-700 flex items-center justify-center relative shadow-2xl group">
        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors rounded-xl" />
        <Sword className="w-16 h-16 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      </div>
      <div className="text-center">
        <h4 className="text-xl font-bold text-slate-200">{content.name}</h4>
        <div className="flex gap-2 justify-center mt-2">
          {components['minecraft:hand_equipped'] && <span className="px-2 py-1 bg-amber-900/30 text-amber-500 rounded text-[10px] uppercase font-bold">Tool</span>}
          {components['minecraft:food'] && <span className="px-2 py-1 bg-green-900/30 text-green-500 rounded text-[10px] uppercase font-bold">Consumable</span>}
          <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] uppercase font-bold">Item</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-950 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/80 backdrop-blur rounded-full border border-slate-800">
           <Layers className="w-4 h-4 text-blue-500" />
           <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Preview Engine v1.0</span>
        </div>
      </div>

      {!parsedData ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <Info className="w-12 h-12 text-slate-800 mb-4" />
          <h3 className="text-slate-500 font-medium">No valid JSON found</h3>
          <p className="text-slate-700 text-sm mt-1">Generate code with AI to see a structural preview.</p>
        </div>
      ) : (
        <>
          {content.type === AddonType.BLOCK && renderBlockPreview()}
          {content.type === AddonType.ENTITY && renderEntityPreview()}
          {content.type === AddonType.ITEM && renderItemPreview()}
          {content.type === AddonType.RECIPE && (
            <div className="flex items-center justify-center h-full text-slate-600 italic">
               Recipe data is structural; no visual preview available.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Previewer;
