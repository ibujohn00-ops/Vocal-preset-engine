import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMusic, FiZap, FiSliders } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          VocalLab AI
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl">
          Professional vocal mixing and mastering powered by AI
        </p>
        <p className="text-slate-400 max-w-2xl">
          Upload your vocals, select a preset, and let our AI-powered system
          automatically mix and master your audio to professional standards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {isAuthenticated ? (
            <>
              <Link
                to="/editor"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-medium flex items-center justify-center space-x-2"
              >
                <span>Start Processing</span>
                <FiArrowRight />
              </Link>
              <Link
                to="/presets"
                className="px-8 py-3 rounded-lg border border-purple-500 hover:bg-purple-500/10 transition font-medium"
              >
                Browse Presets
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-medium flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <FiArrowRight />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-3">
          <FiMusic size={32} className="text-purple-400" />
          <h3 className="text-lg font-bold">Upload & Process</h3>
          <p className="text-slate-400">
            Upload your vocal audio in WAV or MP3 format, then process it with professional presets.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-3">
          <FiZap size={32} className="text-pink-400" />
          <h3 className="text-lg font-bold">AI-Powered Remix</h3>
          <p className="text-slate-400">
            Our AI analyzes your vocal and intelligently modifies presets for optimal results.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-3">
          <FiSliders size={32} className="text-blue-400" />
          <h3 className="text-lg font-bold">Custom Presets</h3>
          <p className="text-slate-400">
            Create, save, and share your own vocal presets with professional effect chains.
          </p>
        </div>
      </div>

      {/* Audio Processing Features */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold">Professional Audio Processing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-3 text-purple-400">Effects Chain</h3>
            <ul className="space-y-2 text-slate-300">
              <li>✓ Pitch Correction & Auto-Tune</li>
              <li>✓ EQ (Parametric)</li>
              <li>✓ Compression</li>
              <li>✓ Reverb & Spatial Effects</li>
              <li>✓ Peak Limiting</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-pink-400">AI Analysis</h3>
            <ul className="space-y-2 text-slate-300">
              <li>✓ Pitch Detection</li>
              <li>✓ Loudness Metering (LUFS)</li>
              <li>✓ Tone Classification</li>
              <li>✓ Dynamic Range Analysis</li>
              <li>✓ Smart Preset Optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
