import React from "react";
import Sidebar from "./components/Sidebar";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar />

      {/* Map */}
      <div className="map-container">
        {/* Replace iframe with your map component if necessary */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.4206672116815!2d-122.08424968449795!3d37.42206597982585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5a6d1231d1d%3A0xcbb3d16d3e4e3b0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1665619143792!5m2!1sen!2sus"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default App;
