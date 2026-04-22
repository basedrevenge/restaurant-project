import React from "react";
import { MenuItem } from "../types";

interface DishCardProps {
  dish: MenuItem;
  onOrder: () => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onOrder }) => {
  const getCategoryName = (cat: string) => {
    const names: Record<string, string> = {
      pizza: "Пицца",
      soup: "Суп",
      salad: "Салат",
      drinks: "Напиток",
      desserts: "Десерт",
    };
    return names[cat] || "";
  };

  return (
    <div className="dish-card">
      <div
        className="dish-image"
        data-category={getCategoryName(dish.category)}
      >
        <img src={dish.image} alt={dish.name} />
      </div>
      <div className="dish-info">
        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-description">{dish.description}</p>
        <div className="dish-footer">
          <span className="dish-price">{dish.price} ₽</span>
          <button className="dish-order-btn" onClick={onOrder}>
            ЗАКАЗАТЬ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
