import React, { useEffect, useState } from "react";
import AiChat from "./components/AiChat";

function Stars({ rating }) {
  const n = Number(rating);
  return (
    <span className="stars">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

export default function App() {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
    fetch(`${API}/summary`).then((r) => r.json()).then(setSummary);
    fetch(`${API}/reviews`).then((r) => r.json()).then(setReviews);
  }, []);

  return (
    <div className="page">

      {/* Product Card */}
      <div className="product-card">
        <img
          className="product-img"
          src="/product.png"
          alt="음식물 처리기"
        />
        <div className="product-info">
          <h1>쉘퍼 원터치형 건조분쇄 필터 음식물 처리기 가정용 4L</h1>
          <div className="product-price">129,000원</div>
          <div className="product-rating">
            <Stars rating={summary?.avgRating || 4} />
            {summary ? `${summary.avgRating}점 (${summary.total}개 리뷰)` : "로딩 중..."}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {summary && (
        <div className="summary-card">
          <h2>리뷰 요약</h2>
          <div className="rating-bars">
            <div className="bar-row">
              <span className="bar-label">긍정</span>
              <div className="bar-track">
                <div className="bar-fill-pos" style={{ width: `${summary.positive.percent}%` }} />
              </div>
              <span className="bar-pct">{summary.positive.percent}%</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">보통</span>
              <div className="bar-track">
                <div className="bar-fill-neu" style={{ width: `${summary.neutral.percent}%` }} />
              </div>
              <span className="bar-pct">{summary.neutral.percent}%</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">부정</span>
              <div className="bar-track">
                <div className="bar-fill-neg" style={{ width: `${summary.negative.percent}%` }} />
              </div>
              <span className="bar-pct">{summary.negative.percent}%</span>
            </div>
          </div>
          <div className="keywords">
            {summary.topKeywords.map((k) => (
              <span key={k.word} className="keyword-tag">
                {k.word} ({k.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="reviews-card">
        <h2>구매 후기 {reviews.length > 0 && `(${reviews.length})`}</h2>
        {reviews.map((r, i) => (
          <div key={i} className="review-item">
            <div className="review-header">
              <span className="review-author">{r.author}</span>
              <span className="review-date">{r.date}</span>
            </div>
            <div className="review-stars">
              <Stars rating={r.rating} /> {r.rating}점
            </div>
            {r.title && <div className="review-title">{r.title}</div>}
            <div className="review-content">{r.content}</div>
          </div>
        ))}
      </div>

      <AiChat />
    </div>
  );
}
