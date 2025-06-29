import LoginForm2 from "../../components/LoginForm2/LoginForm2";
import React from "react";
import "./Login2.css";
import workImages from '../../assets/images/Datas-extraction-amico.png'
import logoImage from '../../assets/logo/logo.png';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Login2 = () => {
  return (
    <div className="" style={{ minHeight: "100vh" }}>
      <div className="bg-login-page d-flex" style={{ width: "100%" }}>
        <div className="logo-container">
          <img src={logoImage} alt="Logo" className="logo-img" />
        </div>
        <div style={{ flex: 1, marginLeft: "0px" }} className="d-flex justify-content-center align-items-center">
          {/* <DotLottieReact
            // src="https://lottie.host/d96b7485-65fa-4a7e-bc74-c905acd780b1/Qbaf1xGHuq.lottie"
            // src="https://lottie.host/15da4029-3bd9-46e1-9ce2-c36473d7d2c1/m1xY6H5Psl.lottie"
            // src="https://lottie.host/3079ca32-9e94-421c-a27a-41f63d7e6090/nD7kBfgUUF.lottie"

            loop
            autoplay
          /> */}
          <img
            src={workImages}
            alt="Work illustration"
            style={{ width: "100%", height: "auto", maxWidth: "500px", }}
            className="login-img"
          />
        </div>
        <div className="login-page-wrapper">
          <div className="background-layers">
            <div className="background-circle bg-layer1"></div>
            <div className="background-circle bg-layer2"></div>
            <div className="background-circle bg-layer3"></div>
          </div>

          <div style={{ flex: 1 }} className="login-container d-flex align-items-center justify-content-center">
            <div className="login-form-container">
              <LoginForm2 />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Login2;
