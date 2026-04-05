import React, { useState } from 'react';
import { createReservation } from '../api';
import Modal from './Modal';

const ReservationForm: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    people: 2,
  });
  const [showModal, setShowModal] = useState(false);
  const [lastReservation, setLastReservation] = useState({
    name: '',
    phone: '',
    date: '',
    people: 2,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createReservation(form);
      setLastReservation(form);
      setShowModal(true);
      setForm({ name: '', phone: '', date: '', people: 2 });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка бронирования');
    }
  };

  return (
    <div className="reservation" id="reservation">
      <h2>Забронировать столик</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Кол-во человек"
          value={form.people}
          onChange={(e) => setForm({ ...form, people: parseInt(e.target.value) })}
          required
        />
        <button type="submit">Забронировать</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        reservation={lastReservation}
      />
    </div>
  );
};

export default ReservationForm;