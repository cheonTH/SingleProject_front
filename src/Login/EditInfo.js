import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditInfo.css';
import { API_BASE_URL } from '../api/AxiosApi';
import { useNavigate } from 'react-router-dom';

const EditInfo = ({setSelectedMenu}) => {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [form, setForm] = useState({
    name: '',
    userId: '',
    email: '',
    nickname: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [nicknameCheck, setNicknameCheck] = useState(null);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate()

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data;
        setForm((prev) => ({
          ...prev,
          name: userData.name,
          userId: userData.userId,
          email: userData.email,
          nickname: userData.nickName,
        }));
      } catch (err) {
        console.error('사용자 정보 불러오기 실패:', err);
      }
    };
    fetchUserInfo();
  }, []);

  const handlePasswordCheck = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/users/check-password`,
        { password: currentPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setStep(2);
        setError('');
      } else {
        setError('비밀번호가 틀렸습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('비밀번호 확인 중 오류 발생');
    }
  };

  const handleCheckNickname = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users/check-nickname?nickName=${form.nickname}`
      );
      setNicknameCheck(
        res.data.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'
      );
    } catch (err) {
      console.error(err);
      setNicknameCheck('닉네임 중복 확인 실패');
    }
  };

  const handleUpdateProfile = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/users/update-profile`,
        {
          email: form.email,
          nickname: form.nickname,
          password: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      sessionStorage.setItem('email', form.email);
      sessionStorage.setItem('nickName', form.nickname);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false); // 2초 후 메시지 숨기기
        setSelectedMenu('/mypage')
        navigate('/mypage'); // 로그인 성공 후 메인 페이지 등으로 이동
      }, 1000);

      setError('');
    } catch (err) {
      console.error(err);
      setError('수정 중 오류가 발생했습니다.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handlePasswordCheck();
  };

  return (
    <div className="edit-info-container">
      <h2 className="edit-info-title">🔐 개인정보 수정</h2>

      {step === 1 && (
        <>
          <label>현재 비밀번호 확인</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="현재 비밀번호 입력"
          />
          <button className="edit-info-button" onClick={handlePasswordCheck}>
            확인
          </button>
          {error && <p className="error-message">{error}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <label>이름</label>
          <input type="text" value={form.name} readOnly />

          <label>아이디</label>
          <input type="text" value={form.userId} readOnly />

          <label>이메일</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>닉네임</label>
          <div className="nickname-row">
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className='nickname-input'
            />
            <button type="button" onClick={handleCheckNickname}>
              중복 확인
            </button>
          </div>
          {nicknameCheck && <p className="nickname-check">{nicknameCheck}</p>}

          <label>새 비밀번호</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />

          <label>비밀번호 확인</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <button className="edit-info-button" onClick={handleUpdateProfile}>
            저장하기
          </button>

          {error && <p className="error-message">{error}</p>}
        </>
      )}

      {showSuccessMessage && (
        <div className="toast-popup">
          <span className="icon">📚</span>
          <span className="text">개인정보 수정이 완료되었습니다!</span>
        </div>
      )}
    </div>
  );
};

export default EditInfo;
