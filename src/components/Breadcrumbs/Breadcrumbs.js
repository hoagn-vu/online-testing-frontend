import React from "react";
import { FaHome } from "react-icons/fa";
import PropTypes from "prop-types";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";

const BreadcrumbComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Trang chủ
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography key={to} color="text.primary">
            {value}
          </Typography>
        ) : (
          <Link key={to} component={RouterLink} to={to} underline="hover" color="inherit">
            {value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

BreadcrumbComponent.propTypes = {
  currentPage: PropTypes.string.isRequired,
};

export default BreadcrumbComponent;
