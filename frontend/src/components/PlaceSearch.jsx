import React, { useState } from "react";
import "./Sidebar.css";
import Autocomplete from "react-google-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";

export const PlaceSearch = () => {
  const libraries = ["places"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });
  return isLoaded ? (
    <Autocomplete
      apiKey={import.meta.env.VITE_MAPS_API_KEY}
      options={{
        fields: ["name", "adr_address", "geometry"],
        types: ["street_address", "premise", "point_of_interest"],
      }}
      onPlaceSelected={(place) => {
        console.log(place);
      }}
    />
  ) : (
    <></>
  );
};
