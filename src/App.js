import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage/LoginPage';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import AccountPage from './pages/AccountPage/AccountPage';

function App() {
  return (
    <Router> {/* Thêm BrowserRouter */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
      <Routes>
        <Route path="/admin" element={<AdminLayout />} >
          <Route path="accountmanage" element={<AccountPage />} />
        </Route>
      </Routes>
      <Routes>
        <Route 
          path="/thisinh" element={<DefaultLayout />} >
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
