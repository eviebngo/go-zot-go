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

import datetime

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
async def read_reviews(id: str | int) -> JSONResponse:
    """
    Finds all reviews of a route
    If route is through Google Routes, routeId is unique polyline
    If route is custom, routeId is the id associated with custom route
    Query: [url]/reviews?custom=[true/false]&id=[id]
    """
    if reviews_path.exists():
        custom = False
        if id.isdigit():
            id = int(id)
            custom = True
        file = json.load(open(reviews_path))
        file_list = [review for review in file["reviews"] if review["isCustom"] == custom and review["routeId"] == id]
        sorted_list = sorted(file_list, key=lambda item: datetime.fromisoformat(item["time"]), reverse=True)
        return JSONResponse(sorted_list)
    return JSONResponse({"Error": "File not found"})

@app.get("/reviews")
async def read_reviews(id_list: list[int]) -> JSONResponse:
    """
    Finds all reviews of a route
    If route is through Google Routes, routeId is unique polyline
    If route is custom, routeId is the id associated with custom route
    Query: [url]/reviews?custom=[true/false]&id=[id]
    """
    if reviews_path.exists():
        file = json.load(open(reviews_path))
        file_list = [review for review in file["reviews"] if review["routeId"] in id_list]
        sorted_list = sorted(file_list, key=lambda item: datetime.fromisoformat(item["time"]), reverse=True)
        return JSONResponse(sorted_list)
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
    Output format:
    {
        "routes": [
            "overview_polyline": encoded polyline string
            "bounds": 
            "steps": [
                "to": string
                "polyline": encoded polyline string
                "from": string
                "mode": string in caps
            ]
            "duration": string (human readable; in format "x days y hr z min")
        ]
    }
    '''
    # Parse inputs as parameters
    origin = urllib.parse.quote(origin)
    destination = urllib.parse.quote(destination)
    mode = urllib.parse.quote(mode)
    
    if len(arrival_time) == 0:
        arrival_time = int(datetime.datetime.now().timestamp())
    else:
        arrival_time = arrival_time.split("-")
        arrival_time = datetime.datetime(int(arrival_time[0]),int(arrival_time[1]),int(arrival_time[2]),int(arrival_time[3]),int(arrival_time[4]),int(arrival_time[5]))
        arrival_time = int(arrival_time.timestamp())
    
    if len(departure_time) == 0:
        departure_time = int(datetime.datetime.now().timestamp())
    else:
        departure_time = departure_time.split("-")
        departure_time = datetime.datetime(int(departure_time[0]),int(departure_time[1]),int(departure_time[2]),int(departure_time[3]),int(departure_time[4]),int(departure_time[5]))
        departure_time = int(departure_time.timestamp())

    try:
        request = urllib.request.urlopen(f"https://maps.googleapis.com/maps/api/directions/json?destination={destination}&origin={origin}&alternatives=true&mode={mode}&arrival_time={arrival_time}&departure_time={departure_time}&key={os.environ['VITE_MAPS_API_KEY']}")
        data = json.loads(request.read().decode(encoding="utf-8"))
        routes = {"routes":[]}
        if data["status"] == "OK":
            for route in data["routes"]:
                steps = []
                duration = 0 # in seconds
                for leg in route["legs"]:
                    for step in leg["steps"]:
                        steps.append({
                            "to": step["end_location"],
                            "polyline": step["polyline"]["points"],
                            "from": step["start_location"],
                            "mode": step["travel_mode"],
                            "type": step["transit_details"]["line"]["name"] if "transit_details" in step else ""
                        })
                    duration += leg["duration"]["value"]
                # Unformatted
                '''legs = []
                for leg in route["legs"]:
                    steps = []
                    for step in leg["steps"]:
                        steps.append({
                            "duration": step["duration"],
                            "to": step["end_location"],
                            "polyline": step["polyline"],
                            "from": step["start_location"],
                            "mode": step["travel_mode"]
                        })
                    legs.append({
                        "end_address": leg["end_address"],
                        "end_location": leg["end_location"],
                        "start_address": leg["start_address"],
                        "start_location": leg["start_location"],
                        "steps": steps,
                        "distance": leg["distance"],
                        "duration": leg["duration"]
                    })'''
                
                overview_polyline = ""
                for char in route["overview_polyline"]["points"]:
                    # if char in ['\\', '"', "'", '\n', '\t', '\r']:
                    #     overview_polyline += '\\' + char
                    # else:
                    #     overview_polyline += char
                    overview_polyline += char

                datetime_duration = datetime.timedelta(seconds=duration)
                readable_duration = ""
                if datetime_duration.days > 0:
                    readable_duration += str(datetime_duration.days)+" days "
                hours = datetime_duration.seconds//3600
                minutes = (datetime_duration.seconds%3600)//60
                if hours > 0:
                    readable_duration += str(hours) + " hr "
                if minutes > 0:
                    readable_duration += str(minutes+(1 if (datetime_duration.seconds%3600)%60 else 0)) + " min "
                readable_duration = readable_duration.strip()

                routes["routes"].append({
                    "overview_polyline":overview_polyline, 
                    "bounds":route["bounds"],
                    "steps": steps,
                    "duration": readable_duration,
                    "cost": route["fare"]["text"] if "fare" in route else 0
                })
        return json.dumps(routes)
    except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as error:
        return JSONResponse({"Error":error})