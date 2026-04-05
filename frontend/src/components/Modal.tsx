import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    name: string;
    phone: string;
    date: string;
    people: number;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, reservation }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          maxWidth: '450px',
          width: '90%',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #d67e35 0%, #b5621a 100%)',
            padding: '30px 20px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '70px' }}>✅</div>
          <h3 style={{ color: 'white', margin: '10px 0 0' }}>Бронь успешно создана!</h3>
        </div>

        <div style={{ padding: '30px' }}>
          <p style={{ textAlign: 'center', color: '#666' }}>Спасибо, что выбрали наш ресторан. Мы ждём вас!</p>

          <div
            style={{
              background: '#f9f9f9',
              borderRadius: '12px',
              padding: '15px',
              margin: '20px 0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ fontWeight: 600, color: '#d67e35' }}>Имя:</span>
              <span>{reservation.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ fontWeight: 600, color: '#d67e35' }}>Телефон:</span>
              <span>{reservation.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ fontWeight: 600, color: '#d67e35' }}>Дата:</span>
              <span>{formatDate(reservation.date)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontWeight: 600, color: '#d67e35' }}>Гостей:</span>
              <span>{reservation.people}</span>
            </div>
          </div>

          <p style={{ fontSize: '14px', textAlign: 'center', color: '#d67e35' }}>Менеджер свяжется с вами для подтверждения</p>
        </div>

        <div style={{ padding: '0 30px 30px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #d67e35 0%, #b5621a 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              fontSize: '16px',
              borderRadius: '50px',
              cursor: 'pointer',
            }}
          >
            Отлично!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;