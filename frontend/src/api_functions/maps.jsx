import axios from 'axios'

export const getMapsAutocomplete = () => {
  const parameters = new URLSearchParams({
    key: import.meta.env.VITE_MAPS_API_KEY,
    input: "irvine"
  })
  axios
    .get("/api/maps_autocomplete?"+parameters.toString())
    .then((res) => {
        console.log(res.data)
        return res.data
    })
    .catch((error) => {
        console.log(error)
    })
}