import React, { useEffect } from "react";
import ReactDom from "react-dom";
import "./Modal.css";

const modalRoot = document.getElementById("modal-root");

export default function Modal({ children, el }) {
  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  return ReactDom.createPortal(children, el);
}
