import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenuItems } from "../api";
import { MenuItem, Category } from "../types";

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([
    { id: "pizza", name: "Пиццы", image: "/pictures/pizza1.jpg", count: 0 },
    { id: "soup", name: "Супы", image: "/pictures/soup.jpg", count: 0 },
    {
      id: "salad",
      name: "Салаты",
      image: "/pictures/salad.jpg",
      count: 0,
    },
    {
      id: "drinks",
      name: "Напитки",
      image: "/pictures/drinks.jpg",
      count: 0,
    },
    {
      id: "desserts",
      name: "Десерты",
      image: "/pictures//desserts.jpg",
      count: 0,
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const items = await getMenuItems();
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        count: items.filter((item: MenuItem) => item.category === cat.id)
          .length,
      }));
      setCategories(updatedCategories);
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (currentIndex < categories.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 150);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 150);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  if (loading) return <div className="loading">Загрузка меню...</div>;

  return (
    <div className="menu" id="menu">
      <div className="container">
        <div className="menu-title">
          Наше <span>Меню</span>
        </div>

        {isMobile ? (
          <div className="mobile-categories">
            <button
              className="mobile-carousel-btn prev"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
            <div className="mobile-carousel-wrapper">
              <div
                className={`mobile-category-card ${isTransitioning ? "transitioning" : ""}`}
                onClick={() => handleCategoryClick(categories[currentIndex].id)}
              >
                <div className="category-image">
                  <img
                    src={categories[currentIndex].image}
                    alt={categories[currentIndex].name}
                  />
                </div>
                <div className="category-title">
                  {categories[currentIndex].name}
                </div>
                <div className="category-count">
                  {categories[currentIndex].count} блюд
                </div>
                <div className="category-button">
                  <span className="category-btn">ВЫБРАТЬ →</span>
                </div>
              </div>
            </div>
            <button
              className="mobile-carousel-btn next"
              onClick={nextSlide}
              disabled={currentIndex === categories.length - 1}
            >
              ›
            </button>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-title">{category.name}</div>
                <div className="category-count">{category.count} блюд</div>
                <div className="category-button">
                  <span className="category-btn">ВЫБРАТЬ →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
