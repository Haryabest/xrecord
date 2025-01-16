import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { createVideoStream } from '../utils/streamUtils';
import { startCaptureLoop } from '../utils/captureUtils';
import type { SourceStream } from '../types/sourceTypes';

export const useSourceStreams = () => {
  const [sourceStreams, setSourceStreams] = useState<SourceStream[]>([]);
  const [captureIntervals, setCaptureIntervals] = useState<{[key: string]: number}>({});

  const addSourceStream = async (title: string, handle: number) => {
    try {
      console.log('Adding source stream for:', title, handle);
      
      // Create video stream
      const stream = await createVideoStream();
      if (!stream) {
        throw new Error('Failed to create video stream');
      }

      // Start capture loop
      const intervalId = await startCaptureLoop(
        BigInt(handle),
        stream,
        (error) => console.error('Capture error:', error)
      );

      setCaptureIntervals(prev => ({
        ...prev,
        [title]: intervalId
      }));

      const newSourceStream = { title, handle, stream };
      setSourceStreams(prev => [...prev, newSourceStream]);
      
      return stream;
    } catch (error) {
      console.error('Error setting up stream:', error);
      return null;
    }
  };

  const getStreamBySource = (title: string) => {
    const source = sourceStreams.find(s => s.title === title);
    return source?.stream || null;
  };

  const removeSourceStream = (title: string) => {
    // Clear capture interval
    if (captureIntervals[title]) {
      clearInterval(captureIntervals[title]);
      setCaptureIntervals(prev => {
        const { [title]: _, ...rest } = prev;
        return rest;
      });
    }

    // Stop and remove stream
    const source = sourceStreams.find(s => s.title === title);
    if (source?.stream) {
      source.stream.getTracks().forEach(track => track.stop());
    }
    
    setSourceStreams(prev => prev.filter(s => s.title !== title));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(captureIntervals).forEach(clearInterval);
      sourceStreams.forEach(({ stream }) => {
        stream?.getTracks().forEach(track => track.stop());
      });
    };
  }, []);

  return {
    sourceStreams,
    addSourceStream,
    getStreamBySource,
    removeSourceStream,
  };
};