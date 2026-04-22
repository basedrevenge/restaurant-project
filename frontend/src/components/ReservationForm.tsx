import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const ReservationForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    guests: 2,
    table_type: "MAIN",
    special_requests: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [lastReservation, setLastReservation] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    table_type: "MAIN",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  const token = localStorage.getItem("access_token");

  // Загрузка данных пользователя из профиля
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !isGuestMode) {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/api/users/profile/",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setForm((prev) => ({
              ...prev,
              name: userData.first_name || userData.username || "",
              phone: userData.phone || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else if (isGuestMode) {
        // Очищаем форму в режиме гостя
        setForm((prev) => ({
          ...prev,
          name: "",
          phone: "",
        }));
      }
    };
    fetchUserData();
  }, [token, isGuestMode]);

  // Простая и надежная маска телефона
  const formatPhoneNumber = (value: string) => {
    // Удаляем все не-цифры
    let digits = value.replace(/\D/g, "");

    // Если начинается с 8, заменяем на 7
    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    // Ограничиваем 11 цифрами
    if (digits.length > 11) digits = digits.slice(0, 11);

    // Форматируем
    if (digits.length === 0) return "";
    if (digits.length === 1) return `+7`;
    if (digits.length <= 4) return `+7 ${digits.slice(1, 4)}`;
    if (digits.length <= 7)
      return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}`;
    if (digits.length <= 9)
      return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}`;
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Если пользователь пытается стереть +7, очищаем всё
    if (rawValue === "" || rawValue === "+") {
      setForm({ ...form, phone: "" });
      return;
    }
    const formatted = formatPhoneNumber(rawValue);
    setForm({ ...form, phone: formatted });
  };

  const getTodayDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setMonth(max.getMonth() + 3);
    return max.toISOString().slice(0, 16);
  };

  const containsBadWords = (text: string) => {
    const badWords = [
      "мат",
      "фигня",
      "плохо",
      "ужасно",
      "дерьмо",
      "хрен",
      "блин",
      "жопа",
      "тупой",
      "идиот",
    ];
    const lowerText = text.toLowerCase();
    return badWords.some((word) => lowerText.includes(word));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Проверка имени
    if (form.name.trim().length < 2) {
      setError("Введите корректное имя (минимум 2 символа)");
      setLoading(false);
      return;
    }

    // Проверка телефона
    let phoneDigits = form.phone.replace(/\D/g, "");
    // Если номер начинается с 8, заменяем на 7 для базы
    if (phoneDigits.startsWith("8")) {
      phoneDigits = "7" + phoneDigits.slice(1);
    }
    if (phoneDigits.length !== 11) {
      setError("Введите 11 цифр номера телефона в формате +7 XXX XXX-XX-XX");
      setLoading(false);
      return;
    }

    // Проверка даты
    if (!form.date) {
      setError("Выберите дату и время бронирования");
      setLoading(false);
      return;
    }

    const selectedDateTime = new Date(form.date);
    const now = new Date();

    if (selectedDateTime < now) {
      setError("Нельзя забронировать столик на прошедшую дату или время");
      setLoading(false);
      return;
    }

    if (form.guests < 1) {
      setError("Количество гостей должно быть не менее 1");
      setLoading(false);
      return;
    }

    if (form.guests > 10) {
      setError("Максимальное количество гостей - 10 человек");
      setLoading(false);
      return;
    }

    if (form.special_requests && containsBadWords(form.special_requests)) {
      setError(
        "Пожалуйста, используйте корректные выражения в особых пожеланиях",
      );
      setLoading(false);
      return;
    }

    const [datePart, timePart] = form.date.split("T");

    try {
      // Гостевая бронь - не отправляем Authorization header
      const headers: any = { "Content-Type": "application/json" };

      // Только если пользователь авторизован и НЕ в гостевом режиме - добавляем токен
      if (token && !isGuestMode) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("http://127.0.0.1:8000/api/reservations/", {
        method: "POST",
        headers,
        body: JSON.stringify({
          date: datePart,
          time: timePart + ":00",
          guests: form.guests,
          table_type: form.table_type,
          special_requests: form.special_requests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLastReservation({
          name: form.name,
          phone: form.phone,
          date: datePart,
          time: timePart,
          guests: form.guests,
          table_type: form.table_type,
        });
        setShowModal(true);
        // Очищаем форму, но в режиме пользователя оставляем данные
        if (!token || isGuestMode) {
          setForm({
            name: "",
            phone: "",
            date: "",
            guests: 2,
            table_type: "MAIN",
            special_requests: "",
          });
        } else {
          setForm((prev) => ({
            ...prev,
            date: "",
            special_requests: "",
          }));
        }
      } else {
        setError(data.error || data.detail || "Ошибка бронирования");
      }
    } catch (err: any) {
      console.error("Reservation error:", err);
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const switchToGuestMode = () => {
    setIsGuestMode(true);
    setForm({
      name: "",
      phone: "",
      date: "",
      guests: 2,
      table_type: "MAIN",
      special_requests: "",
    });
  };

  const switchToUserMode = () => {
    setIsGuestMode(false);
    // Перезагружаем данные пользователя
    if (token) {
      fetch("http://127.0.0.1:8000/api/users/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((userData) => {
          setUser(userData);
          setForm((prev) => ({
            ...prev,
            name: userData.first_name || userData.username || "",
            phone: userData.phone || "",
          }));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="reservation" id="reservation">
      <div className="container">
        <div className="reservation-wrapper">
          <h2 className="reservation-title">Забронировать столик</h2>
          <p className="reservation-subtitle">
            Заполните форму и мы свяжемся с вами для подтверждения
          </p>

          {/* Переключатель режимов */}
          {token && (
            <div className="booking-mode-switch">
              <button
                className={`mode-btn ${!isGuestMode ? "active" : ""}`}
                onClick={switchToUserMode}
              >
                🔐 Как {user?.first_name || user?.username || "пользователь"}
              </button>
              <button
                className={`mode-btn ${isGuestMode ? "active" : ""}`}
                onClick={switchToGuestMode}
              >
                👤 Как гость
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-row">
              <div className="form-group">
                <label>Ваше имя *</label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  minLength={2}
                />
              </div>

              <div className="form-group">
                <label>Телефон *</label>
                <input
                  type="tel"
                  placeholder="+7 XXX XXX-XX-XX"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  required
                />
                <small style={{ fontSize: "12px", color: "#666" }}>
                  Введите номер: +7 XXX XXX-XX-XX или просто цифры
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Дата и время *</label>
                <input
                  type="datetime-local"
                  value={form.date}
                  min={getTodayDateTime()}
                  max={getMaxDate()}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
                <small style={{ fontSize: "12px", color: "#666" }}>
                  Бронирование возможно на ближайшие 3 месяца
                </small>
              </div>

              <div className="form-group">
                <label>Количество гостей *</label>
                <input
                  type="number"
                  placeholder="Кол-во человек"
                  min="1"
                  max="10"
                  value={form.guests}
                  onChange={(e) =>
                    setForm({ ...form, guests: parseInt(e.target.value) || 1 })
                  }
                  required
                />
                <small style={{ fontSize: "12px", color: "#666" }}>
                  Максимум 10 гостей
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Тип столика</label>
                <select
                  value={form.table_type}
                  onChange={(e) =>
                    setForm({ ...form, table_type: e.target.value })
                  }
                >
                  <option value="MAIN">Основной зал</option>
                  <option value="VIP">VIP зал</option>
                  <option value="TERRACE">Терраса</option>
                  <option value="WINDOW">У окна</option>
                </select>
              </div>

              <div className="form-group">
                <label>Особые пожелания</label>
                <input
                  type="text"
                  placeholder="Например: отметить день рождения, нужно детское кресло"
                  value={form.special_requests}
                  onChange={(e) =>
                    setForm({ ...form, special_requests: e.target.value })
                  }
                  maxLength={200}
                />
                <small style={{ fontSize: "12px", color: "#666" }}>
                  Максимум 200 символов
                </small>
              </div>
            </div>

            {error && <div className="reservation-error">{error}</div>}

            <button
              type="submit"
              className="reservation-btn"
              disabled={loading}
            >
              {loading ? "Бронирование..." : "Забронировать столик"}
            </button>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        reservation={{
          name: lastReservation.name,
          phone: lastReservation.phone,
          date: lastReservation.date,
          time: lastReservation.time,
          guests: lastReservation.guests,
          table_type: lastReservation.table_type,
        }}
      />
    </div>
  );
};

export default ReservationForm;
