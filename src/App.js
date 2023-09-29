import {
  BsFillArrowUpSquareFill,
  BsFillArrowDownSquareFill,
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";

import "./App.scss";

import mqtt from "mqtt/dist/mqtt";
import { useEffect, useRef, useState } from "react";

const clientId = "emqx_react_afshin";
const username = "nahofteh";
const password = "12345678";

function App() {
  const client = useRef(null);
  const [light, setLight] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    console.log("refreshing...");
    client.current = mqtt.connect(
      "wss://b7e74b66.ala.us-east-1.emqxsl.com:8084/mqtt",
      {
        clientId,
        username,
        password,
      },
    );
    client.current.on("message", (topic, message) => {
      console.log(`received message: ${message} from topic: ${topic}`);
    });
  }, []);

  const mqttPublish = (context) => {
    if (client.current) {
      console.log("publishing...");
      const { topic, qos, payload } = context;
      client.current.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  return (
    <div className="app">
      <div className="title">Control Machine</div>
      <div className="navigation-buttons">
        <div className="navigation-buttons-row">
          <div
            className="navigation-button"
            onClick={() =>
              mqttPublish({
                topic: "esp32/test",
                payload: "MoveCar,1",
                qos: 2,
              })
            }
          >
            <BsFillArrowUpSquareFill fontSize={64} />
          </div>
        </div>
        <div className="navigation-buttons-row">
          <div
            className="navigation-button"
            onClick={() =>
              mqttPublish({
                topic: "esp32/test",
                payload: "MoveCar,3",
                qos: 2,
              })
            }
          >
            <BsFillArrowLeftSquareFill fontSize={64} />
          </div>
          <div
            className="navigation-button"
            onClick={() =>
              mqttPublish({
                topic: "esp32/test",
                payload: "MoveCar,4",
                qos: 2,
              })
            }
          >
            <BsFillArrowRightSquareFill fontSize={64} />
          </div>
        </div>
        <div className="navigation-buttons-row">
          <div
            className="navigation-button"
            onClick={() =>
              mqttPublish({
                topic: "esp32/test",
                payload: "MoveCar,2",
                qos: 2,
              })
            }
          >
            <BsFillArrowDownSquareFill fontSize={64} />
          </div>
        </div>
      </div>
      <div className="range-wrapper">
      <div>LIGHT:</div>
        <input
          type={"range"}
          value={light}
          min={0}
          max={255}
          onChange={(e) => setLight(e.target.value)}
        />
      </div>
      <div className="range-wrapper">
        <div>SPEED:</div>
        <input
          type={"range"}
          value={speed}
          min={0}
          max={255}
          onChange={(e) => setSpeed(e.target.value)}
        />
      </div>
      <div className="send-message-button-wrappers">
        <button
          className="button"
          onClick={() =>
            mqttPublish({
              topic: "esp32/test",
              payload: "Speed,255",
              qos: 2,
            })
          }
        >
          SEND SPEED
        </button>
        <button
          className="button light"
          onClick={() =>
            mqttPublish({
              topic: "esp32/test",
              payload: `Light,${light}`,
              qos: 2,
            })
          }
        >
          SEND LIGHT
        </button>
        <button
          className="button stop"
          onClick={() =>
            mqttPublish({
              topic: "esp32/test",
              payload: "MoveCar,0",
              qos: 2,
            })
          }
        >
          STOP
        </button>
      </div>
      <div className="footer">&copy; 2023, By Afshin Zanganeh & Seyed Emad Mousavi</div>
    </div>
  );
}

export default App;
