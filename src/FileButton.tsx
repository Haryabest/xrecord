import React from "react";

const FileButton: React.FC = () => {
  const handleClick = () => {
    alert("Файл - Открытие меню Файла");
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      Файл
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontSize: '16px',
  },
};

export default FileButton;
