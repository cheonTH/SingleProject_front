import React from 'react';
import './BoardItem.css';

const BoardItem = ({ title, author, createdDate, category }) => {
  return (
    <div className="board-item">
      <div className="board-text">
        <p className="board-category">{category}</p>
        <h3 className="board-title">{title}</h3>
        <p className="board-content">{author}</p>
        <p className="board-date">{createdDate}</p>
      </div>
    </div>
  );
};

export default BoardItem;
