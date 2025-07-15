import React, { useContext } from 'react';
import BoardContext from './context/BoardContext';
import BoardItem from './BoardItem';
import { Link } from 'react-router-dom';
import "./BoardPop.css"

const BoardPop = ({ setSelectedMenu }) => {
  const { boardList } = useContext(BoardContext);

  // 좋아요 수 1 이상인 게시글 중 좋아요 많은 순 5개 추출
  const popularBoards = boardList
    .filter((item) => item.likeCount >= 1)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);

  return (
    <div className="board-pop-container">
      <h3 className='board-pop-title'>💗 인기 게시글 TOP 5</h3>
      <div className="board-list">
        {popularBoards.map((item) => (
          <Link
            to={`/board/${item.id}`}
            key={item.id}
            className="link-item"
            onClick={() => setSelectedMenu('/detail')}
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
    </div>
  );
};

export default BoardPop;
