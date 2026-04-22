import React, { useState, useEffect } from "react";
import "./AboutPage.css";

interface Review {
  id: number;
  user_name: string;
  rating: number;
  text: string;
  created_at: string;
}

const AboutPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });
  const [loading, setLoading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const photos = [
    "/pictures/rest1.webp",
    "/pictures/rest2.webp",
    "/pictures/rest3.jpg",
    "/pictures/rest4.jpg",
    "/pictures/rest5.jpg",
    "/pictures/rest6.jpg",
  ];

  // Скролл наверх при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Загрузка отзывов
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch("http://127.0.0.1:8000/api/reviews/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          author_name: newReview.name,
          rating: newReview.rating,
          text: newReview.text,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setNewReview({ name: "", rating: 5, text: "" });
        fetchReviews();
        alert("Спасибо за отзыв! Он будет опубликован после модерации.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="about-page">
      {/* Hero секция */}
      <div className="about-hero" id="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title">
              О <span>нас</span>
            </h1>
            <div className="about-quote">
              "Еда — это искусство. Атмосфера — магия"
            </div>
          </div>
        </div>
      </div>

      {/* Карусель фото */}
      <div className="about-carousel" id="about-carousel">
        <div className="container">
          <h2 className="section-title">
            Наша <span>галерея</span>
          </h2>
          <div className="carousel-wrapper">
            <button className="carousel-arrow prev" onClick={prevPhoto}>
              ‹
            </button>
            <div className="carousel-image">
              <img src={photos[currentPhotoIndex]} alt="Gallery" />
            </div>
            <button className="carousel-arrow next" onClick={nextPhoto}>
              ›
            </button>
          </div>
          <div className="carousel-dots">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className={`dot ${idx === currentPhotoIndex ? "active" : ""}`}
                onClick={() => setCurrentPhotoIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Команда */}
      <div className="about-team" id="about-team">
        <div className="container">
          <h2 className="section-title">
            Наша <span>команда</span>
          </h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-icon">👨‍🍳</div>
              <h3>Александр Кузнецов</h3>
              <p>Шеф-повар</p>
              <span>Стаж 15 лет, выпускник Cordon Bleu</span>
            </div>
            <div className="team-card">
              <div className="team-icon">🍷</div>
              <h3>Елена Соколова</h3>
              <p>Сомелье</p>
              <span>Лучший сомелье 2023</span>
            </div>
            <div className="team-card">
              <div className="team-icon">🍰</div>
              <h3>Мария Волкова</h3>
              <p>Кондитер</p>
              <span>Топ-5 кондитеров РФ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Отзывы */}
      <div className="about-reviews" id="about-reviews">
        <div className="container">
          <h2 className="section-title">
            Что говорят <span>гости</span>
          </h2>
          <div className="reviews-grid">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  — {review.user_name}
                  <span>
                    {new Date(review.created_at).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="reviews-buttons">
            <button className="btn-all-reviews">Все отзывы</button>
            <button
              className="btn-add-review"
              onClick={() => setShowModal(true)}
            >
              Оставить отзыв
            </button>
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className="about-contacts" id="about-contacts">
        <div className="container">
          <h2 className="section-title">
            Наши <span>контакты</span>
          </h2>
          <div className="contacts-grid">
            <div className="contact-item">📍 ул. Тверская, 15, Москва</div>
            <div className="contact-item">📞 +7 (999) 123-45-67</div>
            <div className="contact-item">✉️ info@grandplaza.ru</div>
            <div className="contact-item">🕐 Ежедневно: 12:00 - 00:00</div>
          </div>
        </div>
      </div>

      {/* Модальное окно для отзыва */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h3>Оставить отзыв</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Ваше имя</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  required
                  placeholder="Как к вам обращаться?"
                />
              </div>
              <div className="form-group">
                <label>Оценка</label>
                <select
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: Number(e.target.value),
                    })
                  }
                >
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★☆ (4)</option>
                  <option value={3}>★★★☆☆ (3)</option>
                  <option value={2}>★★☆☆☆ (2)</option>
                  <option value={1}>★☆☆☆☆ (1)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ваш отзыв</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) =>
                    setNewReview({ ...newReview, text: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Поделитесь впечатлениями..."
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Отправка..." : "Отправить отзыв"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
