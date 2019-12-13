import React from "react";
import { GoMarkGithub } from "react-icons/go";

function Footer() {
  return (
    <footer className="App-footer">
      <p>
        by{" "}
        <a
          className="App-link"
          href="https://twitter.com/yaeda"
          target="_blank"
          rel="noopener noreferrer"
        >
          @yaeda
        </a>{" "}
        on{" "}
        <a
          className="App-link"
          href="https://github.com/yaeda/cube-sensor-demo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GoMarkGithub style={{ verticalAlign: "middle" }} />
        </a>
      </p>
    </footer>
  );
}

export default Footer;
