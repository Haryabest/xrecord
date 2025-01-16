// components/ActionButtons.tsx
import { Plus, Trash2, Edit3, ArrowUp, ArrowDown } from "lucide-react";
import styles from "./SourcesPanel.module.css";

interface ActionButtonsProps {
  onAction: (action: string) => void;
  isListEmpty: boolean; // Параметр для проверки, пуст ли список
}

const ActionButtons = ({ onAction, isListEmpty }: ActionButtonsProps) => {
  return (
    <div className={styles.buttonGroupBottom}>
      <div className={styles.iconButtonWrapper}>
        <div className={styles.tooltip}>Добавить</div>
        <button onClick={() => onAction("add")} className={styles.iconButton}>
          <Plus className={styles.icon} />
        </button>
      </div>
      <div className={styles.iconButtonWrapper}>
        <div className={styles.tooltip}>Удалить</div>
        <button
          onClick={() => onAction("delete")}
          className={styles.iconButton}
          disabled={isListEmpty} // Отключаем кнопку, если список пуст
        >
          <Trash2 className={styles.icon} />
        </button>
      </div>
      <div className={styles.iconButtonWrapper}>
        <div className={styles.tooltip}>Редактировать</div>
        <button
          onClick={() => onAction("edit")}
          className={styles.iconButton}
          disabled={isListEmpty} // Отключаем кнопку, если список пуст
        >
          <Edit3 className={styles.icon} />
        </button>
      </div>
      <div className={styles.iconButtonWrapper}>
        <div className={styles.tooltip}>Вверх</div>
        <button
          onClick={() => onAction("moveUp")}
          className={styles.iconButton}
          disabled={isListEmpty} // Отключаем кнопку, если список пуст
        >
          <ArrowUp className={styles.icon} />
        </button>
      </div>
      <div className={styles.iconButtonWrapper}>
        <div className={styles.tooltip}>Вниз</div>
        <button
          onClick={() => onAction("moveDown")}
          className={styles.iconButton}
          disabled={isListEmpty} // Отключаем кнопку, если список пуст
        >
          <ArrowDown className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
