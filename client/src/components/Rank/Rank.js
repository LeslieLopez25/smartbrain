import React from "react";

// Displays the user's name and how many images they've submitted
export default function Rank({ name, entries }) {
  return (
    <div>
      <div className="white f3">
        {`${name}, your current entry count is...`}
      </div>
      <div className="white f1">{entries}</div>
    </div>
  );
}
