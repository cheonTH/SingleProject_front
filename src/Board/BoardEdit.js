import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BoardWrite.css'; // 기존 CSS 재사용
import axios from 'axios';

const BoardEdit = ({ setSelectedMenu }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrls, setImageUrls] = useState([]);   // base64 이미지
  const [imageFiles, setImageFiles] = useState([]); // 원본 파일
  const [loading, setLoading] = useState(true);

  // ✅ 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:10000/api/board/${id}`);
        const post = res.data;
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category || '');
        setImageUrls(post.imageUrls || []);
        setLoading(false);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        alert('게시글을 불러오지 못했습니다.');
        navigate('/board');
      }
    };

    fetchPost();
  }, [id, navigate]);

  // ✅ 이미지 변경
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );
    setImageFiles(files);

    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const base64Images = (await Promise.all(base64Promises)).filter(Boolean);
    setImageUrls(base64Images);
  };

  // ✅ 이미지 제거
  const handleRemoveImage = (indexToRemove) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // ✅ 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const updatedData = {
      title,
      content,
      category,
      imageUrls,
      userId: localStorage.getItem('userId'),
      nickName: localStorage.getItem('nickname'),
      writingTime: new Date().toLocaleString('ko-KR'),
    };

    try {
      await axios.put(`http://localhost:10000/api/board/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('게시글이 수정되었습니다!');
      navigate(`/board/${id}`);
    } catch (err) {
      console.error('게시글 수정 실패:', err);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  const goToBack = () => {
    navigate(`/board/${id}`);
  };

  if (loading) return <div>게시글을 불러오는 중입니다...</div>;

  return (
    <div className="board-write-container">
      <h2>게시글 수정</h2>
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

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

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

        <button type="submit">수정 완료</button>
      </form>

      <button className="home-button" onClick={goToBack}>
        취소
      </button>
    </div>
  );
};

export default BoardEdit;
