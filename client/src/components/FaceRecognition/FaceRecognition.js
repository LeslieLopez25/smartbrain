import React from "react";
import "./FaceRecognition.css";

export default function FaceRecognition({ imageUrl, boxes }) {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {boxes.length > 0 ? (
          boxes.map((box, index) => (
            <div
              key={index}
              className="bounding-box"
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            ></div>
          ))
        ) : (
          <p className="white f3">No faces detected</p>
        )}
      </div>
    </div>
  );
}
