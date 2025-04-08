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

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const drawerWidth = 250;

const menuItems = [
  { title: "Trang chủ", icon: <i className="fa-solid fa-chart-column icon-color" aria-hidden="true"></i>, path: "/staff/dashboard", role: ["user", "admin"] },
  { title: "Quản lý tài khoản", icon: <i className="fa-solid fa-user-gear icon-color"></i>, path: "/staff/accountmanage", role: ["user"] },
  { title: "Quản lý kỳ thi", icon: <i className="fa-solid fa-calendar-check icon-color"></i>, path: "/staff/organize", role: ["user", "admin"] },
  { title: "Ngân hàng câu hỏi", icon: <i className="fa-solid fa-database icon-color"></i>, path: "/staff/question", role: ["user"] },
  { title: "Quản lý ma trận đề", icon: <i className="fa-solid fa-table icon-color"></i>, path: "/staff/matrix-exam", role: ["user", "admin"] },
  // { title: "Quản lý đề thi", icon: <i className="fa-solid fa-file-lines icon-color"></i>, path: "/staff/exam", role: ["user"] },
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
  backgroundColor: '#1976d2',
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
      '& .MuiDrawer-paper': openedMixin(theme),
    } : {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className='d-flex justify-content-between'>
          <div className='d-flex align-items-center'>
            <IconButton color="inherit" onClick={handleDrawerOpen} edge="start" sx={{ marginRight: 5, ...(open && { display: 'none' }) }}>
              <MenuIcon />
            </IconButton>
          </div>

          <div className="user-info position-relative d-flex align-items-center" onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
            <img src={avatar} alt="Avatar" className="avatar" />
            <span className="username text-white ms-2">{user?.username}</span>
            <FaChevronDown className="text-white ms-2" />
            
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
          <ListItem key={item.title} disablePadding>
            <Tooltip title={!open ? item.title : ""} placement="right"
              PopperProps={{
                modifiers: [
                  {
                    name: "offset",
                    options: {
                    offset: [0, -13],
                    },
                  },
                ],
              }}
            >
              <ListItemButton 
                onClick={() => navigate(item.path)} 
                selected={location.pathname.startsWith(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.title} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      </Drawer>
      <Box 
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          backgroundColor: "#fdfdfd",
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