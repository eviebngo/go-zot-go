import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { getCustomRoutes } from "./api_functions/routes";
import { getCustomReviews } from "./api_functions/reviews";
import { getMapsAutocomplete } from "./api_functions/maps"

function App() {
  const [count, setCount] = useState(0);

  // Some test runs of API functions in frontend
  getCustomRoutes(34.056365083876415, -118.23400411024693);
  getCustomReviews(1);
  getMapsAutocomplete()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
