import axios from "axios";

/**
 * Gets all predicted autocomplete entries for a search query
 * @param {string} search_query
 * @returns {JSON} each prediction has a "description" and "place_id" key
 */
export const getMapsAutocomplete = (search_query) => {
  const parameters = new URLSearchParams({
    input: search_query
  })
  let predictions = { "predictions": [] } 
  axios
    .get(`/api/maps_autocomplete?` + parameters.toString())
    .then((res) => {
        let data = JSON.parse(res.data)
        
        if (data["status"] == "OK") {
            for (let pred of data["predictions"]) {
                predictions["predictions"].push({
                    "description":pred["description"],
                    "place_id":pred["place_id"]
                })
            }
        }
    })
    .catch((error) => {
        console.log(error)
    })
  return predictions
}

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

    let routes = { "routes": [] }

    const parameters = new URLSearchParams({
      origin: origin,
      destination: destination
    })

    axios
        .get(`/api/maps_route?`+parameters.toString())
        .then((res) => {
            let data = JSON.parse(res.data)
            
            if (data["status"] == "ok") {
                for (let route of data["routes"]) {
                    let legs = []
                    for (let leg of route["legs"]) {
                        let steps = []
                        for (let step of leg["steps"]) {
                            steps.push({
                                "duration": step["duration"],
                                "end_location": step["end_location"],
                                "polyline": step["polyline"],
                                "start_location": step["start_location"],
                                "travel_mode": step["travel_mode"]
                            })
                        }
                        legs.push({
                            "end_address": leg["end_address"],
                            "end_location": leg["end_location"],
                            "start_address": leg["start_address"],
                            "start_location": leg["start_location"],
                            "steps": steps,
                            "distance": leg["distance"],
                            "duration": leg["duration"]
                        })
                    }

                    routes["routes"].push({
                        "overview_polyline":route["overview_polyline"], 
                        "bounds":route["bounds"],
                        "legs": legs
                    })
                }
            } 
        })
        .catch((error) => {
                console.log(error)
        })
    return routes
}