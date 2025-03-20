import React, { useState, useEffect } from 'react';
import { useLoginMutation } from '../../services/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials, setUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import "./LoginForm.css";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username && !password) {
      setErrMsg("");
    }
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(null);

    if (!username || !password) {
      setErrMsg("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    if (username.length < 6 || password.length < 6) {
      setErrMsg("Tài khoản và mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      // Gọi API login
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));

      // Fetch profile để lấy role
      const profileResult = await dispatch(authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true })).unwrap();
      dispatch(setUser(profileResult));

      // Điều hướng dựa trên role
      if (profileResult.role === 'admin') {
        navigate('/staff/dashboard');
      } else if (profileResult.role === 'candidate') {
        navigate('/candidate/home');
      } else if (profileResult.role === 'staff') {
        navigate('/staff/dashboard');
      } else if (profileResult.role === 'supervisor') {
        navigate('/staff/supervisor');
      } else {
        navigate('/not-found');
      }
    } catch (err) {
      console.error('Login failed', err);
      setErrMsg(err.data?.message || 'Đã có lỗi xảy ra');
    }
  };

//     try {
//       const response = await login({ username, password }).unwrap();
//       dispatch(setCredentials(response));

//       if (response.role === 'admin') {
//         navigate("/staff/dashboard");
//       } else if (response.role === 'candidate') {
//         navigate("/candidate/home");
//       } else if (response.role === 'staff') {
//         navigate("/staff/dashboard");
//       } else if (response.role === 'supervisor') {
//         navigate("/staff/supervisor");
//       }

//       // navigate("/welcome");
//     } catch (err) {
//       setErrMsg('Login failed:', err.data?.message);
//     }
//   };

  return (
    // <form onSubmit={handleSubmit}>
    //   <input name="username" placeholder="Username" required />
    //   <input name="password" type="password" placeholder="Password" required />
    //   <button type="submit" disabled={isLoading}>Login</button>
    // </form>
    <div className="custom-login-form d-flex justify-content-center align-items-center vh-100">
      <form
        className="p-4 shadow-lg login-form bgr-color"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-3 fw-bold text-blue-holo">Đăng nhập</h2>

        {errMsg && (
          <div className="alert alert-danger text-center p-2">{errMsg}</div>
        )}

        <div className="mb-3 text-start">
          <label className="form-label fw-bold">Tên tài khoản</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3 text-start">
          <label className="form-label fw-bold">Mật khẩu</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="btn position-absolute top-50 end-0 translate-middle-y me-2"
            onClick={() => setShowPassword(!showPassword)}
          ></button>
        </div>

        <button
          type="submit"
          className="btn w-100 fw-bold css-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <div
              className="spinner-border spinner-border-sm"
              role="status"
            ></div>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;


// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./LoginForm.css";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, } from "react-redux";
// import { useLoginMutation, } from '../../services/authApi';
// import { setCredentials, } from '../../redux/authSlice';

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [login, { isLoading }] = useLoginMutation();
//   const [errMsg, setErrMsg] = useState("");
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrMsg("");

//     if (!username || !password) {
//       setErrMsg("Vui lòng nhập tên đăng nhập và mật khẩu");
//       return;
//     }

//     if (username.length < 6 || password.length < 6) {
//       setErrMsg("Tài khoản và mật khẩu phải có ít nhất 6 ký tự");
//       return;
//     }

//     try {
//       const response = await login({ username, password }).unwrap();
//       dispatch(setCredentials(response));

//       if (response.role === 'admin') {
//         navigate("/staff/dashboard");
//       } else if (response.role === 'candidate') {
//         navigate("/candidate/home");
//       } else if (response.role === 'staff') {
//         navigate("/staff/dashboard");
//       } else if (response.role === 'supervisor') {
//         navigate("/staff/supervisor");
//       }

//       // navigate("/welcome");
//     } catch (err) {
//       setErrMsg('Login failed:', err.data?.message);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100">
//       <form
//         className="p-4 shadow-lg login-form bgr-color"
//         onSubmit={handleLogin}
//       >
//         <h2 className="text-center mb-3 fw-bold text-blue-holo">Đăng nhập</h2>

//         {errMsg && (
//           <div className="alert alert-danger text-center p-2">{errMsg}</div>
//         )}

//         <div className="mb-3 text-start">
//           <label className="form-label fw-bold">Tên tài khoản</label>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Nhập tài khoản"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>

//         <div className="mb-3 text-start">
//           <label className="form-label fw-bold">Mật khẩu</label>
//           <input
//             type={showPassword ? "text" : "password"}
//             className="form-control"
//             placeholder="Nhập mật khẩu"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="button"
//             className="btn position-absolute top-50 end-0 translate-middle-y me-2"
//             onClick={() => setShowPassword(!showPassword)}
//           ></button>
//         </div>

//         <button
//           type="submit"
//           className="btn w-100 fw-bold css-btn"
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <div
//               className="spinner-border spinner-border-sm"
//               role="status"
//             ></div>
//           ) : (
//             "Đăng nhập"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;
