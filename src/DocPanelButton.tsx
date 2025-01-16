import React from "react";

const DocPanelButton: React.FC = () => {
  const handleClick = () => {
    alert("Док панели - Открытие панели документов");
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      Док панели
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

export default DocPanelButton;
