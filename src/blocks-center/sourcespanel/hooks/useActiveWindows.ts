// src/hooks/useActiveWindows.ts
import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface WindowInfo {
  title: string;
  handle: number;
  thumbnail: string | null;
}

const useActiveWindows = () => {
  const [activeWindows, setActiveWindows] = useState<WindowInfo[]>([]);

  useEffect(() => {
    const fetchActiveWindows = async () => {
      const windows = await invoke<WindowInfo[]>("get_active_window_titles");
      setActiveWindows(windows);
    };

    fetchActiveWindows();

    const unsubscribe = listen('active-windows', (event: any) => {
      const windows = event.payload as WindowInfo[];
      setActiveWindows(windows);
    });

    return () => {
      unsubscribe.then(fn => fn());
    };
  }, []);

  return activeWindows;
};

export default useActiveWindows;
