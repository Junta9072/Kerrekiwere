import "./Weer.css";
import { useEffect, useState } from "react";
import { getDistance } from "../utils/helpers";

function Weer(props) {
  const [staticJson, setStaticJson] = useState(null);
  useEffect(() => {
    async function getWeer(x, y) {
      const apiKey = "084e0c6239fedd9c66b9ff66f0e8e7cd";
      const url =
        `https://api.openweathermap.org/data/2.5/onecall?lat=` +
        x +
        `&lon=` +
        y +
        `&exclude={part}&appid=` +
        apiKey +
        `&units=metric`;
      //const url = `https://api.mapbox.com/geocoding/v5/{mapbox.places}/${position.coords.longitude},${position.coords.latitude}.json`;
      //51.211614879653794, 4.428022493438946
      try {
        const response = await fetch(url);
        const json = await response.json();
        setStaticJson(json);
      } catch (error) {
        console.log(error);
      }
    }
    getWeer(props.lat, props.lon);
  }, [props.lat, props.lon]);

  return (
    <div className="weer">
      <div className="guide">
        <span className="temp">temp</span>
        <br />
        <span className="rain">rain</span>
      </div>
      <div className="graph">
        {staticJson && staticJson.hourly
          ? staticJson.hourly.map((item, i) => {
              let margin = staticJson.hourly[i].pop;
              return (
                <div
                  className="bol"
                  key={item.dt}
                  style={{
                    backgroundPosition: "center " + margin + "px",
                    gridArea: "1 / " + (i + 1) + " / 1 / " + (i + 2),
                  }}
                />
              );
            })
          : "loading"}
        {staticJson && staticJson.hourly
          ? staticJson.hourly.map((item, i) => {
              let tempOffset = staticJson.hourly[i].temp;
              return (
                <div
                  className="tempbol"
                  key={item.dt}
                  style={{
                    transform: "translateY(-" + tempOffset / 4 + "vw)",
                    gridArea: "1 / " + (i + 1) + " / 1 / " + (i + 2),
                  }}
                />
              );
            })
          : "loading"}
      </div>
      <div className="turf">
        <span>now</span>
        <span>+6u</span>
        <span>+12u</span>
        <span>+18u</span>
        <span>+24u</span>
        <span>+30u</span>
        <span>+36u</span>
        <span>+32u</span>
      </div>
    </div>
  );
}

export default Weer;
