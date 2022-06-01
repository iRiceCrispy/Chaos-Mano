import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Modal.css';

const Modal = ({ children, showModal }) => (
  <div className="modalContainer">
    <div className="modal">
      <button
        className="btn transparent closeModal"
        type="button"
        onClick={() => showModal(false)}
      >
        <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
