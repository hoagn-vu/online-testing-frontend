import React from "react";

import DefaultLayout from "templates/LayoutContainers/DefaultLayout";
import LoginForm from "../components/LoginForm";

import "../styles/LoginPage.css";

const LoginPage = () => {
  return (
    <DefaultLayout>
      <div className="login-container">
        <div className="login-overlay">
          <div className="login-form-container">
            <LoginForm></LoginForm>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
