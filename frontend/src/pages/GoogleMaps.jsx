import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import { decode } from "@googlemaps/polyline-codec";

export const GoogleMaps = () => {
  const decodePolyline = (polyline) => {
    polyline = polyline.replace(/\\\\/g, "\\").replace(/\\"/g, '"');
    let result = [];
    for (let point of decode(polyline)) {
      result.push({ lat: point[0], lng: point[1] });
    }
    return result;
  };

  // unescaped
  //const [path, setPath] = useState(decodePolyline("g_rlEf~cnUSSOTgFpI_A|AeFhI{BvDgBpCy@y@qAcAyAaA_EkDaE_EkGsGyK}KuHgHsCsCuB_EoAuEa@gFJ_SBqFKcGw@aFcBoE_HqJsCyDyCeDiCaCwCoDkIaN_DcDyDeCiPiHoDaBwAo@WM]i@iBkAe@YiAcAeBmBgBuAwAi@wHgAsC}@aDqBwEqEiFkFwAuAqAsAASM[Oq@Bu@Rc@f@]n@?h@ZVz@C|@i@rAEJAp@Yd@y@rA_AzAeC|DoJpOgW`c@sWnb@gMvS_E|FcFtIwClHqBtHwGnZqElTqH|ZoHfYaDbLoCjGcBtB_DnCiCrAmDhAuNtDyEvBuCnBaE~DsDjFaDpGuFlN}EbOeEnMaIpUuCpHqDdG_DpDsEjDsOrIkY~MgGbDiFvD}OtMoMbK}GxE}FbFmL`LaCfDeAvBmBfEiCbE}FhGgHxGwMdKeIpIsLfNyVnWgc@fd@_KlKoIxKaGhIuFtGgR~RiMzMaUdV_TtT{RxR}NzKoFpEkDnD{MtN{FhGwEzFaCdEoA`DcBdGmBzM{AnJaAlEuB~FiC~FiI`RoOn]oLrW}GnLsDvHqMh\{KxXqLrXuClG{CfFsOdT}CzF_BzFiErSqCdLsBbGgElJaBzCwFpJiDvGmEzJuV|j@sL~WqDxHsIlLsG`IcGhJcFxK{AhEuDhLwBlGoMxZ}DxIgPn\cP`]kPla@sG~OeE|JyFtL}F`LkItPmHzOwL~WqFhLeE`HeF~G{HlIaRrQsIrJkC`EiCdFiHhOwDpGwDbF}ChDuIjH}NjJqZhRiS`M{_@|Ugb@|WsLdHcYrPaZxPcH`EwEfDkDlDsC|DuIvMoNnTcKxOuNvTeEfGsFhFgEfC}FpB}JtBgVdFoExAmDfByOlKiEbDeC`CmOlOoPpPyCdDaCpDeEbHmFhGwPbPyb@ja@}EzCiFpCiEfDmH~GwLdLePfR{DfF{BtEcCxDgEpEmFtEgCtCuBtDyB|FcJrWuBnG}AhHy@fEo@tB_BlD{A|CkErLsGjRkBvFwAzG{@rJG|DBvXBlQEfFUrDeAlHsCxJwGdSkJbYeCbIe@hBWdBi@~B}CzJkH|SkHbT{BdGkClFwCjEuBdCuBjBaEtCuE`B{CXcB@{Gg@sJR_CIsN_BiND{CLwFf@eHjB}An@yJ`EaDhBaBbCu@zB[~AYpFqB`UgArPi@rJOP?bCY`EgAbG_CfFeCtEi@bAwArC\n@~B`CxC`C"))
  // escaped manually
  //const [path, setPath] = useState(decodePolyline("g_rlEf~cnUSSOTgFpI_A|AeFhI{BvDgBpCy@y@qAcAyAaA_EkDaE_EkGsGyK}KuHgHsCsCuB_EoAuEa@gFJ_SBqFKcGw@aFcBoE_HqJsCyDyCeDiCaCwCoDkIaN_DcDyDeCiPiHoDaBwAo@WM]i@iBkAe@YiAcAeBmBgBuAwAi@wHgAsC}@aDqBwEqEiFkFwAuAqAsAASM[Oq@Bu@Rc@f@]n@?h@ZVz@C|@i@rAEJAp@Yd@y@rA_AzAeC|DoJpOgW`c@sWnb@gMvS_E|FcFtIwClHqBtHwGnZqElTqH|ZoHfYaDbLoCjGcBtB_DnCiCrAmDhAuNtDyEvBuCnBaE~DsDjFaDpGuFlN}EbOeEnMaIpUuCpHqDdG_DpDsEjDsOrIkY~MgGbDiFvD}OtMoMbK}GxE}FbFmL`LaCfDeAvBmBfEiCbE}FhGgHxGwMdKeIpIsLfNyVnWgc@fd@_KlKoIxKaGhIuFtGgR~RiMzMaUdV_TtT{RxR}NzKoFpEkDnD{MtN{FhGwEzFaCdEoA`DcBdGmBzM{AnJaAlEuB~FiC~FiI`RoOn]oLrW}GnLsDvHqMh\\{KxXqLrXuClG{CfFsOdT}CzF_BzFiErSqCdLsBbGgElJaBzCwFpJiDvGmEzJuV|j@sL~WqDxHsIlLsG`IcGhJcFxK{AhEuDhLwBlGoMxZ}DxIgPn\\cP`]kPla@sG~OeE|JyFtL}F`LkItPmHzOwL~WqFhLeE`HeF~G{HlIaRrQsIrJkC`EiCdFiHhOwDpGwDbF}ChDuIjH}NjJqZhRiS`M{_@|Ugb@|WsLdHcYrPaZxPcH`EwEfDkDlDsC|DuIvMoNnTcKxOuNvTeEfGsFhFgEfC}FpB}JtBgVdFoExAmDfByOlKiEbDeC`CmOlOoPpPyCdDaCpDeEbHmFhGwPbPyb@ja@}EzCiFpCiEfDmH~GwLdLePfR{DfF{BtEcCxDgEpEmFtEgCtCuBtDyB|FcJrWuBnG}AhHy@fEo@tB_BlD{A|CkErLsGjRkBvFwAzG{@rJG|DBvXBlQEfFUrDeAlHsCxJwGdSkJbYeCbIe@hBWdBi@~B}CzJkH|SkHbT{BdGkClFwCjEuBdCuBjBaEtCuE`B{CXcB@{Gg@sJR_CIsN_BiND{CLwFf@eHjB}An@yJ`EaDhBaBbCu@zB[~AYpFqB`UgArPi@rJOP?bCY`EgAbG_CfFeCtEi@bAwArC\\n@~B`CxC`C",5));
  // escaped in python
  const [path, setPath] = useState(
    decodePolyline(
      "g_rlEf~cnUSSOTgFpI_A|AeFhI{BvDgBpCy@y@qAcAyAaA_EkD_EaEmGqGyK}KuHgHsCsCuB_EoAuEa@gFJ_SBqFKcGw@aFcBoE_HqJsCyDyCeDiCaCwCoDkIaN_DcDyDeCiPiHoDaBwAo@YM_@k@eBiAe@YiAcAeBoBeBsAyAi@wHgAsC}@aDqBwEqEiFkFwAuAqAsAASM[Oq@Bu@Rc@f@]n@?h@ZVz@C|@i@rAEJAp@Yd@y@rA_AzAeC|DoJpOgW`c@sWnb@gMvS_E|FcFtIwClHqBtHwGnZqElTqH|ZoHfYaDbLoCjGcBtB_DnCiCrAmDhAuNtDyEvBuCnBaE~DsDjFaDpGuFlN}EbOeEnMaIpUuCpHqDdG_DpDsEjDsOrIkY~MgGbDiFvD}OtMoMbK}GxE}FbFmL`LaCfDeAvBmBfEiCbE}FhGgHxGwMdKeIpIsLfNyVnWgc@fd@_KlKoIxKaGhIuFtGgR~Rkc@`e@_TtT{RxR}NzKoFpEkDnD{MtN{FhGwEzFaCdEoA`DcBdGmBzM{AnJaAlEuB~FiC~FiI`RoOn]oLrW}GnLsDvHqMh\\{KxXqLrXuClG{CfFsOdT}CzF_BzFiErSqCdLsBbGgElJaBzCwFpJiDvGmEzJuV|j@sL~WqDxHsIlLsG`IcGhJcFxK{AhEuDhLwBlGoMxZ}DxIgPn\\cP`]kPla@sG~OeE|JyFtL}F`LkItPmHzOwL~WqFhLeE`HeF~G{HlIaRrQsIrJkC`EiCdFiHhOwDpGwDbF}ChDuIjH}NjJqZhRiS`M{_@|Ugb@|WsLdHcYrPaZxPcH`EwEfDkDlDsC|DuIvMoNnTcKxOuNvTeEfGsFhFgEfC}FpB}JtBgVdFoExAmDfByOlKiEbDeC`CmOlOoPpPyCdDaCpDeEbHmFhGwPbPyb@ja@}EzCiFpCiEfDmH~GwLdLePfR{DfF{BtEcCxDgEpEmFtEgCtCuBtDyB|FcJrWuBnG}AhHy@fEo@tB_BlD{A|CkErLsGjRkBvFwAzG{@rJG|DBvXBlQEfFUrDeAlHsCxJwGdSkJbYeCbIe@hBWdBi@~B}CzJkH|SkHbT{BdGkClFwCjEuBdCuBjBaEtCuE`B{CXcB@{Gg@sJR_CIsN_BiND{CLwFf@eHjB}An@yJ`EaDhBaBbCu@zB[~AYpFqB`UgArPi@rJOP?bCY`EgAbG_CfFgCtEg@dAwApC\\n@~B`CxC`C"
    )
  );

  const position = { lat: 33.643, lng: -117.841 }; // UC Irvine
  const [center, setCenter] = useState(position);
  const [zoom, setZoom] = useState(12);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: ["places"],
  });

  function recenter() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCenter(pos);
        setZoom(12);
      });
    } else {
      // Browser doesn't support Geolocation
      throw Error("Error: Your browser doesn't support geolocation.");
    }
  }
  return isLoaded ? (
    <div>
      <button
        id="recenter-button"
        onClick={recenter}
        style={{
          position: "absolute",
          zIndex: 1000,
          right: 60,
          margin: 8,
          // marginLeft: "1000px",
        }}
      >
        Recenter
      </button>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "right",
        }}
      >
        <GoogleMap
          mapContainerStyle={{ width: "60%", height: "100%" }}
          center={center}
          zoom={zoom}
        >
          <Polyline
            path={path}
            options={{ strokeColor: "#4285f4", strokeWeight: 5 }}
          />
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
};
