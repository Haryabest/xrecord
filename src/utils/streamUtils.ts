export const createVideoStream = async (): Promise<MediaStream> => {
    try {
      // Request screen capture from the browser
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        }
      });
      return stream;
    } catch (error) {
      console.error('Failed to create video stream:', error);
      throw error;
    }
  };