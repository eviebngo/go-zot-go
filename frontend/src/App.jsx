import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// import { getCustomRoutes } from "./api_functions/routes";
// import { getCustomReviews } from "./api_functions/reviews";
// import { getMapsAutocomplete, getMapsRoute } from "./api_functions/maps";

import { GoogleMaps } from "./pages/GoogleMaps";

function App() {
  const [reviews, setReviews] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loc, setLoc] = useState({
    lat: 34.056365083876415,
    lng: -118.23400411024693,
  });

  // Some test runs of API functions in frontend
  const getReviews = (routeIdList) => {
    let url = "";
    routeIdList.forEach((route) => {
      url += `id_list=${route}`;
      if (route != routeIdList[routeIdList.length - 1]) url += `&`;
    });
    axios
      .get(`/api/reviews?${url}`)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setReviews(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCustomRoutes = (to_lat, to_lon) => {
    axios
      .get(`/api/custom_routes?to_lat=${to_lat}&to_lon=${to_lon}`)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          for (let route of res.data) {
            setRoutes([...routes, route]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getMapsRoute = (origin, destination, mode, departure_time) => {
    /**
     * origin: string of valid location from Google Maps autocomplete
     * destination: same requirements as origin
     * mode: driving (default), walking, bicycling, transit
     * arrival_time: string of time in "YYYY-MM-DD-HH-MM-SS" in UTC or "" for now
     * departure_time: same requirements as arrival_time
     */

    const parameters = new URLSearchParams({
      origin: origin,
      destination: destination,
      mode: mode,
      departure_time: departure_time,
    });

    axios
      .get(`/api/maps_route?` + parameters.toString())
      .then((res) => {
        let data = JSON.parse(res.data);
        for (let route of data["routes"]) {
          setRoutes([...routes, route]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllRoutes = (
    to_lat,
    to_lon,
    origin,
    destination,
    mode,
    departure_time
  ) => {
    let routeList = [];
    axios
      .get(`/api/custom_routes?to_lat=${to_lat}&to_lon=${to_lon}`)
      .then((res) => {
        if (res.data) {
          console.log("YES", res.data);
          for (let route of res.data) {
            routeList.push(route);
          }
        }
      })
      .then(() => {
        const parameters = new URLSearchParams({
          origin: origin,
          destination: destination,
          mode: mode,
          departure_time: departure_time,
        });

        axios
          .get(`/api/maps_route?` + parameters.toString())
          .then((res) => {
            if (res.data) {
              console.log("YESSSSS");
              let data = JSON.parse(res.data);
              for (let route of data["routes"]) {
                routeList.push(route);
              }
            }
          })
          .then(() => {
            setRoutes(routeList);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAvgRating = (route) => {
    review_list = reviews.filter((review) => review.routeId == route.id);
    let sum = 0;
    let count = 0;
    review_list.forEach((review) => {
      sum += review.stars;
      count++;
    });
    return sum / count;
  };

  const sortRoutes = (sort) => {
    if (routes.length > 0) {
      if (sort == "rating") {
        sorted_list = routes.sort((a, b) => getAvgRating(b) - getAvgRating(a));
      }
    }
  };

  const fetchRoutesFromSearch = () => {
    //e.preventDefault();
    console.log("fetching routes...");
    setRoutes([]);
    // getCustomRoutes(loc.lat, loc.lng);
    // getMapsRoute("33.643,-117.841", loc.lat + "," + loc.lng, "", "");
    getAllRoutes(
      loc.lat,
      loc.lng,
      "33.643,-117.841",
      loc.lat + "," + loc.lng,
      "",
      ""
    );
    console.log("ROUTES>>>", routes);
  };

  useEffect(() => {}, []);

  // getCustomReviews(1);
  // getMapsAutocomplete("irvine");
  // getMapsRoute("Irvine, CA", "Los Angeles, CA", "transit", "", "");

  console.log("REVIEWS>>", reviews);
  console.log("ROUTES>>", routes);
  return (
    <div className="app">
      <div className="map-container">
        {/* Replace iframe with your map component if necessary */}
        <GoogleMaps
          setLoc={setLoc}
          fetchRoutes={fetchRoutesFromSearch}
          routes={routes}
          setRoutes={setRoutes}
        />
        {/*<iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.4206672116815!2d-122.08424968449795!3d37.42206597982585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5a6d1231d1d%3A0xcbb3d16d3e4e3b0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1665619143792!5m2!1sen!2sus"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          allowFullScreen
          loading="lazy"
        ></iframe>*/}
      </div>
      {/* Sidebar */}

      {/* Map */}
    </div>
  );
}

export default App;
