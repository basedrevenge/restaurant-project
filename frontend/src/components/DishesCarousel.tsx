import React, { useState, useEffect } from "react";

interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface CategoryDishes {
  id: string;
  title: string;
  dishes: Dish[];
  image: string;
}

const DishesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Данные по категориям блюд
  const categories: CategoryDishes[] = [
    {
      id: "pizza",
      title: "Пиццы",
      image: "/pictures/pizza3.jpg",
      dishes: [
        {
          id: 1,
          name: "Пицца 'Пармезан'",
          price: 399,
          image: "/pictures/parmezan.jpg",
        },
        {
          id: 2,
          name: "Пицца 'Четыре сыра'",
          price: 449,
          image: "/pictures/4cheese.jpg",
        },
        {
          id: 3,
          name: "Пицца 'Барбекю'",
          price: 399,
          image: "/pictures/barbeku.jpg",
        },
      ],
    },
    {
      id: "soup",
      title: "Супы",
      image: "/pictures/soup1.png",
      dishes: [
        {
          id: 4,
          name: "Суп 'Солянка''",
          price: 350,
          image: "/pictures/solyanka.jpg",
        },
        {
          id: 5,
          name: "Томатный суп",
          price: 320,
          image: "/pictures/tomato.jpg",
        },
        {
          id: 6,
          name: "Грибной крем-суп",
          price: 290,
          image: "/pictures/mushroom.jpg",
        },
      ],
    },
    {
      id: "salad",
      title: "Салаты",
      image: "/pictures/salad.webp",
      dishes: [
        {
          id: 7,
          name: "Цезарь с курицей",
          price: 380,
          image: "/pictures/ceasar.webp",
        },
        {
          id: 8,
          name: "Греческий салат",
          price: 350,
          image: "/pictures/greek.webp",
        },
        {
          id: 9,
          name: "Оливье с языком",
          price: 420,
          image: "/pictures/oliva.webp",
        },
      ],
    },
    {
      id: "drinks",
      title: "Напитки",
      image: "/pictures/zxc.webp",
      dishes: [
        {
          id: 10,
          name: "Лимонад домашний",
          price: 250,
          image: "/pictures/lemonad.jpg",
        },
        {
          id: 11,
          name: "Капучино",
          price: 220,
          image: "/pictures/capoo.jpg",
        },
        {
          id: 12,
          name: "Морс Клюквеный",
          price: 180,
          image: "/pictures/mors.jpg",
        },
      ],
    },
    {
      id: "desserts",
      title: "Десерты",
      image: "/pictures/qwe.webp",
      dishes: [
        {
          id: 13,
          name: "Тирамису",
          price: 380,
          image: "/pictures/tiramisu.jpg",
        },
        {
          id: 14,
          name: "Чизкейк",
          price: 350,
          image: "/pictures/kake.jpg",
        },
        { id: 15, name: "Медовик", price: 320, image: "/pictures/medovik.jpg" },
      ],
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = () => {
    if (currentIndex < categories.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 200);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 200);
    }
  };

  const currentCategory = categories[currentIndex];

  return (
    <div className="dishes-carousel">
      <div className="dishes-carousel-header">
        <h3 className="dishes-category-title">{currentCategory.title}</h3>
      </div>

      {/* На ПК - стрелки по бокам */}
      {!isMobile ? (
        <div className="dishes-carousel-wrapper">
          <button
            className="dishes-nav-btn prev"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            ‹
          </button>

          <div className="dishes-carousel-content">
            <div className="dishes-carousel-image">
              <img src={currentCategory.image} alt={currentCategory.title} />
            </div>
            <div className="dishes-carousel-items">
              {currentCategory.dishes.map((dish) => (
                <div key={dish.id} className="carousel-dish-item">
                  <img src={dish.image} alt={dish.name} />
                  <div className="carousel-dish-info">
                    <span className="carousel-dish-name">{dish.name}</span>
                    <span className="carousel-dish-price">{dish.price} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="dishes-nav-btn next"
            onClick={nextSlide}
            disabled={currentIndex === categories.length - 1}
          >
            ›
          </button>
        </div>
      ) : (
        // На мобилке - стрелки снизу
        <>
          <div className="dishes-carousel-content">
            <div className="dishes-carousel-image">
              <img src={currentCategory.image} alt={currentCategory.title} />
            </div>
            <div className="dishes-carousel-items">
              {currentCategory.dishes.map((dish) => (
                <div key={dish.id} className="carousel-dish-item">
                  <img src={dish.image} alt={dish.name} />
                  <div className="carousel-dish-info">
                    <span className="carousel-dish-name">{dish.name}</span>
                    <span className="carousel-dish-price">{dish.price} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dishes-carousel-mobile-nav">
            <button
              className="dishes-nav-btn prev"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
            <span className="dishes-counter">
              {currentIndex + 1} / {categories.length}
            </span>
            <button
              className="dishes-nav-btn next"
              onClick={nextSlide}
              disabled={currentIndex === categories.length - 1}
            >
              ›
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DishesCarousel;
