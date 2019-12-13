import React from "react";
import classNames from "classnames";
import "./CubeView.css";

const CLASS_NAME_POSTURE_TYPE = [
  "show-normal",
  "show-normal",
  "show-upside-down",
  "show-front-side-down",
  "show-back-side-down",
  "show-left-side-down",
  "show-right-side-down"
];

function CubeView(props) {
  return (
    <div className="cube-view">
      <div
        className={classNames(["cube", CLASS_NAME_POSTURE_TYPE[props.posture]])}
      >
        <div className="cube_face cube_face-front">toio</div>
        <div className="cube_face cube_face-back" />
        <div className="cube_face cube_face-right" />
        <div className="cube_face cube_face-left" />
        <div className="cube_face cube_face-top" />
        <div className="cube_face cube_face-bottom" />
      </div>
    </div>
  );
}

export default CubeView;
