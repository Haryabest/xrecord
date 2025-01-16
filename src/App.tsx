import React, { useState, useRef } from "react";
import { VideoPreview } from "./components/VideoPreview";
import { Controls } from "./components/Controls";
import { useScreenRecorder } from "./hooks/useScreenRecorder";
import BottomBar from "./bottom/Bottom";
import AllBlocks from "./blocks-center/AllBlocks";

const ScreenRecorder: React.FC = () => {
  const {
    isRecording,
    folderPath,
    videoRef,
    startRecording,
    stopRecording,
    selectFolder,
  } = useScreenRecorder("screen-recordings");

  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleSourceChange = (source: string | null, stream: MediaStream | null) => {
    console.log('Source changed:', { source, hasStream: !!stream });
    setSelectedSource(source);
    setCurrentStream(stream);
  };

  return (
    <div>
      <div>
        <VideoPreview 
          videoRef={videoRef}
          stream={currentStream}
        />
        <AllBlocks 
          onSourceChange={handleSourceChange}
          selectedSource={selectedSource}
        />
      </div>
      
      <Controls
        isRecording={isRecording}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onSelectFolder={selectFolder}
        folderPath={folderPath}
      />
      <BottomBar />
    </div>
  );
};

export default ScreenRecorder;