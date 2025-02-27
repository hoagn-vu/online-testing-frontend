import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage/LoginPage';
import Header from './components/Header/Header';
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <Router> {/* Thêm BrowserRouter */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
      <Routes>
        <Route path="/admin" element={<AdminLayout />} />
      </Routes>
    </Router>
  );

}

export default App;
