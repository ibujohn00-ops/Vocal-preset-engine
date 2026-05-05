import React from 'react';

interface ProcessingStatusProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  progress,
  error,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-400';
      case 'completed':
        return 'text-green-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="w-full bg-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Processing Status</h3>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusDisplay()}
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 text-right">{progress}%</p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default ProcessingStatus;
