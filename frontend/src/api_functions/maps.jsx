import axios from 'axios'

export const getMapsAutocomplete = () => {
  const parameters = new URLSearchParams({
    input: "irvine"
  })
  axios
    .get(`/api/maps_autocomplete?`+parameters.toString())
    .then((res) => {
        if (res.data["status"] == "ok") {
            let predictions = []
            for (let pred of res.data["predictions"]) {
                predictions.push({
                    "description":pred["description"],
                    "place_id":pred["place_id"]
                })
            }
            return predictions
        } else {
            return []
        }
    })
    .catch((error) => {
        console.log(error)
    })
}

export const getMapsRoute = () => {
    const parameters = new URLSearchParams({
      origin: "Irvine, CA",
      destination: "Los Angeles, CA"
    })
    axios
      .get(`/api/maps_route?`+parameters.toString())
      .then((res) => {
          console.log(res.data)
      })
      .catch((error) => {
          console.log(error)
      })
  }