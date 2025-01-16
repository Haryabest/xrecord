import { useState } from "react";
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown } from "lucide-react";
import styles from "./ScenePanel.module.css";
import SceneModal from "./modal/SceneModal";  // Модальное окно для добавления сцены

const ScenePanel = () => {
  const [scenes, setScenes] = useState<{ name: string, sources: string[] }[]>([
    { name: "Сцена 1", sources: [] }
  ]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedSceneName, setEditedSceneName] = useState<string>('');
  
  // Обработчик для добавления нового источника в активную сцену

  const handleSourceAction = (action: string) => {
    switch (action) {
      case "add":
        setShowModal(true);  // Открытие модального окна для добавления сцены
        break;
      case "delete":
        if (activeScene) {
          setScenes(scenes.filter(scene => scene.name !== activeScene));  // Удаление сцены
          setActiveScene(null);  // Сброс активной сцены
        }
        break;
      case "edit":
        if (activeScene) {
          setIsEditMode(true);  // Включаем режим редактирования
          setEditedSceneName(activeScene);  // Устанавливаем имя для редактирования
        }
        break;
      case "up":
        if (activeScene) {
          const index = scenes.findIndex(scene => scene.name === activeScene);
          if (index > 0) {
            const newScenes = [...scenes];
            [newScenes[index - 1], newScenes[index]] = [newScenes[index], newScenes[index - 1]];  // Перемещение сцены вверх
            setScenes(newScenes);
          }
        }
        break;
      case "down":
        if (activeScene) {
          const index = scenes.findIndex(scene => scene.name === activeScene);
          if (index < scenes.length - 1) {
            const newScenes = [...scenes];
            [newScenes[index + 1], newScenes[index]] = [newScenes[index], newScenes[index + 1]];  // Перемещение сцены вниз
            setScenes(newScenes);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleAddScene = (sceneName: string): boolean => {
    if (scenes.some(scene => scene.name === sceneName)) {
      return false; // Возвращаем false, если сцена уже существует
    }
    setScenes((prevScenes) => [...prevScenes, { name: sceneName, sources: [] }]);
    return true; // Возвращаем true, если сцена успешно добавлена
  };

  const handleEditScene = () => {
    if (activeScene) {
      if (scenes.some((scene) => scene.name === editedSceneName && scene.name !== activeScene)) {
        alert("Сцена с таким именем уже существует!");
        return;
      }

      const updatedScenes = scenes.map((scene) =>
        scene.name === activeScene ? { ...scene, name: editedSceneName } : scene
      );
      setScenes(updatedScenes);
      setActiveScene(editedSceneName); // Обновляем активную сцену
    }
    setIsEditMode(false);
  };

  const handleModalClose = () => {
    setShowModal(false);  // Закрытие модального окна
    setIsEditMode(false);  // Выход из режима редактирования
  };

  const handleSceneClick = (sceneName: string) => {
    setActiveScene(sceneName); // Устанавливаем активную сцену
  };

  const handleSceneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSceneName(e.target.value);  // Обновляем имя сцены в процессе редактирования
  };

  const handleEditKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditScene(); // Завершаем редактирование при нажатии Enter
    }
  };

  // Получаем источники для активной сцены
  const activeSceneSources = activeScene ? scenes.find(scene => scene.name === activeScene)?.sources : [];

  return (
    <div className={styles.container}>
      <div className={styles.borderText}>Сцены</div>
      <div className={styles.content}>
        <div className={styles.sourceBlock}>
          {scenes.length === 0 ? (
            <p>Список сцен будет здесь</p>
          ) : (
            <ul className={styles.sourcesList}>
              {scenes.map((scene, index) => (
                <li
                  key={index}
                  className={`${styles.sourceItem} ${activeScene === scene.name ? styles.active : ""}`}
                  onClick={() => handleSceneClick(scene.name)} // Обработчик для активации сцены
                >
                  {isEditMode && activeScene === scene.name ? (
                    <input
                      type="text"
                      value={editedSceneName}
                      onChange={handleSceneChange}
                      onBlur={handleEditScene}  // Завершаем редактирование по уходу фокуса
                      autoFocus
                      onKeyDown={handleEditKeyPress} // Обрабатываем нажатие клавиши
                    />
                  ) : (
                    scene.name
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <hr className={styles.divider} />
        <div className={styles.buttonGroupBottom}>
          <div className={styles.iconButtonWrapper}>
            <div className={styles.tooltip}>Добавить</div>
            <button onClick={() => handleSourceAction("add")} className={styles.iconButton}>
              <Plus className={styles.icon} />
            </button>
          </div>
          <div className={styles.iconButtonWrapper}>
            <div className={styles.tooltip}>Удалить</div>
            <button onClick={() => handleSourceAction("delete")} className={styles.iconButton}>
              <Trash2 className={styles.icon} />
            </button>
          </div>
          <div className={styles.iconButtonWrapper}>
            <div className={styles.tooltip}>Редактировать</div>
            <button onClick={() => handleSourceAction("edit")} className={styles.iconButton}>
              <Edit3 className={styles.icon} />
            </button>
          </div>
          <div className={styles.iconButtonWrapper}>
            <div className={styles.tooltip}>Вверх</div>
            <button onClick={() => handleSourceAction("up")} className={styles.iconButton}>
              <ArrowUp className={styles.icon} />
            </button>
          </div>
          <div className={styles.iconButtonWrapper}>
            <div className={styles.tooltip}>Вниз</div>
            <button onClick={() => handleSourceAction("down")} className={styles.iconButton}>
              <ArrowDown className={styles.icon} />
            </button>
          </div>
        </div>
      </div>

      {/* Панель источников для активной сцены */}
      {activeScene && activeSceneSources && activeSceneSources.length > 0 && (
        <div className={styles.sourcesListWrapper}>
          <h3>Источники для {activeScene}:</h3>
          <ul>
            {activeSceneSources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Отображаем модальное окно для добавления сцены */}
      {showModal && (
        <SceneModal
          onAddScene={handleAddScene}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ScenePanel;
