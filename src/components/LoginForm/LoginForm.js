import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginForm.css'

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

     // Xóa thông báo lỗi khi username hoặc password trống
     useEffect(() => {
        if (!username && !password) {
            setError('');
        }
    }, [username, password]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            if (username === 'admin' && password === '123456') {
                console.log('Login successful!');
            } else {
                setError('⚠ Sai tên tài khoản hoặc mật khẩu!');
            }
            setLoading(false);
        }, 200);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <form className="card p-4 shadow-lg login-form" onSubmit={handleSubmit}>
                <h2 className="text-center mb-3 fw-bold text-blue-holo">Đăng nhập</h2>

                {error && <div className="alert alert-danger text-center p-2">{error}</div>}

                {/* Ô nhập tài khoản */}
                <div className="mb-3 text-start">
                    <label className="form-label fw-bold">Tên tài khoản</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tài khoản"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                {/* Ô nhập mật khẩu */}
                <div className="mb-3 text-start">
                    <label className="form-label fw-bold">Mật khẩu</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y me-2"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                    </button>
                </div>

                {/* Nút đăng nhập */}
                <button type="submit" className="btn w-100 fw-bold css-btn" disabled={loading}>
                    {loading ? (
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
