import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./ListUserInGroup.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {Chip, Box, Button, Grid, MenuItem, Select, Pagination, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';
import ApiService from "../../services/apiService";
import { IdCard } from "lucide-react";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";

const ListUserInGroup = () => {
  const [showForm, setShowForm] = useState(false);
  const inputRef = useRef(null);
  const { groupuserId } = useParams();
  const [listCandidate, setListCandidate] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);  
  const [groupName, setGroupName] = useState(0);

  const processData = (data) => {
    return data.map((item) => {
      const nameParts = item.fullName.trim().split(" ");
      const firstName = nameParts.pop(); // Lấy phần cuối cùng là firstName
      const lastName = nameParts.join(" "); // Phần còn lại là lastName
      return {
        ...item,
        firstName, 
        lastName
      };
    });
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get(`/groupUser/group/users`, {
          params: { groupId: groupuserId, keyword, page, pageSize },
      });
      setListCandidate(response.data.items);
      setTotalCount(response.data.total);
      setGroupName(response.data.groupName);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
    setIsLoading(false);
  };

  const addCandidate = async (groupId, userList) => {
    setIsLoading(true);
    try {
      await ApiService.post(`/groupUser/add-users?groupId=${groupId}`, userList, {
        headers: { "Content-Type": "application/json" }
      });
      fetchData();
    } catch (error) {
      console.error("Failed to create subject: ", error);
      throw error;
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [groupuserId, keyword, page, pageSize]);
      
  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);
  
  const [formData, setFormData] = useState({
    candidateList: [],
    listUserText: ""
  });

  const preAddNew = () => {
    setFormData({
      candidateList: [],
      listUserText: ""
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tách listUserText thành mảng
    const lines = formData.listUserText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line); // Loại bỏ dòng rỗng
    console.log(lines)
    if (lines.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập ít nhất một mã sinh viên",
        didClose: () => {
          inputRef.current.focus()
        }
      });
      return;
    }
    
    try {      
      await addCandidate(groupuserId, lines);
      Swal.fire({
        icon: "success",
        text: "Thêm người dùng vào nhóm thành công!",
        draggable: true
      });
  
      setShowForm(false);
    }catch (error) {
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: error?.message || "Không thể xử lý yêu cầu",
      });;
    }
  };
  
  const handleDelete = async (groupId, userId) => {
    Swal.fire({
      title: "Bạn có chắc chắn xóa?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          await ApiService.delete(`/groupUser/delete/${groupId}/user/${userId}`);
          fetchData();
          Swal.fire({
            title: "Đã xóa!",
            text: "Người dùng đã bị xóa khỏi nhóm.",
            icon: "success",
          });
        }
        catch (error) {
        console.error("Failed to delete group: ", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Không thể xóa người dùng khỏi nhóm",
        });
      }
      }
    });
  };
  
  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
          <Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
          <span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
          <span className="breadcrumb-between">
          <Link to="/staff/groupuser" className="breadcrumb-between">Nhóm người dùng</Link></span>
          <span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
          <span className="breadcrumb-current">Nhóm {groupName}</span>
      </nav>

      <div className="tbl-shadow p-3">
        <div className="sample-card-header d-flex justify-content-between align-items-center mb-2">
          <div className='left-header d-flex align-items-center'>
            <div className="search-box rounded d-flex align-items-center">
              <i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
              <input
                type="text"
                className="search-input w-100"
                placeholder="Tìm kiếm..."
                value={keyword}
                onChange={handleKeywordChange}
              />
            </div>
          </div>

          <div className='right-header'>
            <AddButton onClick={preAddNew}>
                <i className="fas fa-plus me-2"></i>
              Thêm mới
            </AddButton>
          </div>
        </div>

        <div className="session-table-container mt-3">
          <div className="table-responsive">
            <table className="table sample-table tbl-organize table-striped">
              <thead style={{fontSize: "14px"}}>
                <tr className="align-middle fw-medium">
                  <th className="text-center">STT</th> 
                  <th>MSSV</th>
                  <th>Họ và tên đệm</th>
                  <th>Tên</th>
                  <th className="text-center">Ngày sinh</th>
                  <th className="text-center">Giới tính</th>
                  <th scope="col" className="title-row">Thao tác</th>
                </tr>
              </thead>
              <tbody style={{fontSize: "14px"}}>
                {processData(listCandidate).length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center fw-semibold text-muted" 
                      style={{ height: "100px", verticalAlign: "middle" }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                processData(listCandidate).map((item, index) => (
                  <tr key={item.userId} className="align-middle">
                    <td className="text-center">{index + 1}</td>
                    <td>{item.userCode}</td>
                    <td>{item.lastName}</td>
                    <td>{item.firstName}</td>
                    <td className="text-center">
                      {item.dateOfBirth
                        ? (() => {
                            const [year, month, day] = item.dateOfBirth.split("-");
                            return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
                          })()
                        : ""}
                    </td>
                    <td className="text-center">{item.gender == "male" ? "Nam" : "Nữ"}</td>
                    <td>
                      <button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}  onClick={() => handleDelete(groupuserId, item.userId)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end mb-2">
            { totalCount > 0 && (
              <Pagination
                count={Math.ceil(totalCount / pageSize)}
                shape="rounded"
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            )}
          </div>
        </div>
      </div>

      {/* Form thêm tài khoản */}
      {showForm && (
        <div className="form-overlay">
          <div
            className="shadow form-fade bg-white bd-radius-8"
            style={{ width: "750px", boxShadow: 3,}}
            onSubmit={handleSubmit}
          >
            <div className="d-flex justify-content-between"
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
              }}
            >
              <p className="fw-bold p-4 pb-0">Thêm người dùng vào nhóm</p>
              <button
                type="button"
                className="p-4"
                onClick={() => setShowForm(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}><i className="fa-solid fa-xmark"></i>
              </button>
            </div>
              <Grid container sx={{p: 3, pt: 1}}>	
                <Grid item xs={12}>									
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Nhập mã sinh viên"
                    placeholder="Nhập mã sinh viên"
                    multiline
                    value={formData.listUserText}
                    inputRef={inputRef}
                    maxRows={12}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        listUserText: e.target.value
                      });
                    }}
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": {
                        minHeight: "150px", 
                        alignItems: "flex-start", 
                      },
                      "& .MuiInputBase-input": {
                          fontSize: "14px",
                      },
                      "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                    }}
                  />
                </Grid>	
              </Grid>		
              {/* Buttons */}
              <Grid container spacing={2} sx={{justifyContent: "flex-end", p: 3, pt: 1 }}>
                <Grid item xs={3}>
                  <CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>
                    Hủy
                  </CancelButton>
                </Grid>
                <Grid item xs={3}>
                  <AddButton style={{width: "100%"}} onClick={handleSubmit}>
                    Lưu
                  </AddButton>
                </Grid>
              </Grid>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListUserInGroup;