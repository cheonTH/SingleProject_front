import React, { useEffect, useState } from 'react';
import './MyPage.css';
import axios from 'axios';
import { API_BASE_URL } from '../api/AxiosApi';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    userId: '',
    email: '',
    nickName: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo({
          name: res.data.name,
          userId: res.data.userId,
          email: res.data.email,
          nickName: res.data.nickName,
        });

        // 동기화용 sessionStorage 업데이트
        sessionStorage.setItem('name', res.data.name);
        sessionStorage.setItem('email', res.data.email);
        sessionStorage.setItem('nickName', res.data.nickName);
      } catch (err) {
        console.error('사용자 정보 가져오기 실패', err);
      }
    };

    fetchUserInfo();
  }, []);


  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>
      <div className="mypage-info">
        <p><strong>이름:</strong> {userInfo.name}</p>
        <p><strong>아이디:</strong> {userInfo.userId}</p>
        <p><strong>이메일:</strong> {userInfo.email}</p>
        <p><strong>닉네임:</strong> {userInfo.nickName}</p>
      </div>
    </div>
  );
};

export default MyPage;
