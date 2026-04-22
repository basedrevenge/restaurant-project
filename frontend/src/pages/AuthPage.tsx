import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

interface AuthPageProps {
  onLogin?: (token: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  // Убираем отступы body при загрузке
  useEffect(() => {
    document.body.style.paddingTop = "0";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.paddingTop = "";
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        if (onLogin) onLogin(data.access);
        navigate("/profile");
      } else {
        setError("Неверное имя пользователя или пароль");
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          phone: registerData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Автоматический вход после регистрации
        const loginResponse = await fetch("http://127.0.0.1:8000/api/token/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: registerData.username,
            password: registerData.password,
          }),
        });

        const loginDataRes = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem("access_token", loginDataRes.access);
          localStorage.setItem("refresh_token", loginDataRes.refresh);
          if (onLogin) onLogin(loginDataRes.access);
          navigate("/profile");
        } else {
          navigate("/login");
        }
      } else {
        const errorMsg =
          data.username?.[0] || data.email?.[0] || "Ошибка регистрации";
        setError(errorMsg);
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/pictures/logo.png" alt="Grand Plaza" />
            </div>
            <h1>{isLogin ? "Вход в аккаунт" : "Регистрация"}</h1>
            <p className="auth-subtitle">
              {isLogin
                ? "Добро пожаловать обратно!"
                : "Создайте аккаунт в Гранд Плаза"}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {isLogin ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Имя пользователя</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  required
                  placeholder="Введите имя пользователя"
                />
              </div>
              <div className="form-group">
                <label>Пароль</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  placeholder="Введите пароль"
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Вход..." : "Войти"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Имя</label>
                  <input
                    type="text"
                    value={registerData.first_name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        first_name: e.target.value,
                      })
                    }
                    placeholder="Ваше имя"
                  />
                </div>
                <div className="form-group">
                  <label>Фамилия</label>
                  <input
                    type="text"
                    value={registerData.last_name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        last_name: e.target.value,
                      })
                    }
                    placeholder="Ваша фамилия"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Имя пользователя *</label>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                  required
                  placeholder="Придумайте логин"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, phone: e.target.value })
                  }
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Пароль *</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    placeholder="Минимум 6 символов"
                  />
                </div>
                <div className="form-group">
                  <label>Подтвердите пароль *</label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Создать новый аккаунт" : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
