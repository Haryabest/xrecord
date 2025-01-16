import React from "react";

const ViewButton: React.FC = () => {
  const handleClick = () => {
    alert("Вид - Открытие настроек вида");
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      Вид
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

export default ViewButton;
