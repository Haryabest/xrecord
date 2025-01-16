import React from "react";

const HelpButton: React.FC = () => {
  const handleClick = () => {
    alert("Справка - Открытие справки");
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      Справка
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

export default HelpButton;
