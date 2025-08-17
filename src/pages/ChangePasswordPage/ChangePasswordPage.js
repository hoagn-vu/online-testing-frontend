import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate  } from "react-router-dom";
import "./ChangePasswordPage.css";
import {InputAdornment , Box, Button, Grid, MenuItem, Pagination, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import ChangePasswordForm from "../../components/ChangePasswordForm/ChangePasswordForm";

const ChangePasswordPage = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Cài đặt</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 d-flex info-exam-content mt-0">
        <div className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center w-full info-content">
          <div className="flex flex-col items-center">
            <h4 className="text-blue-holo mb-4">Thông tin người dùng</h4>
            <div className="icon icon-user">
              <FaUserCircle style={{ fontSize: "130px", color: "#206ee3" }} />
            </div>
          </div>

          <div className="mt-4 w-100">
            <p className="font-semibold mb-2">
              <span className="fw-bold">Họ tên: </span>
              <span>Phan Thị Phương Linh</span>
            </p>
            <p className="text-gray-500">
              <span className="fw-bold">Mã người dùng: </span>
              <span>BIT220089</span>
            </p>
          </div>
        </div>

        {/* Cột 2: Danh sách bài thi */}
        <div className="bg-white shadow-md rounded-lg w-full exam-content">
          {/* <h4 className="text-xl font-semibold">Đổi mật khẩu</h4> */}
          <ChangePasswordForm></ChangePasswordForm>
        </div>
      </div>

    </div>
  );
};

export default ChangePasswordPage;
