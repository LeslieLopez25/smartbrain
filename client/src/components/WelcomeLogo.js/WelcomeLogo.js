import Tilt from "react-parallax-tilt";
import brain from "./brain.png";

import "./WelcomeLogo.styles.css";

// Displays a tilting brain logo on the welcome screen
export default function WelcomeLogo() {
  return (
    <div className="w-full mt-5 mb-6 flex justify-center">
      <Tilt
        className="Tilt br2 shadow-2"
        style={{ height: "150px", width: "150px" }}
        tiltMaxAngleX={25}
        tiltMaxAngleY={25}
      >
        <div className="p-4 flex items-center justify-center h-full w-full">
          <img className="h-full w-auto wiggle-logo" alt="logo" src={brain} />
        </div>
      </Tilt>
    </div>
  );
}
