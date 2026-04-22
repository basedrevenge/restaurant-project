import React, { useState, useEffect } from 'react';

const chefs = [
  { id: 1, src: '/pictures/povar1.jpg', name: 'Шеф-повар Александр' },
  { id: 2, src: '/pictures/i (1).webp', name: 'Су-шеф Анатолий' },
  { id: 3, src: '/pictures/povar2.jpg', name: 'Повар Дмитрий' },
];

const ChefCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chefs.length);
    }, 3000); // Меняется каждые 3 секунды

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chef-carousel">
      <div className="chef-carousel-container">
        <img src={chefs[currentIndex].src} alt={chefs[currentIndex].name} />
        <p className="chef-name">{chefs[currentIndex].name}</p>
      </div>
      <div className="chef-dots">
        {chefs.map((_, index) => (
          <span
            key={index}
            className={`chef-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChefCarousel;