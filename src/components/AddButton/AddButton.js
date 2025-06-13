import React, { useState } from 'react';
import "./AddButton.css";
import PropTypes from "prop-types";


function AddButton({ onClick, children, style }) {
  return (
    <button className="add-btn" 
      style={{fontSize: "14px",...style}} 
      onClick={onClick} >
      {children}
    </button>
  );
}

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired, 
  style: PropTypes.object,
};

export default AddButton;
