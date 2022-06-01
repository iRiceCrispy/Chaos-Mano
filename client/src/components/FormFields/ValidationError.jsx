import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ValidationError.css';

const ValidationError = ({ message }) => (
  <p className="validationError">
    {message && (
      <>
        <FontAwesomeIcon className="errorIcon" icon="fa-solid fa-circle-exclamation" />
        <span>{message}</span>
      </>
    )}
  </p>
);

export default ValidationError;
