import React from 'react';
import './BoardItem.css';

const BoardItem = ({ title, author, createdDate, category, likeCount, commentCount }) => {
  function formatToKoreanTime(utcString) {
    const date = new Date(utcString);
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  console.log('🧩 BoardItem props:', title, likeCount, commentCount);

  return (
    <div className="board-item">
      <div className="board-text">
        <p className="board-category">{category}</p>
        <h3 className="board-title">{title}</h3>
        <p className="board-content">👤 {author}</p>
        <p className="board-date">🕒 {formatToKoreanTime(createdDate)}</p>

        <div className="board-stats">
          {Number(likeCount) > 0 && <span className="board-like">💗 {likeCount}</span>}
          {commentCount > 0 && <span className="board-comment">💬 {commentCount || 0}</span>}
        </div>
      </div>
    </div>
  );
};

export default BoardItem;
