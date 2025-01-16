import React from "react";
import FileButton from "./FileButton";
import HelpButton from "./HelpButton";
import ProfileButton from "./ProfileButton";
import DocPanelButton from "./DocPanelButton";
import ViewButton from "./ViewButton";

const Toolbar: React.FC = () => {
  return (
    <div style={toolbarStyle}>
      <FileButton />
      <HelpButton />
      <ProfileButton />
      <DocPanelButton />
      <ViewButton />
    </div>
  );
};

// Определяем стиль с использованием CSSProperties
const toolbarStyle: React.CSSProperties = {
  position: "fixed", // Фиксируем тулбар
  top: "0px", // Прижимаем к верхней части экрана
  left: "0px",
  width: "100%", // Растягиваем на всю ширину
  zIndex: 1000, // Устанавливаем высокий z-index, чтобы тулбар был сверху
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#333",
  color: "white",
  padding: "5px 0px",
  fontSize: "16px",
  borderBottom: "2px solid #444",
};

export default Toolbar;
