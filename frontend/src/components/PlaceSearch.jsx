import React, { useState } from "react";
import "./Sidebar.css";
import Autocomplete from "react-google-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import { useGoogleMap } from "@react-google-maps/api";

export const PlaceSearch = (props) => {
  const libraries = ["places"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });
  const map = useGoogleMap();

  return isLoaded ? (
    <Autocomplete
      apiKey={import.meta.env.VITE_MAPS_API_KEY}
      options={{
        fields: ["name", "formatted_address", "geometry.location"],
        types: ["street_address", "premise", "point_of_interest"],
        componentRestrictions: { country: ["us"] },
      }}
      onPlaceSelected={(place) => {
        if (map) {
          var latLng = new google.maps.LatLng(
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
          map.panTo(latLng);
          map.setZoom(18);
        }
      }}
    />
  ) : (
    <></>
  );
};
