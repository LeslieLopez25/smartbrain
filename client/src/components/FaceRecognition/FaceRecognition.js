import React, { useMemo } from "react";
import PropTypes from "prop-types";

import "./FaceRecognition.css";

export default function FaceRecognition({ imageUrl, boxes }) {
  const renderBoxes = useMemo(() => {
    if (!boxes || boxes.length === 0) {
      return <p className="white f3">No faces detected</p>;
    }

    return boxes.map((box, index) => (
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
    ));
  }, [boxes]);

  return (
    <div className="center ma">
      <div className="absolute mt2">
        {imageUrl ? (
          <>
            <img
              id="inputimage"
              alt=""
              src={imageUrl}
              width="500px"
              height="auto"
            />
            {renderBoxes}
          </>
        ) : (
          <p className="white f3">No Image Uploaded</p>
        )}
      </div>
    </div>
  );
}

FaceRecognition.propTypes = {
  imageUrl: PropTypes.string,
  boxes: PropTypes.arrayOf(
    PropTypes.shape({
      topRow: PropTypes.number.isRequired,
      rightCol: PropTypes.number.isRequired,
      bottomRow: PropTypes.number.isRequired,
      leftCol: PropTypes.number.isRequired,
    })
  ),
};
