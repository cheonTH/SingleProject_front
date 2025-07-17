import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardDetail.css';
import BoardContext from './context/BoardContext';
import { API_BASE_URL } from '../api/AxiosApi';

const BoardDetail = ({ setSelectedMenu, isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBoardLikeCount } = useContext(BoardContext);

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [popupMessage, setPopupMessage] = useState('')

  const hideControlsTimer = useRef(null);

  const token = sessionStorage.getItem('token');
  const currentUserId = sessionStorage.getItem('userId');
  const currentNickName = sessionStorage.getItem('nickname');

  const formatToKoreanTime = (utcString) => {
    const date = new Date(utcString);
    return date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/board/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: currentUserId,
          },
        });
        setBoard(res.data);
        setLikes(res.data.likeCount || 0);
        setLiked(res.data.liked || false);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };

    fetchBoard();
    fetchComments();
  }, [id]);

  const flattenComments = () => {
    const result = [];

    const traverse = (parentId = null, level = 0) => {
      const children = comments
        .filter((c) => c.parentId === parentId)
        .sort((a, b) => a.id - b.id);

      for (let child of children) {
        result.push({ ...child, level });
        traverse(child.id, level + 1);
      }
    };

    traverse();
    return result;
  };

  const renderVisibleComments = () => {
    const flattened = flattenComments();
    const visible = showAllComments ? flattened : flattened.slice(0, 5);

    return visible.map((c) => (
      <div key={c.id} className={`comment-item ${c.level > 0 ? 'reply' : ''}`}>
        <div className="comment-header">
          <span>{c.nickName}</span>
          <span>{c.createdTime}</span>
        </div>
        <div className="comment-content">
          {editingCommentId === c.id ? (
            <>
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <div className="reply-buttons">
                <button onClick={() => handleCommentEdit(c.id)}>저장</button>
                <button onClick={() => setEditingCommentId(null)}>취소</button>
              </div>
            </>
          ) : (
            <div>{c.content}</div>
          )}
        </div>
        <div className="comment-actions">
          <button onClick={() => setReplyTo(c.id)}>답글</button>
          {c.userId === currentUserId && (
            <>
              <button
                onClick={() => {
                  setEditingCommentId(c.id);
                  setEditingContent(c.content);
                }}
              >
                수정
              </button>
              <button onClick={() => handleCommentDelete(c.id)}>삭제</button>
            </>
          )}
        </div>
        {replyTo === c.id && (
          <div className="reply-input">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="답글을 입력하세요..."
              rows={3}
            />
            <div className="reply-buttons">
              <button onClick={handleCommentSubmit}>작성</button>
              <button onClick={() => setReplyTo(null)}>취소</button>
            </div>
          </div>
        )}
      </div>
    ));
  };

  const handleLike = async () => {
    if (!token || !currentUserId) {
      setPopupMessage('notLogin')
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false); // 2초 후 메시지 숨기기
        setPopupMessage('')
      }, 1000);
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/board/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: currentUserId,
          },
        }
      );

      const { likeCount, liked } = res.data;
      setLikes(likeCount);
      setLiked(liked);
      updateBoardLikeCount(Number(id), likeCount, liked);
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleDelete = async () => {
    if (!token || !window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/board/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPopupMessage('delete')
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false); // 2초 후 메시지 숨기기
        navigate('/board');
        setSelectedMenu('/board')
        setPopupMessage('')
      }, 1000);
      
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    if (!token) {
      setPopupMessage('notLogin')
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false); // 2초 후 메시지 숨기기
        setPopupMessage('')
      }, 1000);
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/comments`,
        {
          boardId: id,
          content: commentInput,
          nickName: currentNickName,
          userId: currentUserId,
          parentId: replyTo || null,
          createdTime: new Date().toLocaleString('ko-KR'),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments([res.data, ...comments]);
      setCommentInput('');
      setReplyTo(null);
      setBoard(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const handleCommentEdit = async (commentId) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/comments/${commentId}`,
        {
          content: editingContent,
          updatedTime: new Date().toLocaleString('ko-KR'),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(comments.map((c) => (c.id === commentId ? res.data : c)));
      setEditingCommentId(null);
      setEditingContent('');
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
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
        <span>🕒 {formatToKoreanTime(board.writingTime)}</span>
      </div>
      <hr />
      <div className="board-detail-content">{board.content}</div>

      {validImageUrls.length > 0 && (
        <div
          className="board-image-slider"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => {
            hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
          }}
        >
          <img
            src={validImageUrls[currentImageIndex]}
            alt={`img-${currentImageIndex}`}
            className="board-detail-image"
          />
          {showControls && (
            <>
              <button
                className="arrow-btn left"
                onClick={() => setCurrentImageIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentImageIndex === 0}
              >◀</button>
              <button
                className="arrow-btn right"
                onClick={() => setCurrentImageIndex((prev) => Math.min(prev + 1, validImageUrls.length - 1))}
                disabled={currentImageIndex === validImageUrls.length - 1}
              >▶</button>
              <div className="slider-count-overlay">
                {currentImageIndex + 1} / {validImageUrls.length}
              </div>
            </>
          )}
        </div>
      )}

      <div className="like-section">
        <button onClick={handleLike}>{liked ? '💗' : '🤍'}</button> {likes}
      </div>

      <div className="comment-section">
        <h4>💬 댓글 {comments.length}</h4>
        <textarea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder={replyTo ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
          rows={3}
        />
        <button onClick={handleCommentSubmit}>작성</button>
        <div className="comment-list">{renderVisibleComments()}</div>
        {flattenComments().length > 5 && (
          <button onClick={() => setShowAllComments(!showAllComments)}>
            {showAllComments ? '접기 ▲' : '댓글 더보기 ▼'}
          </button>
        )}
      </div>

      <div className="detail-footer">
        <div className="footer-left">
          <button
            onClick={() => {
              navigate('/board');
              setSelectedMenu('/board');
            }}
          >← 목록으로</button>
        </div>
        {(board.userId === currentUserId || isAdmin) && (
          <div className="footer-right">
            <button onClick={() => navigate(`/board/${id}/edit`)} className="edit-btn">✏️ 수정</button>
            <button onClick={handleDelete} className="delete-btn">🗑 삭제</button>
          </div>
        )}
      </div>

      {showSuccessMessage && (
        <div className="toast-popup">
          {popupMessage === 'delete' &&
            <>
              <span className="icon">🗑</span>
              <span className="text">삭제가 완료되었습니다!</span>
            </>
          }
          {popupMessage === 'notLogin' &&
            <>
              <span className="icon">❌</span>
              <span className="text">로그인이 필요합니다!</span>
            </>
          }
        </div>
      )}
    </div>
  );
};

export default BoardDetail;
