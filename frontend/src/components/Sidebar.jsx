import React, { useState } from "react";
import "./Sidebar.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { Route } from "./Route";
import { PlaceSearch } from "./PlaceSearch";

const Sidebar = (props) => {
  const [activeStop, setActiveStop] = useState(null); // For stops
  const [menuOpen, setMenuOpen] = useState(false); // State for the menu
  const [selectedIcons, setSelectedIcons] = useState([]); // For multiple active transportation icons
  const [filtersOpen, setFiltersOpen] = useState(false); // For filter dropdown visibility
  const [modalOpen, setModalOpen] = useState(false); // For Add New modal visibility
  const [reviewModalOpen, setReviewModalOpen] = useState(false); // For Review modal visibility
  const [selectedStop, setSelectedStop] = useState(null); // To track selected stop for reviews
  const [routes, setRoutes] = useState([]); // To store dynamically added stops
  const [formFields, setFormFields] = useState([
    { field: "starting", value: "" },
    { field: "destination", value: "" },
  ]);

  const [reviews, setReviews] = useState({
    1: [
      { name: "Rebecca", text: "Great stop!", rating: 5 },
      { name: "Joshua", text: "Very convenient.", rating: 4 },
    ],
    2: [
      { name: "Michael", text: "Crowded but useful.", rating: 3 },
      { name: "Sophia", text: "Nice scenery.", rating: 4 },
    ],
    3: [
      { name: "Liam", text: "Clean and spacious.", rating: 5 },
      { name: "Olivia", text: "Good for families.", rating: 4 },
    ],
  });

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
      setSelectedIcons(selectedIcons.filter((icon) => icon !== iconName));
    } else {
      setSelectedIcons([...selectedIcons, iconName]);
    }
  };

  // Handle form input changes
  const handleInputChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].value = value;
    setFormFields(updatedFields);
  };

  // Add a new field
  const handleAddField = () => {
    setFormFields([...formFields, { field: "additional", value: "" }]);
  };

  // Remove a field
  const handleRemoveField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  // Handle form submission to add a new route
  const handleAddRoute = () => {
    if (formFields.some((field) => field.value.trim() === "")) {
      alert("Please fill out all fields before adding a route.");
      return;
    }

    const newRoute = formFields.map((field) => field.value).join(" -> ");
    setRoutes([...routes, newRoute]); // Add the new route to the list
    setModalOpen(false); // Close modal after adding
    setFormFields([
      { field: "starting", value: "" },
      { field: "destination", value: "" },
    ]); // Reset fields
  };

  // Open review modal for reviews
  const openReviewModal = (stop) => {
    setSelectedStop(stop);
    setReviewModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setReviewModalOpen(false);
    setSelectedStop(null);
  };

  return (
    <>
      {/* Menu Bar */}
      <div className={`menu-bar ${menuOpen ? "open" : ""}`}>
        <span className="close-menu-btn" onClick={toggleMenu}>
          &times;
        </span>
        <h2>Transportation Types</h2>

        {/* Walking Icon */}
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

        {/* Train Icon */}
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

        {/* Bus Icon */}
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

        {/* Car Icon */}
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
          <PlaceSearch setLoc={props.setLoc} />
          <button className="secondary-button" onClick={props.fetchRoutes}>
            Go
          </button>
        </div>

        {/* Filter and Add New Buttons */}
        <div className="action-buttons">
          <button
            className="filter-btn"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            Filters
          </button>

          <button className="popup-btn" onClick={() => setModalOpen(true)}>
            Add New
          </button>
        </div>

        {/* Filter Dropdown */}
        {filtersOpen && (
          <div className="filter-dropdown">
            <label>
              <input type="checkbox" />
              Price
            </label>
            <label>
              <input type="checkbox" />
              Rating
            </label>
            <label>
              <input type="checkbox" />
              Distance
            </label>
          </div>
        )}

        {/* Stops with Dropdowns */}
        <div className="suggestions">
          {[0, 1, 2].map((stop) => {
            if (props.routes.length < stop+1) return <></>
            console.log(props.routes)
            return <Route
              key={stop}
              functions={{ activeStop, toggleStop, openReviewModal }}
              data={props.routes[stop]} // destination, route, time, notes
            />
          })}

          {routes.map((route, index) => (
            <div key={index} className="stop">
              <button className="suggestion">{route}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Route Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              Add New Route
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {formFields.map((field, index) => (
                <div
                  key={index}
                  style={{ display: "flex", marginBottom: "10px" }}
                >
                  <input
                    type="text"
                    placeholder={
                      field.field === "starting"
                        ? "Enter starting point"
                        : field.field === "destination"
                        ? "Enter destination"
                        : "Additional info"
                    }
                    value={field.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{
                      flex: 1,
                      marginRight: "10px",
                      background: "white",
                      color: "black",
                      border: "1px solid #ccc",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  />
                  {index >= 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      style={{
                        background: "#ff4b4b",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddField}
                style={{
                  background: "#0064A4",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                + Add Field
              </button>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleAddRoute}
                style={{
                  background: "#0064A4",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
              <button
                onClick={closeModal}
                style={{
                  background: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              Reviews for Stop {selectedStop}
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {reviews[selectedStop]?.map((review, index) => (
                <div
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    marginBottom: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>{review.name}</strong>
                    <span>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p>{review.text}</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#0064A4",
                      }}
                    >
                      👍
                    </button>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ff4b4b",
                      }}
                    >
                      👎
                    </button>
                  </div>
                </div>
              ))}
              {!reviews[selectedStop]?.length && <p>No reviews available.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
