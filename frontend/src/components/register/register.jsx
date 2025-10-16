import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../router/routes";
import './registerStyle.css'

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Navigator
    const navigator = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!confirmPasswordsMatch()) {
            setError('As senhas não coincidem. Tente novamente.');
            setLoading(false);
            return;
        }

        // Simulação de requisição
        setTimeout(() => {
            // Simulação de requisição
            alert('Registro realizado com sucesso!');
            setLoading(false);
        }, 1500);
    }

    function confirmPasswordsMatch() {
        return password === confirmPassword;
    }

    const handleLogin = () => {
        return navigator(ROUTES.LOGIN);
    }

    return (
        <div>
            <div className="register-container">
                <div className="register-wrapper">
                    {/* Card Principal */}
                    <div className="register-card">
                        {/* Header */}
                        <div className="register-header">
                            <h1 className="register-title">Sistema NF-e</h1>
                            <p className="register-subtitle">Gestão de Notas Fiscais Eletrônicas</p>
                        </div>

                        {/* Formulário */}
                        <div className="register-form-container">
                            <h2 className="form-title">Crie sua conta</h2>
                            <div className="form-fields">
                                {/* Campo Nome */}
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Nome
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Seu nome completo"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                {/* Campo Email */}
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="exemplo@email,com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                {/* Campo Telefone */}
                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">
                                        Telefone
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="(99) 99999-9999"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
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
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                {/* Campo Confirmar Senha */}
                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirmar Senha
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                                {/* Botão Registrar */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
                                >
                                    {loading ? (
                                        'Registrando...'
                                    ) : (
                                        'Registrar'
                                    )}
                                </button>
                            </div>

                            {/* Divisor */}
                            <div className="divider">
                                <div className="divider-line"></div>
                                <span className="divider-text">Já tem uma conta?</span>
                            </div>

                            {/* Botão Login */}
                            <button
                                onClick={handleLogin}
                                className="btn btn-secondary"
                            >
                                Fazer login
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="register-footer">
                        <p>© 2025 Sistema NF-e. Todos os direitos reservados.</p>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default Register;