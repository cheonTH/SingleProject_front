import React, { useEffect, useState } from "react";
import "./PlaceDetail.css";
import axios from "axios";

const PlaceDetailModal = ({ place, onClose }) => {
  const [reviewInput, setReviewInput] = useState("");
  const [reviewList, setReviewList] = useState([]);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [nickName, setNickName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [myReview, setMyReview] = useState(null);
  const reviewsPerPage = 5;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedNickName = localStorage.getItem("nickName");

    if (storedToken) setToken(storedToken);
    if (storedUserId) setUserId(storedUserId);
    if (storedNickName) setNickName(storedNickName);
  }, []);

  useEffect(() => {
    if (!place) return;
    axios
      .get(`http://localhost:10000/api/reviews/${place.id}`)
      .then((res) => {
        setReviewList(res.data);
        setCurrentPage(1);
        if (userId) {
          const mine = res.data.find((r) => r.userId === userId);
          setMyReview(mine || null);
        }
      })
      .catch((err) => console.error("리뷰 불러오기 실패", err));
  }, [place, userId]);

  const handleSubmit = async () => {
    if (!reviewInput.trim()) return;
    if (!userId || !token) {
      alert("로그인 후에 리뷰를 작성할 수 있습니다.");
      return;
    }
    if (myReview) {
      alert("이미 이 장소에 리뷰를 작성하셨습니다.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:10000/api/reviews",
        {
          placeId: place.id,
          placeName: place.place_name,
          review: reviewInput,
          userId,
          nickName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviewInput("");
      const updated = await axios.get(`http://localhost:10000/api/reviews/${place.id}`);
      setReviewList(updated.data);
      setCurrentPage(1);
      const mine = updated.data.find((r) => r.userId === userId);
      setMyReview(mine || null);
    } catch (err) {
      console.error("리뷰 등록 실패", err);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:10000/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updated = await axios.get(`http://localhost:10000/api/reviews/${place.id}`);
      setReviewList(updated.data);
      if (reviewId === myReview?.id) {
        setMyReview(null);
      }
      alert('리뷰가 삭제되었습니다!')
    } catch (err) {
      console.error("리뷰 삭제 실패", err);
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(reviewList.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviewList.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!place) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{place.place_name}</h2>
        <p>
          <strong>주소:</strong> {place.road_address_name || place.address_name}
        </p>
        <p>
          <strong>전화번호:</strong> {place.phone || "없음"}
        </p>
        <p>
          <strong>카테고리:</strong> {place.category_name}
        </p>
        <a href={place.place_url} target="_blank" rel="noreferrer">
          📍 카카오맵에서 보기
        </a>

        <hr />
        <h4>한줄 리뷰</h4>

        {/* 내 리뷰 상단 표시 */}
        {myReview && (
          <div style={{ backgroundColor: "#f7f7f7", padding: "10px", borderRadius: "6px", marginBottom: "10px" }}>
            <strong>내 리뷰</strong>: 📝 {myReview.review}
            <button
              onClick={() => handleDelete(myReview.id)}
              style={{
                marginLeft: "10px",
                color: "red",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              삭제
            </button>
          </div>
        )}

        {/* 리뷰 작성 입력창 */}
        {userId && !myReview ? (
          <>
            <input
              type="text"
              placeholder="리뷰를 입력하세요"
              className="review-input"
              value={reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <button onClick={handleSubmit}>작성</button>
          </>
        ) : !userId ? (
          <p style={{ color: "gray" }}>리뷰 작성은 로그인 후 가능합니다.</p>
        ) : null}

        {/* 전체 리뷰 목록 (내 리뷰 포함) */}
        <ul style={{ marginTop: "10px" }}>
          {currentReviews.length === 0 ? (
            <li>리뷰가 없습니다.</li>
          ) : (
            currentReviews.map((r, i) => (
              <li key={i} style={{ marginBottom: "5px" }}>
                <strong>{r.nickName}</strong>: 📝 {r.review}
                {token && r.userId === userId && (
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      marginLeft: "10px",
                      color: "red",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                )}
              </li>
            ))
          )}
        </ul>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              ◀ 이전
            </button>
            <span style={{ margin: "0 10px" }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음 ▶
            </button>
          </div>
        )}

        <button onClick={onClose} style={{ marginTop: "15px" }}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default PlaceDetailModal;
