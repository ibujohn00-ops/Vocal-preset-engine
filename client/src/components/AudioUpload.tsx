import React from 'react';
import { FiUpload } from 'react-icons/fi';

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

const AudioUpload: React.FC<AudioUploadProps> = ({ onFileSelect, isLoading = false }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ['audio/wav', 'audio/mpeg', 'audio/flac', 'audio/ogg'].includes(file.type)) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      alert('Please select a valid audio file (WAV, MP3, FLAC, OGG)');
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".wav,.mp3,.flac,.ogg"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="w-full p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-purple-500 hover:bg-slate-900/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center space-y-2">
          <FiUpload size={32} className="text-purple-400" />
          <div>
            <p className="font-medium">Upload Audio File</p>
            <p className="text-sm text-slate-400">WAV, MP3, FLAC, or OGG</p>
            {fileName && <p className="text-sm text-green-400 mt-2">{fileName}</p>}
          </div>
        </div>
      </button>
    </div>
  );
};

export default AudioUpload;
