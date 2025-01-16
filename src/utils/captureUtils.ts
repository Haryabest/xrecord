import { invoke } from '@tauri-apps/api/core';

export const startCaptureLoop = async (
  handle: bigint,
  stream: MediaStream,
  onError: (error: any) => void
): Promise<number> => {
  return window.setInterval(async () => {
    try {
      const frameData = await invoke<number[]>('capture_window', { 
        handle: handle.toString()
      });

      if (!frameData || !frameData.length) {
        throw new Error('No frame data received');
      }

      // Calculate dimensions ensuring they're valid for ImageData
      const pixelCount = frameData.length / 4; // RGBA = 4 bytes per pixel
      const width = Math.floor(Math.sqrt(pixelCount));
      const height = Math.floor(pixelCount / width);

      // Ensure we have the correct amount of data
      const validDataLength = width * height * 4;
      const validData = frameData.slice(0, validDataLength);

      const imageData = new ImageData(
        new Uint8ClampedArray(validData),
        width,
        height
      );

      const bitmap = await createImageBitmap(imageData);
      const videoTrack = stream.getVideoTracks()[0];

      if (videoTrack && videoTrack.enabled) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0);
        }
      }
    } catch (error) {
      onError(error);
    }
  }, 1000 / 30); // 30 FPS
};