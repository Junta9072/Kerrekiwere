import "./Velo.css";
import { useEffect, useState } from "react";

function Velo(props) {
  const [veloName, setVeloName] = useState(null);
  const [veloFree, setVeloFree] = useState(null);
  const [veloCount, setVeloCount] = useState(null);

  //velo API
  useEffect(() => {
    async function getStations() {
      const response = await fetch(
        "https://api.citybik.es/v2/networks/velo-antwerpen"
      );
      let json = await response.json();
      //geolocation ophalen
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }

      function showPosition(position) {
        console.log(
          "Latitude: " +
            position.coords.latitude +
            " | Longitude: " +
            position.coords.longitude
        );
        //closest distance
        //    maak een nieuw object aan
        json.network.stations.forEach((station, i) => {
          station["distance"] = getDistance(
            position.coords.latitude,
            position.coords.longitude,
            station.latitude,
            station.longitude
          );
        });
        //    sorteer de array
        json.network.stations.sort(function (a, b) {
          return a.distance.distance - b.distance.distance;
        });
        setVeloName(json.network.stations[props.podium].extra.address);
        setVeloFree(json.network.stations[props.podium].free_bikes);
        if (json.network.stations[props.podium].free_bikes <= 9) {
          setVeloCount("veloLow");
        }
      }

      function showError(error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        }
      }

      //copy paste van IS2 opdracht6
      // Degrees to Radians
      function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
      }

      // Redians to Degrees
      function radiansToDegrees(radians) {
        return (radians * 180) / Math.PI;
      }

      // Calculate Distance Between LatLongs
      function getDistance(lat1, lon1, lat2, lon2) {
        const earthRadiusKm = 6371;

        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        const lat1rad = degreesToRadians(lat1);
        const lat2rad = degreesToRadians(lat2);
        const lon1rad = degreesToRadians(lon1);
        const lon2rad = degreesToRadians(lon2);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1rad) *
            Math.cos(lat2rad);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = Math.round(earthRadiusKm * c * 1000);

        const y = Math.sin(lon2rad - lon1rad) * Math.cos(lat2rad);
        const x =
          Math.cos(lat1rad) * Math.sin(lat2rad) -
          Math.sin(lat1rad) * Math.cos(lat2rad) * Math.cos(lon2rad - lon1rad);
        let brng = Math.atan2(y, x);
        brng = radiansToDegrees(brng);

        const direction = Math.round((brng + 360) % 360);
        //console.log(":" +direction)
        return {
          distance,
          directionInDegrees: direction,
          directionInWind: convertWindDirection(direction),
        };
      }

      // Convert Bearing
      function convertWindDirection(direction) {
        let result = "";
        if (direction < 22.5) {
          result = "North";
        } else if (direction > 22.5 && direction < 67.5) {
          result = "NorthEast";
        } else if (direction > 67.5 && direction < 112.5) {
          result = "East";
        } else if (direction > 112.5 && direction < 157.5) {
          result = "SouthEast";
        } else if (direction > 157.5 && direction < 202.5) {
          result = "South";
        } else if (direction > 202.5 && direction < 247.5) {
          result = "SouthWest";
        } else if (direction > 247.5 && direction < 292.5) {
          result = "West";
        } else if (direction > 292.5 && direction < 337.5) {
          result = "NorthWest";
        } else if (direction > 337.5) {
          result = "North";
        }

        return result;
      }
      getLocation();
    }

    getStations();
  }, []);
  return (
    <div className="Velo">
      <span className="veloName">{veloName}</span>
      <span className={veloCount + " veloIcon"}></span>
      <span className="veloFree">{veloFree}</span>
    </div>
  );
}

export default Velo;
