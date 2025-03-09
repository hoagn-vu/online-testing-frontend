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
import React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React base styles
import colors from "assets/theme/base/colors";

function Exam({ color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 385 515"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>exam</title>
      <g
        id="Basic-Elements"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Rounded-Icons"
          transform="translate(-1780.4000, -289.800)"
          fill={colors[color] ? colors[color].main : colors.dark.main}
          fillRule="nonzero"
        >
          <g
            id="Icons-with-opacity"
            transform="translate(1716.000000, 291.000000)"
          >
            <g id="exam" transform="translate(1.000000, 0.000000)">
              <path
                d="M426.412,19.559h-46.803c-3.765,0-6.816,3.05-6.815,6.815c0.001,8.546-0.001,28.545-0.001,75.844
                c0,22.583-18.306,40.893-40.889,40.893H180.096c-22.583,0-40.889-18.312-40.889-40.893c0-47.302-0.003-67.301-0.001-75.845
                c0.001-3.765-3.05-6.815-6.815-6.815H85.587c-11.291,0-20.445,9.154-20.445,20.445v451.552c0,11.291,9.154,20.445,20.445,20.445
                h340.824c11.291,0,20.445-9.154,20.445-20.445V40.003C446.856,28.712,437.702,19.559,426.412,19.559z M237.128,429.336
                c0,11.291-9.154,20.445-20.445,20.445H151.26c-11.291,0-20.445-9.154-20.445-20.445v-65.423c0-11.291,9.154-20.445,20.445-20.445
                h65.423c11.291,0,20.445,9.154,20.445,20.445V429.336z M237.128,282.135c0,11.291-9.154,20.445-20.445,20.445H151.26
                c-11.291,0-20.445-9.154-20.445-20.445v-65.423c0-11.291,9.154-20.445,20.445-20.445h65.423c11.291,0,20.445,9.154,20.445,20.445
                V282.135z M360.738,417.069h-73.6c-11.291,0-20.445-9.154-20.445-20.445s9.154-20.445,20.445-20.445h73.6
                c11.291,0,20.445,9.154,20.445,20.445S372.029,417.069,360.738,417.069z M360.738,269.868h-73.6
                c-11.291,0-20.445-9.154-20.445-20.445c0-11.291,9.154-20.445,20.445-20.445h73.6c11.291,0,20.445,9.154,20.445,20.445
                C381.183,260.715,372.029,269.868,360.738,269.868z"
              />
              <path
                d="M180.095,122.667h151.808c11.291,0,20.445-9.154,20.445-20.445V20.445C352.348,9.154,343.194,0,331.903,0H180.095
                c-11.291,0-20.445,9.154-20.445,20.445v81.778C159.651,113.514,168.805,122.667,180.095,122.667z"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

// Typechecking props for the Exam
Exam.propTypes = {
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

export default Exam;
