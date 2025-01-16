import { useState, useCallback, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface SourceStream {
  title: string;
  stream: MediaStream | null;
}

export const useSourceStreams = () => {
  const [sourceStreams, setSourceStreams] = useState<SourceStream[]>([]);

  const addSourceStream = useCallback(async (title: string) => {
    console.log(`[useSourceStreams] Attempting to add source stream for: ${title}`);
    console.log(`[useSourceStreams] Current streams:`, sourceStreams);
    
    try {
      // First get the window capture from Rust
      console.log(`[useSourceStreams] Invoking set_selected_source with title: ${title}`);
      await invoke('set_selected_source', { source: title });
      console.log('[useSourceStreams] Successfully set selected source in Rust');

      // Then get the display media
      console.log('[useSourceStreams] Requesting display media...');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'window',
        },
        audio: false
      });
      
      console.log('[useSourceStreams] Successfully got display media stream:', stream);
      console.log('[useSourceStreams] Stream tracks:', stream.getTracks());

      setSourceStreams(prev => {
        const newStreams = prev.filter(s => s.title !== title);
        console.log('[useSourceStreams] Updated streams:', [...newStreams, { title, stream }]);
        return [...newStreams, { title, stream }];
      });

      return stream;
    } catch (error) {
      console.error('[useSourceStreams] Error capturing stream:', error);
      return null;
    }
  }, [sourceStreams]);

  const getStreamBySource = useCallback((title: string) => {
    console.log(`[useSourceStreams] Getting stream for source: ${title}`);
    console.log(`[useSourceStreams] Available streams:`, sourceStreams);
    
    const source = sourceStreams.find(s => s.title === title);
    console.log(`[useSourceStreams] Found stream for ${title}:`, source);
    
    if (source?.stream) {
      console.log(`[useSourceStreams] Stream tracks:`, source.stream.getTracks());
      return source.stream;
    }
    
    console.log(`[useSourceStreams] No stream found for ${title}`);
    return null;
  }, [sourceStreams]);

  const removeSourceStream = useCallback((title: string) => {
    console.log(`[useSourceStreams] Removing stream for source: ${title}`);
    const source = sourceStreams.find(s => s.title === title);
    
    if (source?.stream) {
      console.log(`[useSourceStreams] Stopping tracks for ${title}`);
      source.stream.getTracks().forEach(track => {
        console.log(`[useSourceStreams] Stopping track:`, track);
        track.stop();
      });
    }
    
    setSourceStreams(prev => {
      const newStreams = prev.filter(s => s.title !== title);
      console.log(`[useSourceStreams] Updated streams after removal:`, newStreams);
      return newStreams;
    });
  }, [sourceStreams]);

  // Listen for stream-ready events from Rust
  useEffect(() => {
    console.log('[useSourceStreams] Setting up stream-ready listener');
    
    const unsubscribe = listen('stream-ready', (event: any) => {
      console.log('[useSourceStreams] Received stream-ready event:', event);
      const source = event.payload as string;
      
      if (source) {
        console.log(`[useSourceStreams] Requesting display media for ${source}`);
        navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'window',
          },
          audio: false
        }).then(stream => {
          console.log(`[useSourceStreams] Got stream for ${source}:`, stream);
          setSourceStreams(prev => [...prev, { title: source, stream }]);
        }).catch(err => {
          console.error(`[useSourceStreams] Error getting display media:`, err);
        });
      }
    });

    return () => {
      console.log('[useSourceStreams] Cleaning up stream-ready listener');
      unsubscribe.then(fn => fn());
    };
  }, []);

  return {
    sourceStreams,
    addSourceStream,
    getStreamBySource,
    removeSourceStream,
  };
};