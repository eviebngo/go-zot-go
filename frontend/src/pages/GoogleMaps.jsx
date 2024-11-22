import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Polyline } from "@react-google-maps/api";
import { decode } from "@googlemaps/polyline-codec";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export const GoogleMaps = (props) => {
  const [routes, setRoutes] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const getMapsAutocomplete = (search_query) => {
    const parameters = new URLSearchParams({
      input: search_query,
    });
    axios
      .get(`/api/maps_autocomplete?` + parameters.toString())
      .then((res) => {
        let data = JSON.parse(res.data);
        setPredictions(data["predictions"]);
        //console.log(predictions)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMapsRoute = (origin, destination, mode, departure_time) => {
    /**
     * origin: string of valid location from Google Maps autocomplete
     * destination: same requirements as origin
     * mode: driving (default), walking, bicycling, transit
     * arrival_time: string of time in "YYYY-MM-DD-HH-MM-SS" in UTC or "" for now
     * departure_time: same requirements as arrival_time
     */

    const parameters = new URLSearchParams({
      origin: origin,
      destination: destination,
      mode: mode,
      departure_time: departure_time,
    });

    axios
      .get(`/api/maps_route?` + parameters.toString())
      .then((res) => {
        let data = JSON.parse(res.data);
        for (let route of data["routes"]) {
          props.setRoutes([...props.routes, route]);
        }
        console.log(routes);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //getMapsAutocomplete("irvine");
  //getMapsRoute("Irvine, CA", "Los Angeles, CA", "", "", "");

  const decodePolyline = (polyline) => {
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
  //const [path, setPath] = useState(decodePolyline("g_rlEf~cnUSSOTgFpI_A|AeFhI{BvDgBpCy@y@qAcAyAaA_EkD_EaEmGqGyK}KuHgHsCsCuB_EoAuEa@gFJ_SBqFKcGw@aFcBoE_HqJsCyDyCeDiCaCwCoDkIaN_DcDyDeCiPiHoDaBwAo@YM_@k@eBiAe@YiAcAeBoBeBsAyAi@wHgAsC}@aDqBwEqEiFkFwAuAqAsAASM[Oq@Bu@Rc@f@]n@?h@ZVz@C|@i@rAEJAp@Yd@y@rA_AzAeC|DoJpOgW`c@sWnb@gMvS_E|FcFtIwClHqBtHwGnZqElTqH|ZoHfYaDbLoCjGcBtB_DnCiCrAmDhAuNtDyEvBuCnBaE~DsDjFaDpGuFlN}EbOeEnMaIpUuCpHqDdG_DpDsEjDsOrIkY~MgGbDiFvD}OtMoMbK}GxE}FbFmL`LaCfDeAvBmBfEiCbE}FhGgHxGwMdKeIpIsLfNyVnWgc@fd@_KlKoIxKaGhIuFtGgR~Rkc@`e@_TtT{RxR}NzKoFpEkDnD{MtN{FhGwEzFaCdEoA`DcBdGmBzM{AnJaAlEuB~FiC~FiI`RoOn]oLrW}GnLsDvHqMh\\{KxXqLrXuClG{CfFsOdT}CzF_BzFiErSqCdLsBbGgElJaBzCwFpJiDvGmEzJuV|j@sL~WqDxHsIlLsG`IcGhJcFxK{AhEuDhLwBlGoMxZ}DxIgPn\\cP`]kPla@sG~OeE|JyFtL}F`LkItPmHzOwL~WqFhLeE`HeF~G{HlIaRrQsIrJkC`EiCdFiHhOwDpGwDbF}ChDuIjH}NjJqZhRiS`M{_@|Ugb@|WsLdHcYrPaZxPcH`EwEfDkDlDsC|DuIvMoNnTcKxOuNvTeEfGsFhFgEfC}FpB}JtBgVdFoExAmDfByOlKiEbDeC`CmOlOoPpPyCdDaCpDeEbHmFhGwPbPyb@ja@}EzCiFpCiEfDmH~GwLdLePfR{DfF{BtEcCxDgEpEmFtEgCtCuBtDyB|FcJrWuBnG}AhHy@fEo@tB_BlD{A|CkErLsGjRkBvFwAzG{@rJG|DBvXBlQEfFUrDeAlHsCxJwGdSkJbYeCbIe@hBWdBi@~B}CzJkH|SkHbT{BdGkClFwCjEuBdCuBjBaEtCuE`B{CXcB@{Gg@sJR_CIsN_BiND{CLwFf@eHjB}An@yJ`EaDhBaBbCu@zB[~AYpFqB`UgArPi@rJOP?bCY`EgAbG_CfFgCtEg@dAwApC\\n@~B`CxC`C"))
  // escaped in python (mode: transit)
  const [path, setPath] = useState(
    decodePolyline(
      "ssllExuqmUWX_@l@}C~EcPhWgAzAwJzOaKhPyUt_@kXjc@ySz\\eLxQsIhNkSf\\kQjYmg@~x@kh@nz@eA`BmC`E{Tn^OZwDfGuFbJ{A|B_CxDkJlOeIpMwKhQiE~GsA`C[p@_IhMsMzSaZ`f@{i@p|@sZvf@i@z@yFlJ{Uv_@cFfIaBvBqC`CaCrAkBn@gE`AmSlEmK|BeC^uBL}A@m_@FsF?oE?}LGsNKqSEyLDu]GmBDuAPqBl@aFvBcDfAmB^kCViABwF?{OCmXBuJ@uJAyZCoDHgALw@RgAh@mAfAaA|Ai@dB{@dE}EbWeGxZ_Jpe@qBzJk@`DoApG}@hFsHt`@uAzGmBbI_ArDo@rBuB|FuBnEsChF_B~Bq@z@eC|CgFdFsEnDiF`DwCvAsEfBsBn@oG|A}KfCaM|Cmu@~PeSxEqFjAkT|EaPtDuJ|BcNtCkT`F}FtA_F~@iBViD\\eDNqBDeID{YNgUJsFFwCV}Bj@_C`AaAj@eBrA_BdBkAdB_BhDy@jCe@pCWvCKrC@`GDvNPbg@f@zwA@fF@dGEpF]bJa@zEcE~_@q@~Fy@rH{K~eA}S`rB{@jIuAjMg@|Cq@|Ce@hBmAtDkArC_CdF_GdMgGrMia@r{@}Sbd@k\\bs@{MlYgCpFgGnMeQd_@gPt]ip@fvA_BjDmA~BkAjBqBnCgBpB{ApAoDbCw@b@kCfAeBj@iCl@kBZiCT{BHk^Dci@Fgv@HkYDoEByAFkBPuDv@iBf@{Al@mBbAcC`BeBzAcEfEgN~N{ChDoCrCqFzF{DfEqNlOuGhHeCdDu@rAyA|CaApCi@jBkC~LsCvMqHf^uDjQmDvPgBrGwBnFuClFsQbZcFnIiDjFgKjPuIpNeCxE}CvHcBpFy@|CmBhIgFjTA`@m@jCgBpHoDbOoBzIsHtZ{DxOcCdKcA~Eg@|Bs@rCiB~HwA~FsMbj@cVhcAqFnUwFnV_HnY_DnMgD|N}CfN{Kzd@iNzk@uLxg@mDlM{AlGmEbReChKaAbEw@fDw@`EoBfIoBfIi@~BwA~GmChLkBhIWlBa@tFMjGMxCO|AWtAk@dBeAhBmApAq@d@m@\\aA^gATgAFoCCqDMsC?{BReWjD{G`AaIbA{G~@kNlBoc@jGkb@|FyMnByANkBLgA@UCcD_@gTuDo@I}Aa@uBmA{AqAcFqEw@m@m@[kA[w@IeACkBJuNdAmEl@qAZq@`@i@l@[l@YfAIz@BnDRlENjAXbAj@bAv@t@`@VrFbC|BnAzFhCvAb@fH|@F@^oE"
    )
  );

  const [center, setCenter] = useState({ lat: 33.643, lng: -117.841 });
  const [zoom, setZoom] = useState(10);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const recenter = (e) => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      //getMapsRoute("33.643,-117.841", "Los Angeles, CA", "transit", "");
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
  };

  const goToLocation = (lat, lng) => {
    const pos = {
      lat,
      lng,
    };
    setCenter(pos);
    setZoom(13);
  };

  const getRoutePath = (route) => {
    if ("overview_polyline" in route) {
      //console.log(decodePolyline(route["overview_polyline"]))
      return decodePolyline(route["overview_polyline"]);
    } else {
      //console.log([{lat:route["origin_lat"],lng:route["origin_lon"]},{lat:route["destination_lat"],lng:route["destination_lon"]}])
      return [
        { lat: route["origin_lat"], lng: route["origin_lon"] },
        { lat: route["destination_lat"], lng: route["destination_lon"] },
      ];
    }
  };

  // if (isLoaded) {
  //   polylines.forEach(polyline => {

  //   })
  // props.routes.map((route, index) => {
  //   setPolylines([
  //     ...polylines,
  //     <Polyline
  //       path={getRoutePath(route)}
  //       options={{ strokeColor: route.color, strokeWeight: 5 }}
  //     />,
  //   ]);
  // });
  // }

  return isLoaded ? (
    <div>
      <button
        id="recenter-button"
        className="primary-button"
        onClick={recenter}
        style={{
          position: "absolute",
          zIndex: 1000,
          right: 60,
          margin: 8,
          // marginLeft: "1000px",
          backgroundColor: "#f9f9f9",
        }}
      >
        Recenter
      </button>
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          center={center}
          zoom={zoom}
        >
          {props.routes.map((route, index) => {
            return (
              <Polyline
                path={getRoutePath(route)}
                options={{ strokeColor: route.color, strokeWeight: 5 }}
              />
            );
          })}
          <Sidebar
            setLoc={props.setLoc}
            fetchRoutes={props.fetchRoutes}
            routes={props.routes}
            fetchReviews={props.fetchReviews}
          />
        </GoogleMap>
      </div>
    </div>
  ) : (
    <></>
  );
};
