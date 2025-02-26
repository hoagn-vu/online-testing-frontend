import './App.css';
import LoginPage from './pages/LoginPage/LoginPage'
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router> {/* Thêm BrowserRouter */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );

}

export default App;
