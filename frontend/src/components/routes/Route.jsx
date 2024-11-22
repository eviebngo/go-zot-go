import React from "react";
import "../Sidebar.css";
export const Route = (props) => {
  // const calcTotal = (route) => {
  //   if ("cost" in route) {
  //     return route["cost"];
  //   }
  //   let total = 0.0;
  //   route.forEach((r) => {
  //     total += r.cost;
  //   });
  //   return total;
  // };
  if (props.data) {
    const { destination, route, time, notes } = props.data;
    const { activeStop, toggleStop, openReviewModal } = props.functions;
    console.log(props);
    return (
      <div className="stop">
        <button
          className={`suggestion ${
            activeStop === props.data.id ? "active" : ""
          }`}
          onClick={() => toggleStop(props.data.id)}
        >
          <div style={{ display: "block" }}>
            <h4>
              UCI to {destination} &mdash; ${route.cost}
            </h4>
            {route &&
              route.map((r) => {
                return (
                  <p>
                    <strong>{r.from}</strong> &rarr; <strong>{r.to}</strong>:{" "}
                    {r.duration}
                  </p>
                );
              })}
          </div>
        </button>
        {activeStop === props.data.id && (
          <div className="stop-content dropdown">
            <p>Details about Stop 1...</p>
            <p>Additional info for Stop 1.</p>
            <button
              className="review-btn"
              onClick={() => openReviewModal(stop)}
            >
              <i className="fa-regular fa-comments"></i> View Reviews
            </button>
          </div>
        )}
      </div>
    );
  }
};
