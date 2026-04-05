import React, { useEffect } from "react";
import Menu from "./components/Menu";
import ReservationForm from "./components/ReservationForm";

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".fade-up, .fade-left, .fade-right, .fade-scale")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  // ========================================
  const smoothScroll = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    window.scrollBy(0, -50); // маленькая поправка, чтобы не прилипало к самому верху
  }
};
  return (
    <div>
      {/* ШАПКА */}
      <div className="header">
        <div className="container">
          <div className="header-line">
            <div className="header-logo">
              <img src="/pictures/logo.png" alt="" />
            </div>
            <div className="nav">
              <a
                className="nav-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                ГЛАВНАЯ
              </a>
              <a
                className="nav-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScroll("menu");
                }}
              >
                МЕНЮ
              </a>
              <a
                className="nav-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                О НАС
              </a>
              <a
                className="nav-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScroll("reservation");
                }}
              >
                БРОНЬ
              </a>
            </div>
            <div className="btn">
              <a className="button" href="#reservation">
                ЗАКАЗ СТОЛИКА
              </a>
            </div>
          </div>
          <div className="header-down">
            <div className="header-title">
              Добро пожаловать в
              <div className="header-subtitle">Наш ресторан</div>
              <div className="header-suptitle">ГРАНД ПЛАЗА</div>
              <div className="header-bth">
                <a href="#menu" className="header-button">
                  Меню
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* КАРТОЧКИ */}
      <div className="cards">
        <div className="container">
          <div className="cards-holder">
            <div className="card">
              <div className="card-image">
                <img className="card-img" src="/pictures/card.png" alt="" />
              </div>
              <div className="card-title">
                Магическая <span>Атмосфера</span>
              </div>
              <div className="card-desc">
                Здесь каждый момент наполнен волшебством и уютом.
              </div>
            </div>
            <div className="card">
              <div className="card-image">
                <img className="card-img" src="/pictures/card.png" alt="" />
              </div>
              <div className="card-title">
                Витрина <span>Блюд</span>
              </div>
              <div className="card-desc">
                Вдохновляйтесь нашими вкусными моментами.
              </div>
            </div>
            <div className="card">
              <div className="card-image">
                <img className="card-img" src="/pictures/card.png" alt="" />
              </div>
              <div className="card-title">
                Сочная <span>Еда</span>
              </div>
              <div className="card-desc">
                Вкус, насыщенный ароматом и яркими впечатлениями.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ИСТОРИЯ */}
      <div className="history">
        <div className="container">
          <div className="history-holder">
            <div className="history-info">
              <div className="history-title">
                Наша <span>История</span>
              </div>
              <div className="history-desc">
                Мы начали свой путь с страсти к качественной еде и заботе о
                клиентах. За годы работы мы создали команду друзей и
                поклонников, для которых каждый визит — особый праздник.
              </div>
              <div className="history-number">
                <div className="number-item">
                  11 <span>Напитки</span>
                </div>
                <div className="number-item">
                  43 <span>Еда</span>
                </div>
                <div className="number-item">
                  15 <span>Закуски</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ЧЁРНЫЙ БЛОК */}
      <div className="black-block">
        <div className="container">
          <div className="block-holder">
            <div className="left">
              <div className="left-title">
                Отпразднуйте в одном из самых лучших ресторанов.
              </div>
              <div className="left-text">
                Пусть вечер запомнится ярко и тепло.
              </div>
            </div>
            <div className="right">
              <div className="right-button">
                <a href="#reservation" className="right-btn">
                  ЗАКАЗ СТОЛИКА
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* НАШИ БЛЮДА (статичные) */}
      <div className="dishes">
        <div className="container">
          <div className="dishes-title">
            Наши <span>Блюда</span>
          </div>
          <div className="burgers">
            <div className="burgers-image">
              <img src="/pictures/pizza.jpg" className="pizza" alt="" />
            </div>
            <div className="burgers-items">
              <div className="burger-item">
                <img src="/pictures/burger.jpg" alt="" />
                <div className="burger-text">
                  Пицца "Пармезан" -------------- 399 ₽
                </div>
              </div>
              <div className="burger-item">
                <img src="/pictures/burger.jpg" alt="" />
                <div className="burger-text">
                  Пицца "Четыре сыра" -------------- 449 ₽
                </div>
              </div>
              <div className="burger-item">
                <img src="/pictures/burger.jpg" alt="" />
                <div className="burger-text">
                  Пицца "Барбекю" -------------- 399 ₽
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU (React-карусель) */}

      <div id="menu">
        <Menu />
      </div>

      {/* ГАЛЕРЕЯ */}
      <div className="galery">
        <div className="container">
          <div className="galery-title">
            Галерея <span>Блюд</span>
          </div>
          <div className="galery-content">
            <div className="galery-left">
              <div className="galery-up">
                <img className="img-gal high" src="/pictures/10.jpg" alt="" />
              </div>
              <div className="galery-down">
                <img className="img-gal" src="/pictures/20.jpg" alt="" />
                <img className="img-gal" src="/pictures/30.jpg" alt="" />
              </div>
            </div>
            <div className="galery-right">
              <div className="galery-up">
                <img className="img-gal" src="/pictures/20.jpg" alt="" />
                <img className="img-gal" src="/pictures/30.jpg" alt="" />
              </div>
              <div className="galery-down">
                <img className="img-gal high" src="/pictures/10.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ПОВАРА */}
      <div className="cook">
        <div className="container">
          <div className="cook-title">
            Наши <span>Повара</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              flexWrap: "wrap",
            }}
          >
            <img
              src="/pictures/povar1.jpg"
              alt="Повар 1"
              style={{
                width: "400px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <img
              src="/pictures/i (1).webp"
              alt="Повар 2"
              style={{
                width: "400px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <img
              src="/pictures/povar2.jpg"
              alt="Повар 3"
              style={{
                width: "400px",
                height: "400px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      </div>

      {/* ФОРМА БРОНИРОВАНИЯ */}
      <div id="reservation">
        <ReservationForm />
      </div>

      {/* ПОДВАЛ */}
      <div className="footer">Copyright 2026</div>
    </div>
  );
}

export default App;
