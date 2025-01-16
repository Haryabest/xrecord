import React from "react";
import MixerBlock from './mixerpanel/MixerBlock';
import ControlPanel from './controlpanel/ControlPanel';
import SourcesPanel from './sourcespanel/SourcesPanel';
import ScenePanel from './scenepanel/ScenePanel';

import styles from './AllBlock.module.css';

interface AllBlocksProps {
  selectedSource: string | null;
  onSourceChange: (source: string | null, stream: MediaStream | null) => void;
}

const AllBlocks: React.FC<AllBlocksProps> = ({ onSourceChange, selectedSource }) => {
  return (
    <div className={styles.container}>
      <ScenePanel />
      <SourcesPanel 
        onSourceChange={onSourceChange}
        selectedSource={selectedSource} videoRef={undefined} onStreamChange={function (stream: MediaStream | null): void {
          throw new Error("Function not implemented.");
        } }      />
      <MixerBlock />
      <ControlPanel />
    </div>
  );
};

export default AllBlocks;
