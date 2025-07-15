import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boardList, setBoardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ❗ 추가 가능

  const fetchBoards = async () => {
    setLoading(true); // ✅ 새 요청마다 로딩 재설정
    try {
      const res = await axios.get('http://localhost:10000/api/board');
      setBoardList(res.data);
      setError(null);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
      setError(err); // ❗ 필요 시 에러 상태 저장
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <BoardContext.Provider value={{ boardList, loading, error, fetchBoards }}>
      {children}
    </BoardContext.Provider>
  );
};


export default BoardContext;
