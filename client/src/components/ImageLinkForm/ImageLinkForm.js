import React, { useState } from "react";
import PropTypes from "prop-types";

import "./ImageLinkForm.css";

export default function ImageLinkForm({ onInputChange, onButtonSubmit }) {
  const [input, setInput] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
    onInputChange(event);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && input.trim()) {
      onButtonSubmit();
    }
  };

  return (
    <div>
      <p className="image-link-form-text">
        {"This Magic Brain will detect faces in your pictures. Give it a try."}
      </p>
      <div className="image-link-form-container">
        <div className="image-link-form-input-container form">
          <input
            className="image-link-form-input"
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter image URL"
            aria-label="Image URL input field"
          />
          <button
            className="image-link-form-button"
            onClick={onButtonSubmit}
            disabled={!input.trim()}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
}

ImageLinkForm.propTypes = {
  onInputChange: PropTypes.func.isRequired,
  onButtonSubmit: PropTypes.func.isRequired,
};
