import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingMenu.css';

const FloatingMenu = ({ selectedMenu, setSelectedMenu, selectedCategory, setSelectedCategory }) => {
  const navigate = useNavigate();

  const handleWrite = () => {
    if (selectedMenu === '/board') {
      setSelectedMenu('/write');
      navigate('/write');
    } else if (selectedMenu === '/write') {
      setSelectedMenu('/board');
      navigate('/board');
    }
  };

  const handleGoHome = () => {
    setSelectedMenu('/');
    navigate('/');
  };

  return (
    <div className="floating-menu">
        {['/', '/hunbab', '/coinwash', '/cafe'].includes(selectedMenu) && (
            <>
            <button onClick={() => { setSelectedMenu('/'); navigate('/'); }}>🚩 홈</button>
            <button onClick={() => { setSelectedMenu('/hunbab'); navigate('/'); }}>🍚 혼밥</button>
            <button onClick={() => { setSelectedMenu('/coinwash'); navigate('/'); }}>🧦 코인 세탁방</button>
            <button onClick={() => { setSelectedMenu('/cafe'); navigate('/'); }}>☕ 카페</button>
            </>
        )}

        {selectedMenu === '/board' && (
            <>
            <button onClick={() => { setSelectedMenu('/'); navigate('/'); }}>홈</button>
            <button onClick={handleWrite}>글쓰기</button>
            <button onClick={() => alert('인기 게시물로 이동')}>💗 인기</button>
            <button onClick={() => alert('추천 게시물로 이동')}>⭐ 추천</button>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
            >
                <option value="all">전체</option>
                <option value="tip">자취 팁</option>
                <option value="자유">자유게시판</option>
                <option value="질문">자취 질문</option>
            </select>
            </>
        )}

        {selectedMenu === '/write' && (
            <>
                <button onClick={() => { setSelectedMenu('/'); navigate('/'); }}>🚩 홈</button>
                <button onClick={() => { setSelectedMenu('/board'); navigate('/board'); }}>📄 게시판</button>
            </>
        )}

        {selectedMenu === '/login' && (
            <>
                <button onClick={() => { setSelectedMenu('/'); navigate('/'); }}>🚩 홈</button>
            </>
        )}

        {selectedMenu === '/mypage' && (
            <>
                <button onClick={() => { setSelectedMenu('/'); navigate('/'); }}>🚩 홈</button>
                <button onClick={() => { setSelectedMenu('/editInfo'); navigate('/editInfo'); }}>📚 개인정보 수정</button>
            </>
        )}

        {selectedMenu === '/find-id' && (
            <>
                <button onClick={() => { setSelectedMenu('/'); navigate('/'); }}>🚩 홈</button>
                <button onClick={() => { setSelectedMenu('/login'); navigate('/login'); }}>✅ 로그인</button>
                <button onClick={() => { setSelectedMenu('/find-password'); navigate('/find-password'); }}>비밀번호 찾기</button>
            </>
        )}

        {selectedMenu === '/find-password' && (
            <>
                <button onClick={() => { setSelectedMenu('/'); navigate('/'); }}>홈</button>
                <button onClick={() => { setSelectedMenu('/login'); navigate('/login'); }}>로그인</button>
                <button onClick={() => { setSelectedMenu('/find-id'); navigate('/find-id'); }}>아이디 찾기</button>
            </>
        )}
    </div>
  );
};

export default FloatingMenu;
