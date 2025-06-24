import React, { useState } from 'react';
import "./CancelButton.css";
import PropTypes from "prop-types";


function CancelButton({ onClick, children, style, id, ...rest}) {
  return (
    <button 
			className="cancel-btn" 
			style={{ fontSize: "14px", ...style }}
			onClick={onClick} 
      id={id}
      {...rest}
    >
      {children}
    </button>
  );
}

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired, 
  style: PropTypes.object,
  id: PropTypes.string,
};

export default CancelButton;
