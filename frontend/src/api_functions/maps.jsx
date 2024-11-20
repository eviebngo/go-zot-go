import axios from "axios";

/**
 * Gets all predicted autocomplete entries for a search query
 * @param {string} search_query
 * @returns {JSON} each prediction has a "description" and "place_id" key
 */
export const getMapsAutocomplete = (search_query) => {
  const parameters = new URLSearchParams({
    input: search_query,
  });
  axios
    .get(`/api/maps_autocomplete?` + parameters.toString())
    .then((res) => {
      let predictions = { predictions: [] };
      if (res.data["status"] == "ok") {
        for (let pred of res.data["predictions"]) {
          predictions["predictions"].push({
            description: pred["description"],
            place_id: pred["place_id"],
          });
        }
      }
      return predictions;
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * Gets all possible routes from origin to destination
 * @param {string} origin
 * @param {string} destination
 * @returns {JSON}
 *  overview_polyline (DirectionsPolyline): encoded polyline of all the points on a route
 *  bounds: lat and lng in degrees for northeast and southwest bounds to adjust Google Maps viewbox
 *  legs (Array<DirectionsLeg>): leg for each destination specified
 *    end_address (string): human readable street address
 *    end_location (LatLngLiteral): lat and lng coordinates
 *    start_address (string)
 *    start_location (LatLngLiteral)
 *    steps (Array<DirectionsStep): step for each direction in the navigation
 *        duration (TextValueObject)
 *        end_location (LatLngLiteral)
 *        polyline (DirectionsPolyline)
 *        start_location (LatLngLiteral)
 *        travel_mode (TravelMode)
 *    distance (TextValueObject)
 *    duration (TextValueObject)
 *
 *  Variable types:
 *  TextValueObject:
 *      text (string)
 *      value (number)
 *
 *  DirectionsPolyline:
 *      points (string)
 *
 *  TravelMode: DRIVING (default), BICYCLING, TRANSIT, WALKING
 */
export const getMapsRoute = (origin, destination) => {
  const parameters = new URLSearchParams({
    origin: origin,
    destination: destination,
  });
  axios
    .get(`/api/maps_route?` + parameters.toString())
    .then((res) => {
      let routes = { routes: [] };
      if (res.data["status"] == "ok") {
        for (let route of res.data["routes"]) {
          routes["routes"].push({
            overview_polyline: route["overview_polyline"],
            bounds: route["bounds"],
            legs: {
              end_address: route["legs"]["end_address"],
              end_location: route["legs"]["end_location"],
              start_address: route["legs"]["start_address"],
              start_location: route["legs"]["start_location"],
              steps: [],
            },
          });
        }
      }
      console.log(res.data);
      return routes;
    })
    .catch((error) => {
      console.log(error);
    });
};
