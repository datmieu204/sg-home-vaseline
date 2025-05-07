import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Lưu user vào localStorage
      // QUAN TRỌNG
      localStorage.setItem('user', JSON.stringify(data));

      // Điều hướng theo role
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'manager') {
        navigate('/manager');
      } else if (data.role === 'staff') {
        if (data.department_id === 'ACCT') {
          navigate('/staffACCT');
        } else if (data.department_id === 'RECEP') {
          navigate('/staffRECEP');
        } else {
          navigate('/staff');
        }
      } else if (data.role === 'household') {
        navigate('/household');
      } else {
        setError('Role không hợp lệ');
      }

    } catch (err) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">VNHOME</div>
        <h2 className="login-title">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="login-button">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
