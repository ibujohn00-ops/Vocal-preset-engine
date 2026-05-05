import React from 'react';
import { FiPlay, FiPause, FiDownload } from 'react-icons/fi';

interface AudioPlayerProps {
  src: string;
  label: string;
  onDownload?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, onDownload }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full bg-slate-800 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-medium text-slate-300">{label}</h3>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition"
        >
          {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
        </button>
        <div className="flex-1">
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-slate-400 min-w-[40px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      {onDownload && (
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center space-x-2 p-2 bg-slate-700 hover:bg-slate-600 rounded transition text-sm font-medium"
        >
          <FiDownload size={16} />
          <span>Download</span>
        </button>
      )}
    </div>
  );
};

export default AudioPlayer;
