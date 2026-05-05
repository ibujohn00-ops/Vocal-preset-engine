import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-2">Manage your audio projects and presets</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Projects</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Presets</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Storage Used</h3>
          <p className="text-3xl font-bold">0 MB</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <FiLoader className="animate-spin-slow mx-auto mb-4" size={32} />
        <p className="text-slate-400">Dashboard features coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
