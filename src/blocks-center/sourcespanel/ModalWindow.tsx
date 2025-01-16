import styles from "./SourcesPanel.module.css";

interface WindowInfo {
  title: string;
  thumbnail: string | null;
}

interface ModalWindowProps {
  activeWindows: WindowInfo[];
  onWindowSelect: (windowTitle: string) => void;
  onClose: () => void;
}

const ModalWindow = ({ activeWindows, onWindowSelect, onClose }: ModalWindowProps) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>
          ×
        </button>
        <ul className={styles.windowsList}>
          {activeWindows.map((window, index) => (
            <li key={index} className={styles.windowItem}>
              <button 
                onClick={() => onWindowSelect(window.title)} 
                className={styles.windowButton}
              >
                {window.thumbnail && (
                  <img 
                    src={`data:image/png;base64,${window.thumbnail}`}
                    alt={window.title}
                    className={styles.windowThumbnail}
                  />
                )}
                <span>{window.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModalWindow;