// BoardDetail.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardDetail.css';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const hideControlsTimer = useRef(null);

  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');
  const currentNickName = localStorage.getItem('nickname');

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`http://localhost:10000/api/board/${id}`);
        setBoard(res.data);
        setLikes(res.data.likeCount || 0);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:10000/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };

    fetchBoard();
    fetchComments();
  }, [id]);

  const handleMouseEnter = () => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
  };

  const handleMouseLeave = () => {
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleLike = async () => {
    if (!token) return alert('로그인이 필요합니다.');

    try {
      const res = await axios.post(`http://localhost:10000/api/board/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikes(res.data.likeCount);
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleDelete = async () => {
    if (!token || !window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:10000/api/board/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('삭제되었습니다.');
      navigate('/board');
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    if (!token) return alert('로그인이 필요합니다.');

    try {
      const res = await axios.post(`http://localhost:10000/api/comments`, {
        boardId: id,
        content: commentInput,
        nickName: currentNickName,
        userId: currentUserId,
        parentId: replyTo || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments([res.data, ...comments]);
      setCommentInput('');
      setReplyTo(null);
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:10000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const handleCommentEdit = async (commentId) => {
    try {
      const res = await axios.put(`http://localhost:10000/api/comments/${commentId}`, {
        content: editingContent,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.map((c) => (c.id === commentId ? res.data : c)));
      setEditingCommentId(null);
      setEditingContent('');
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  const renderComments = (parentId = null, level = 0) => {
    return comments
      .filter((c) => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} className={`comment-item ${parentId ? 'reply' : ''}`}>  
          <div><strong>{c.nickName}</strong></div>
          <div>
            {editingCommentId === c.id ? (
              <>
                <textarea value={editingContent} onChange={(e) => setEditingContent(e.target.value)} />
                <button onClick={() => handleCommentEdit(c.id)}>저장</button>
                <button onClick={() => setEditingCommentId(null)}>취소</button>
              </>
            ) : (
              <div>{c.content}</div>
            )}
          </div>
          <div className="comment-actions">
            <span>{c.writingTime}</span>
            {c.userId === currentUserId && (
              <>
                <button onClick={() => { setEditingCommentId(c.id); setEditingContent(c.content); }}>수정</button>
                <button onClick={() => handleCommentDelete(c.id)}>삭제</button>
              </>
            )}
            <button onClick={() => setReplyTo(c.id)}>답글</button>
          </div>

          {renderComments(c.id, level + 1)}
        </div>
      ));
  };

  const validImageUrls = Array.isArray(board?.imageUrls)
    ? board.imageUrls.filter((url) => typeof url === 'string' && url.startsWith('data:image/'))
    : [];

  if (loading) return <div>📄 게시글을 불러오는 중입니다...</div>;
  if (!board) return <div>❌ 게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="board-detail-container">
      <p className="board-category">{board.category}</p>
      <h2 className="board-detail-title">{board.title}</h2>

      <div className="board-detail-meta">
        <span>👤 {board.nickName}</span>
        <span>🕒 {board.writingTime}</span>
      </div>

      <hr />
      <div className="board-detail-content">{board.content}</div>

      {validImageUrls.length > 0 && (
        <div className="board-image-slider" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img src={validImageUrls[currentImageIndex]} alt={`img-${currentImageIndex}`} className="board-detail-image" />
          <button className={`arrow-btn left ${showControls ? 'visible' : 'hidden'}`} onClick={() => setCurrentImageIndex((prev) => prev - 1)} disabled={currentImageIndex === 0}>◀</button>
          <button className={`arrow-btn right ${showControls ? 'visible' : 'hidden'}`} onClick={() => setCurrentImageIndex((prev) => prev + 1)} disabled={currentImageIndex === validImageUrls.length - 1}>▶</button>
          <div className={`slider-count-overlay ${showControls ? 'visible' : 'hidden'}`}>{currentImageIndex + 1} / {validImageUrls.length}</div>
        </div>
      )}

      <div className="like-section">❤️ <button onClick={handleLike}>좋아요</button> {likes}개</div>

      <div className="comment-section">
        <h4>💬 댓글</h4>
        <textarea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder={replyTo ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
          rows={3}
        />
        <button onClick={handleCommentSubmit}>작성</button>
        <div className="comment-list">
          {renderComments()}
        </div>
        {comments.length > 5 && (
          <button onClick={() => setShowAllComments(!showAllComments)}>{showAllComments ? '접기' : '더보기'}</button>
        )}
      </div>

      <div className="detail-footer">
        <div className="footer-left">
          <button onClick={() => navigate('/board')}>← 목록으로</button>
        </div>
        {board.userId === currentUserId && (
          <div className="footer-right">
            <button onClick={() => navigate(`/board/${id}/edit`)}>✏️ 수정</button>
            <button onClick={handleDelete}>🗑 삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;
