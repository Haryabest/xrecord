import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { Volume2 } from "lucide-react";
import styles from "./MixerBlock.module.css";

const MixerBlock = () => {
  const [microphoneLevel, setMicrophoneLevel] = useState(0);
  const [desktopLevel, setDesktopLevel] = useState(0);
  const [microphoneVolume, setMicrophoneVolume] = useState(50);
  const [desktopVolume, setDesktopVolume] = useState(50);

  useEffect(() => {
    const unlistenMicrophone = listen<number>("microphone-level", (event) => {
      setMicrophoneLevel(event.payload);
    });

    const unlistenDesktop = listen<number>("desktop-level", (event) => {
      setDesktopLevel(event.payload);
    });

    return () => {
      unlistenMicrophone.then((unlisten) => unlisten());
      unlistenDesktop.then((unlisten) => unlisten());
    };
  }, []);

  const handleVolumeChange = (volume: number, type: "microphone" | "desktop") => {
    if (type === "microphone") {
      setMicrophoneVolume(volume);
      // Дополнительная логика для микрофона
    } else {
      setDesktopVolume(volume);
      // Дополнительная логика для рабочего стола
    }
  };

  const getBarColor = (level: number) => {
    if (level < 50) return "#40C040";
    if (level < 75) return "#FFC000";
    return "#FF4040";
  };

  return (
    <div className={styles.container}>
      <div className={styles.borderText}>Микшер звука</div>
      <div className={styles.content}>
        <VolumeBar
          label="Микрофон"
          level={microphoneLevel}
          volume={microphoneVolume}
          getBarColor={getBarColor}
          onVolumeChange={(volume) => handleVolumeChange(volume, "microphone")}
        />
        <VolumeBar
          label="бимбам"
          level={desktopLevel}
          volume={desktopVolume}
          getBarColor={getBarColor}
          onVolumeChange={(volume) => handleVolumeChange(volume, "desktop")}
        />
      </div>
    </div>
  );
};

const VolumeBar = ({
  label,
  level,
  volume,
  getBarColor,
  onVolumeChange,
}: {
  label: string;
  level: number;
  volume: number;
  getBarColor: (level: number) => string;
  onVolumeChange: (volume: number) => void;
}) => {
  return (
    <div className={styles.item}>
      <div className={styles.label}>{label}</div>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{
            width: `${level}%`,
            backgroundColor: getBarColor(level),
          }}
        />
      </div>
      <div className={styles.value}>{level.toFixed(1)}%</div>
      <div className={styles.volumeControl}>
        <Volume2 className={styles.volumeIcon} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className={styles.slider}
        />
        <span>{volume}%</span>
      </div>
    </div>
  );
};

export default MixerBlock;
