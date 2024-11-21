import React, { useState } from "react";
import "./Sidebar.css";
import "@fortawesome/fontawesome-free/css/all.css";

const Sidebar = () => {
  const [activeStop, setActiveStop] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for the menu

  // Toggle active stop
  const toggleStop = (stop) => {
    setActiveStop(activeStop === stop ? null : stop);
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Menu Bar */}
      <div className={`menu-bar ${menuOpen ? "open" : ""}`}>
        <span className="close-menu-btn" onClick={toggleMenu}>
          &times;
        </span>
        <h2>Transportation Types</h2>
        <div className="menu-item">
          <img
            src="https://img.icons8.com/ios-filled/100/null/walking.png"
            alt="Walking"
          />
        </div>
        <div className="menu-item">
          <img
            src="https://img.icons8.com/ios-filled/100/null/train.png"
            alt="Train"
          />
        </div>
        <div className="menu-item">
          <img
            src="https://img.icons8.com/ios-filled/100/null/bus.png"
            alt="Bus"
          />
        </div>
        <div className="menu-item">
          <img
            src="https://img.icons8.com/ios-filled/100/null/car.png"
            alt="Car"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Search Bar */}
        <div className="search-bar">
          <button className="menu-btn" onClick={toggleMenu}>
            ☰
          </button>
          <input type="text" placeholder="Search" />
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
