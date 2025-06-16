import LoginForm2 from "../../components/LoginForm2/LoginForm2";
import React from "react";
import "./Login2.css";
import workImages from '../../assets/images/Datas-extraction-amico.png'
import logoImage from '../../assets/logo/logo.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Login2 = () => {
  return (
    <div className="" style={{ minHeight: "100vh" }}>
      <div className="xanh-dam d-flex" style={{ width: "100%" }}>
        <div className="logo-container">
          <img src={logoImage} alt="Logo" className="logo-img" />
        </div>
        <div style={{ flex: 1, marginLeft: "60px" }} className="d-flex justify-content-center align-items-center">
          <DotLottieReact
            src="https://lottie.host/d96b7485-65fa-4a7e-bc74-c905acd780b1/Qbaf1xGHuq.lottie"
            loop
            autoplay
          />
          {/* <img
            src={workImages}
            alt="Work illustration"
            style={{ width: "100%", height: "auto", maxWidth: "565px", }}
            className="login-img"
          /> */}
        </div>
        <div style={{ flex: 1 }} className="login-container d-flex align-items-center justify-content-center">
          <div className="login-form-container">
            <LoginForm2 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login2;
