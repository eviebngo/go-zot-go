from fastapi import FastAPI, status, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse

from typing import TypedDict
from pathlib import Path
import json
import os
from datetime import datetime

from geopy import distance

import urllib.request
import urllib.parse

import googlemaps

'''
custom_routes_path = Path("../db/custom_routes.json")

reviews_path = Path("../db/reviews.json")
'''
custom_routes_path = Path(__file__).parent.parent/"db/custom_routes.json"

reviews_path = Path(__file__).parent.parent/"db/reviews.json"

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

gmaps = googlemaps.Client(key=os.environ['VITE_MAPS_API_KEY'])

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

@app.get("/custom_routes")
async def read_custom_routes(to_lat: float, to_lon: float) -> JSONResponse:
    """
    Finds all custom routes within a 0.5 mile radius of specified lat and lon
    Query: [url]/custom_routes?to_lat=[latitude]&to_lon=[longitude]
    """
    if custom_routes_path.exists():
        file = json.load(open(custom_routes_path))
        file_list = [route for route in file["custom_routes"] if distance.distance((to_lat, to_lon), (route["destination_lat"], route["destination_lon"])).miles <= 0.5]
        return JSONResponse(file_list)
    return JSONResponse({"Error": "File not found"})


@app.post("/custom_routes")
async def post_custom_route(destination_lat: float = Form(), destination_lon: float = Form(), destination: str = Form(), route: list[dict] = Form()) -> JSONResponse:
    date = datetime.now()
    file = json.load(open(custom_routes_path))
    id = file["custom_routes"][-1]["id"]+1
    new_custom_route = {
        "id": id,
        "origin": "UCI",
        "destination": destination,
        "destination_lat": destination_lat,
        "destination_lon": destination_lon,
        "route": route,
        "time": date.isoformat(timespec="seconds")
    }
    file["custom_routes"].append(new_custom_route)
    with open(custom_routes_path, "w") as f:
        json.dump(file,f)
    
    return RedirectResponse(f'/api/custom_routes?to_lat={destination_lat}&to_lon={destination_lon}', status.HTTP_303_SEE_OTHER)

@app.get("/reviews")
async def read_reviews(custom: bool, id: str | int) -> JSONResponse:
    """
    Finds all reviews of a route
    If route is through Google Routes, routeId is unique polyline
    If route is custom, routeId is the id associated with custom route
    Query: [url]/reviews?custom=[true/false]&id=[id]
    """
    if reviews_path.exists():
        if id.isdigit():
            id = int(id)
        file = json.load(open(reviews_path))
        file_list = [review for review in file["reviews"] if review["isCustom"] == custom and review["routeId"] == id]
        return JSONResponse(file_list)
    return JSONResponse({"Error": "File not found"})

@app.post("/reviews")
async def post_reviews(custom: bool = Form(), id: str| int = Form(), time: str = Form(), stars: float = Form(), comments: str = Form()) -> RedirectResponse:
    file = json.load(open(reviews_path))
    review_id = file["reviews"][-1]["id"]+1
    if id.isdigit():
        id = int(id)
    new_review = {
        "id": review_id,
        "isCustom": custom,
        "routeId": id,
        "stars": stars,
        "comments": comments,
        "time": time
    }
    file["reviews"].append(new_review)
    with open(reviews_path, "w") as f:
        json.dump(file,f)
    return RedirectResponse(f'/reviews?custom={custom}&id={id}', status.HTTP_303_SEE_OTHER)


@app.get("/maps_autocomplete")
async def get_map_autocomplete(input: str) -> JSONResponse:
    '''
    Returns all predicted autocomplete searches on Google Maps
    '''
    input = urllib.parse.quote(input)
    try:
        request = urllib.request.urlopen(f"https://maps.googleapis.com/maps/api/place/autocomplete/json?key={os.getenv('VITE_MAPS_API_KEY')}&input={input}")
        data = json.loads(request.read().decode(encoding="utf-8"))
        predictions = { "predictions": [] } 
        if data["status"] == "OK":
            for pred in data["predictions"]:
                predictions["predictions"].append({
                    "description":pred["description"],
                    "place_id":pred["place_id"]
                })
        return json.dumps(predictions)
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as error:
        return JSONResponse({"Error":error})


@app.get("/maps_route")
async def get_map_route(origin: str, destination: str, mode: str, arrival_time: str, departure_time: str) -> JSONResponse:
    '''
    Returns best Google Maps route
    '''
    # route = gmaps.directions(origin,destination) 
    # return route
    origin = urllib.parse.quote(origin)
    destination = urllib.parse.quote(destination)
    print("origin, destination",origin,destination)
    try:
        request = urllib.request.urlopen(f"https://maps.googleapis.com/maps/api/directions/json?destination={destination}&origin={origin}&alternatives=true&mode={mode}&arrival_time={arrival_time}&departure_time={departure_time}&key={os.environ['VITE_MAPS_API_KEY']}")
        data = json.loads(request.read().decode(encoding="utf-8"))
        routes = {"routes":[]}
        if data["status"] == "OK":
            for route in data["routes"]:
                legs = []
                for leg in route["legs"]:
                    steps = []
                    for step in leg["steps"]:
                        steps.append({
                            "duration": step["duration"],
                            "end_location": step["end_location"],
                            "polyline": step["polyline"],
                            "start_location": step["start_location"],
                            "travel_mode": step["travel_mode"]
                        })
                    legs.append({
                        "end_address": leg["end_address"],
                        "end_location": leg["end_location"],
                        "start_address": leg["start_address"],
                        "start_location": leg["start_location"],
                        "steps": steps,
                        "distance": leg["distance"],
                        "duration": leg["duration"]
                    })
                overview_polyline = ""
                for char in route["overview_polyline"]["points"]:
                    # if char in ['\\', '"', "'", '\n', '\t', '\r']:
                    #     overview_polyline += '\\' + char
                    # else:
                    #     overview_polyline += char
                    overview_polyline += char
                routes["routes"].append({
                    "overview_polyline":overview_polyline, 
                    "bounds":route["bounds"],
                    "legs": legs
                })
        return json.dumps(routes)
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as error:
        return JSONResponse({"Error":error})