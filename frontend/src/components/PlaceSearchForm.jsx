import React, { useState } from "react";
import "./Sidebar.css";
import Autocomplete from "react-google-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import { useGoogleMap } from "@react-google-maps/api";

export const PlaceSearchForm = (props) => {
  console.log(props);
  const libraries = ["places"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });

  return isLoaded ? (
    <Autocomplete
      apiKey={import.meta.env.VITE_MAPS_API_KEY}
      options={{
        fields: ["name", "formatted_address", "geometry.location"],
        types: ["street_address", "premise", "point_of_interest"],
        componentRestrictions: { country: ["us"] },
      }}
      onPlaceSelected={(place) => {
        props.setFormVal(place);
      }}
      style={{
        width: "100%",
      }}
    />
  ) : (
    <></>
  );
};
