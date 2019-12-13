import React from "react";
import cmp from "semver-compare";
import classNames from "classnames";
import Footer from "./components/Footer";
import CubeView from "./components/CubeView";
import useCube from "./hooks/useCube";
import "./App.css";

function App() {
  const [
    connect,
    disconnect,
    connected,
    orientation,
    doubleTap,
    version
  ] = useCube();

  // When browser doesn't support bluetooth
  if (navigator.bluetooth === undefined) {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-notice">
            <p>This browser doesn't support Bluetooth.</p>
            <p>Please use Google Chrome on PC/Mac/Android.</p>
          </div>
        </header>
        <Footer />
      </div>
    );
  }

  const styles = [
    { backgroundColor: "#282c34", color: "white" },
    { backgroundColor: "yellow", color: "black" },
    { backgroundColor: "white", color: "black" },
    { backgroundColor: "red", color: "white" },
    { backgroundColor: "orange", color: "white" },
    { backgroundColor: "greenyellow", color: "black" },
    { backgroundColor: "blue", color: "white" }
  ];

  const generateNotice = () => {
    if (!connected) {
      return <p>Connect a cube</p>;
    }
    if (version === "") {
      return null;
    }
    if (cmp(version, "2.1.0") < 0) {
      return (
        <>
          <p>This cube doesn't support new sensor features.</p>
          <p>
            <a
              className="App-link"
              href="https://toio.io/update"
              target="_blank"
              rel="noopener noreferrer"
            >
              Please update system software{" "}
              <span role="img" aria-label="go to official information">
                👉
              </span>
            </a>
          </p>
        </>
      );
    }
    return <p>Rotate or Double Tap</p>;
  };

  return (
    <div className="App" style={styles[orientation]}>
      <header className="App-header">
        <CubeView posture={orientation} />
        <div className={classNames({ "App-notice": true, bounce: doubleTap })}>
          {generateNotice()}
        </div>
        {connected ? (
          <button className="App-button" onClick={disconnect}>
            Disconnect
          </button>
        ) : (
          <button className="App-button" onClick={connect}>
            Connect
          </button>
        )}
      </header>
      <Footer />
    </div>
  );
}

export default App;
