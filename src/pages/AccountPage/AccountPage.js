import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation  } from "react-router-dom";
import "./AccountPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {InputAdornment , Box, Button, Grid, MenuItem, Pagination, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DragDropModal from "../../components/DragDrop/DragDrop";
import { CircularProgress } from "@mui/material";
import userFile from "../../assets/file/upload_user.xlsx";
import { useSelector } from "react-redux";
import hasPermission from "../../permissions";
import InputMask from "react-input-mask";

const AccountPage = () => {
  const inputRef = useRef(null);
  const userRole = useSelector((state) => state.auth.user?.role);

  const [listAccount, setListAccount] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRole, setSelectedRole] = useState("candidate");
  const [totalCount, setTotalCount] = useState(0);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const roleTabs = [
    { label: "Thí sinh", value: "candidate" },
    { label: "Giám thị", value: "supervisor" },
    { label: "Giảng viên", value: "lecturer" },
    { label: "Quản trị viên", value: "admin" },
    { label: "Cán bộ phụ trách kỳ thi", value: "staff" },
  ];

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [rows, setRows] = useState(Object.values(listAccount).flat()); 
  const [listDisplay, setListDisplay] = useState([]);
  const [listGroupName, setListGroupName] = useState([]);
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, keyword]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/users", {
        params: { page, pageSize, keyword, role: selectedRole },
      });

      setListAccount(response.data.users);
      setTotalCount(response.data.total);
      setListDisplay(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  const createUser = async (user) => {
    setIsLoading(true);
    try {
      await ApiService.post("/users", user);
      await fetchData();
    } catch (error) {
      console.error("Failed to create user: ", error);
    }
    setIsLoading(false);
  };

  const updateUser = async (user) => {
    setIsLoading(true);
    try {
      const response = await ApiService.put(`/users/${user.id}`, user);
      if (response.status >= 200 && response.status < 300) {
        await fetchData();
        return true; // thành công
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Failed to update level:", error);
      throw error; // ném lỗi ra ngoài để handleSubmit bắt được
    } finally {
      setIsLoading(false);
    }
  };

 
  const getGroupUser = async () => {
    try {
      const response = await ApiService.get("/groupUser", {
        params: { keyword, page, pageSize },
      });
      const options = response.data.groups.map((item) => ({
        value: item.id,
        label: item.groupName
      }));
      setListGroupName(options);
    } catch (error) {
      console.error("Failed to get group: ", error);
    } finally {
    setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroupUser();
  }, [page, pageSize, keyword]);
  
  useEffect(() => {
    fetchData();
  }, [page, pageSize, keyword, selectedRole]);

  useEffect(() => {
    setListDisplay(listAccount); // Đồng bộ listDisplay với listAccount
  }, [listAccount, selectedRole]);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (e, id) => {
    if (e.target.checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(listAccount.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const convertGender = (gender) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  const convertStatus = (status) => {
    switch (status) {
      case "active":
        return { label: "Hoạt động", className: "bg-primary" };
      case "disabled":
        return { label: "Vô hiệu hóa", className: "bg-secondary" };
    }
  };

  const [formData, setFormData] = useState({
    id: null,
    userName: null,
    password: null,
    userCode: null,
    fullName: null,
    role: null,
    gender: null,
    dateOfBirth: null,
    accountStatus: "active",
    groupName: [],
    authenticate: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showForm]);

  useEffect(() => {
    if (showAddGroupForm && inputRef.current) {
      inputRef.current.focus();
    }
    if (!showAddGroupForm) {
      setSelectedGroups(null);
  }
  }, [showAddGroupForm]);

  const permissionOptions = [
    "Quản lý kỳ thi",
    "Quản lý ngân hàng câu hỏi",
    "Quản lý đề thi",
    "Quản lý ma trận đề thi",
    "Quản lý phòng thi",
  ];

  const handleAddNew = () => {
    setIsEditing(false);
    resetFormData();
    setShowForm(true);
  };

  const [passwordData, setPasswordData] = useState({
    role: "candidate",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePermissionChange = (permission) => {
    setFormData((prevData) => {
      const updatedPermissions = prevData.authenticate.includes(permission)
        ? prevData.authenticate.filter((p) => p !== permission)
        : [...prevData.authenticate, permission];

      return { ...prevData, authenticate: updatedPermissions };
    });
  };

  function showToast(type, message) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    return Toast.fire({
      icon: type,
      title: message
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const finalData = {
      //   ...formData,
      //   username: formData.userCode.toLowerCase(),
      //   password: formData.userCode.toLowerCase(),
      // };

      if (formData.id || formData.id == "") {
        await updateUser(formData);
        
        showToast("success", "Cập nhật người dùng thành công!");
        // console.log("Dữ liệu thêm mới:", finalData);
        setShowForm(false);
      } else {
        // Thêm mới dữ liệu
        console.log("Dữ liệu thêm mới:", formData);
        await createUser(formData);
        showToast("success", "Thêm người dùng thành công!");
        /*Swal.fire({
          icon: "success",
          text: "Thêm người dùng thành công",
          draggable: true
        });*/
        setShowForm(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra",
        text: error?.message || "Không thể xử lý yêu cầu",
      });
    }
    
    setShowForm(false);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log("Cập nhật mật khẩu cho vai trò:", passwordData);
    setShowPasswordForm(false);
  };

  const handleEdit = (account) => {
    console.log("Cập nhật tài khoản:", account);
    setEditingAccount(account);
    setIsEditing(true);
    setFormData({
      id: account.id || null,
      userName: account.userName || null,
      password: account.password || null,
      userCode: account.userCode || null,
      fullName: account.fullName || null,
      role: account.role || null,
      gender: account.gender || null,
      dateOfBirth: account.dateOfBirth || null,
      accountStatus: account.accountStatus || "active",
      groupName: account.groupName || [],
      authenticate: account.authenticate || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
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
          await ApiService.delete(`/users/delete/${id}`);
          fetchData();
          showToast("success", "Người dùng đã bị xóa thành công!");
        }
        catch (error) {
          console.error("Failed to delete users: ", error);
        }
        console.log("Xóa tài khoản có ID:", id);
      }
    });
  };

  const [openModal, setOpenModal] = useState(false);

  const handleUploadClick = () => {
    setOpenModal(true);
  };

  const handleFilesDropped = async (files) => {
    console.log("Files received:", files);
    const formData = new FormData();
		formData.append("file", files[0]);

		setIsLoading(true);
		setUploadProgress(0);
		document.getElementById("uploadModal").classList.add("show");
		document.getElementById("uploadModal").style.display = "block";

		try {
      const userLogId = "67c5cee0194f0c8804a6bd21";
			const response = await ApiService.post(`/file/upload-file-user`, formData, {
				params: { userLogId },
				headers: { "Content-Type": "multipart/form-data" },
				onUploadProgress: (progressEvent) => {
					if (progressEvent.total) {
						const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

						setUploadProgress((prevProgress) => {
							// Tăng từ từ, nhưng không nhảy đột ngột
							if (percentCompleted > prevProgress) {
									return percentCompleted < 99 ? percentCompleted : 99;
							}
							return prevProgress;
						});
					}
					},
			});

			setUploadProgress(100); // Khi hoàn thành, đặt 100%
      showToast("success", "Tải tệp người dùng thàng công!");
			await fetchData();
		} catch (error) {
      showToast("error", error.message);
		}

		document.getElementById("uploadModal").classList.remove("show");
		document.getElementById("uploadModal").style.display = "none";
		setIsLoading(false);
		setUploadProgress(0);
    setOpenModal(false);
  };

  const colourOptions = [
    { value: "22IT1", label: "22IT1" },
    { value: "22IT2", label: "22IT2" },
    { value: "22IT3", label: "22IT3" },
  ];
  
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleToggleStatus = async (id, currentStatus) => {
    Swal.fire({
      title: "Bạn có chắc muốn thay đổi trạng thái?",
      text: "Trạng thái sẽ được cập nhật ngay sau khi xác nhận!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newStatus = currentStatus.toLowerCase() === "active" ? "disabled" : "active";
        const statusLabel = newStatus === "active" ? "Hoạt động" : "Vô hiệu hoá";

        try {
          const response = await ApiService.put(`/users/${id}`, { accountStatus: newStatus });
          let message = "";
          if (newStatus === "active") {
            message = "Kích hoạt tài khoản người dùng thành công!";
          } else {
            message = "Tài khoản người dùng đã bị vô hiệu hoá!";
          }

          showToast("success", message);
          await fetchData(); // Làm mới danh sách sau khi cập nhật
        } catch (error) {
          console.error("Failed to update status:", error);
          showToast("error", "Không thể cập nhật trạng thái. Vui lòng thử lại.");
        }
      }
    });
  };

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  // state quản lý hiện/ẩn
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // hàm toggle
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleCreateGroup = async (selectedGroup, selectedItems) => {  
    console.log("selectedGroup in handleCreateGroup:", selectedGroup);
    console.log("selectedItems:", selectedItems);  
    if (!selectedGroup || !selectedGroup.label) {
      showToast("warning", "Vui lòng chọn hoặc nhập tên nhóm");
      return false;
    }
    
    // Map selectedItems (IDs) to userCodes
    const listUser = selectedItems.map(id => {
      const user = listDisplay.find(item => String(item.id) === String(id)); 
      return user ? user.userCode : null;
    }).filter(code => code !== null); // Loại bỏ các giá trị null (nếu có)
    
    if (!listUser.length) {
      await showToast("warning", "Vui lòng chọn ít nhất một tài khoản");
      return false;
    }

    // Debug: Log listUser to verify mapping result
    console.log('Tạo nhóm:', groupName);
    console.log('Danh sách ID:', selectedItems);
    console.log('Danh sách userCode:', listUser);

    const payload = {
      groupName: selectedGroup.label,
      listUser,
    };

    setIsLoading(true);
    /*try {
      await ApiService.post('/groupUser/create-group-users', payload);
      await fetchData(); // Làm mới danh sách sau khi tạo nhóm
      await Swal.fire({
        icon: 'success',
        title: 'Tạo nhóm thành công',
        draggable: true
      });
      setSelectedItems([]); // Reset checkbox
      await fetchData(); // Làm mới danh sách
      setShowAddGroupForm(false);
    } catch (error) {
      console.error('Failed to create group:', error.response?.data || error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể tạo nhóm',
      });
    } finally {
      setIsLoading(false);
    }*/
    try {
      if (selectedGroup.__isNew__) {
        // 👉 Nhóm mới: gọi API create-group-users
        const payload = {
          groupName: selectedGroup.label, // vì CreatableSelect tạo option mới có label
          listUser,
        };

        await ApiService.post('/groupUser/create-group-users', payload);
        await showToast("success", "Tạo nhóm người dùng thành công!");
        await getGroupUser();   
        setSelectedGroup(null);
      } else {
        // 👉 Nhóm đã có: gọi API add-users
        const groupId = selectedGroup.value; // value của option có thể là groupId
        await ApiService.post(
          `/groupUser/add-users?groupId=${groupId}`,
          listUser,
          { headers: { "Content-Type": "application/json" } }
        );
        await showToast("success", "Thêm người dùng vào nhóm thành công!");
        setSelectedGroup(null);
      }

      await fetchData(); // refresh lại danh sách
      setSelectedItems([]);
      setShowAddGroupForm(false);
    } catch (error) {
      console.error("Lỗi khi xử lý nhóm:", error.response?.data || error);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || 'Không thể xử lý nhóm'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
  
  const resetFormData = () => {
    setFormData({
      id: null,
      userName: null,
      password: null,
      userCode: null,
      fullName: null,
      role: null,
      gender: null,
      dateOfBirth: null,
      accountStatus: "active",
      groupName: [],
      authenticate: [],
    });
  }

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Quản lý tài khoản</span>
      </nav>
      <div className="tbl-shadow p-3 pt-1">
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
          <div className="role-selector d-flex align-items-center gap-2">
            {hasPermission(userRole, "create_user")  && (
              <AddButton onClick={handleAddNew}>
                <i className="fas fa-plus me-2"></i> Thêm mới
              </AddButton>
            )}
            {/* <button className="btn btn-primary add-btn-hover" style={{fontSize: "14px"}} onClick={handleAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </button> */}
            {/* <button
              className="change-password-btn btn-size align-items-center d-flex"
              onClick={() => setShowPasswordForm(true)}
            >
              Đổi mật khẩu
            </button> */}
            <AddButton onClick={() => setShowAddGroupForm(true)}>
              <i className="fas fa-plus me-2"></i> Thêm nhóm
            </AddButton>
            { hasPermission(userRole, "import_users") && (
              <AddButton className="upload-btn-hover" style={{backgroundColor: "#28A745"}} onClick={handleUploadClick}>
                <i className="fas fa-upload me-2"></i>Upload File
              </AddButton>
            )}
            <div className="modal fade" id="uploadModal" tabIndex="-1" aria-hidden="true"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered small-modal" >
                <div className="modal-content text-center p-4 container" style={{ width: "500px" }}>
                  <div className="modal-body">
                    {/* Vòng tròn tiến trình MUI */}
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress variant="determinate" value={uploadProgress} size={80} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption" component="div" sx={{ color: "text.secondary", fontSize: "18px" }}>
                          {`${uploadProgress}%`}
                        </Typography>
                      </Box>
                    </Box>
                    <p className="mt-3">Đang tải lên...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs ">
          { roleTabs.map((role) => (
            hasPermission(userRole, `get_${role.value}`)  && (
              <li className="nav-item" key={role.value}>
                <a
                  className={`nav-link ${selectedRole === role.value ? "active" : ""}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedRole(role.value);
                  }}
                >
                  {role.label}
                </a>
              </li>
            )
          ))}
        </ul>

        <div className="table-responsive" style={{minHeight: "230px"}}>
          <table className="table sample-table table-hover tbl-organize-hover">
            <thead>
              <tr className="align-middle">
                <th scope="col" className="text-center title-row" style={{ width: "50px"}}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={listAccount.length > 0 && listAccount.every((item) => selectedItems.includes(item.id))}                  />
                </th>
                <th scope="col" className="title-row">Mã</th>
                <th scope="col" className="title-row">Tài khoản</th>
                <th scope="col" className="title-row">Họ và tên đệm</th>
                <th scope="col" className="title-row">Tên</th>
                <th className="text-center">Ngày sinh</th>
                <th className="text-center">Giới tính</th>
                {/* <th className="text-center">Nhóm</th> */}
                <th className="text-center">Trạng thái</th>
                <th className="text-center" style={{ width: "120px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
            {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) :
              processData(listAccount).map((item, index) => (
                <tr key={item.id} className="align-middle">
                  <td className=" text-center" style={{ width: "50px" }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={(e) => handleSelectItem(e, item.id)}
                      checked={selectedItems.includes(item.id)}
                    />
                  </td>
                  <td>{item.userCode}</td>
                  <td>{item.userName}</td>
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
                  <td className="text-center">{convertGender(item.gender)}</td>
                  {/* <td className="text-center">{item.groupName}</td> */}
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <span className={`badge ms-2 mt-1 ${convertStatus(item.accountStatus).className}`}>
                        {convertStatus(item.accountStatus).label}
                      </span>
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <div className="dropdown d-inline-block">
                      <button
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        className="dropdown-toggle-icon"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom"
                        style={{
                          right: "50%",
                          transform: 'translate3d(-10px, 10px, 0px)',
                        }}
                      >
                        {hasPermission(userRole, "update_user") && (
                          <li className="tbl-action" onClick={() => handleEdit(item)}>
                            <button className="dropdown-item tbl-action" onClick={() => handleEdit(item)}>
                              Chỉnh sửa
                            </button>
                          </li>
                        )}
                        {hasPermission(userRole, "delete_user") && (
                          <li className="tbl-action" onClick={() => handleDelete(item.id)}>
                            <button className="dropdown-item tbl-action" onClick={() => handleDelete(item.id)}>
                               Xoá
                            </button>
                          </li>
                        )}
                        {hasPermission(userRole, "toggle_status") && (
                          <li className="tbl-action" onClick={() => handleToggleStatus(item.id, item.accountStatus)}>
                            <button
                              className="dropdown-item tbl-action"
                              onClick={() =>
                                handleToggleStatus(item.id, item.accountStatus)
                            }
                          >
                            {item.accountStatus.toLowerCase() === "active"
                              ? "Vô hiệu hoá"
                              : "Kích hoạt"}
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sample-pagination d-flex justify-content-end align-items-center mb-2">
          {/* <Pagination count={10} color="primary" shape="rounded" /> */}
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
      {/* Form thêm tài khoản */}
      {showForm && (
        <div className="form-overlay">
          <form
            className="shadow form-fade bg-white bd-radius-8"
            style={{ width: "800px", boxShadow: 3,}}
            onSubmit={handleSubmit}
          >
            <div className="d-flex justify-content-between"
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
              }}
            >   
              <p className="fw-bold p-4 pb-0">
                {editingAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
              </p>
              <button
                className="p-4"
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              ><i className="fa-solid fa-xmark"></i></button>
            </div>
            <Grid container spacing={2} sx={{p: 3, pt: 1}}>
              {/* Mã và Họ Tên */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mã"
                  required
                  inputRef={inputRef}
                  value={formData.userCode}
                  onChange={(e) => {
                    setFormData({ ...formData, userCode: e.target.value, userName: e.target.value.toLowerCase(), password: e.target.value.toLowerCase() });
                    console.log("formData:", formData);
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>

              {/* Ngày sinh và Giới tính */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ngày Sinh"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Giới tính"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                </TextField>
              </Grid>

              {/* Username và Password */}
              {/* <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid> */}
              {/* <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Password"
                  // type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid> */}

              {/* Trạng thái và Vai trò */}
              {/* <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  required
                  value={formData.accountStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, accountStatus: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </TextField>
              </Grid> */}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Vai trò"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="candidate">Thí sinh</MenuItem>
                  <MenuItem value="supervisor">Giám thị</MenuItem>
                  <MenuItem value="lecturer">Giảng viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="staff">
                    Cán bộ phụ trách kỳ thi
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Phân quyền nếu là Cán bộ phụ trách kỳ thi */}
            {formData.role === "staff" && (
              <FormControl component="fieldset" sx={{p: 3, pt: 0 }}>
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Phân quyền:
                </label>
                <FormGroup>
                  <Grid container spacing={2}>
                    {permissionOptions.map((permission, index) => (
                      <Grid item xs={6} key={index}>
                        <FormControlLabel
                          sx={{ mb: -3 }}
                          control={
                            <Checkbox
                              checked={formData.authenticate.includes(
                                permission
                              )}
                              onChange={(e) => {
                                const updatedPermissions = e.target.checked
                                  ? [...formData.authenticate, permission]
                                  : formData.authenticate.filter(
                                      (p) => p !== permission
                                    );
                                setFormData({
                                  ...formData,
                                  authenticate: updatedPermissions,
                                });
                              }}
                              sx={{ "& .MuiCheckbox-root": { padding: "0px" } }} // Giảm padding checkbox
                            />
                          }
                          label={
                            <span style={{ fontSize: "14px" }}>
                              {permission}
                            </span>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
            )}

            {/* Buttons */}
            <Grid container spacing={2} sx={{justifyContent:"flex-end", p: 3, pt: 1 }}>
              <Grid item xs={3}>
                <CancelButton onClick={() => setShowForm(false)} style={{width: "100%"}}>
                  Hủy
                </CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}>
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </AddButton>
              </Grid>
            </Grid>
          </form>
        </div>
      )}

      {/* Form Đổi mật khẩu */}
      {showPasswordForm && (
        <div className="form-overlay">
          <div
            className="shadow form-fade bg-white bd-radius-8"
            style={{ width: "800px", boxShadow: 3,}}
            onSubmit={handlePasswordSubmit}
          >
            <div 
              className="d-flex justify-content-between"
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
              }}
            >
              <p className="fw-bold p-4 pb-0">
                Đổi mật khẩu
              </p>
              <button
                className="p-4"
                type="button"
                onClick={() => setShowPasswordForm(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              ><i className="fa-solid fa-xmark"></i></button>            
            </div>
            <Grid container spacing={2} sx={{p: 3, pt: 1}}>
              {/* Mã và Họ Tên */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Vai trò"
                  value={passwordData.role}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, role: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="candidate">Thí sinh</MenuItem>
                  <MenuItem value="supervisor">Giám thị</MenuItem>
                  <MenuItem value="lecturer">Giảng viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="staff">Cán bộ phụ trách kỳ thi</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  type={showPassword ? "text" : "password"}
                  required
                  inputRef={inputRef}
                  value={formData.newPassword}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  required
                  inputRef={inputRef}
                  type={showConfirmPassword  ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
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
              </Grid>

            {/* Buttons */}
            <Grid container spacing={2} sx={{justifyContent:"flex-end", p: 3, pt: 1 }}>
              <Grid item xs={3}>
                <CancelButton onClick={() => setShowPasswordForm(false)} style={{width: "100%"}}>
                  Hủy
                </CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}>
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </AddButton>
              </Grid>
            </Grid>
          </div>
        </div>
      )}

      {showAddGroupForm && (
        <div className="form-overlay d-flex align-items-center justify-content-center">
          <div
            className="shadow form-fade bg-white bd-radius-8"
            style={{
              width: "750px",
              maxHeight: "100vh", 
              overflowY: "auto",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
              }}
            >
              <h5 className="fw-bold text-start mb-0 p-4">Thêm nhóm mới</h5>

              <button
                className="mt-0 pe-4"
                type="button"
                onClick={() => {
                  setShowAddGroupForm(false);
                  setSelectedGroup(null);  
                  setSelectedItems([]);
                }} 
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '40px',
                  width: '40px'
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
 
            <div className="p-4 pt-0 pb-0">
              <div className="mb-3">
                <label className="form-label fw-medium">Tên nhóm:</label>
                <CreatableSelect
                  isClearable
                  options={listGroupName}
                  value={selectedGroup} 
                  onChange={(newValue) => setSelectedGroup(newValue)}
                  menuPortalTarget={document.body}
                  placeholder="Chọn nhóm người dùng"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    container: (provided) => ({ ...provided, flex: 1 })
                  }}
                  ref={inputRef}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Danh sách tài khoản đã chọn:</label>
                <div style={{ maxHeight: "320px", overflowY: "auto", paddingRight: "6px" }}>
                  <ul className="ps-0" style={{ listStyle: "none" }}>
                    {listAccount.filter(item => selectedItems.includes(item.id)).length > 0 ? (
                      listAccount
                        .filter(item => selectedItems.includes(item.id))
                        .map(item => (
                          <li
                            key={item.id}
                            className="d-flex align-items-center mb-2 px-3 py-2"
                            style={{
                              backgroundColor: "#f1f3f5",
                              borderRadius: "8px",
                              fontSize: "15px",
                            }}
                          >
                            <i className="fas fa-user me-2 text-primary"></i>
                            <span>
                              <strong>{item.userCode}</strong> - {item.fullName}
                            </span>
                          </li>
                        ))
                    ) : (
                      <li className="text-muted">Chưa chọn tài khoản nào.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <Grid container spacing={2} sx={{justifyContent:"flex-end", p: 3, pt: 2, pe: 0 }}>
              <Grid item xs={3}>
                <CancelButton 
                  onClick={() => {
                    setShowAddGroupForm(false);
                    setSelectedGroup(null);  
                    setSelectedItems([]);
                  }} 
                  style={{width: "100%"}}
                >
                  Hủy
                </CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}
                  onClick={async () => {
                    await handleCreateGroup(selectedGroup, selectedItems);
                  }}
                >
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </AddButton>
              </Grid>
            </Grid>
          </div>
        </div>
      )}

      <DragDropModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onFilesDropped={handleFilesDropped}
        sampleFile={{ url: userFile, name: "upload_user.xlsx" }}
      />
    </div>
  );
};

export default AccountPage;
