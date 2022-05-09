import "./Lijn.css";
import { useEffect, useState } from "react";
import { getDistance } from "../utils/helpers";
import moment from "moment";
moment().format();

function Lijn(props) {
  const [haltes, setHaltes] = useState([]);
  const [halte, setHalte] = useState("loading");
  const [count, setCount] = useState(0);
  const [sheet0, setSheet0] = useState(0);
  const [sheet1, setSheet1] = useState(0);
  const [sheet2, setSheet2] = useState(0);
  const [dur0, setDur0] = useState(0);
  const [dur1, setDur1] = useState(0);
  const [dur2, setDur2] = useState(0);
  const [lijnStop, setLijnStop] = useState("hallteSelect loadingLijn");
  const [timesheet, setTimesheet] = useState("loading");

  useEffect(() => {
    async function getLijn() {
      const response = await fetch(
        "https://api.delijn.be/DLKernOpenData/api/v1/entiteiten/1/haltes",
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "ef400d19bfa2408084768076c7c66fc8",
          },
        }
      );
      let json = await response.json();
      const results = json.haltes;
      setLijnStop("halteSelect loadingFinish");

      //adressAPI scripts

      //get location

      results.forEach((halte, i) => {
        halte["distance"] = getDistance(
          props.lat,
          props.lon,
          halte.geoCoordinaat.latitude,
          halte.geoCoordinaat.longitude
        );
      });
      //    sorteer de array

      results.sort(function (a, b) {
        return a.distance.distance - b.distance.distance;
      });
      setHaltes(results);
      //hier resultaat
      setHalte(results[count].omschrijving);
    }
    getLijn();
  }, []);

  useEffect(() => {
    if (haltes[count]) {
      setHalte(haltes[count].omschrijving);
      async function getTimesheet() {
        const response = await fetch(
          "https://api.delijn.be/DLKernOpenData/api/v1/haltes/1/" +
            haltes[count].haltenummer +
            "/real-time?maxAantalDoorkomsten=3",
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "ef400d19bfa2408084768076c7c66fc8",
            },
          }
        );
        let json = await response.json();

        //moment berekening
        let date = new Date();
        function durCalc(x, y) {
          var start = new moment(x);
          var stop = new moment(y);
          return moment.duration(start.diff(stop));
        }

        function checkDoorkomst() {
          if (json.halteDoorkomsten.length > 0) {
            const results = json.halteDoorkomsten[0].doorkomsten;
            setTimesheet(results);
            setSheet0(results[0]);
            setSheet1(0);
            setSheet2(0);
            setDur1(0);
            setDur2(0);
            setDur0(
              durCalc(date, results[0]["real-timeTijdstip"])._data.minutes
            );
            if (results.length > 1) {
              setSheet1(results[1]);
              setDur1(
                durCalc(date, results[1]["real-timeTijdstip"])._data.minutes
              );
            }
            if (results.length > 2) {
              setSheet2(results[2]);
              setDur2(
                durCalc(date, results[2]["real-timeTijdstip"])._data.minutes
              );
            }
          } else {
            setCount(count + 1);
          }
        }

        checkDoorkomst();
      }
      getTimesheet();
    }
  }, [count, haltes]);

  return (
    <div className="Lijn">
      <div className="LijnContainer">
        <span className={lijnStop}>{halte}</span>
        <span
          className="lijnp"
          onClick={() => {
            setCount(count - 1);
          }}
        >
          -
        </span>
        <span
          className="lijnm"
          onClick={() => {
            setCount(count + 1);
          }}
        >
          +
        </span>
        <span
          className="lijnreset"
          onClick={() => {
            setCount(0);
          }}
        >
          *
        </span>
      </div>
      <div className="timetable">
        <p value="0" className="time">
          <span className="n°">{sheet0.lijnnummer}</span>
          <span className="destination">{sheet0.bestemming}</span>
          <span className="tminus">{Math.abs(dur0)}m</span>
        </p>
        <p value="1" className="time">
          <span className="n°">{sheet1.lijnnummer}</span>
          <span className="destination">{sheet1.bestemming}</span>
          <span className="tminus">{Math.abs(dur1)}m</span>
        </p>
        <p value="2" className="time">
          <span className="n°">{sheet2.lijnnummer}</span>
          <span className="destination">{sheet2.bestemming}</span>
          <span className="tminus">{Math.abs(dur2)}m</span>
        </p>
      </div>
    </div>
  );
}

export default Lijn;
