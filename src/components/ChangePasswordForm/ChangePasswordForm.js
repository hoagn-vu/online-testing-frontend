import React, { useState, useEffect, useRef } from 'react';
import { useLoginMutation } from '../../services/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setUser } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import "./ChangePasswordForm.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {InputAdornment, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Pagination, NumberInput, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import { useChangePasswordMutation } from "../../services/authApi"
import Swal from "sweetalert2";

const ChangePasswordForm = () => {
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const oldPasswordRef = useRef(null);

  const user = useSelector((state) => state.auth.user);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (oldPasswordRef.current) {
      oldPasswordRef.current.focus();
    }
  }, []);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // 1. Check rỗng
    if (!passwordData.oldPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng nhập mật khẩu cũ!",
      });
      return;
    }
    
    if (!passwordData.newPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng nhập mật khẩu mới!",
      });
      return;
    }

    if (!passwordData.confirmNewPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Vui lòng nhập lại mật khẩu xác nhận!",
      });
      return;
    }

    // 2. Check new != old
    if (passwordData.newPassword === passwordData.oldPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Mật khẩu mới không được trùng mật khẩu cũ!",
      });
      return;
    }

    // 3. Check confirm
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Mật khẩu xác nhận không khớp!",
      });
      return;
    }

    try {
      console.log("Gửi API với dữ liệu: ", {
        userId: user.id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });

      await changePassword({
        userId: user.id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đổi mật khẩu thành công",
      });
    } catch (err) {
      console.log("Lỗi đổi mật khẩu:", err);

      let message = "Đổi mật khẩu thất bại!";
      
      if (err?.status === 404) {
        message = "Mật khẩu cũ không đúng!";
      } else if (err?.status === 400) {
        message = err?.data?.message || "Yêu cầu không hợp lệ!";
      } else if (err?.data?.message) {
        message = err.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: message,
      });
    }

  };

  /*const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log("Cập nhật mật khẩu cho vai trò:", passwordData);
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);*/

  return (
    <div className="d-flex justify-content-center">
      <form
        className=" pb-5 ps-5 pe-5 bgr-color w-100"
        onSubmit={handlePasswordSubmit}
      >
        {/* <p className="text-center mb-4 fw-bold text-blue-holo mt-4">Đổi mật khẩu</p>
        {errMsg && (
          <div className="alert alert-danger text-center p-2">{errMsg}</div>
        )} */}

        {/* <div className="mb-3 text-start position-relative">
          <label className="form-label fw-bold">Mật khẩu mới:</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control pe-5"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent mt-3"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            <i className={`fa-regular ${showPassword  ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div>

        <div className="mb-3 text-start position-relative">
          <label className="form-label fw-bold">Nhập lại mật khẩu:</label>
          <input
            type={showPasswordConfirm ? "text" : "password"}
            className="form-control pe-5"
            placeholder="Nhập lại mật khẩu"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent mt-3"
            onClick={() => setShowPasswordConfirm(!passwordConfirm)}
            tabIndex={-1}
          >
            <i className={`fa-regular ${showPasswordConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
          </button>
        </div> */}

        <Grid item xs={12}>
          <label className="form-label">Mật khẩu cũ:</label>
          <TextField
            fullWidth
            type={showOldPassword ? "text" : "password"}
            required
            placeholder='Nhập mật khẩu cũ'
            inputRef={oldPasswordRef}
            value={passwordData.oldPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, oldPassword: e.target.value })
            }
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "14px",
                paddingBottom: "11px",
              },
              "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{mt: 3}}>
          <label className="form-label">Mật khẩu mới:</label>
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            required
            placeholder='Nhập mật khẩu mới'
            inputRef={inputRef}
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "14px",
                paddingBottom: "11px",
              },
              "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{mt: 3}}>
          <label className="form-label">Nhập lại mật khẩu:</label>
          <TextField
            fullWidth
            required
            placeholder='Nhập lại mật khẩu'
            inputRef={inputRef}
            type={showConfirmPassword  ? "text" : "password"}
            value={passwordData.confirmNewPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
            }
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "14px",
                paddingBottom: "11px",
              },
              "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <button
          type="submit"
          className="btn w-100 fw-bold css-btn mb-1 mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <div
              className="spinner-border spinner-border-sm"
              role="status"
            ></div>
          ) : (
            "Đổi mật khẩu"
          )}
        </button>
      </form>
    </div>

  );
};

export default ChangePasswordForm;
