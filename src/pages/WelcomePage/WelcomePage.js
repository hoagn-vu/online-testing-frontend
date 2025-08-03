import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import { styled } from '@mui/material/styles';
import { Select, Autocomplete, TextField, Switch, FormControlLabel } from "@mui/material";

const WelcomePage = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  
  // const user = useSelector((state) => state.auth.user);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   navigate("/");
  // };

  const [questionTypes, setQuestionTypes] = useState([
    { label: "Multiple Choice", value: "multiple_choice" },
    { label: "True/False", value: "true_false" },
    { label: "Short Answer", value: "short_answer" },
  ]);

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: '#65C466',
          opacity: 1,
          border: 0,
          ...theme.applyStyles('dark', {
            backgroundColor: '#2ECA45',
          }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey[100],
        ...theme.applyStyles('dark', {
          color: theme.palette.grey[600],
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.7,
        ...theme.applyStyles('dark', {
          opacity: 0.3,
        }),
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: '#E9E9EA',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
      ...theme.applyStyles('dark', {
        backgroundColor: '#39393D',
      }),
    },
  }));


  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <div className="custom-card-header">
            <div className="d-flex justify-content-between align-items-center">
              <Autocomplete
                options={questionTypes}
                getOptionLabel={(option) => option.label}
                renderInput={
                  (params) => 
                  <TextField 
                    {...params}
                    label="Select Question Type"
                    size="small"
                    sx={{ 
                      minWidth: 250,
                    }}
                  />
                }
              />

              <div className="d-flex align-items-center">
                <div className="form-check form-switch me-3">
                  <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" />
                  <label className="form-check-label" htmlFor="switchCheckDefault">Required</label>
                </div>

                <div className="btn-group">
                  <button type="button" className="btn custom-btn d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false" style={{ borderRadius: '0.375rem', height: '30px' }}>
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Separated link</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="custom-card-content">
            <div className="row mt-3">
              <div className="col-md-8">
                <div className="form-group">
                  <label htmlFor="questionContent">Nội dung câu hỏi <span className="text-danger">*</span></label>
                  <textarea className="form-control" id="questionContent" rows="5"></textarea>
                </div>
              </div>
              <div className="col-md-4">
                {/* Thêm drag drop */}
              </div>
            </div>

            <div className="d-flex align-items-center mt-2">
              <p className="mb-0 me-3 pe-3" style={{ borderRight: "1px solid #d9d9d9" }}>Đáp án <span className="text-danger">*</span></p>

              <div className="form-check form-switch me-3">
                <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" />
                <label className="form-check-label" htmlFor="switchCheckDefault">Required</label>
              </div>

              <div className="form-check form-switch me-3">
                <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" />
                <label className="form-check-label" htmlFor="switchCheckDefault">Required</label>
              </div>
            </div>

            <div className="mt-2">
              <div className="custom-option-group d-flex align-items-center mt-2">
                <input className="form-check-input m-0 me-2" type="radio" />
                <textarea className="form-control m-0 me-2" placeholder="Nhập đáp án" rows={1} style={{ resize: "none", overflow: "hidden", minHeight: "40px" }} onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}></textarea>
                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <div className="custom-option-group d-flex align-items-center mt-2">
                <input className="form-check-input m-0 me-2" type="radio" />
                <textarea className="form-control m-0 me-2" placeholder="Nhập đáp án" rows={1} style={{ resize: "none", overflow: "hidden", minHeight: "40px" }} onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}></textarea>
                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <div className="custom-option-group d-flex align-items-center mt-2">
                <input className="form-check-input m-0 me-2" type="radio" />
                <textarea className="form-control m-0 me-2" placeholder="Nhập đáp án" rows={1} style={{ resize: "none", overflow: "hidden", minHeight: "40px" }} onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}></textarea>
                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <div className="custom-option-group d-flex align-items-center mt-2">
                <input className="form-check-input m-0 me-2" type="radio" />
                <textarea className="form-control m-0 me-2" placeholder="Nhập đáp án" rows={1} style={{ resize: "none", overflow: "hidden", minHeight: "40px" }} onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}></textarea>
                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>

            <button className="btn btn-outline-secondary mt-2" style={{ fontSize: "14px" }}>
              <i className="fa-solid fa-plus me-2"></i>Thêm đáp án
            </button> 
          </div>

          <div className="custom-card-footer mt-3">
            
          </div>
        </div>
      </div>
    </div>




    // <div>
    //   <h1>Welcome, {user?.username}</h1>
    //   <button onClick={handleLogout} className="btn btn-danger">
    //     Logout
    //   </button>
    // </div>
  );
};

export default WelcomePage;
