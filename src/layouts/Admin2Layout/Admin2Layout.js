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

const drawerWidth = 250;

const menuItems = [
  { title: "Trang chủ", icon: <i className="fa-solid fa-chart-column icon-color" aria-hidden="true"></i>, path: "/staff/dashboard", role: ["user", "admin"] },
  { 
    title: "Quản lý người dùng", 
    icon: <i className="fa-solid fa-user-gear icon-color"></i>, 
    path: "/staff/accountmanage", 
    role: ["user"],
    children: [
      { title: "Nhóm người dùng", path: "/staff/accountmanage" },
    ],
  },
  { title: "Quản lý kỳ thi", icon: <i className="fa-solid fa-calendar-check icon-color"></i>, path: "/staff/organize", role: ["user", "admin"] },
  { title: "Ngân hàng câu hỏi", icon: <i className="fa-solid fa-database icon-color"></i>, path: "/staff/question", role: ["user"] },
  { title: "Quản lý ma trận đề", icon: <i className="fa-solid fa-table icon-color"></i>, path: "/staff/matrix-exam", role: ["user", "admin"] },
  { title: "Quản lý đề thi", icon: <i className="fa-solid fa-file-lines icon-color"></i>, path: "/staff/exam", role: ["user"] },
  { title: "Quản lý phòng thi", icon: <i className="fa-solid fa-school icon-color"></i>, path: "/staff/room", role: ["user", "admin"] },
  { title: "Nhật ký sử dụng", icon: <i className="fa-solid fa-book icon-color"></i>, path: "/staff/log", role: ["user"] },
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
            <span className="username ms-2">{user?.username}</span>
            <i className="fa-solid fa-caret-down ms-2" aria-hidden="true" style={{ color: "black" }}></i>
            {isOpen && (
              <ul className="dropdown-menu show position-absolute end-0 mt-2 custom-dropdown">
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
        <DrawerHeader>
          <img src={logo} alt="Logo" style={{ height: 40 }} />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
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
                      }
                      navigate(item.path);          // điều hướng
                    }}
                    selected={location.pathname.startsWith(item.path)}
                    sx={{
                      '&.Mui-selected': {
                        borderLeft: '5px solid #1976D2',
                        backgroundColor: '#f0f8ff',
                      }
                    }}
                  >
                    <ListItemIcon sx={{minWidth:'45px'}}>{item.icon}</ListItemIcon>
                    {open && <ListItemText primary={item.title} />}
                    {open && item.children && (isMenuOpen(item) ? <ExpandLess /> : <ExpandMore />)}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {item.children && (
                <Collapse in={isMenuOpen(item)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((subItem) => (
                      <ListItemButton
                        key={subItem.title}
                        onClick={() => navigate(subItem.path)}
                        selected={location.pathname === subItem.path}
                        sx={{
                          pl: 0,
                          ml: '30px',
                          py: 1,
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            color: '#1976D2',
                          },
                          '&:hover': {
                            backgroundColor: '#f5f5f5', // Hover nhẹ nếu bạn muốn
                          },
                        }}
                      >
                        {/* Thanh dọc xanh luôn hiển thị */}
                        <Box
                          sx={{
                            width: '4px',
                            height: '35px',
                            backgroundColor: location.pathname === subItem.path ? '#1976D2' : '#1976D2', // xanh đậm nếu chọn, nhạt nếu không
                            borderRadius: '2px',
                            ml: '8px',
                            mr: '8px',
                          }}
                        />
                        <ListItemText primary={subItem.title} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          paddingTop: 0,
          backgroundColor: "#F8F9FA",
          minHeight: "100vh",
          transition: "margin 0.3s ease, width 0.3s ease",
          marginLeft: open ? `${drawerWidth - 250}px` : `calc(${theme.spacing(0)} + 1px)`,
          width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - calc(${theme.spacing(0)} + 1px))`,
        }}
      >        
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}