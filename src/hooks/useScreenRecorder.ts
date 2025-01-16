import { useRef, useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export const useScreenRecorder = (mainFolderName: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const chunksRef = useRef<Blob[]>([]);
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initializeFolder = async () => {
      try {
        const folderPath = await invoke("create_folder", { folderName: mainFolderName }) as string;
        console.log("Папка создана/существует:", folderPath);
        setFolderPath(folderPath);
      } catch (error) {
        console.error("Ошибка при создании папки:", error);
      }
    };

    initializeFolder();
  }, [mainFolderName]);

  const handleStreamChange = (newStream: MediaStream | null) => {
    if (isRecording && newStream && mediaRecorderRef.current) {
      // Store chunks from current recording
      const currentChunks = chunksRef.current;
      
      // Stop current recorder
      mediaRecorderRef.current.stop();
      
      // Create new recorder with new stream
      const newRecorder = new MediaRecorder(newStream, {
        mimeType: "video/webm"
      });
      
      newRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      newRecorder.onstop = mediaRecorderRef.current.onstop;
      
      // Start new recording
      mediaRecorderRef.current = newRecorder;
      newRecorder.start(1000);
      
      // Keep existing chunks
      chunksRef.current = currentChunks;
    }
    
    currentStreamRef.current = newStream;
  };

  const selectFolder = async () => {
    try {
      const selectedFolderPath = await open({
        directory: true,
      });

      const folderPathString = selectedFolderPath as string;
      if (folderPathString) {
        setFolderPath(folderPathString);
        console.log("Выбранная папка:", folderPathString);
      } else {
        alert("Папка не была выбрана.");
      }
    } catch (err) {
      console.error("Ошибка при открытии проводника:", err);
      alert("Ошибка при открытии проводника: " + err);
    }
  };

  const startRecording = async () => {
    if (!folderPath) {
      alert("Пожалуйста, выберите папку для сохранения видео.");
      return;
    }

    if (!currentStreamRef.current) {
      alert("Пожалуйста, выберите источник для записи.");
      return;
    }

    try {
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(currentStreamRef.current, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsRecording(false);

        if (chunksRef.current.length > 0) {
          try {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            const buffer = await blob.arrayBuffer();
            const bytes = new Uint8Array(buffer);

            const fileName = `recording_${Date.now()}.webm`;

            await invoke("save_recording", {
              recording: Array.from(bytes),
              filename: fileName,
              path: folderPath,
            });

            alert(`Видео сохранено в папке: ${folderPath}`);
          } catch (error) {
            console.error("Ошибка при сохранении видео:", error);
            alert("Ошибка при сохранении видео: " + error);
          }
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Ошибка при начале записи:", error);
      alert("Ошибка при начале записи: " + error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  return {
    videoRef,
    isRecording,
    folderPath,
    startRecording,
    stopRecording,
    selectFolder,
    handleStreamChange
  };
};