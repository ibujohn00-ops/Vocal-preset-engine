import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Editor: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Audio Editor</h1>
        <p className="text-slate-400 mt-2">Upload, process, and download your vocals</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <FiLoader className="animate-spin-slow mx-auto mb-4" size={32} />
        <p className="text-slate-400">Editor interface coming soon...</p>
      </div>
    </div>
  );
};

export default Editor;
