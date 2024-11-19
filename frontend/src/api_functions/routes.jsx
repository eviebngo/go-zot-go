import axios from "axios";

export const getCustomRoutes = (to_lat, to_lon) => {
  axios
    .get(`/api/custom_routes?to_lat=${to_lat}&to_lon=${to_lon}`)
    .then((res) => {
      if (res.data) {
        console.log("CUSTOM ROUTES>>", res.data);
        return res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
