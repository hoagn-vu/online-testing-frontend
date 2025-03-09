import React, { useEffect } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Soft UI Dashboard React context
import { useSoftUIController, setLayout } from "context";

function AuthLayout({ children }) {
  const [, dispatch] = useSoftUIController();
  const { pathname } = useLocation();

  useEffect(() => {
    setLayout(dispatch, "default");
  }, [pathname]);

  return <div>{children}</div>;
}

// Typechecking props for the AuthLayout
AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
