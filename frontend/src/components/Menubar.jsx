import React, { useState } from "react";
import "./MenuBar.css"; // Import associated CSS file

const MenuBar = ({ isOpen, toggleMenu }) => {
  const [selectedIcons, setSelectedIcons] = useState([]); // State for selected icons

  // Toggle selection of an icon
  const toggleIcon = (icon) => {
    if (selectedIcons.includes(icon)) {
      // Remove the icon if already selected
      setSelectedIcons(selectedIcons.filter((i) => i !== icon));
    } else {
      // Add the icon to the selected state
      setSelectedIcons([...selectedIcons, icon]);
    }
  };

  return (
    <div className={`menu-bar ${isOpen ? "open" : ""}`}>
      <span className="close-menu-button" onClick={toggleMenu}>
        &times;
      </span>
      <h2>Transportation Types</h2>
      <div className="menu-grid">
        <button
          className={`icon-btn ${
            selectedIcons.includes("walking") ? "selected" : ""
          }`}
          onClick={() => toggleIcon("walking")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/walking.png"
            alt="Walking"
          />
        </button>
        <button
          className={`icon-btn ${
            selectedIcons.includes("train") ? "selected" : ""
          }`}
          onClick={() => toggleIcon("train")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/train.png"
            alt="Train"
          />
        </button>
        <button
          className={`icon-btn ${
            selectedIcons.includes("bus") ? "selected" : ""
          }`}
          onClick={() => toggleIcon("bus")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/bus.png"
            alt="Bus"
          />
        </button>
        <button
          className={`icon-btn ${
            selectedIcons.includes("car") ? "selected" : ""
          }`}
          onClick={() => toggleIcon("car")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/car.png"
            alt="Car"
          />
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
