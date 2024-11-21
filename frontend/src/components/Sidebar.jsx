import React, { useState } from "react";
import "./Sidebar.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { PlaceSearch } from "./PlaceSearch";

const Sidebar = () => {
  const [activeStop, setActiveStop] = useState(null); // For stops
  const [menuOpen, setMenuOpen] = useState(false); // State for the menu
  const [selectedIcons, setSelectedIcons] = useState([]); // For multiple active transportation icons

  // Toggle active stop
  const toggleStop = (stop) => {
    setActiveStop(activeStop === stop ? null : stop);
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle icon click
  const toggleIcon = (iconName) => {
    if (selectedIcons.includes(iconName)) {
      // Remove the icon if it's already selected
      setSelectedIcons(selectedIcons.filter((icon) => icon !== iconName));
    } else {
      // Add the icon if it's not selected
      setSelectedIcons([...selectedIcons, iconName]);
    }
  };

  return (
    <>
      {/* Menu Bar */}
      <div className={`menu-bar ${menuOpen ? "open" : ""}`}>
        <span className="close-menu-btn" onClick={toggleMenu}>
          &times;
        </span>
        <h2>Transportation Types</h2>

        <div
          className={`menu-item ${
            selectedIcons.includes("walking") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("walking")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/walking.png"
            alt="Walking"
          />
          <span className="menu-label">Walking</span>
        </div>

        <div
          className={`menu-item ${
            selectedIcons.includes("train") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("train")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/train.png"
            alt="Train"
          />
          <span className="menu-label">Train</span>
        </div>

        <div
          className={`menu-item ${
            selectedIcons.includes("bus") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("bus")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/bus.png"
            alt="Bus"
          />
          <span className="menu-label">Bus</span>
        </div>

        <div
          className={`menu-item ${
            selectedIcons.includes("car") ? "active-icon" : ""
          }`}
          onClick={() => toggleIcon("car")}
        >
          <img
            src="https://img.icons8.com/ios-filled/100/null/car.png"
            alt="Car"
          />
          <span className="menu-label">Car</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Search Bar */}
        <div className="search-bar">
          <button className="menu-btn" onClick={toggleMenu}>
            ☰
          </button>
          <PlaceSearch />
        </div>

        {/* Suggestions */}
        <div className="suggestions">
          <div className="stop">
            <button
              className={`suggestion ${activeStop === 1 ? "active" : ""}`}
              onClick={() => toggleStop(1)}
            >
              Stop 1
            </button>
            {activeStop === 1 && (
              <div className="stop-content dropdown">
                <p>Details about Stop 1...</p>
                <p>Additional info for Stop 1.</p>
              </div>
            )}
          </div>

          <div className="stop">
            <button
              className={`suggestion ${activeStop === 2 ? "active" : ""}`}
              onClick={() => toggleStop(2)}
            >
              Stop 2
            </button>
            {activeStop === 2 && (
              <div className="stop-content dropdown">
                <p>Expanded details about Stop 2...</p>
                <p>Additional info for Stop 2 here.</p>
              </div>
            )}
          </div>

          <div className="stop">
            <button
              className={`suggestion ${activeStop === 3 ? "active" : ""}`}
              onClick={() => toggleStop(3)}
            >
              Stop 3
            </button>
            {activeStop === 3 && (
              <div className="stop-content dropdown">
                <p>Details about Stop 3...</p>
                <p>More information about Stop 3.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
