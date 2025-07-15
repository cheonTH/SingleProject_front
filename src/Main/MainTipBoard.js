import React, { useEffect, useState } from 'react';
import './MainTipBoard.css';
import { Link } from 'react-router-dom';
import BoardItem from '../Board/BoardItem';
import axios from 'axios';

const MainTipBoard = () => {
  const [tipPosts, setTipPosts] = useState([]);

  useEffect(() => {
    const fetchTipPosts = async () => {
      try {
        const res = await axios.get('http://localhost:10000/api/board');
        const tips = res.data
          .filter(item => item.category === 'tip')
          .slice(0, 3);
        setTipPosts(tips);
      } catch (err) {
        console.error('팁 게시글 불러오기 실패:', err);
      }
    };

    fetchTipPosts();
  }, []);

  return (
    <div className="main-tip-board-container">
      <h2 className='main-tip-title'>💡 혼자 살 때 꿀팁</h2>
      <div className="main-tip-board-list">
        {tipPosts.map((item) => (
          <Link to={`/board/${item.id}`} key={item.id} className="tip-link-item">
            <BoardItem
              category={item.category}
              title={item.title}
              author={item.nickName || '익명'}
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

export default MainTipBoard;
