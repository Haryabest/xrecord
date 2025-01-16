import React, { useState, useCallback, useEffect } from "react";
import { useSourceStreams } from "../../hooks/useSourceStreams";
import useActiveWindows from "./hooks/useActiveWindows";
import ActionButtons from "./ActionButtons";
import ModalWindow from "./ModalWindow";
import styles from "./SourcesPanel.module.css";
import { invoke } from "@tauri-apps/api/core";

interface SourcesPanelProps {
  onSourcesChange?: (sources: string[]) => void;
  onSelectSource?: (source: string, stream: MediaStream | null) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onStreamChange: (stream: MediaStream | null) => void;
  onSourceChange: (source: string | null, stream: MediaStream | null) => void;
  selectedSource: string | null;
}


const SourcesPanel = ({ onSourcesChange, onSelectSource, videoRef, onStreamChange, selectedSource, onSourceChange}: SourcesPanelProps) => {
  const [showModal, setShowModal] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const activeWindows = useActiveWindows();
  const { addSourceStream, getStreamBySource, removeSourceStream } = useSourceStreams();

  useEffect(() => {
    // When activeSource changes, update the video preview
    if (activeSource) {
      const stream = getStreamBySource(activeSource);
      if (onSelectSource) onSelectSource(activeSource, stream);
    }
  }, [activeSource, getStreamBySource, onSelectSource]);




  const handleSourceAction = (action: string) => {
    console.log(`[SourcesPanel] Source action: ${action}`);
    switch (action) {
      case "add":
        setShowModal(true);
        break;
      case "delete":
        if (selectedSource) {
          removeSourceStream(selectedSource);
          setSources(prev => prev.filter(source => source !== selectedSource));
          onSourceChange(null, null);
        }
        break;
      case "edit":
        if (activeSource) {
          const index = sources.indexOf(activeSource);
          setEditingIndex(index);
        }
        break;
      case "moveUp":
        if (activeSource && sources.length > 1) {
          const index = sources.indexOf(activeSource);
          if (index > 0) {
            const newSources = [...sources];
            [newSources[index], newSources[index - 1]] = [newSources[index - 1], newSources[index]];
            setSources(newSources);
            if (onSourcesChange) onSourcesChange(newSources);
          }
        }
        break;
      case "moveDown":
        if (activeSource && sources.length > 1) {
          const index = sources.indexOf(activeSource);
          if (index < sources.length - 1) {
            const newSources = [...sources];
            [newSources[index], newSources[index + 1]] = [newSources[index + 1], newSources[index]];
            setSources(newSources);
            if (onSourcesChange) onSourcesChange(newSources);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleWindowSelect = async (windowTitle: string) => {
    try {
      if (sources.includes(windowTitle)) {
        alert("This window is already added!");
        return;
      }
    
      const selectedWindow = activeWindows.find(w => w.title === windowTitle);
      if (!selectedWindow) {
        throw new Error('Window not found in active windows list');
      }
    
      // Create a MediaStream from the window capture
      const stream = await createStreamFromWindowCapture(selectedWindow.handle.toString());
      
      if (!stream) {
        throw new Error('Failed to create stream for window');
      }
      
      // Add the stream to the source streams
      await addSourceStream(windowTitle, selectedWindow.handle);
      
      setSources(prev => [...prev, windowTitle]);
      setShowModal(false);
      onSourceChange(windowTitle, stream);
    } catch (error) {
      console.error('Error adding window source:', error);
      alert('Failed to add window source. Please try again.');
    }
  };




  const createStreamFromWindowCapture = async (handle: string): Promise<MediaStream> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Set initial canvas size
    canvas.width = 1280;  // Default width
    canvas.height = 720;  // Default height

    // Create a MediaStream from the canvas
    const stream = canvas.captureStream(30); // 30 FPS

    // Function to update the canvas with new window capture data
    const updateCanvas = async () => {
      try {
        // Capture window content using Tauri command
        const imageData: number[] = await invoke('capture_window', { handle });
        
        // Convert the raw bytes to ImageData
        const uint8Array = new Uint8Array(imageData);
        const blob = new Blob([uint8Array], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        
        // Create an image element and draw it to the canvas
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(imageUrl);
        };
        img.src = imageUrl;
      } catch (error) {
        console.error('Error capturing window:', error);
      }
      
      // Schedule next frame
      requestAnimationFrame(updateCanvas);
    };

    // Start the capture loop
    updateCanvas();

    return stream;
  };














  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingIndex !== null) {
      const updatedSources = [...sources];
      updatedSources[editingIndex] = event.target.value;
      setSources(updatedSources);
    }
  };

  const handleEditSave = () => {
    if (editingIndex !== null) {
      const newSourceValue = sources[editingIndex];

      const isSourceExist = sources.some((source, index) => source === newSourceValue && index !== editingIndex);

      if (isSourceExist) {
        alert("Этот источник уже существует!");
        return;
      }

      setEditingIndex(null);
    }
  };

  const handleSourceSelect = useCallback((source: string) => {
    try {
      const stream = getStreamBySource(source);
      onSourceChange(source, stream);
    } catch (error) {
      console.error('Error selecting source:', error);
    }
  }, [getStreamBySource, onSourceChange]);

  const handleEditKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditSave();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.borderText}>Sources</div>
      <div className={styles.content}>
        <div className={styles.sourceBlock}>
          {!sources.length && <p>Source list will appear here</p>}
          <ul className={styles.sourcesList}>
            {sources.map((source, index) => (
              <li
                key={index}
                className={`${styles.sourceItem} ${selectedSource === source ? styles.active : ""}`}
                onClick={() => handleSourceSelect(source)}
              >
                {source}
              </li>
            ))}
          </ul>
        </div>
        <hr className={styles.divider} />
        <ActionButtons onAction={handleSourceAction} isListEmpty={sources.length === 0} />
      </div>

      {showModal && (
        <ModalWindow
          activeWindows={activeWindows}
          onWindowSelect={handleWindowSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );

};

export default SourcesPanel;
