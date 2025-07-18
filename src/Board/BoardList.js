// components/BoardList.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BoardItem from './BoardItem';
import './BoardList.css';
import BoardContext from './context/BoardContext';

const BoardList = ({ selectedCategory, setSelectedMenu }) => {
  const { boardList, loading, fetchBoards } = useContext(BoardContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const postsPerPage = 5;

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') setTitle('전체');
    else if (selectedCategory === 'tip') setTitle('자취 팁');
    else if (selectedCategory === '자유') setTitle('자유');
    else if (selectedCategory === '질문') setTitle('자취 질문');
  }, [selectedCategory]);

  useEffect(() => {
    if (!boardList) return;

    const baseFiltered =
      selectedCategory === 'all'
        ? [...boardList]
        : boardList.filter((item) => item.category === selectedCategory);

    let finalFiltered = baseFiltered;

    if (searchTerm.trim() !== '') {
      finalFiltered = baseFiltered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    finalFiltered.sort(
      (a, b) => new Date(b.writingTime) - new Date(a.writingTime)
    );

    setFilteredBoards(finalFiltered);
    setCurrentPage(1);
  }, [boardList, selectedCategory, searchTerm]);

  if (loading) return <p>게시글을 불러오는 중입니다...</p>;
  if (!boardList || boardList.length === 0) return (
    <div className="board-list-container">
      <p>게시글이 없습니다.</p>
    </div>
  );

  if (filteredBoards.length === 0) {
    return (
      <div className="board-list-container">
        <h2 className="board-list-title">
          {isSearching
            ? `"${searchTerm}" 검색 결과`
            : `${title} 게시판`}
        </h2>
        <p>해당 카테고리에 게시글이 없습니다.</p>
      </div>
    );
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBoards.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBoards.length / postsPerPage);

  const handleSearch = () => {
    setSearchTerm(searchQuery.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="board-list-container">
      <h2 className="board-list-title">
        {isSearching
          ? `"${searchTerm}" 검색 결과`
          : `${title} 게시판`}
      </h2>

      <div className="board-list">
        {currentPosts.map((item) => (
          <Link
            to={`/board/${item.id}`}
            key={item.id}
            className="link-item"
            onClick={() => {
              setSelectedMenu('/detail');
            }}
          >
            <BoardItem
              category={item.category}
              title={item.title}
              author={item.nickName}
              createdDate={item.writingTime}
              likeCount={item.likeCount}
              commentCount={item.commentCount}
            />
          </Link>
        ))}
      </div>

      {/* ✅ 검색창: 게시글 목록 아래에 위치 */}
      <div className="search-bar-bottom">
        <input
          type="text"
          placeholder="제목 또는 내용을 검색하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {/* 페이지네이션 */}
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
