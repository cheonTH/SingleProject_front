// components/BoardList.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BoardItem from './BoardItem';
import './BoardList.css';
import BoardContext from './context/BoardContext';

const BoardList = ({ selectedCategory }) => {
  const { boardList, loading, fetchBoards } = useContext(BoardContext);

  useEffect(() => {
      fetchBoards(); // 💡 BoardList 페이지 진입 시마다 호출
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') setTitle('전체');
    else if (selectedCategory === 'tip') setTitle('자취 팁');
    else if (selectedCategory === '자유') setTitle('자유');
    else if (selectedCategory === '질문') setTitle('자취 질문');
  }, [selectedCategory]);


  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('')
  const postsPerPage = 5;

  if (loading) return <p>게시글을 불러오는 중입니다...</p>;
  if (!boardList || boardList.length === 0) return <p>게시글이 없습니다.</p>;
  
  

  // ✅ 필터링
  const filteredBoards =
    selectedCategory === 'all'
      ? [...boardList]
      : boardList.filter((item) => item.category === selectedCategory);

  // ✅ 최신순 정렬
  filteredBoards.sort(
    (a, b) => new Date(b.writingTime) - new Date(a.writingTime)
  );

  console.log("boardList: ",boardList)

  // ✅ 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBoards.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBoards.length / postsPerPage);

  return (
    <div className="board-list-container">
      <h2 className="board-list-title">{title} 게시판</h2>

      <div className="board-list">
        {currentPosts.map((item) => (
          <Link to={`/board/${item.id}`} key={item.id} className="link-item">
            <BoardItem
              category={item.category}
              title={item.title}
              author={item.nickName}
              createdDate={item.writingTime}
              // imageUrl={item.imageUrls?.[0]}
            />
          </Link>
        ))}
      </div>

      {/* ✅ 페이지네이션 UI */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BoardList;
