import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Navbar from '../ui/navBar/navBar';
import usersIcon from '../ui/svg/users.svg';
import errIcon from '../ui/svg/error.svg';
import serIcon from '../ui/svg/search.svg';
import crossIcon from '../ui/svg/cross.svg';
import eyeIcon from '../ui/svg/eye.svg';
import editIcon from '../ui/svg/edit.svg';
import cancelIcon from '../ui/svg/cancel.svg';
import './destinatariosStyle.css';

function Destinatarios() {
    const [destinatarios, setDestinatarios] = useState([]);
    const [filteredDestinatarios, setFilteredDestinatarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedDestinatario, setSelectedDestinatario] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        cpf_cnpj: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        loadDestinatarios();
    }, []);

    useEffect(() => {
        filterDestinatarios();
    }, [searchTerm, destinatarios]);

    const loadDestinatarios = async () => {
        setLoading(true);
        try {
            const data = await api.listDestinatarios();
            setDestinatarios(data.destinatarios || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao carregar destinatários' });
        } finally {
            setLoading(false);
        }
    };

    const filterDestinatarios = () => {
        if (!searchTerm) {
            setFilteredDestinatarios(destinatarios);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = destinatarios.filter(d =>
            d.name.toLowerCase().includes(term) ||
            d.cpf_cnpj.includes(searchTerm.replace(/\D/g, ''))
        );
        setFilteredDestinatarios(filtered);
    };

    const formatDocument = (value) => {
        if (!value) return '';
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'cpf_cnpj') {
            setFormData(prev => ({ ...prev, [name]: formatDocument(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const openModal = (mode, destinatario = null) => {
        setModalMode(mode);
        setSelectedDestinatario(destinatario);

        if (mode === 'create') {
            setFormData({ name: '', cpf_cnpj: '', phone: '', email: '' });
        } else if (destinatario) {
            setFormData({
                name: destinatario.name,
                cpf_cnpj: formatDocument(destinatario.cpf_cnpj),
                phone: destinatario.phone || '',
                email: destinatario.email || ''
            });
        }

        setShowModal(true);
        setMessage({ type: '', text: '' });
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDestinatario(null);
        setFormData({ name: '', cpf_cnpj: '', phone: '', email: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const dataToSend = {
                name: formData.name,
                cpf_cnpj: formData.cpf_cnpj.replace(/\D/g, ''),
                phone: formData.phone,
                email: formData.email
            };

            if (modalMode === 'create') {
                await api.createDestinatario(dataToSend);
                setMessage({ type: 'success', text: 'Destinatário cadastrado com sucesso!' });
            } else if (modalMode === 'edit') {
                await api.updateDestinatario(selectedDestinatario.id, dataToSend);
                setMessage({ type: 'success', text: 'Destinatário atualizado com sucesso!' });
            }

            await loadDestinatarios();
            setTimeout(() => closeModal(), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (destinatario) => {
        const action = destinatario.active ? 'desativar' : 'ativar';
        if (!window.confirm(`Deseja realmente ${action} este destinatário?`)) return;

        setLoading(true);
        try {
            await api.toggleDestinatarioStatus(destinatario.id, !destinatario.active);
            setMessage({ type: 'success', text: `Destinatário ${action}do com sucesso!` });
            await loadDestinatarios();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar activeTab="destinatarios" />

            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <img src={usersIcon} alt="search" />
                    </div>
                    <div>
                        <h1 className="page-title">Gerenciar Destinatários</h1>
                        <p className="page-subtitle">Cadastre e gerencie os destinatários de notas fiscais</p>
                    </div>
                </div>
            </div>

            <div className="content-container">
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        <img className='alert-icon' src={errIcon} alt="error" />
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="toolbar">
                    <div className="search-box">
                        <img className='search-icon' src={serIcon} alt="search" />
                        <input
                            type="text"
                            placeholder="Buscar por name ou CPF/CNPJ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button onClick={() => openModal('create')} className="btn btn-primary">
                        Novo Destinatário
                    </button>
                </div>

                <div className="table-card">
                    {loading && destinatarios.length === 0 ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Carregando destinatários...</p>
                        </div>
                    ) : filteredDestinatarios.length === 0 ? (
                        <div className="empty-state">
                            <p>Nenhum destinatário encontrado</p>
                            <span>Cadastre o primeiro destinatário para começar</span>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>CPF/CNPJ</th>
                                    <th>Telefone</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDestinatarios.map((destinatario) => (
                                    <tr key={destinatario.id}>
                                        <td className="font-medium">{destinatario.name}</td>
                                        <td className="font-mono">{formatDocument(destinatario.cpf_cnpj)}</td>
                                        <td>{destinatario.phone || '-'}</td>
                                        <td>{destinatario.email || '-'}</td>
                                        <td>
                                            <span className={`status-badge ${destinatario.active ? 'status-active' : 'status-inactive'}`}>
                                                {destinatario.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button onClick={() => openModal('view', destinatario)} className="btn-icon btn-view" title="Visualizar">
                                                    <div className='option-icon'>
                                                        <img className='option-icon' src={eyeIcon} alt="visualize" />
                                                    </div>
                                                </button>
                                                <button onClick={() => openModal('edit', destinatario)} className="btn-icon btn-edit" title="Editar">
                                                    <div className='option-icon'>
                                                        <img className='option-icon' src={editIcon} alt="edit" />
                                                    </div>
                                                </button>
                                                <button onClick={() => handleToggleStatus(destinatario)} className={`btn-icon ${destinatario.active ? 'btn-deactivate' : 'btn-activate'}`} title={destinatario.active ? 'Desativar' : 'Ativar'}>
                                                    <div className='option-icon'>
                                                        <img className='option-icon' src={cancelIcon} alt="delete" />
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
                                {modalMode === 'create' && 'Novo Destinatário'}
                                {modalMode === 'edit' && 'Editar Destinatário'}
                                {modalMode === 'view' && 'Visualizar Destinatário'}
                            </h2>
                            <button onClick={closeModal} className="modal-close">
                                <img src={crossIcon} alt="cross" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Nome <span className="required">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="Nome do destinatário" required disabled={modalMode === 'view'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">CPF/CNPJ <span className="required">*</span></label>
                                <input type="text" name="cpf_cnpj" value={formData.cpf_cnpj} onChange={handleInputChange} className="form-input" placeholder="000.000.000-00 ou 00.000.000/0000-00" maxLength={18} required disabled={modalMode === 'view'} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Telefone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="(00) 00000-0000" disabled={modalMode === 'view'} />
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

export default Destinatarios;