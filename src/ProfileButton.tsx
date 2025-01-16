import React from "react";

const ProfileButton: React.FC = () => {
  const handleClick = () => {
    alert("Профиль - Открытие профиля");
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      Профиль
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

export default ProfileButton;
