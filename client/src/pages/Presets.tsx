import React from 'react';
import { FiLoader } from 'react-icons/fi';

const PresetsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Presets</h1>
        <p className="text-slate-400 mt-2">Manage and share your vocal presets</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <FiLoader className="animate-spin-slow mx-auto mb-4" size={32} />
        <p className="text-slate-400">Presets management coming soon...</p>
      </div>
    </div>
  );
};

export default PresetsPage;
