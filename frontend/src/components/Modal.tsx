import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    table_type: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, reservation }) => {
  // Блокируем скролл body при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTableTypeText = (type: string) => {
    switch (type) {
      case "VIP":
        return "VIP зал";
      case "TERRACE":
        return "Терраса";
      case "WINDOW":
        return "У окна";
      default:
        return "Основной зал";
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modern-modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modern-modal-icon">
          <div className="checkmark">✓</div>
        </div>

        <h3 className="modern-modal-title">Бронирование подтверждено!</h3>

        <p className="modern-modal-greeting">
          Уважаемый(ая) <strong>{reservation.name || "гость"}</strong>
        </p>

        <div className="modern-modal-details">
          <div className="detail-row">
            <span className="detail-icon">📅</span>
            <span className="detail-label">Дата</span>
            <span className="detail-value">{reservation.date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon">⏰</span>
            <span className="detail-label">Время</span>
            <span className="detail-value">{reservation.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon">👥</span>
            <span className="detail-label">Гостей</span>
            <span className="detail-value">{reservation.guests}</span>
          </div>
          <div className="detail-row">
            <span className="detail-icon">📍</span>
            <span className="detail-label">Столик</span>
            <span className="detail-value">
              {getTableTypeText(reservation.table_type)}
            </span>
          </div>
          {reservation.phone && (
            <div className="detail-row">
              <span className="detail-icon">📞</span>
              <span className="detail-label">Телефон</span>
              <span className="detail-value">{reservation.phone}</span>
            </div>
          )}
        </div>

        <p className="modern-modal-note">
          Мы свяжемся с вами для подтверждения
        </p>

        <button className="modern-modal-btn" onClick={onClose}>
          Отлично
        </button>
      </div>
    </div>
  );

  // Используем Portal для рендера в body, а не внутри ReservationForm
  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
