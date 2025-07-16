import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { API_BASE_URL } from '../api/AxiosApi';

const Login = ({ setIsLoggedIn, setSelectedMenu }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        userId,
        password,
      });

      const { token, nickName, email, id, name } = response.data;

      // ✅ 로그인 성공 처리
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('nickName', nickName);
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('userPk', id);

      setError('no'); // 성공 상태로 세팅
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSelectedMenu('/');
        navigate('/');
        setIsLoggedIn(true);
      }, 1000);
    } catch (err) {
      setError('error'); // 실패 상태로 세팅
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>

      <div className="login-links">
        <Link to="/signup">회원가입</Link>
        <span>|</span>
        <Link to="/find-id" onClick={() => setSelectedMenu('/find-id')}>아이디 찾기</Link>
        <span>|</span>
        <Link to="/find-password" onClick={() => setSelectedMenu('/find-password')}>비밀번호 찾기</Link>
      </div>

      {showSuccessMessage && (
        <div className="toast-popup">
          {error === 'error' ? (
            <>
              <span className="icon">❌</span>
              <span className="text">로그인 실패!</span>
            </>
          ) : (
            <>
              <span className="icon">✅</span>
              <span className="text">로그인 성공!</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
