import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingMenu.css';

const FloatingMenu = ({ selectedMenu, setSelectedMenu, selectedCategory, setSelectedCategory, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleWrite = () => {
    if(isLoggedIn === false){
        alert("로그인이 필요합니다")
    }else{
        if (selectedMenu === '/board') {
            setSelectedMenu('/write');
            navigate('/write');
        } else if (selectedMenu === '/write') {
            setSelectedMenu('/board');
            navigate('/board');
        }
    }
    
  };

  const goHome = () => {
    setSelectedMenu('/');
    navigate('/');
  };

  return (
    <div className="floating-menu">
      {['/', '/hunbab', '/coinwash', '/cafe'].includes(selectedMenu) && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/hunbab'); navigate('/'); }}>
            <div className="icon-circle">🍚</div>
            <div className="button-text">혼밥</div>
          </button>
          <button onClick={() => { setSelectedMenu('/coinwash'); navigate('/'); }}>
            <div className="icon-circle">🧦</div>
            <div className="button-text">코인 세탁방</div>
          </button>
          <button onClick={() => { setSelectedMenu('/cafe'); navigate('/'); }}>
            <div className="icon-circle">☕</div>
            <div className="button-text">카페</div>
          </button>
        </>
      )}

      {selectedMenu === '/board' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={handleWrite}>
            <div className="icon-circle">✍️</div>
            <div className="button-text">글쓰기</div>
          </button>
          <button onClick={() => {setSelectedMenu('/boardpop'); navigate('/boardpop')}}>
            <div className="icon-circle">💗</div>
            <div className="button-text">인기</div>
          </button>
          {/* <button onClick={() => alert('추천 게시물로 이동')}>
            <div className="icon-circle">⭐</div>
            <div className="button-text">추천</div>
          </button> */}

          {/* ✅ select 카테고리 필터 추가 */}
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

      {selectedMenu === '/detail' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/board'); navigate('/board'); }}>
            <div className="icon-circle">📄</div>
            <div className="button-text">게시판</div>
          </button>
        </>
      )}

      {selectedMenu === '/boardpop' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/board'); navigate('/board'); }}>
            <div className="icon-circle">📄</div>
            <div className="button-text">게시판</div>
          </button>
        </>
      )}

      {selectedMenu === '/write' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/board'); navigate('/board'); }}>
            <div className="icon-circle">📄</div>
            <div className="button-text">게시판</div>
          </button>
        </>
      )}

      {selectedMenu === '/login' && (
        <button onClick={goHome}>
          <div className="icon-circle">🚩</div>
          <div className="button-text">홈</div>
        </button>
      )}

      {selectedMenu === '/mypage' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/editInfo'); navigate('/editInfo'); }}>
            <div className="icon-circle">📚</div>
            <div className="button-text" style={{fontSize: '14px'}}>개인정보 수정</div>
          </button>
        </>
      )}

      {selectedMenu === '/editInfo' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/mypage'); navigate('/mypage'); }}>
            <div className="icon-circle">📘</div>
            <div className="button-text">마이페이지</div>
          </button>
        </>
      )}

      {selectedMenu === '/find-id' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/login'); navigate('/login'); }}>
            <div className="icon-circle">✅</div>
            <div className="button-text">로그인</div>
          </button>
          <button onClick={() => { setSelectedMenu('/find-password'); navigate('/find-password'); }}>
            <div className="icon-circle">🔒</div>
            <div className="button-text">PW 찾기</div>
          </button>
        </>
      )}

      {selectedMenu === '/find-password' && (
        <>
          <button onClick={goHome}>
            <div className="icon-circle">🚩</div>
            <div className="button-text">홈</div>
          </button>
          <button onClick={() => { setSelectedMenu('/login'); navigate('/login'); }}>
            <div className="icon-circle">✅</div>
            <div className="button-text">로그인</div>
          </button>
          <button onClick={() => { setSelectedMenu('/find-id'); navigate('/find-id'); }}>
            <div className="icon-circle">👤</div>
            <div className="button-text">ID 찾기</div>
          </button>
        </>
      )}
    </div>
  );
};

export default FloatingMenu;
