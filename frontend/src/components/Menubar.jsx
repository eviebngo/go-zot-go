import React from "react";
import "./MenuBar.css"; // Import associated CSS file

const MenuBar = ({ isOpen, toggleMenu }) => {
  return (
    <div className={`menu-bar ${isOpen ? "open" : ""}`}>
      <span className="close-menu-button" onClick={toggleMenu}>
        &times;
      </span>
      <h2 className="custom-heading">Menu</h2>
      {/* Additional content here, if needed */}
    </div>
  );
};

export default MenuBar;
