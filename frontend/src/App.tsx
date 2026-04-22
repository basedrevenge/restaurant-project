import React, { useEffect, useRef, useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Menu from "./components/Menu";
import ReservationForm from "./components/ReservationForm";
import ChefCarousel from "./components/ChefCarousel";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./components/CategoryPage";
import AboutPage from "./pages/AboutPage";
import DishesCarousel from "./components/DishesCarousel";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isProfilePage = location.pathname === "/profile";

  const lastScrollPosition = useRef(0);
  const pendingSection = useRef<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token"),
  );
  const navigate = useNavigate();

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Функция для получения высоты хедера
  const getHeaderHeight = (): number => {
    const header = document.querySelector(".header") as HTMLElement | null;
    return header?.offsetHeight ?? 85;
  };

  // Сохраняем позицию скролла при уходе с главной
  useEffect(() => {
    if (isHomePage) {
      if (pendingSection.current) {
        setTimeout(() => {
          const element = document.getElementById(pendingSection.current!);
          if (element) {
            const headerHeight = getHeaderHeight();
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.scrollY - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
          pendingSection.current = null;
        }, 600);
      } else {
        window.scrollTo({
          top: lastScrollPosition.current,
          behavior: "instant",
        });
      }
    } else {
      lastScrollPosition.current = window.scrollY;
    }
  }, [isHomePage]);

  useEffect(() => {
    const burgerIcon = document.querySelector(".burger-icon");
    const burgerSlide = document.querySelector(".burger-slide");
    const overlay = document.querySelector(".burger-overlay");

    const openMenu = () => {
      burgerIcon?.classList.toggle("open");
      burgerSlide?.classList.toggle("open");
      overlay?.classList.toggle("open");
      document.body.style.overflow = burgerSlide?.classList.contains("open")
        ? "hidden"
        : "";
    };

    const closeMenu = () => {
      burgerIcon?.classList.remove("open");
      burgerSlide?.classList.remove("open");
      overlay?.classList.remove("open");
      document.body.style.overflow = "";
    };

    burgerIcon?.addEventListener("click", openMenu);
    overlay?.addEventListener("click", closeMenu);

    return () => {
      burgerIcon?.removeEventListener("click", openMenu);
      overlay?.removeEventListener("click", closeMenu);
    };
  }, []);

  // Эффект для анимации появления элементов при скролле (только на главной)
  useEffect(() => {
    if (!isHomePage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("active")
          ) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".fade-up, .fade-left, .fade-right, .fade-scale")
      .forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          el.classList.add("active");
        } else {
          observer.observe(el);
        }
      });

    return () => observer.disconnect();
  }, [isHomePage]);

  // Плавный скролл к секциям с учетом фиксированного хедера
  const smoothScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = getHeaderHeight();
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Обработчик клика по навигации
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    sectionId?: string,
  ) => {
    e.preventDefault();

    if (path === "/profile") {
      navigate("/profile");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } else if (path === "/" && sectionId === "home") {
      if (!isHomePage) {
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (path === "/" && sectionId) {
      if (!isHomePage) {
        navigate(`/#${sectionId}`);
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const headerHeight = getHeaderHeight();
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.scrollY - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }, 600);
      } else {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const headerHeight = getHeaderHeight();
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.scrollY - headerHeight;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }, 300);
      }
    } else if (path === "/") {
      if (!isHomePage) {
        navigate("/");
      }
    } else if (path === "/about") {
      navigate("/about");
    } else {
      alert("Страница в разработке");
    }
  };

  // Эффект для плавной фиксации навигации при скролле
  useEffect(() => {
    const header = document.querySelector(".header");
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            header?.classList.add("scrolled");
          } else {
            header?.classList.remove("scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    if (window.scrollY > 50) {
      header?.classList.add("scrolled");
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Эффект для скролла к секции после загрузки страницы
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && isHomePage) {
      const sectionId = hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerHeight = getHeaderHeight();
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerHeight;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 300);
    }
  }, [isHomePage]);

  return (
    <div>
      {/* ШАПКА */}
      <div
        className={`header ${!isHomePage && !isProfilePage ? "minimal-header" : ""} ${isProfilePage ? "profile-header-mode" : ""}`}
      >
        <div className="header-overlay"></div>
        <div className="container">
          <div className="header-line">
            <div className="header-logo">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isHomePage) {
                    pendingSection.current = null;
                    navigate("/");
                    setTimeout(
                      () => window.scrollTo({ top: 0, behavior: "smooth" }),
                      100,
                    );
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <img src="/pictures/logo.png" alt="Grand Plaza" />
              </a>
            </div>
            <div className="nav">
              <a
                className="nav-item"
                href="/"
                onClick={(e) => handleNavClick(e, "/", "home")}
              >
                ГЛАВНАЯ
              </a>
              <a
                className="nav-item"
                href="/"
                onClick={(e) => handleNavClick(e, "/", "menu")}
              >
                МЕНЮ
              </a>
              <a
                className="nav-item"
                href="/about"
                onClick={(e) => handleNavClick(e, "/about")}
              >
                О НАС
              </a>
              <a
                className="nav-item"
                href="/profile"
                onClick={(e) => handleNavClick(e, "/profile")}
              >
                ЛИЧНЫЙ КАБИНЕТ
              </a>
              <a
                className="nav-item"
                href="/"
                onClick={(e) => handleNavClick(e, "/", "reservation")}
              >
                БРОНЬ
              </a>
            </div>
            <div className="header-actions">
              <div className="header-phone">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.352 21.4019C21.1467 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.945 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.17 18.85C8.7738 17.3147 6.72533 15.2662 5.19001 12.87C3.49927 10.2415 2.44809 7.27301 2.12001 4.18001C2.09506 3.90347 2.12811 3.6248 2.21689 3.36167C2.30567 3.09853 2.44845 2.85701 2.63597 2.6521C2.82349 2.44719 3.05174 2.28377 3.30601 2.17212C3.56028 2.06046 3.83516 2.00323 4.11301 2.00401H7.11301C7.59503 1.99916 8.06576 2.1471 8.45681 2.42457C8.84786 2.70205 9.13739 3.09339 9.28001 3.54801C9.48919 4.28993 9.78554 5.00647 10.163 6.68201C10.2572 7.07599 10.2488 7.48625 10.1388 7.87601C10.0287 8.26577 9.82091 8.62033 9.53601 8.90501L8.39101 10.05C9.9506 12.81 11.19 14.33 13.85 15.95L14.995 14.805C15.2797 14.5201 15.6342 14.3123 16.024 14.2022C16.4138 14.0922 16.824 14.0838 17.218 14.178C18.8935 14.5554 19.6101 14.8518 20.352 15.061C20.8066 15.2036 21.1979 15.4931 21.4754 15.8842C21.7529 16.2752 21.9008 16.746 21.896 17.228L21.896 17.228Z"
                    fill="currentColor"
                  />
                </svg>
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="btn">
                <a
                  className="button"
                  href="/"
                  onClick={(e) => handleNavClick(e, "/", "reservation")}
                >
                  ЗАКАЗ СТОЛИКА
                </a>
              </div>
            </div>
            <div className="burger-menu">
              <div
                className="burger-icon"
                onClick={() => {
                  document
                    .querySelector(".burger-slide")
                    ?.classList.toggle("disp");
                }}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          {isHomePage && (
            <div className="header-down">
              <div className="header-title animate-text">
                <span className="welcome-text">Добро пожаловать в</span>
                <div className="header-subtitle">Наш ресторан</div>
                <div className="header-suptitle">ГРАНД ПЛАЗА</div>
                <div className="header-bth">
                  <a
                    href="/"
                    className="header-button"
                    onClick={(e) => handleNavClick(e, "/", "menu")}
                  >
                    Смотреть меню →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="burger-overlay"></div>

      {/* Бургер-меню выпадашка */}
      <div className="burger-slide">
        <a
          className="nav-item"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (!isHomePage) {
              pendingSection.current = null;
              navigate("/");
              setTimeout(
                () => window.scrollTo({ top: 0, behavior: "smooth" }),
                100,
              );
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            document.querySelector(".burger-icon")?.classList.remove("open");
            document.querySelector(".burger-slide")?.classList.remove("open");
            document.querySelector(".burger-overlay")?.classList.remove("open");
            document.body.style.overflow = "";
          }}
        >
          ГЛАВНАЯ
        </a>
        <a
          className="nav-item"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (!isHomePage) {
              pendingSection.current = "menu";
              navigate("/");
            } else {
              smoothScroll("menu");
            }
            document.querySelector(".burger-icon")?.classList.remove("open");
            document.querySelector(".burger-slide")?.classList.remove("open");
            document.querySelector(".burger-overlay")?.classList.remove("open");
            document.body.style.overflow = "";
          }}
        >
          МЕНЮ
        </a>
        <a
          className="nav-item"
          href="/about"
          onClick={(e) => {
            e.preventDefault();
            navigate("/about");
            document.querySelector(".burger-icon")?.classList.remove("open");
            document.querySelector(".burger-slide")?.classList.remove("open");
            document.querySelector(".burger-overlay")?.classList.remove("open");
            document.body.style.overflow = "";
          }}
        >
          О НАС
        </a>
        <a
          className="nav-item"
          href="/profile"
          onClick={(e) => {
            e.preventDefault();
            navigate("/profile");
            document.querySelector(".burger-icon")?.classList.remove("open");
            document.querySelector(".burger-slide")?.classList.remove("open");
            document.querySelector(".burger-overlay")?.classList.remove("open");
            document.body.style.overflow = "";
          }}
        >
          ЛИЧНЫЙ КАБИНЕТ
        </a>
        <a
          className="nav-item"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (!isHomePage) {
              pendingSection.current = "reservation";
              navigate("/");
            } else {
              smoothScroll("reservation");
            }
            document.querySelector(".burger-icon")?.classList.remove("open");
            document.querySelector(".burger-slide")?.classList.remove("open");
            document.querySelector(".burger-overlay")?.classList.remove("open");
            document.body.style.overflow = "";
          }}
        >
          БРОНЬ
        </a>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="history" id="history">
                <div className="container">
                  <div className="history-info">
                    <div className="history-title fade-up">
                      Наша <span>История</span>
                    </div>
                    <div className="history-divider fade-scale">
                      <span className="divider-line"></span>
                      <span className="divider-icon">✦</span>
                      <span className="divider-line"></span>
                    </div>
                    <div className="history-desc fade-up delay-1">
                      Мы начали свой путь с маленькой уютной кухни и большой
                      любви к гостям. За 10 лет работы мы превратились в место,
                      куда приходят за особыми впечатлениями и изысканным
                      вкусом. Наша команда — это семья профессионалов, которые
                      каждый день дарят вам тепло и заботу. Здесь каждый гость
                      чувствует себя особенным, а каждое блюдо — маленьким
                      шедевром.
                    </div>
                    <div className="history-number">
                      <div className="number-item fade-scale delay-2">
                        8 <span>Лет работы</span>
                      </div>
                      <div className="number-item fade-scale delay-3">
                        1250 <span>Довольных гостей</span>
                      </div>
                      <div className="number-item fade-scale delay-4">
                        45 <span>Блюд в меню</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="black-block">
                <div className="container">
                  <div className="block-holder">
                    <div className="left">
                      <div className="left-title fade-right">
                        Отпразднуйте в одном из самых лучших ресторанов.
                      </div>
                      <div className="left-text fade-right delay-1">
                        Пусть вечер запомнится ярко и тепло.
                      </div>
                    </div>
                    <div className="right">
                      <div className="right-button fade-left">
                        <a
                          href="/"
                          className="right-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            smoothScroll("reservation");
                          }}
                        >
                          ЗАКАЗ СТОЛИКА
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dishes" id="dishes">
                <div className="container">
                  <div className="dishes-title fade-up">
                    Наши <span>Блюда</span>
                  </div>
                  <DishesCarousel />
                </div>
              </div>

              <div id="menu" className="menu">
                <Menu />
              </div>

              <div className="galery" id="galery">
                <div className="container">
                  <div className="galery-title fade-up">
                    Галерея <span>Блюд</span>
                  </div>
                  <div className="galery-grid">
                    <img
                      className="img-gal fade-scale"
                      src="/pictures/gal9.jpg"
                      alt=""
                    />
                    <img
                      className="img-gal fade-scale delay-1"
                      src="/pictures/gal2.jpg"
                      alt=""
                    />
                    <img
                      className="img-gal fade-scale delay-2"
                      src="/pictures/gal10.jpg"
                      alt=""
                    />
                    <img
                      className="img-gal fade-scale delay-3"
                      src="/pictures/gal4.jpg"
                      alt=""
                    />
                    <img
                      className="img-gal fade-scale delay-4"
                      src="/pictures/gal5.webp"
                      alt=""
                    />
                    <img
                      className="img-gal fade-scale delay-5"
                      src="/pictures/gal13.jpg"
                      alt=""
                    />
                    <img
                      className="img-gal fade-scale"
                      src="/pictures/gal11.jpg"
                      alt=""
                    />
                    <img
                      className="img-gal fade-scale delay-1"
                      src="/pictures/gal12.webp"
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div className="cook" id="cook">
                <div className="container">
                  <div className="cook-title fade-up">
                    Наши <span>Повара</span>
                  </div>
                  <div className="cook-content-pc">
                    <img
                      className="fade-scale"
                      src="/pictures/povar1.jpg"
                      alt="Повар 1"
                    />
                    <img
                      className="fade-scale delay-1"
                      src="/pictures/i (1).webp"
                      alt="Повар 2"
                    />
                    <img
                      className="fade-scale delay-2"
                      src="/pictures/povar2.jpg"
                      alt="Повар 3"
                    />
                  </div>
                  <div className="cook-content-mobile">
                    <ChefCarousel />
                  </div>
                </div>
              </div>

              <div id="reservation">
                <ReservationForm />
              </div>
            </>
          }
        />
        <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <div className="footer">Copyright 2026</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
