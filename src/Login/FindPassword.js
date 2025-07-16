import React, { useState } from 'react';
import axios from 'axios';
import './FindPassword.css';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/AxiosApi';

const FindPassword = ({setSelectedMenu}) => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate()

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/reset-password`, {
        userId,
        email,
        newPassword,
      });

      setSuccessMessage(res.data);
      setErrorMessage('');
      setUserId('');
      setEmail('');
      setNewPassword('');

      // 자동 이동 (선택 사항)
      // setTimeout(() => {
      //   window.location.href = '/login';
      // }, 2000);
    } catch (err) {
      setSuccessMessage('');
      setErrorMessage(
        err.response?.data || '비밀번호 재설정 중 오류가 발생했습니다.'
      );
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
    setSelectedMenu('/login')
  };

  return (
    <div className="find-container">
      <h2 className='find-container-title'>비밀번호 재설정</h2>
      <form onSubmit={handleResetPassword} className="find-form">
        <input
          type="text"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="가입한 이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="새 비밀번호 입력"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">비밀번호 재설정</button>
      </form>

      {successMessage && <p className="success-message">✅ {successMessage}</p>}
      {errorMessage && <p className="error-message">❌ {errorMessage}</p>}

      {/* 로그인 페이지로 이동 */}
      <button className="go-login-button" onClick={handleGoToLogin}>
        로그인 페이지로 이동
      </button>
    </div>
  );
};

export default FindPassword;
