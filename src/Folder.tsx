import React, { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";  // Используем open для выбора папки

const Folder: React.FC<{ onFolderSelected: (path: string) => void }> = ({ onFolderSelected }) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);  // Состояние для ошибок

  const openFolderDialog = async () => {
    try {
      // Открываем диалог выбора папки
      const folderPath = await open({
        directory: true,  // Устанавливаем флаг, чтобы выбрать папку
      });

      // Приводим folderPath к типу string
      const folderPathString = folderPath as string; 

      if (folderPathString) {
        setSelectedFolder(folderPathString); // Обновляем состояние с выбранным путем
        setError(null); // Сбрасываем ошибки, если папка выбрана
        onFolderSelected(folderPathString); // Вызываем функцию при успешном выборе папки
        console.log("Выбранная папка:", folderPathString);
      } else {
        setError("Папка не была выбрана.");  // Сообщение, если папка не выбрана
        setSelectedFolder(null);  // Очищаем выбранный путь
      }
    } catch (err) {
      setError("Ошибка при открытии проводника: " + err);  // Обработка ошибок
      setSelectedFolder(null);  // Очищаем выбранный путь в случае ошибки
      console.error("Ошибка при открытии проводника:", err);
    }
  };

  return (
    <div>
      <button onClick={openFolderDialog}>Выбрать папку</button>
      {selectedFolder && <p>Выбранная папка: {selectedFolder}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Выводим сообщение об ошибке */}
    </div>
  );
};

export default Folder;
