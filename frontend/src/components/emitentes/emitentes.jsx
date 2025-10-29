import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../ui/navBar';
import cardIcon from '../ui/svg/card.svg';
import errIcon from '../ui/svg/error.svg';
import serIcon from '../ui/svg/search.svg';
import eyeIcon from '../ui/svg/eye.svg';
import editIcon from '../ui/svg/edit.svg';
import cancelIcon from '../ui/svg/cancel.svg';
import './emitentesStyle.css';

function Emitentes() {
    const navigate = useNavigate();
    const [emitentes, setEmitentes] = useState([]);
    const [filteredEmitentes, setFilteredEmitentes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedEmitente, setSelectedEmitente] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        nome: '',
        cnpj: '',
        telefone: '',
        email: ''
    });

    useEffect(() => {
        loadEmitentes();
    }, []);

    useEffect(() => {
        filterEmitentes();
    }, [searchTerm, emitentes]);

    const loadEmitentes = async () => {
        setLoading(true);
        try {
            const data = await api.listEmitentes();
            setEmitentes(data.emitentes || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao carregar emitentes' });
        } finally {
            setLoading(false);
        }
    };

    const filterEmitentes = () => {
        if (!searchTerm) {
            setFilteredEmitentes(emitentes);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = emitentes.filter(e =>
            e.name.toLowerCase().includes(term) ||
            e.cnpj.includes(searchTerm.replace(/\D/g, ''))
        );
        setFilteredEmitentes(filtered);
    };

    const formatCNPJ = (value) => {
        const numbers = value.replace(/\D/g, '').slice(0, 14);
        if (numbers.length <= 11) return numbers;
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cnpj') {
            setFormData(prev => ({ ...prev, [name]: formatCNPJ(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const openModal = (mode, emitente = null) => {
        setModalMode(mode);
        setSelectedEmitente(emitente);

        if (mode === 'create') {
            setFormData({ nome: '', cnpj: '', telefone: '', email: '' });
        } else if (emitente) {
            setFormData({
                nome: emitente.name,
                cnpj: formatCNPJ(emitente.cnpj),
                telefone: emitente.phone || '',
                email: emitente.email || ''
            });
        }

        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEmitente(null);
        setFormData({ nome: '', cnpj: '', telefone: '', email: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const dataToSend = {
                nome: formData.nome,
                cnpj: formData.cnpj.replace(/\D/g, ''),
                telefone: formData.telefone,
                email: formData.email
            };

            if (modalMode === 'create') {
                await api.createEmitente(dataToSend);
                setMessage({ type: 'success', text: 'Emitente cadastrado com sucesso!' });
            } else if (modalMode === 'edit') {
                await api.updateEmitente(selectedEmitente.id, dataToSend);
                setMessage({ type: 'success', text: 'Emitente atualizado com sucesso!' });
            }

            await loadEmitentes();
            setTimeout(() => closeModal(), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (emitente) => {
        const action = emitente.active ? 'desativar' : 'ativar';
        if (!window.confirm(`Deseja realmente ${action} este emitente?`)) return;

        setLoading(true);
        try {
            await api.toggleEmitenteStatus(emitente.id, !emitente.active);
            setMessage({ type: 'success', text: `Emitente ${action}do com sucesso!` });
            await loadEmitentes();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar activeTab="emitentes" />

            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <img src={cardIcon} alt="search" />
                    </div>
                    <div>
                        <h1 className="page-title">Gerenciar Emitentes</h1>
                        <p className="page-subtitle">Cadastre e gerencie os emitentes de notas fiscais</p>
                    </div>
                </div>
            </div>

            <div className="content-container">
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        <div className='alert-icon'>
                            <img src={errIcon} alt="error" />
                        </div>
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="toolbar">
                    <div className="search-box">
                        <div className='search-icon'>
                            <img src={serIcon} alt="search" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou CNPJ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button onClick={() => openModal('create')} className="btn btn-primary">
                        Novo Emitente
                    </button>
                </div>

                <div className="table-card">
                    {loading && emitentes.length === 0 ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Carregando emitentes...</p>
                        </div>
                    ) : filteredEmitentes.length === 0 ? (
                        <div className="empty-state">
                            <p>Nenhum emitente encontrado</p>
                            <span>Cadastre o primeiro emitente para começar</span>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>CNPJ</th>
                                    <th>Telefone</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmitentes.map((emitente) => (
                                    <tr key={emitente.id}>
                                        <td className="font-medium">{emitente.name}</td>
                                        <td className="font-mono">{formatCNPJ(emitente.cnpj)}</td>
                                        <td>{emitente.phone || '-'}</td>
                                        <td>{emitente.email || '-'}</td>
                                        <td>
                                            <span className={`status-badge ${emitente.active ? 'status-active' : 'status-inactive'}`}>
                                                {emitente.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => openModal('view', emitente)} className="btn-icon btn-view" title="Visualizar">
                                                    <div className='option-icon'>
                                                        <img src={eyeIcon} alt="visualize" />
                                                    </div>
                                                </button>
                                                <button onClick={() => openModal('edit', emitente)} className="btn-icon btn-edit" title="Editar">
                                                    <div className='option-icon'>
                                                        <img src={editIcon} alt="edit" />
                                                    </div>
                                                </button>
                                                <button onClick={() => handleToggleStatus(emitente)} className={`btn-icon ${emitente.active ? 'btn-deactivate' : 'btn-activate'}`} title={emitente.active ? 'Desativar' : 'Ativar'}>
                                                    <div className='option-icon'>
                                                        <img src={cancelIcon} alt="delete" />
                                                    </div>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {modalMode === 'create' && 'Novo Emitente'}
                                {modalMode === 'edit' && 'Editar Emitente'}
                                {modalMode === 'view' && 'Visualizar Emitente'}
                            </h2>
                            <button onClick={closeModal} className="modal-close">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Nome <span className="required">*</span></label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="form-input" placeholder="Nome do emitente" required disabled={modalMode === 'view'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">CNPJ <span className="required">*</span></label>
                                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} className="form-input" placeholder="00.000.000/0000-00" maxLength={18} required disabled={modalMode === 'view'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Telefone</label>
                                <input type="tel" name="telefone" value={formData.telefone} onChange={handleInputChange} className="form-input" placeholder="(00) 00000-0000" disabled={modalMode === 'view'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="email@exemplo.com" disabled={modalMode === 'view'} />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    {modalMode === 'view' ? 'Fechar' : 'Cancelar'}
                                </button>
                                {modalMode !== 'view' && (
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Emitentes;