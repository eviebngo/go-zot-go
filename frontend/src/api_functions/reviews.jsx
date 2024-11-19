import axios from "axios";

export const getCustomReviews = (routeId) => {
  axios
    .get(`/api/reviews?custom=true&id=${routeId}`)
    .then((res) => {
      if (res.data) {
        console.log("CUSTOM REVIEW>>", res.data);
        return res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
