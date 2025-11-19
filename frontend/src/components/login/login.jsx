import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import api from '../../services/api';
import './loginStyle.css';

import eyeIcon from '../ui/svg/eye.svg'; 

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // 3. ESTADO: Adicionado para controlar a visibilidade da senha
    const [showPassword, setShowPassword] = useState(false); 

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email e senha são obrigatórios');
            return;
        }

        setLoading(true);

        try {
            const response = await api.login(email, password);
            console.log('Login realizado:', response);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('token_type', response.token_type);
            alert('Login realizado com sucesso!');
            navigator(ROUTES.NFSE_REGISTER);
        } catch (err) {
            console.error('Erro no login:', err);
            setError(err.message || 'Email ou senha incorretos');
        } finally {
            setLoading(false);
        }
    };
    
    const handleRegister = () => {
         return navigator(ROUTES.REGISTER);
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-title">Sistema NF-e</h1>
                        <p className="login-subtitle">Gestão de Notas Fiscais Eletrônicas</p>
                    </div>

                    <div className="login-form-container">
                        <h2 className="form-title">Acesse sua conta</h2>
                        <div className="form-fields">
                            {/* Campo Email (INALTERADO) */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <div className="input-wrapper">
                                    <input 
                                        id="email" type="email" placeholder="seu@email.com"
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        required className="form-input"
                                    />
                                </div>
                            </div>

                            {/* Campo Senha (ALTERADO) */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Senha</label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        // 4. LÓGICA: Alterna entre "text" e "password"
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="form-input"
                                    />
                                    
                                    {/* 5. BOTÃO: Adicionado para alternar a visibilidade */}
                                    <button 
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {/* LÓGICA DO ÍCONE: Se showPassword é true, mostra o olho aberto (para esconder). Se for false, mostra o olho fechado (para mostrar). Se não tiver o eyeOffIcon, use o eyeIcon nos dois e o opacity como dica visual. */}
                                        <img 
                                            src={showPassword ? eyeIcon : eyeIcon} 
                                            alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                            style={{ opacity: showPassword ? 1 : 0.5 }} 
                                        />
                                        {/* Se tiver o eyeOffIcon, use: src={showPassword ? eyeOffIcon : eyeIcon} */}
                                    </button>
                                </div>
                            </div>

                            {error && (<div className="error-message"><span>{error}</span></div>)}
                             
                            <button onClick={handleSubmit} disabled={loading} className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                        
                        <div className="divider">
                            <div className="divider-line"></div>
                            <span className="divider-text">Ainda não tem conta?</span>
                        </div>

                        <button onClick={handleRegister} className="btn btn-secondary">
                            Criar nova conta
                        </button>
                    </div>
                </div>

                <div className="login-footer">
                    <p>© 2025 Sistema NF-e. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;