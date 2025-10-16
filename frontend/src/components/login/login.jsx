import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../router/routes'
import './loginStyle.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Navigator
    const navigator = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulação de requisição
        setTimeout(() => {
            // Simulação de requisição
            alert('Login realizado com sucesso!');
            setLoading(false);
        }, 1500);
    };

    const handleRegister = () => {
        return navigator(ROUTES.REGISTER);
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* Card Principal */}
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <h1 className="login-title">Sistema NF-e</h1>
                        <p className="login-subtitle">Gestão de Notas Fiscais Eletrônicas</p>
                    </div>

                    {/* Formulário */}
                    <div className="login-form-container">
                        <h2 className="form-title">Acesse sua conta</h2>
                        <div className="form-fields">
                            {/* Campo Email */}
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            {/* Campo Senha */}
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Senha
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            {/* Mensagem de Erro */}
                            {error && (
                                <div className="error-message">
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Botão Login */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                            >
                                {loading ? (
                                    'Entrando...'
                                ) : (
                                    'Entrar'
                                )}
                            </button>
                        </div>

                        {/* Divisor */}
                        <div className="divider">
                            <div className="divider-line"></div>
                            <span className="divider-text">Ainda não tem conta?</span>
                        </div>

                        {/* Botão Registro */}
                        <button
                            onClick={handleRegister}
                            className="btn btn-secondary"
                        >
                            Criar nova conta
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    <p>© 2025 Sistema NF-e. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;