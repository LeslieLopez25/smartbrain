import React, { useEffect } from "react";
import ReactDom from "react-dom";

import "./Modal.css";

const modalRoot = document.getElementById("modal-root");

// This component renders its children into a separate DOM node (used for popups like the profile modal)
export default function Modal({ children }) {
  const el = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  return ReactDom.createPortal(children, el);
}
