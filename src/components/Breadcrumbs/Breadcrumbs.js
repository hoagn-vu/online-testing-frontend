import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

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

export default Breadcrumbs;
