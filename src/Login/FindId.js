import React, { useState } from 'react';
import axios from 'axios';
import './FindId.css';
import { useNavigate } from 'react-router-dom';

const FindId = ({setSelectedMenu}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [foundIds, setFoundIds] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate()

  const handleFindId = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('http://localhost:10000/api/users/find-userId', {
        params: { name, email },
      });

      const ids = res.data.userIds || [];
      if (ids.length === 0) {
        setError('해당 정보로 등록된 아이디가 없습니다.');
        setFoundIds([]);
      } else {
        setFoundIds(ids);
        setError('');
      }
    } catch (err) {
      setFoundIds([]);
      setError('아이디를 찾을 수 없습니다. 입력 정보를 다시 확인해주세요.');
    }
  };

  const handleGoToFindPw = (userId) => {
   navigate(`/find-password?userId=${userId}`); // 필요 시 쿼리 변경
   setSelectedMenu('/find-password')
  };

  const handleGoToLogin = () => {
    navigate('/login')
    setSelectedMenu('/login')
  };

  return (
    <div className="find-container">
      <h2 className='find-id-title'>아이디 찾기</h2>
      <form onSubmit={handleFindId} className="find-form">
        <input
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="가입한 이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">아이디 찾기</button>
      </form>

      <div className="message-area">
        {foundIds.length > 0 && (
          <div className="success-message">
            ✅ 아래는 입력하신 정보로 등록된 아이디 목록입니다:
            <ul>
              {foundIds.map((id, idx) => (
                <li key={idx} className="user-id-row">
                  <span><strong>{id}</strong></span>
                  <button
                    className="pw-link-btn"
                    onClick={() => handleGoToFindPw(id)}
                  >
                    비밀번호 찾기
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="error-message">❌ {error}</p>}
      </div>

      <button className="go-login-button" onClick={handleGoToLogin}>
        로그인으로 이동
      </button>
    </div>
  );
};

export default FindId;
