import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { invoke } from "@tauri-apps/api/core";

interface SystemInfo {
  cpu_usage: number; // Загруженность процессора
  gpu_usage: number; // Загруженность GPU
}

const BottomBar = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({ cpu_usage: 0, gpu_usage: 0 });

  useEffect(() => {
    // Обновляем данные каждую секунду
    const interval = setInterval(() => {
      // Получаем данные CPU и GPU параллельно
      Promise.all([
        invoke<number>("get_cpu_usage"),
        invoke<number>("get_gpu_usage")
      ])
        .then(([cpuUsage, gpuUsage]) => {
          console.log("Получены значения CPU и GPU:", cpuUsage, gpuUsage);
          setSystemInfo({ cpu_usage: cpuUsage, gpu_usage: gpuUsage });
        })
        .catch((error) => {
          console.error("Ошибка при получении данных о CPU/GPU:", error);
        });
    }, 1000);

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, []);

  return ReactDOM.createPortal(
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.version}>Version 1.0.0</div>
        <div style={styles.rightContent}>
          <div style={styles.item}>
            <div style={styles.dot}></div>
            00:00:00 {/* Здесь можно отображать время или другие данные */}
          </div>
          <div style={styles.divider}></div>
          <div style={styles.item}>CPU: {systemInfo.cpu_usage.toFixed(2).padStart(6, " ")}%</div>
          <div style={styles.divider}></div>
          <div style={styles.item}>GPU: {systemInfo.gpu_usage.toFixed(2).padStart(6, " ")}%</div>
          <div style={styles.divider}></div>
          <div style={styles.item}>FPS 30.00 / 30</div> {/* Замените на фактические данные FPS, если есть */}
        </div>
      </div>
    </div>,
    document.body // Рендерится непосредственно в body
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#343434",
    borderTop: "1px solid #444444",
    padding: "10px 0",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px",
    color: "#DEDEDE",
  },
  version: {
    fontFamily: "DM Sans",
    fontSize: "13px",
    padding: "4px 12px",
    border: "3px solid #444444",
    borderBottomWidth: "7px",
    borderRadius: "16px",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  rightContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  item: {
    padding: "4px 12px",
    border: "3px solid #444444",
    borderBottomWidth: "7px",
    borderRadius: "16px",
    fontFamily: "DM Sans",
    fontSize: "13px",
    textAlign: "center",
    whiteSpace: "nowrap",
    width: "120px", // Фиксированная ширина
    overflow: "hidden", // Скрытие текста, выходящего за границы
    textOverflow: "ellipsis", // Добавление многоточия, если текст слишком длинный
  },
  divider: {
    width: "1px",
    height: "25px",
    backgroundColor: "#444444",
  },
  dot: {
    display: "inline-block",
    width: "10px",
    height: "10px",
    backgroundColor: "#F5C5FF",
    borderRadius: "50%",
    marginRight: "8px",
  },
};

export default BottomBar;
