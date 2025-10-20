import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import './nfseConsultationStyle.css';

function ConsultaNotaFiscal() {

    // Navigator
    const navigate = useNavigate();

    const [notasFiscais, setNotasFiscais] = useState([]);
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedNota, setSelectedNota] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [filters, setFilters] = useState({
        numero_nota: '',
        nome_emitente: '',
        nome_destinatario: '',
        data_inicio: '',
        data_fim: ''
    });

    // Simulação de dados (substitua pela chamada à sua API)
    const mockData = [
        {
            id: 1,
            numero_nota: '000123',
            serie: '1',
            cfop: '5102',
            nome_emitente: 'Empresa ABC LTDA',
            cnpj_emitente: '12.345.678/0001-90',
            nome_destinatario: 'João Silva',
            cpf_ou_cnpj_destinatario: '123.456.789-00',
            valor_total: '1500.00',
            icms: '270.00',
            pis: '24.75',
            cofins: '114.00',
            desconto: '50.00',
            created_at: '2025-10-15T10:30:00'
        },
        {
            id: 2,
            numero_nota: '000124',
            serie: '1',
            cfop: '5102',
            nome_emitente: 'Empresa XYZ S.A.',
            cnpj_emitente: '98.765.432/0001-10',
            nome_destinatario: 'Maria Santos',
            cpf_ou_cnpj_destinatario: '987.654.321-00',
            valor_total: '2300.50',
            icms: '414.09',
            pis: '37.96',
            cofins: '174.88',
            desconto: '0.00',
            created_at: '2025-10-16T14:20:00'
        },
        {
            id: 3,
            numero_nota: '000125',
            serie: '2',
            cfop: '6102',
            nome_emitente: 'Empresa ABC LTDA',
            cnpj_emitente: '12.345.678/0001-90',
            nome_destinatario: 'Comércio Beta LTDA',
            cpf_ou_cnpj_destinatario: '11.222.333/0001-44',
            valor_total: '5800.00',
            icms: '1044.00',
            pis: '95.70',
            cofins: '441.00',
            desconto: '200.00',
            created_at: '2025-10-17T09:15:00'
        }
    ];

    useEffect(() => {
        loadNotasFiscais();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, notasFiscais]);

    const loadNotasFiscais = async () => {
        setLoading(true);
        try {
            // Simulação de requisição à API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Aqui requisição real para API

            setNotasFiscais(mockData);
            setFilteredNotas(mockData);
        } catch (error) {
            console.error('Erro ao carregar notas fiscais:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...notasFiscais];

        if (filters.numero_nota) {
            filtered = filtered.filter(nota =>
                nota.numero_nota.toLowerCase().includes(filters.numero_nota.toLowerCase())
            );
        }

        if (filters.nome_emitente) {
            filtered = filtered.filter(nota =>
                nota.nome_emitente.toLowerCase().includes(filters.nome_emitente.toLowerCase())
            );
        }

        if (filters.nome_destinatario) {
            filtered = filtered.filter(nota =>
                nota.nome_destinatario.toLowerCase().includes(filters.nome_destinatario.toLowerCase())
            );
        }

        if (filters.data_inicio) {
            filtered = filtered.filter(nota =>
                new Date(nota.created_at) >= new Date(filters.data_inicio)
            );
        }

        if (filters.data_fim) {
            filtered = filtered.filter(nota =>
                new Date(nota.created_at) <= new Date(filters.data_fim)
            );
        }

        setFilteredNotas(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            numero_nota: '',
            nome_emitente: '',
            nome_destinatario: '',
            data_inicio: '',
            data_fim: ''
        });
    };

    const openModal = (nota) => {
        setSelectedNota(nota);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedNota(null);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleNavigateToRegister = () => {
        navigate(ROUTES.NFSE_REGISTER);
    };

    //const handleNavigateToHome = () => {
    // Navegar para a página de dashboard/home
    // Não implementado no MVP
    //};

    return (
        <div className="page-container">
            {/* Barra de Navegação */}
            <div className="navbar">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <svg className="brand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="brand-text">Sistema NF-e</span>
                    </div>

                    <div className="navbar-links">
                        {/* Botão para dashboard */}
                        {/*
                        <button onClick={handleNavigateToHome} className="nav-link">
                            Início
                        </button>
                        */}

                        <button onClick={handleNavigateToRegister} className="nav-link">
                            Nova Nota Fiscal
                        </button>

                        <button className="nav-link nav-link-active">
                            Consultar Notas
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="page-title">Consulta de Notas Fiscais</h1>
                        <p className="page-subtitle">Busque e visualize as notas fiscais cadastradas no sistema</p>
                    </div>
                </div>
            </div>

            <div className="content-container">
                {/* Filtros */}
                <div className="filters-card">
                    <div className="filters-header">
                        <h2 className="filters-title">Filtros de Busca</h2>
                        <button onClick={clearFilters} className="btn-clear">
                            Limpar Filtros
                        </button>
                    </div>

                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="filter-label">Número da Nota</label>
                            <input
                                type="text"
                                name="numero_nota"
                                value={filters.numero_nota}
                                onChange={handleFilterChange}
                                className="filter-input"
                                placeholder="Ex: 000123"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Emitente</label>
                            <input
                                type="text"
                                name="nome_emitente"
                                value={filters.nome_emitente}
                                onChange={handleFilterChange}
                                className="filter-input"
                                placeholder="Nome do emitente"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Destinatário</label>
                            <input
                                type="text"
                                name="nome_destinatario"
                                value={filters.nome_destinatario}
                                onChange={handleFilterChange}
                                className="filter-input"
                                placeholder="Nome do destinatário"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Data Início</label>
                            <input
                                type="date"
                                name="data_inicio"
                                value={filters.data_inicio}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Data Fim</label>
                            <input
                                type="date"
                                name="data_fim"
                                value={filters.data_fim}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                <div className="results-card">
                    <div className="results-header">
                        <h2 className="results-title">
                            {filteredNotas.length} {filteredNotas.length === 1 ? 'Nota Encontrada' : 'Notas Encontradas'}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <svg className="spinner-large" fill="none" viewBox="0 0 24 24">
                                <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <p>Carregando notas fiscais...</p>
                        </div>
                    ) : filteredNotas.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>Nenhuma nota fiscal encontrada</p>
                            <span>Tente ajustar os filtros de busca</span>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="notas-table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Série</th>
                                        <th>Emitente</th>
                                        <th>Destinatário</th>
                                        <th>Valor Total</th>
                                        <th>Data/Hora</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNotas.map((nota) => (
                                        <tr key={nota.id}>
                                            <td className="nota-numero">{nota.numero_nota}</td>
                                            <td>{nota.serie}</td>
                                            <td>{nota.nome_emitente}</td>
                                            <td>{nota.nome_destinatario}</td>
                                            <td className="nota-valor">{formatCurrency(nota.valor_total)}</td>
                                            <td className="nota-data">{formatDate(nota.created_at)}</td>
                                            <td>
                                                <button
                                                    onClick={() => openModal(nota)}
                                                    className="btn-view"
                                                >
                                                    Visualizar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalhes */}
            {showModal && selectedNota && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Detalhes da Nota Fiscal</h2>
                            <button onClick={closeModal} className="modal-close">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-section">
                                <h3 className="detail-title">Identificação</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Número da Nota:</span>
                                        <span className="detail-value">{selectedNota.numero_nota}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Série:</span>
                                        <span className="detail-value">{selectedNota.serie}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">CFOP:</span>
                                        <span className="detail-value">{selectedNota.cfop}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Data/Hora:</span>
                                        <span className="detail-value">{formatDate(selectedNota.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3 className="detail-title">Emitente</h3>
                                <div className="detail-grid">
                                    <div className="detail-item detail-full">
                                        <span className="detail-label">Nome:</span>
                                        <span className="detail-value">{selectedNota.nome_emitente}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">CNPJ:</span>
                                        <span className="detail-value">{selectedNota.cnpj_emitente}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3 className="detail-title">Destinatário</h3>
                                <div className="detail-grid">
                                    <div className="detail-item detail-full">
                                        <span className="detail-label">Nome:</span>
                                        <span className="detail-value">{selectedNota.nome_destinatario}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">CPF/CNPJ:</span>
                                        <span className="detail-value">{selectedNota.cpf_ou_cnpj_destinatario}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3 className="detail-title">Valores e Impostos</h3>
                                <div className="detail-grid">
                                    <div className="detail-item highlight">
                                        <span className="detail-label">Valor Total:</span>
                                        <span className="detail-value-large">{formatCurrency(selectedNota.valor_total)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">ICMS:</span>
                                        <span className="detail-value">{formatCurrency(selectedNota.icms)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">PIS:</span>
                                        <span className="detail-value">{formatCurrency(selectedNota.pis)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">COFINS:</span>
                                        <span className="detail-value">{formatCurrency(selectedNota.cofins)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Desconto:</span>
                                        <span className="detail-value">{formatCurrency(selectedNota.desconto)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={closeModal} className="btn btn-secondary">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConsultaNotaFiscal;