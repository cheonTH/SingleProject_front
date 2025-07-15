import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardWrite.css';
import axios from 'axios';
import BoardContext from './context/BoardContext';

const BoardWrite = ({ selectedMenu, setSelectedMenu }) => {
  const navigate = useNavigate();
  const { fetchBoards } = useContext(BoardContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // 선택된 파일 저장
  const [imageUrls, setImageUrls] = useState([]);   // base64 변환된 이미지

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );
    setImageFiles(files);

    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // ✅ 반드시 전체 문자열 저장
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });


  const base64Images = (await Promise.all(base64Promises)).filter(Boolean);
    setImageUrls(base64Images);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const data = {
      title,
      content,
      category,
      userId: localStorage.getItem('userId') || 'guest',
      nickName: localStorage.getItem('nickname') || '익명',
      writingTime: new Date().toLocaleString('ko-KR'),
      imageUrls: imageUrls, // base64 이미지 전송
      likeCount: 0,
      isLiked: false,
      commentCount: 0,
      isSaved: false
    };

    try {
      await axios.post('http://localhost:10000/api/board', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('게시글이 등록되었습니다!');
      await fetchBoards();
      navigate('/board');
      setSelectedMenu('/board');
    } catch (err) {
      console.error('게시글 등록 실패:', err);
      alert('게시글 등록에 실패했습니다.');
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

        {/* ✅ 파일 선택 (다중 선택 가능) */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        {/* ✅ 미리보기 */}
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
    </div>
  );
};

export default BoardWrite;
