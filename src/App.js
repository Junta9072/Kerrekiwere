import "./App.css";
import Velo from "./components/Velo";
import Lijn from "./components/Lijn";
import Weer from "./components/Weer";

//side effects
import { useEffect, useState } from "react";

function App() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [mode, setMode] = useState(false);
  const [light, setLight] = useState(null);
  const [currentMode, setCurrentMode] = useState("LightMode");

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    console.log(position);
    setLat(position.coords.latitude);
    setLon(position.coords.longitude);
  }

  function showError() {
    alert("location error");
  }
  useEffect(() => {
    getLocation();
  }, []);

  function modeSwitch() {}

  return (
    <main className={light}>
      <div className="veloBox">
        <h1>
          Velo<span className="red">.</span>
        </h1>
        <div className="veloDisplay">
          <Velo podium={0} />
          <Velo podium={1} />
          <Velo podium={2} />
        </div>
      </div>
      <div className="deLijnBox">
        <h1>
          De lijn<span className="red">.</span>
        </h1>
        {lat && lon && <Lijn lat={lat} lon={lon} />}
      </div>
      <div className="nmbsBox"></div>
      <div className="weerBox">
        <h1>
          Weer<span className="red">.</span>
        </h1>
        {lat && lon && <Weer lat={lat} lon={lon} />}
      </div>
      <button
        className="modeSwitch"
        onClick={() => {
          if (mode == false) {
            console.log(mode);
            setLight("light");
            setMode(true);
            setCurrentMode("Darkmode");
          } else if (mode == true) {
            console.log(mode);
            setLight(null);
            setMode(false);
            setCurrentMode("LightMode");
          }
        }}
      >
        {currentMode}
      </button>
    </main>
  );
}

export default App;
