import React, { useState } from 'react';
import Login from './components/login';
import Register from './components/register';
import './styles/app.css'

function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    return (
        <div>
            {!loggedIn ? (
                <>
                    <h2>Login</h2>
                    <Login onLoginSuccess={() => setLoggedIn(true)} />
                    <hr />
                    <h2>Registrar</h2>
                    <Register />
                </>
            ) : (
                <div>Bem-vindo! (aqui vai o conteúdo protegido, como a tela de nota fiscal)</div>
            )}
        </div>
    );
}

export default App;