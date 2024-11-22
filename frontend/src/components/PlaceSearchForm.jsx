import React, { useRef } from "react";
import "./Sidebar.css";
import Autocomplete, {usePlacesWidget} from "react-google-autocomplete";
import { useJsApiLoader } from "@react-google-maps/api";
import { useGoogleMap } from "@react-google-maps/api";

export const PlaceSearchForm = (props) => {
  const libraries = ["places"];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });
  const {ref} = usePlacesWidget({
    apiKey:import.meta.env.VITE_MAPS_API_KEY,
    onPlaceSelected:(place) => {
      console.log("PROPS>>",props)
      if (props.index) {
        props.setFormVal(props.index,place,props.placeholder)
      } else {
        props.setFormVal(place);
      }
    },
    options:{
      fields: ["name", "formatted_address", "geometry.location"],
      types: ["street_address", "premise", "point_of_interest"],
      componentRestrictions: { country: ["us"] },
    }
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
    <>{/*<input
      ref = {ref}
      placeholder={props.placeholder}
      style={{width: "100%",
        height:"100%"}}
      onChange={(e) => props.setFormVal(props.index, e.target.value, props.placeholder)}
    />*/}</>
    
  );
};
