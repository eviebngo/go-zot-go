import React from "react";
import "../Sidebar.css";

export const CustomRoute = (props) => {
  const calcTotal = (route) => {
    if (route.cost == 0) {
      return "Free";
    } else {
      return route.cost;
    }
  };

  const getSummary = (route) => {
    let summary = "";
    route.forEach((r) => {
      if (r.mode == "TRANSIT") {
        summary += r.instructions + ", ";
      }
    });
    summary += "...";
    return summary;
  };

  if (props.data) {
    const { destination, route, time, notes } = props.data;
    const { activeStop, toggleStop, openReviewModal } = props.functions;
    return (
      <div className="stop">
        <button
          className={`suggestion ${
            activeStop === props.data.overview_polyline ? "active" : ""
          }`}
          onClick={() => toggleStop(props.data.overview_polyline)}
        >
          <div style={{ display: "block" }}>
            <h4>
              UCI to {props.destination} &mdash; {calcTotal(props.data)},{" "}
              {props.data.duration} &nbsp;
              <span style={{ color: props.data.color }}>&#9679;</span>
            </h4>
            <p>{getSummary(route)}</p>
          </div>
        </button>
        {activeStop === props.data.overview_polyline && (
          <div className="stop-content dropdown">
            <p>Details about this route</p>
            {route &&
              route.map((r) => {
                return (
                  <p style={{ margin: 10 }}>
                    <strong>{r.instructions}</strong> &nbsp;
                    {r.duration}
                    {r.line || r.org ? (
                      <p>
                        {r.line ? "Line " + r.line : ""} &nbsp; {r.org}
                      </p>
                    ) : null}
                  </p>
                );
              })}
            <button
              className="review-btn"
              onClick={() => openReviewModal(props.data.overview_polyline)}
            >
              <i className="fa-regular fa-comments"></i> View Reviews
            </button>
          </div>
        )}
      </div>
    );
  }
};
