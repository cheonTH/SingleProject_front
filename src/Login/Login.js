import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({setIsLoggedIn, setSelectedMenu}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:10000/api/users/login', {
        userId,
        password,
      });

      console.log(response.data)
      const { token, nickName, email, id, name } = response.data;

      // ✅ localStorage에 로그인 정보 저장
      localStorage.setItem('token', token);
      localStorage.setItem('nickName', nickName);
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userPk', id);

      alert('로그인 성공!');
      setSelectedMenu('/')
      navigate('/'); // 로그인 성공 후 메인 페이지 등으로 이동
      setIsLoggedIn(true)
      console.log(nickName)

    } catch (error) {
      alert('로그인 실패: ' + (error.response?.data || '서버 오류'));
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
        <Link to="/find-id" onClick={() => {setSelectedMenu('/find-id')}}>아이디 찾기</Link>
        <span>|</span>
        <Link to="/find-password" onClick={() => {setSelectedMenu('/find-password')}}>비밀번호 찾기</Link>
      </div>
    </div>
  );
};

export default Login;
