const API_BASE_URL = 'http://localhost:8000';

// Função para lidar com respostas da API
const handleResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    if (response.ok) return {};
    throw new Error('Servidor retornou resposta vazia');
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error:', e);
    throw new Error('Resposta inválida do servidor');
  }

  if (!response.ok) {
    throw new Error(data.detail || 'Erro na requisição');
  }

  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

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

  // Buscar emitentes (autocomplete)
  searchEmitentes: async (query) => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/emitentes/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar emitentes');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar emitentes:', error);
      // Retorna cache local se API falhar
      return JSON.parse(localStorage.getItem('cached_emitentes') || '[]')
        .filter(e =>
          e.nome.toLowerCase().includes(query.toLowerCase()) ||
          e.cnpj.includes(query)
        );
    }
  },

  // Buscar destinatários (autocomplete)
  searchDestinatarios: async (query) => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${API_BASE_URL}/destinatarios/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar destinatários');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar destinatários:', error);
      // Retorna cache local se API falhar
      return JSON.parse(localStorage.getItem('cached_destinatarios') || '[]')
        .filter(d =>
          d.nome.toLowerCase().includes(query.toLowerCase()) ||
          d.cpf_cnpj.includes(query)
        );
    }
  },

  // Atualizar cache local
  updateCache: (type, data) => {
    const cacheKey = `cached_${type}`;
    const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');

    // Adiciona novo item se não existir
    const exists = existing.find(item =>
      type === 'emitentes'
        ? item.cnpj === data.cnpj
        : item.cpf_cnpj === data.cpf_cnpj
    );

    if (!exists) {
      existing.push(data);
      localStorage.setItem(cacheKey, JSON.stringify(existing.slice(-50))); // Mantém últimos 50
    }
  },

  // CRUD Emitentes
  createEmitente: async (emitenteData) => {
    try {
      const payload = {
        name: emitenteData.nome,
        cnpj: emitenteData.cnpj,
        phone: emitenteData.telefone,
        email: emitenteData.email,
      };

      //console.log('Enviando para API:', payload); // ← DEBUG

      const response = await fetch(`${API_BASE_URL}/emitentes/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao criar emitente:', error);
      throw error;
    }
  },

  listEmitentes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/emitentes/`, {
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response);
      //console.log('Dados recebidos:', data); // DEBUG
      return data;
    } catch (error) {
      console.error('Erro ao listar emitentes:', error);
      throw error;
    }
  },

  updateEmitente: async (id, emitenteData) => {
    try {
      const payload = {
        name: emitenteData.nome,
        cnpj: emitenteData.cnpj.replace(/\D/g, ''),
        phone: emitenteData.telefone,
        email: emitenteData.email,
        active: true
      };

      //console.log('Enviando atualização:', payload); // DEBUG

      const response = await fetch(`${API_BASE_URL}/emitentes/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao atualizar emitente:', error);
      throw error;
    }
  },

  toggleEmitenteStatus: async (id, activate) => {
    try {
      const token = localStorage.getItem('access_token');
      const endpoint = activate ? 'activate' : 'deactivate';
      const response = await fetch(`${API_BASE_URL}/emitentes/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Erro ao alterar status');
      return data;
    } catch (error) {
      console.error('Erro ao alterar status do emitente:', error);
      throw error;
    }
  },

  // CRUD Destinatários
  createDestinatario: async (destinatarioData) => {
    try {
      const payload = {
        name: destinatarioData.name,
        cpf_cnpj: destinatarioData.cpf_cnpj.replace(/\D/g, ''),
        phone: destinatarioData.phone,
        email: destinatarioData.email,
      };

      //console.log('🔍 DEBUG - Payload final:', payload);

      const response = await fetch(`${API_BASE_URL}/destinatarios/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao criar destinatário:', error);
      throw error;
    }
  },

  listDestinatarios: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinatarios/`, {
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response);
      //console.log('Destinatários recebidos:', data); // DEBUG
      return data;
    } catch (error) {
      console.error('Erro ao listar destinatários:', error);
      throw error;
    }
  },

  getDestinatarioById: async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/destinatarios/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Destinatário não encontrado');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar destinatário:', error);
      throw error;
    }
  },

  updateDestinatario: async (id, destinatarioData) => {
    try {
      const payload = {
        name: destinatarioData.name,
        cpf_cnpj: destinatarioData.cpf_cnpj.replace(/\D/g, ''),
        phone: destinatarioData.phone,
        email: destinatarioData.email,
      };

      //  console.log('Atualizando destinatário:', payload); // DEBUG

      const response = await fetch(`${API_BASE_URL}/destinatarios/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao atualizar destinatário:', error);
      throw error;
    }
  },

  toggleDestinatarioStatus: async (id, activate) => {
    try {
      const endpoint = activate ? 'activate' : 'deactivate';
      const response = await fetch(`${API_BASE_URL}/destinatarios/${id}/${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Erro ao alterar status do destinatário:', error);
      throw error;
    }
  },
};

export default api;