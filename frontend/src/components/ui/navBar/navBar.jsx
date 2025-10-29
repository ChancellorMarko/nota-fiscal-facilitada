import React from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../routes';
import api from '../../../services/api';
import docIcon from '../../ui/svg/document.svg';
import serIcon from '../../ui/svg/search.svg';
import plusIcon from '../../ui/svg/plus.svg';
import logIcon from '../../ui/svg/sign-out.svg';
import cardIcon from '../../ui/svg/card.svg';
import usersIcon from '../../ui/svg/users.svg';

import './navBarStyle.css';

function Navbar({ activeTab }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm('Deseja realmente sair?');

        if (confirmLogout) {
            api.logout();
            navigate(ROUTES.LOGIN);
        }
    };

    const handleNavigateToRegister = () => {
        navigate(ROUTES.NFSE_REGISTER);
    };

    const handleNavigateToConsult = () => {
        navigate(ROUTES.NFSE_CONSULT);
    };

    const handleNavigateToEmitentes = () => {
        navigate(ROUTES.EMITENTES);
    };

    const handleNavigateToDestinatarios = () => {
        navigate(ROUTES.DESTINATARIOS);
    };

    return (
        <div className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <img className='brand-icon' src={docIcon} alt="document" />
                    <span className="brand-text">Sistema NF-e</span>
                </div>

                <div className="navbar-links">
                    <button
                        onClick={handleNavigateToRegister}
                        className={`nav-link ${activeTab === 'register' ? 'nav-link-active' : ''}`}
                    >
                        <img className='nav-icon' src={plusIcon} alt="plus" />
                        Nova Nota Fiscal
                    </button>

                    <button
                        onClick={handleNavigateToConsult}
                        className={`nav-link ${activeTab === 'consult' ? 'nav-link-active' : ''}`}
                    >
                        <img className='nav-icon' src={serIcon} alt="search" />
                        Consultar Notas
                    </button>

                    <button
                        onClick={handleNavigateToEmitentes}
                        className={`nav-link ${activeTab === 'emitentes' ? 'nav-link-active' : ''}`}
                    >
                        <img className='nav-icon' src={cardIcon} alt="search" />
                        Emitentes
                    </button>

                    <button
                        onClick={handleNavigateToDestinatarios}
                        className={`nav-link ${activeTab === 'destinatarios' ? 'nav-link-active' : ''}`}
                    >
                        <img className='nav-icon' src={usersIcon} alt="search" />
                        Destinatarios
                    </button>

                    <button
                        onClick={handleLogout}
                        className="nav-link nav-link-logout"
                    >
                        <img className='nav-icon' src={logIcon} alt="signout" />
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;