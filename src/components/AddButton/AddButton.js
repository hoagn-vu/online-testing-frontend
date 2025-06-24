import React, { useState } from 'react';
import "./AddButton.css";
import PropTypes from "prop-types";


function AddButton({ onClick, className = "", children, style, ...rest }) {
  return (
    <button 
      className={`add-btn ${className}`}
      style={{fontSize: "14px",...style}} 
      onClick={onClick}
      {...rest}
    >
      {children}

    </button>
  );
}

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired, 
  style: PropTypes.object,
  className: PropTypes.string,
};

export default AddButton;
