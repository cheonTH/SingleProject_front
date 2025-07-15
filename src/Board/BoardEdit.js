import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BoardWrite.css'; // 동일한 CSS 재사용
import dummyData from './boardDummy'; // 더미 데이터에서 게시글 찾기

const BoardEdit = ({ setSelectedMenu }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const originalPost = dummyData.find((item) => item.id === parseInt(id));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (originalPost) {
      setTitle(originalPost.title);
      setContent(originalPost.content);
      setCategory(originalPost.category || ''); // 카테고리도 불러오기
    }
  }, [originalPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('수정된 제목:', title);
    console.log('수정된 내용:', content);
    console.log('수정된 카테고리:', category);
    console.log('첨부파일:', file);
    alert('게시글이 수정되었습니다!');
    navigate(`/board/${id}`);
  };

  const goToBack = () => {
    navigate(`/board/${id}`);
  };

  if (!originalPost) return <div>❌ 게시글을 찾을 수 없습니다.</div>;

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
          <option value="자취 팁">자취 팁</option>
          <option value="자유게시판">자유게시판</option>
          <option value="자취 질문">자취 질문</option>
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
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">수정 완료</button>
      </form>
      <button className="home-button" onClick={goToBack}>
        취소
      </button>
    </div>
  );
};

export default BoardEdit;
