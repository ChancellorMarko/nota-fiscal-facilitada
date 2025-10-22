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

  // Registrar NFSe
  registerNfse: async (nfseData) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    // Converter valores string para número/decimal onde necessário
    const payload = {
      numero_nota: nfseData.numero_nota,
      serie: nfseData.serie,
      cfop: nfseData.cfop,
      nome_emitente: nfseData.nome_emitente,
      cnpj_emitente: nfseData.cnpj_emitente.replace(/\D/g, ''), // Remove formatação
      nome_destinatario: nfseData.nome_destinatario,
      cpf_ou_cnpj_destinatario: nfseData.cpf_ou_cnpj_destinatario.replace(/\D/g, ''), // Remove formatação
      valor_total: parseFloat(nfseData.valor_total) || 0,
      icms: nfseData.icms ? parseFloat(nfseData.icms) : null,
      pis: nfseData.pis ? parseFloat(nfseData.pis) : null,
      cofins: nfseData.cofins ? parseFloat(nfseData.cofins) : null,
      desconto: nfseData.desconto ? parseFloat(nfseData.desconto) : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/nfse/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao registrar nota fiscal');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar NFSe:', error);
      throw error;
    }
  },

  // Listar NFSes
  listNfse: async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/nfse/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao listar notas fiscais');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar NFSes:', error);
      throw error;
    }
  },

  // Logout (apenas limpa os tokens de seção)
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  },
};

export default api;