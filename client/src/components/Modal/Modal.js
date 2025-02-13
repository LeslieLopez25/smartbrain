import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

export default function Modal({ children }) {
  const el = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) {
      console.error("Error: No 'modal-root' element found in index.html!");
      return;
    }

    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  return ReactDOM.createPortal(children, el);
}
