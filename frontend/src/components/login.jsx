import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Logica da requisição para login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Lógica de requisição
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Usuário ou Email"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Entrar</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
    );
}

export default Login;