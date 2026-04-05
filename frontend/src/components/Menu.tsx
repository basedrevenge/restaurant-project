import React, { useEffect, useState, useRef } from 'react';
import { getMenu } from '../api';
import { MenuItem } from '../types';

const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMenu()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width <= 600) setItemsPerPage(1);
      else if (width <= 900) setItemsPerPage(2);
      else if (width <= 1200) setItemsPerPage(3);
      else setItemsPerPage(4);
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const nextSlide = () => {
    const maxIndex = Math.max(0, items.length - itemsPerPage);
    setCurrentIndex(prev => Math.min(prev + itemsPerPage, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - itemsPerPage, 0));
  };

  if (loading) return <div className="loading">Загрузка меню...</div>;

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage);

  return (
    <div className="menu" id="menu">
      <div className="container">
        <div className="menu-title">Наше меню</div>
        <div className="carousel-container">
          <button className="carousel-btn prev-btn" onClick={prevSlide}>‹</button>
          <div className="carousel-track-wrapper">
            <div className="carousel-track" ref={trackRef} style={{ transform: `translateX(-${currentIndex * (280 + 30)}px)`, display: 'flex', transition: 'transform 0.5s ease', gap: '30px' }}>
              {items.map((item) => (
                <div key={item.id} className="menu-item" style={{ flex: '0 0 250px', minWidth: '250px' }}>
                  <div className="menu-image">
                    <img src="/pictures/burger-i.jpg" className="menu-img" alt={item.title} />
                    <div className="price-420">{item.price} ₽</div>
                  </div>
                  <div className="menu-text">{item.title}</div>
                  <div className="menu-subtext">{item.desc || 'Вкусное блюдо'}</div>
                  <div className="menu-button">
                    <a href="#reservation" className="menu-btn">ЗАКАЗАТЬ</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="carousel-btn next-btn" onClick={nextSlide}>›</button>
        </div>
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div key={i} className={`dot ${i === currentPage ? 'active' : ''}`} onClick={() => setCurrentIndex(i * itemsPerPage)}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;