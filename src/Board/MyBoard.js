// components/MyBoard.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BoardContext from './context/BoardContext';
import BoardItem from './BoardItem';
import './BoardList.css'; // BoardList 스타일 재사용

const MyBoard = () => {
    const { boardList, loading, fetchBoards } = useContext(BoardContext);
    const [myBoards, setMyBoards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const currentUserId = sessionStorage.getItem('userId'); // 또는 userId

    useEffect(() => {
        fetchBoards();
    }, []);

    useEffect(() => {
        if (!boardList || !currentUserId) return;
        const myPosts = boardList.filter((item) => item.userId === currentUserId);
        myPosts.sort((a, b) => new Date(b.writingTime) - new Date(a.writingTime));
        setMyBoards(myPosts);
        setCurrentPage(1);
    }, [boardList]);

    if (loading) return <p>게시글을 불러오는 중입니다...</p>;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = myBoards.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(myBoards.length / postsPerPage);

    return (
        <div className="board-list-container">
        <h2 className="board-list-title">내가 작성한 글</h2>

        {myBoards.length === 0 ? (
            <p>작성한 게시글이 없습니다.</p>
        ) : (
            <>
            <div className="board-list">
                {currentPosts.map((item) => (
                <Link to={`/board/${item.id}`} key={item.id} className="link-item">
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
            </>
        )}
        </div>
    );
};

export default MyBoard;
