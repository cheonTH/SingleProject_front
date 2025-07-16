import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardWrite.css';
import axios from 'axios';
import BoardContext from './context/BoardContext';
import { API_BASE_URL } from '../api/AxiosApi';

const BoardWrite = ({ selectedMenu, setSelectedMenu }) => {
  const navigate = useNavigate();
  const { fetchBoards } = useContext(BoardContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState([]);   // base64 변환된 이미지
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState('');

  // 이미지 리사이징 함수
  const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 비율 유지하며 크기 조절
        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = width * (maxHeight / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // jpeg 포맷으로 압축해서 base64 반환
        const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(resizedDataUrl);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );

    try {
      // 각 파일 리사이징 후 base64로 변환
      const base64Promises = files.map((file) => resizeImage(file));
      const base64Images = (await Promise.all(base64Promises)).filter(Boolean);

      setImageUrls(base64Images);
    } catch (error) {
      console.error('이미지 리사이징 실패:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const data = {
      title,
      content,
      category,
      userId: sessionStorage.getItem('userId') || 'guest',
      nickName: sessionStorage.getItem('nickname') || '익명',
      writingTime: new Date().toISOString(),
      imageUrls: imageUrls, // base64 이미지 전송
      likeCount: 0,
      isLiked: false,
      commentCount: 0,
      isSaved: false
    };

    try {
      await axios.post(`${API_BASE_URL}/api/board`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setError('no'); // 성공 상태로 세팅

      setShowSuccessMessage(true); // 메시지 보여주기
      setTimeout(() => {
        setShowSuccessMessage(false); // 2초 후 메시지 숨기기
        fetchBoards();
        navigate('/board');
        setSelectedMenu('/board');
      }, 1000);
    } catch (err) {
      console.error('게시글 등록 실패:', err);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setError('error'); // 성공 상태로 세팅
        setShowSuccessMessage(false); // 2초 후 메시지 숨기기
      }, 1000);
    }
  };

  const goToBoard = () => {
    navigate('/board');
    setSelectedMenu('/board');
  };

  return (
    <div className="board-write-container">
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit} className="board-write-form">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">카테고리 선택</option>
          <option value="tip">자취 팁</option>
          <option value="자유">자유게시판</option>
          <option value="질문">자취 질문</option>
        </select>

        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* 파일 선택 (다중 선택 가능) */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        {/* 이미지 미리보기 */}
        <div className="preview-images">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="image-preview-wrapper">
              <img src={url} alt={`preview-${idx}`} />
              <button
                type="button"
                className="remove-image-button"
                onClick={() => handleRemoveImage(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="submit">작성 완료</button>
      </form>

      <button className="home-button" onClick={goToBoard}>
        게시판으로 이동
      </button>

      {showSuccessMessage && (
        <div className="toast-popup">
          {error === 'error' ? (
            <>
              <span className="icon">❌</span>
              <span className="text">게시글 등록 실패!</span>
            </>
          ) : (
            <>
              <span className="icon">📝</span>
          <span className="text">게시글 등록 성공!</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardWrite;
