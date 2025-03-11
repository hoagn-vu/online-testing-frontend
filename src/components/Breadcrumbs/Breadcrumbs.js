import React from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Breadcrumbs = ({ currentPage }) => {
  return (
    <nav className="breadcrumb-container">
      <Link to="/" className="breadcrumb-link">
        <FaHome /> Home
      </Link>
      <span> / </span>
      <span className="breadcrumb-current">{currentPage}</span>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  currentPage: PropTypes.string.isRequired,
};

export default Breadcrumbs;
