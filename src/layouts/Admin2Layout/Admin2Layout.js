import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import logo from '../../assets/logo/logo.png';
import { FaChevronDown } from "react-icons/fa";
import avatar from "../../assets/images/avar.jpg";
import './Admin2Layout.css'
import Tooltip from '@mui/material/Tooltip';
import {Collapse} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ChapterSidebar from '../../components/ChapterSidebar/ChapterSidebar';
const drawerWidth = 250;

const menuItems = [
  { title: "Trang chủ", icon: <i className="fa-solid fa-chart-column icon-color" aria-hidden="true"></i>, path: "/staff/dashboard", role: ["staff"] },
  /*{ 
    title: "Quản lý người dùng", 
    icon: <i className="fa-solid fa-user-gear icon-color"></i>, 
    role: ["admin"],
    children: [
      { title: "Danh sách người dùng", path: "/admin/accountmanage" },
      { title: "Nhóm người dùng", path: "/admin/groupuser" },
    ],
  },*/
  { 
    title: "Quản lý người dùng", 
    icon: <i className="fa-solid fa-user-gear icon-color"></i>, 
    role: ["staff", "admin"],
    children: [
      { title: "Danh sách người dùng", path: "/staff/accountmanage" },
      { title: "Nhóm người dùng", path: "/staff/groupuser" },
    ],
  },
  { 
    title: "Tổ chức kỳ thi", 
    icon: <i className="fa-solid fa-calendar-check icon-color"></i>, 
    role: ["staff"],
    children: [
      { title: "Quản lý kỳ thi", path: "/staff/organize" },
      { title: "Quản lý phòng thi", path: "/staff/room" },
    ],
  },
  { 
    title: "Quản lý nội dung thi", 
    icon: <i className="fa-solid fa-database icon-color"></i>, 
    role: ["staff", "lecturer"],
    children: [
      { title: "Ngân hàng câu hỏi", path: "/staff/question" },
      { title: "Quản lý ma trận đề", path: "/staff/matrix-exam" },
      { title: "Quản lý đề thi", path: "/staff/exam" },
      { title: "Quản lý mức độ", path: "/staff/level" },
    ],
  },
  /*{ 
    title: "Quản lý nội dung thi", 
    icon: <i className="fa-solid fa-database icon-color"></i>, 
    role: ["lecturer"],
    children: [
      { title: "Ngân hàng câu hỏi", path: "/lecturer/question" },
      { title: "Quản lý ma trận đề", path: "/lecturer/matrix-exam" },
      { title: "Quản lý đề thi", path: "/lecturer/exam" },
      { title: "Quản lý mức độ", path: "/lecturer/level" },
    ],
  },*/
  // { title: "Quản lý ma trận đề", icon: <i className="fa-solid fa-table icon-color"></i>, path: "/staff/matrix-exam", role: ["admin"] },
  // { title: "Quản lý đề thi", icon: <i className="fa-solid fa-file-lines icon-color"></i>, path: "/staff/exam", role: ["admin"] },
  { title: "Nhật ký sử dụng", icon: <i className="fa-solid fa-book icon-color"></i>, path: "/admin/log", role: ["admin"] },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open ? {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
          backgroundColor: '#ffffff',
          boxShadow: '1px 0px 15px 0px rgba(142, 142, 142, 0.25)',
      },
    } : {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': {
          ...closedMixin(theme),
            backgroundColor: '#ffffff',
            boxShadow: '5px 0px 15px 0px rgba(142, 142, 142, 0.25)',
        },
    }),
  })
);

export default function Admin2Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 960) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dispatch = useDispatch();
 
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.role === "lecturer") {
      setOpenMenus((prev) => ({
        ...prev,
        "Quản lý nội dung thi": true, // auto mở menu này
      }));
    }
    if (user?.role === "admin") {
      setOpenMenus((prev) => ({
        ...prev,
        "Quản lý người dùng": true, // auto mở menu này
      }));
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const handleToggle = (title) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isMenuOpen = (item) =>
    openMenus[item.title] !== undefined
      ? openMenus[item.title]
      : location.pathname.startsWith(item.path);

  const [isAiFormOpen, setIsAiFormOpen] = useState(false);
  const [isAddQuestionFormOpen, setIsAddQuestionFormOpen] = useState(false);
  
  useEffect(() => {
    const handleToggle = (e) => {
      setIsAiFormOpen(e.detail);
    };

    window.addEventListener("toggleAiForm", handleToggle);
    return () => {
      window.removeEventListener("toggleAiForm", handleToggle);
    };
  }, []);

  useEffect(() => {
    const handleToggleAd = (e) => {
      setIsAddQuestionFormOpen(e.detail);
    };

    window.addEventListener("toggleAddQuestionForm", handleToggleAd);
    return () => {
      window.removeEventListener("toggleAddQuestionForm", handleToggleAd);
    };
  }, []);

  const isBaseListQuestionPage = location.pathname.startsWith("/staff/question/") &&
                                location.pathname.split("/").length === 5;

  const isListQuestionPage = isBaseListQuestionPage && !isAiFormOpen && !isAddQuestionFormOpen;

  const handleNavigateToChangePassword = () => {
    if (user.role === "lecturer") {
      navigate("/staff/change-password");
    } else if (user.role === "staff") {
      navigate("/staff/change-password");
    } else if (user.role === "admin") {
      navigate("/staff/change-password");
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" 
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: '5px 0px 15px 0px rgba(142, 142, 142, 0.25)',

        }}
        open={open}
      >
        <Toolbar className='d-flex justify-content-between'>
          <div className='d-flex align-items-center'>
            <IconButton color="inherit" onClick={handleDrawerOpen} edge="start" sx={{ color: '#1764b0', marginRight: 5, ...(open && { display: 'none' }) }}>
              <MenuIcon />
            </IconButton>
          </div>

          <div className="user-info position-relative d-flex align-items-center" onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
            <img src={avatar} alt="Avatar" className="avatar" />
            <span className="username ms-2">{user?.fullName}</span>
            <i className="fa-solid fa-caret-down ms-2" aria-hidden="true" style={{ color: "black" }}></i>
            {isOpen && (
              <ul className="dropdown-menu show position-absolute end-0 mt-2 custom-dropdown">
                <li>
                  <a
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    onClick={() => handleNavigateToChangePassword()}
                    style={{ gap: "8px" }}
                  >
                    <span>Đổi mật khẩu</span>
                    <i className="fa-solid fa-key" aria-hidden="true"></i>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex justify-content-between align-items-center"
                    onClick={handleLogout}
                    style={{ gap: "8px" }}
                  >
                    <span>Đăng xuất</span>
                    <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>            
            )}
          </div>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        {isListQuestionPage ? (
          <ChapterSidebar onFilterSelect={setSelectedFilter}
    selectedFilter={selectedFilter} />
        ) : (
          <>
            <DrawerHeader>
              <img src={logo} alt="Logo" style={{ height: 40 }} />
              {/* <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton> */}
            </DrawerHeader>
            <Divider />
            <List>
              {menuItems.filter(item => item.role.includes(user?.role))
                .map((item) => (
                <React.Fragment key={item.title}>
                  <ListItem disablePadding
                    sx={{
                      ...(open === false && {
                        mb: 1, // cách dọc giữa các icon khi thu gọn
                      }),
                    }}
                  >
                    <Tooltip title={!open ? item.title : ""} placement="right"
                      PopperProps={{
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -13], // đây là phần tạo khoảng cách
                            },
                          },
                        ],
                      }}
                    >
                      <ListItemButton
                        onClick={() => {
                          if (item.children) {
                            handleToggle(item.title);   // mở submenu
                          } else {
                            navigate(item.path);          // điều hướng
                          }
                        }}
                        selected={location.pathname.startsWith(item.path)}
                        sx={{
                          '&.Mui-selected': {
                            borderLeft: '5px solid #1976D2',
                            backgroundColor: '#f0f8ff',
                          }
                        }}
                      >
                        <ListItemIcon sx={{minWidth:'35px'}}>{item.icon}</ListItemIcon>
                        {open && <ListItemText primary={item.title} />}
                        {open && item.children && (isMenuOpen(item) ? <ExpandLess /> : <ExpandMore />)}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>

                  {item.children && (
                    <Collapse in={isMenuOpen(item)} timeout="auto" unmountOnExit>
                      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        {/* Thanh dọc xanh chung cho toàn bộ submenu */}
                        <Box
                          sx={{
                            width: '3px',
                            backgroundColor: '#1976D2',
                            borderRadius: '2px',
                            ml: '35px',
                          }}
                        />
                        <List component="div" disablePadding >
                          {item.children.map((subItem) => (
                            <ListItemButton
                              key={subItem.title}
                              onClick={() => navigate(subItem.path)}
                              selected={location.pathname.startsWith(subItem.path)}                          
                              sx={{
                                pl: 2,
                                py: 0.8, // nhỏ hơn để sát nhau
                                '&.Mui-selected': {
                                  backgroundColor: 'transparent',
                                  color: '#1976D2',
                                },
                                '&:hover': {
                                  backgroundColor: '#f5f5f5',
                                },
                              }}
                            >
                              <ListItemText primary={subItem.title} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Box>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      </Drawer>
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          paddingTop: 0,
          // backgroundColor: "#F8F9FA",
          backgroundColor: "#F8F9FA",
          minHeight: "100vh",
          transition: "margin 0.3s ease, width 0.3s ease",
          marginLeft: open ? `${drawerWidth - 250}px` : `calc(${theme.spacing(0)} + 1px)`,
          width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - calc(${theme.spacing(0)} + 1px))`,
        }}
      >        
        <DrawerHeader />
        <Outlet context={{ selectedFilter  }} /> {/* Truyền selectedChapter qua context */}      </Box>
    </Box>
  );
}