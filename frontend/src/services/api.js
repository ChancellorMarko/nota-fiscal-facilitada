// src/services/api.js
const API_BASE_URL = 'http://localhost:8000'; // Ajuste para a URL da sua API

const api = {
  // Registro de usuário
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
        }),
      });

      const text = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', text);

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Resposta inválida do servidor');
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao registrar usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },

  // Login (gerar token)
  login: async (email, password) => {
    // A API FastAPI espera FormData para OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', email); // Note: username = email
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao fazer login');
    }

    return await response.json();
  },

  // Refresh token
  refreshToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao renovar token');
    }

    return await response.json();
  },

  // Exemplo: buscar dados do usuário autenticado
  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    return await response.json();
  },
};

export default api;