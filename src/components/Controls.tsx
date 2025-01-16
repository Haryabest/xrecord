import React from 'react';
import { Play, Square, Folder } from 'lucide-react';

interface ControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSelectFolder: () => void;
  folderPath: string | null;
}

export const Controls: React.FC<ControlsProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onSelectFolder,
  folderPath,
}) => {
  return (
    <div className="">
      <div className="">
        <div className="">
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? (
              <>
                <Square size={20} />
                Stop Recording
              </>
            ) : (
              <>
                <Play size={20} />
                Start Recording
              </>
            )}
          </button>
          
          <button
            onClick={onSelectFolder}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            <Folder size={20} />
            Select Folder
          </button>
        </div>
        
        <div className="text-sm text-gray-300">
          {folderPath ? `Save Location: ${folderPath}` : 'No folder selected'}
        </div>
      </div>
    </div>
  );
};