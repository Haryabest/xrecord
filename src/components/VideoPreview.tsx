import React from 'react';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import './VideoPreview.css';

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ videoRef, stream }) => {
  const [dimensions, setDimensions] = React.useState({ width: 640, height: 360 });

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    }
  }, [stream, videoRef]);

  const onResize = (_: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setDimensions({
      width: size.width,
      height: size.height,
    });
  };

  return (
    <div className="video-preview-container">
      <div className="video-preview-wrapper">
        <div className="video-preview-box">
          <div className="video-preview-header">
            <span className="video-title">Preview</span>
            <span className="video-dimensions">
              {dimensions.width} x {dimensions.height}
            </span>
          </div>
          <div className="video-preview-content">
            <Draggable bounds="parent" handle=".handle">
              <div className="draggable-box">
                <ResizableBox
                  width={dimensions.width}
                  height={dimensions.height}
                  onResize={onResize}
                  minConstraints={[320, 180]}
                  maxConstraints={[1920, 1080]}
                  resizeHandles={['se', 'sw', 'ne', 'nw', 'e', 'w', 'n', 's']}
                  className="resizable-box"
                >
                  <div className="handle video-box">
                    <video
                      ref={videoRef}
                      className="video"
                      style={{
                        width: dimensions.width,
                        height: dimensions.height,
                      }}
                      autoPlay
                      playsInline
                    />
                    <div className="video-overlay" />
                  </div>
                </ResizableBox>
              </div>
            </Draggable>
          </div>
        </div>
      </div>
    </div>
  );
};