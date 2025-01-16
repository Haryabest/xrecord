import React, { useState } from "react";
import styles from "./ScenePanel.module.css";
interface SceneModalProps {
  onClose: () => void;
  onAddScene: (sceneName: string) => boolean; // Возвращает boolean
}

const SceneModal: React.FC<SceneModalProps> = ({ onClose, onAddScene }) => {
  const [sceneName, setSceneName] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSceneName(event.target.value);
  };

  const handleAddClick = () => {
    if (sceneName.trim()) {
      const isAdded = onAddScene(sceneName); // Проверяем успешность добавления
      if (isAdded) {
        setSceneName(""); // Очищаем поле
        onClose(); // Закрываем модальное окно
      } else {
        alert("Сцена с таким названием уже существует!"); // Показываем предупреждение
      }
    }
  };

  const handleCancelClick = () => {
    setSceneName(""); // Очищаем поле
    onClose(); // Закрываем модальное окно
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>×</button>
        <h2>Добавить новую сцену</h2>
        <input
          type="text"
          value={sceneName}
          onChange={handleInputChange}
          placeholder="Введите название сцены"
          className={styles.modalInput}
        />
        <div className={styles.modalActions}>
          <button onClick={handleAddClick} className={styles.modalButton}>Добавить</button>
          <button onClick={handleCancelClick} className={styles.modalButton}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default SceneModal;
