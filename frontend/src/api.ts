const API_URL = "http://localhost:8000/api";

// ========== МЕНЮ И КАТЕГОРИИ ==========
export const getMenuItems = async (category?: string) => {
  let url = `${API_URL}/menu/`;
  if (category && category !== "all") {
    url += `?category=${category}`;
  }
  const response = await fetch(url);
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories/`);
  return response.json();
};

// ========== АВТОРИЗАЦИЯ ==========
export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const register = async (userData: any) => {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// ========== ПРОФИЛЬ ==========
export const getProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/users/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const updateProfile = async (token: string, data: any) => {
  const response = await fetch(`${API_URL}/users/profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// ========== БРОНИРОВАНИЯ ==========
export const getReservations = async (token: string) => {
  const response = await fetch(`${API_URL}/reservations/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const createReservation = async (token: string, data: any) => {
  const response = await fetch(`${API_URL}/reservations/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const cancelReservation = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/reservations/${id}/cancel/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

// ========== ИЗБРАННОЕ ==========
export const getFavorites = async (token: string) => {
  const response = await fetch(`${API_URL}/favorites/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const addFavorite = async (token: string, dishId: number) => {
  const response = await fetch(`${API_URL}/favorites/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dish_id: dishId }),
  });
  return response.json();
};

export const removeFavorite = async (token: string, dishId: number) => {
  const response = await fetch(`${API_URL}/favorites/remove_by_dish/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dish_id: dishId }),
  });
  return response.json();
};

// ========== ИСТОРИЯ ЗАКАЗОВ ==========
export const getOrderHistory = async (token: string) => {
  const response = await fetch(`${API_URL}/orders/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
