import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Settings, PlayCircle } from "lucide-react"; // Импорт иконок
import styles from "./ControlPanel.module.css";

const ControlPanel = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleButtonClick = (action: string) => {
    switch (action) {
      case "start":
        invoke("start_recording") // Взаимодействие с Tauri для начала записи
          .then(() => setIsRecording(true))
          .catch((error) => console.error("Ошибка при начале записи:", error));
        break;
      case "stop":
        invoke("stop_recording") // Взаимодействие с Tauri для остановки записи
          .then(() => setIsRecording(false))
          .catch((error) =>
            console.error("Ошибка при остановке записи:", error)
          );
        break;
      case "settings":
        // Открыть настройки (можно добавить логику открытия модального окна настроек)
        console.log("Открытие настроек...");
        break;
      case "wait":
        console.log("Ожидание...");
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.borderText}>Управление</div>
      <div className={styles.content}>
        {/* Кнопки управления */}
        <div className={styles.block}>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => handleButtonClick("start")}
              className={`${styles.button} ${
                isRecording ? styles.disabled : ""
              }`}
              disabled={isRecording}
            >
              <PlayCircle className={styles.icon} />
              Начать запись
            </button>


            <button
              onClick={() => handleButtonClick("settings")}
              className={styles.button}
            >
              <Settings className={styles.icon} />
              Настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
