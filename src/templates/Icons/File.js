/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";

function File({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>file</title>
      <g id="Basic-Elements" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          id="Rounded-Icons"
          transform="translate(-1721.000000, -292.99)"
          fill={colors[color] ? colors[color].main : colors.dark.main}
          fillRule="nonzero"
        >
          <g id="Icons-with-opacity" transform="translate(1716.000000, 291.000000)">
            <g id="file" transform="translate(2.000000, 0.000000)">
              <path d="M16,2l4,4H16ZM14,8h6V21a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V3A1,1,0,0,1,5,2h9ZM7,6A1,1,0,0,0,8,7h3a1,1,0,0,0,0-2H8A1,1,0,0,0,7,6ZM17,18a1,1,0,0,0-1-1H8a1,1,0,0,0,0,2h8A1,1,0,0,0,17,18ZM8,13a1,1,0,0,0,0,2h8a1,1,0,0,0,0-2Z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

// Setting default values for the props of File
File.defaultProps = {
  color: "dark",
  size: "16px",
};

// Typechecking props for the File
File.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default File;
