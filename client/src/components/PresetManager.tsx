import React from 'react';
import { FiEdit2, FiShare2, FiTrash2 } from 'react-icons/fi';

interface Preset {
  _id: string;
  name: string;
  description?: string;
  effects: any;
}

interface PresetManagerProps {
  presets: Preset[];
  selectedPreset?: Preset;
  onSelect: (preset: Preset) => void;
  onDelete?: (presetId: string) => void;
  onShare?: (presetId: string) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  selectedPreset,
  onSelect,
  onDelete,
  onShare,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-4">Your Presets</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {presets.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No presets yet</p>
        ) : (
          presets.map((preset) => (
            <div
              key={preset._id}
              onClick={() => onSelect(preset)}
              className={`p-4 rounded-lg cursor-pointer transition ${
                selectedPreset?._id === preset._id
                  ? 'bg-purple-900 border border-purple-500'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{preset.name}</h3>
                  {preset.description && (
                    <p className="text-sm text-slate-400 mt-1">{preset.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(preset.effects).map(([key, effect]: [string, any]) => {
                      if (effect?.enabled) {
                        return (
                          <span
                            key={key}
                            className="text-xs px-2 py-1 bg-slate-700 rounded"
                          >
                            {key}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                <div className="flex space-x-2 ml-2">
                  {onShare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(preset._id);
                      }}
                      className="p-2 hover:bg-slate-600 rounded transition"
                      title="Share"
                    >
                      <FiShare2 size={16} />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(preset._id);
                      }}
                      className="p-2 hover:bg-red-900 text-red-400 rounded transition"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PresetManager;
