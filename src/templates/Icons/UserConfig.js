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

function UserConfig({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 18"
      fill={colors[color] ? colors[color].main : colors.dark.main}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>user-config</title>
      <g id="Basic-Elements" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Rounded-Icons" transform="translate(-1717.5, -294.04)" fill="red" fillRule="nonzero">
          <g id="Icons-with-opacity" transform="translate(1716.000000, 291.000000)">
            <g id="user-config" transform="translate(0.000000, 0.000000)">
              <path d="M9.6 3.32a3.86 3.86 0 103.86 3.85A3.85 3.85 0 009.6 3.32M16.35 11.07a.26.26 0 00-.25.21l-.18 1.27a4.63 4.63 0 00-.82.45l-1.2-.48a.3.3 0 00-.3.13l-1 1.66a.24.24 0 00.06.31l1 .79a3.94 3.94 0 000 1l-1 .79a.23.23 0 00-.06.3l1 1.67c.06.13.19.13.3.13l1.2-.49a3.85 3.85 0 00.82.46l.18 1.27a.24.24 0 00.25.2h1.93a.24.24 0 00.23-.2l.18-1.27a5 5 0 00.81-.46l1.19.49c.12 0 .25 0 .32-.13l1-1.67a.23.23 0 00-.06-.3l-1-.79a4 4 0 000-.49 2.67 2.67 0 000-.48l1-.79a.25.25 0 00.06-.31l-1-1.66c-.06-.13-.19-.13-.31-.13L19.5 13a4.07 4.07 0 00-.82-.45l-.18-1.27a.23.23 0 00-.22-.21H16.46M9.71 13C5.45 13 2 14.7 2 16.83v1.92h9.33a6.65 6.65 0 010-5.69A13.56 13.56 0 009.71 13m7.6 1.43a1.45 1.45 0 110 2.89 1.45 1.45 0 010-2.89Z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

// Setting default values for the props of CustomerSupport
UserConfig.defaultProps = {
  color: "dark",
  size: "16px",
};

// Typechecking props for the CustomerSupport
UserConfig.propTypes = {
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

export default UserConfig;
