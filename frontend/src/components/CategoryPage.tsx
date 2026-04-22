import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenuItems } from "../api";
import { MenuItem } from "../types";
import DishCard from "./DishCard";

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categoryNames: Record<string, string> = {
    pizza: "Пиццы",
    soup: "Супы",
    salad: "Салаты",
    drinks: "Напитки",
    desserts: "Десерты",
  };

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getMenuItems(categoryId);
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, [categoryId]);

  const handleOrder = (dish: MenuItem) => {
    setSelectedDish(dish);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="category-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate("/#menu")}>
          ← Назад к меню
        </button>
        <h1 className="category-title">
          {categoryNames[categoryId || ""]} <span>Меню</span>
        </h1>
        <div className="dishes-grid">
          {items.map((item) => (
            <DishCard
              key={item.id}
              dish={item}
              onOrder={() => handleOrder(item)}
            />
          ))}
        </div>
      </div>

      {showModal && selectedDish && (
        <div
          className="order-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="order-modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <img src={selectedDish.image} alt={selectedDish.name} />
            <h3>{selectedDish.name}</h3>
            <p>{selectedDish.description}</p>
            <div className="order-price">{selectedDish.price} ₽</div>
            <button
              className="order-submit-btn"
              onClick={() => {
                setShowModal(false);
                navigate("/#reservation");
              }}
            >
              Забронировать столик
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
