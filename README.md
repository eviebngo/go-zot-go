# Go Zot Go!
A readme goes here

## Tech Stack
Frontend: ReactJS + Vite <br/>
Backend: FastAPI server

## Start the development server
### Start backend server
Go to directory
```
cd backend
```
Create virtual env
```
python -m venv venv
source venv/bin/activate
```
Install dependencies
```
pip install requirements.txt
```
Start FastAPI server
```
python main.py
```

### Start frontend server
Go to directory
```
cd frontend
```
Install dependences
```
npm i
```
Start server
```
npm run dev
```

### Notes
Frontend server runs on localhost:5173 <br/>

Backend server runs on localhost:8000, but also has API endpoint at localhost:5173/api
