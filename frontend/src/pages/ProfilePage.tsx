import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

interface ProfilePageProps {
  onLogout?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // ========== ВСЕ useState (всегда в начале) ==========
  const [activeTab, setActiveTab] = useState("bookings");
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ========== ВСЕ useEffect (тоже в начале) ==========
  // Скролл наверх при загрузке
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Дополнительный скролл для надежности
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }, []);

  // ========== ФУНКЦИИ ==========
  const fetchData = async () => {
    if (!token) return;

    try {
      const userRes = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      const bookingsRes = await fetch(
        "http://127.0.0.1:8000/api/reservations/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      const favRes = await fetch("http://127.0.0.1:8000/api/favorites/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favData = await favRes.json();
      setFavorites(favData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
        }),
      });

      if (response.ok) {
        setEditing(false);
        fetchData();
        alert("Профиль обновлен!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Новые пароли не совпадают");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/change-password/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: passwordData.old_password,
            new_password: passwordData.new_password,
            confirm_password: passwordData.confirm_password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Пароль успешно изменен!");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({
            old_password: "",
            new_password: "",
            confirm_password: "",
          });
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(data.error || "Ошибка смены пароля");
      }
    } catch (error) {
      setPasswordError("Ошибка соединения с сервером");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/profile/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        alert("Аватарка обновлена!");
      } else {
        alert("Ошибка при загрузке аватарки");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Ошибка соединения с сервером");
    }
  };

  const handleNewBooking = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("reservation");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const getMemberYear = () => {
    if (user?.date_joined) {
      return new Date(user.date_joined).getFullYear();
    }
    return new Date().getFullYear();
  };

  // ========== ТОЛЬКО В КОНЦЕ return с условием ==========
  if (loading) {
    return <div className="profile-loading">Загрузка...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Шапка профиля */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={user?.avatar || "/pictures/avatar-default.jpg"}
              alt="Avatar"
            />
            <label className="avatar-overlay">
              <span>✎</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className="profile-info">
            <h1>
              {user?.first_name || user?.username} {user?.last_name || ""}
            </h1>
            <p className="profile-member">Участник с {getMemberYear()} года</p>
            <div className="profile-loyalty">
              <div
                className="loyalty-badge"
                data-tier={user?.loyalty_tier || "BRONZE"}
              >
                {user?.loyalty_tier === "GOLD"
                  ? "Золотой"
                  : user?.loyalty_tier === "SILVER"
                    ? "Серебряный"
                    : "Бронзовый"}{" "}
                уровень
              </div>
              <div className="loyalty-points">
                <span className="points-value">
                  {user?.loyalty_points || 0}
                </span>
                <span className="points-label">баллов</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn-outline logout-btn" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </div>

        {/* Табы */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📅 Мои брони
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Настройки
          </button>
        </div>

        {/* Контент */}
        <div className="profile-content">
          {activeTab === "bookings" && (
            <div className="bookings-list">
              <h2>Ваши бронирования</h2>
              {bookings.length === 0 ? (
                <p className="empty-message">У вас пока нет бронирований</p>
              ) : (
                bookings.map((booking: any) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-date">
                      <span className="day">
                        {new Date(booking.date).getDate()}
                      </span>
                      <span className="month">
                        {new Date(booking.date).toLocaleString("ru", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="booking-details">
                      <div className="booking-time">
                        ⏰ {booking.time.slice(0, 5)}
                      </div>
                      <div className="booking-guests">
                        👥 {booking.guests}{" "}
                        {booking.guests === 1 ? "гость" : "гостей"}
                      </div>
                      <div className="booking-table">
                        📍{" "}
                        {booking.table_type === "VIP"
                          ? "VIP зал"
                          : booking.table_type === "TERRACE"
                            ? "Терраса"
                            : "Основной зал"}
                      </div>
                    </div>
                    <div className="booking-status">
                      <span
                        className={`status-badge ${booking.status === "CONFIRMED" ? "confirmed" : "pending"}`}
                      >
                        {booking.status === "CONFIRMED"
                          ? "✅ Подтверждено"
                          : "⏳ Ожидание"}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <button className="btn-new-booking" onClick={handleNewBooking}>
                + Новое бронирование
              </button>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="favorites-list">
              <h2>Избранные блюда</h2>
              {favorites.length === 0 ? (
                <p className="empty-message">У вас пока нет избранных блюд</p>
              ) : (
                <div className="favorites-grid">
                  {favorites.map((dish: any) => (
                    <div key={dish.id} className="favorite-card">
                      <img
                        src={dish.dish_image || "/pictures/gal1.jpg"}
                        alt={dish.dish_name}
                      />
                      <div className="favorite-info">
                        <h3>{dish.dish_name}</h3>
                        <p>{dish.dish_price} ₽</p>
                        <button className="btn-order">Заказать</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-form">
              <h2>Настройки профиля</h2>
              {editing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label>Имя</label>
                    <input
                      type="text"
                      name="first_name"
                      defaultValue={user?.first_name || ""}
                    />
                  </div>
                  <div className="form-group">
                    <label>Фамилия</label>
                    <input
                      type="text"
                      name="last_name"
                      defaultValue={user?.last_name || ""}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={user?.email || ""}
                    />
                  </div>
                  <div className="form-group">
                    <label>Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={user?.phone || ""}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-save">
                      Сохранить
                    </button>
                    <button
                      type="button"
                      className="btn-password"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Сменить пароль
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => setEditing(false)}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info-display">
                  <div className="info-row">
                    <strong>Имя:</strong> {user?.first_name || "—"}
                  </div>
                  <div className="info-row">
                    <strong>Фамилия:</strong> {user?.last_name || "—"}
                  </div>
                  <div className="info-row">
                    <strong>Email:</strong> {user?.email || "—"}
                  </div>
                  <div className="info-row">
                    <strong>Телефон:</strong> {user?.phone || "—"}
                  </div>
                  <div className="info-row">
                    <strong>Логин:</strong> {user?.username}
                  </div>
                  <button
                    className="btn-outline"
                    style={{ marginTop: "20px" }}
                    onClick={() => setEditing(true)}
                  >
                    Редактировать профиль
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно смены пароля */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div className="password-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Смена пароля</h3>
            {passwordError && (
              <div className="password-error">{passwordError}</div>
            )}
            {passwordSuccess && (
              <div className="password-success">{passwordSuccess}</div>
            )}
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Текущий пароль</label>
                <input
                  type="password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Новый пароль</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Подтвердите новый пароль</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  Изменить
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;