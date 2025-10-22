import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';
import api from '../../services/api';
import './nfseRegisterStyle.css';

function CadastroNotaFiscal() {

    // Navigator
    const navigator = useNavigate();

    const [formData, setFormData] = useState({
        numero_nota: '',
        serie: '',
        cfop: '',
        nome_emitente: '',
        cnpj_emitente: '',
        nome_destinatario: '',
        cpf_ou_cnpj_destinatario: '',
        valor_total: '',
        icms: '',
        pis: '',
        cofins: '',
        desconto: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCurrency = (value) => {
        const number = value.replace(/\D/g, '');
        const decimal = (Number(number) / 100).toFixed(2);
        return decimal;
    };

    const handleCurrencyChange = (e) => {
        const { name, value } = e.target;
        const formatted = formatCurrency(value);
        setFormData(prev => ({
            ...prev,
            [name]: formatted
        }));
    };

    const formatCNPJ = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const handleDocumentChange = (e) => {
        const { name, value } = e.target;
        const formatted = formatCNPJ(value);
        setFormData(prev => ({
            ...prev,
            [name]: formatted
        }));
    };

    const validateForm = () => {
        if (!formData.numero_nota || !formData.serie || !formData.cfop) {
            setMessage({ type: 'error', text: 'Preencha os dados da nota fiscal.' });
            return false;
        }
        if (!formData.nome_emitente || !formData.cnpj_emitente) {
            setMessage({ type: 'error', text: 'Preencha os dados do emitente.' });
            return false;
        }
        if (!formData.nome_destinatario || !formData.cpf_ou_cnpj_destinatario) {
            setMessage({ type: 'error', text: 'Preencha os dados do destinatário.' });
            return false;
        }
        if (!formData.valor_total || parseFloat(formData.valor_total) <= 0) {
            setMessage({ type: 'error', text: 'Informe um valor total válido.' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await api.registerNfse(formData);

            setMessage({
                type: 'success',
                text: 'Nota Fiscal cadastrada com sucesso!'
            });

            // Limpar formulário após sucesso
            setFormData({
                numero_nota: '',
                serie: '',
                cfop: '',
                nome_emitente: '',
                cnpj_emitente: '',
                nome_destinatario: '',
                cpf_ou_cnpj_destinatario: '',
                valor_total: '',
                icms: '',
                pis: '',
                cofins: '',
                desconto: ''
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Erro ao cadastrar nota fiscal. Tente novamente.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            numero_nota: '',
            serie: '',
            cfop: '',
            nome_emitente: '',
            cnpj_emitente: '',
            nome_destinatario: '',
            cpf_ou_cnpj_destinatario: '',
            valor_total: '',
            icms: '',
            pis: '',
            cofins: '',
            desconto: ''
        });
        setMessage({ type: '', text: '' });
    };

    const handleNavigateToConsulta = () => {
        return navigator(ROUTES.NFSE_CONSULT);
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

                        <button className="nav-link nav-link-active">
                            Nova Nota Fiscal
                        </button>

                        <button onClick={handleNavigateToConsulta} className="nav-link">
                            Consultar Notas
                        </button>
                    </div>
                </div>
            </div>

            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="page-title">Cadastro de Nota Fiscal</h1>
                        <p className="page-subtitle">Preencha os dados para emitir uma nova nota fiscal eletrônica</p>
                    </div>
                </div>
            </div>

            <div className="form-container">
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                            {message.type === 'success' ? (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            ) : (
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                        </svg>
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="form-card">
                    <div className="form-section">
                        <h2 className="section-title">Identificação da Nota Fiscal</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Número da Nota <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="numero_nota"
                                    value={formData.numero_nota}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ex: 000123"
                                    maxLength={50}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Série <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="serie"
                                    value={formData.serie}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ex: 1"
                                    maxLength={20}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    CFOP <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="cfop"
                                    value={formData.cfop}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ex: 5102"
                                    maxLength={10}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Dados do Emitente</h2>
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label">
                                    Nome do Emitente <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nome_emitente"
                                    value={formData.nome_emitente}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Razão social ou nome completo"
                                    maxLength={100}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    CNPJ do Emitente <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="cnpj_emitente"
                                    value={formData.cnpj_emitente}
                                    onChange={handleDocumentChange}
                                    className="form-input"
                                    placeholder="00.000.000/0000-00"
                                    maxLength={18}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Dados do Destinatário</h2>
                        <div className="form-row">
                            <div className="form-group form-group-full">
                                <label className="form-label">
                                    Nome do Destinatário <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nome_destinatario"
                                    value={formData.nome_destinatario}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Razão social ou nome completo"
                                    maxLength={100}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    CPF/CNPJ do Destinatário <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="cpf_ou_cnpj_destinatario"
                                    value={formData.cpf_ou_cnpj_destinatario}
                                    onChange={handleDocumentChange}
                                    className="form-input"
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    maxLength={18}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Valores e Impostos</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    Valor Total <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="valor_total"
                                    value={formData.valor_total}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">ICMS</label>
                                <input
                                    type="text"
                                    name="icms"
                                    value={formData.icms}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">PIS</label>
                                <input
                                    type="text"
                                    name="pis"
                                    value={formData.pis}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">COFINS</label>
                                <input
                                    type="text"
                                    name="cofins"
                                    value={formData.cofins}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Desconto</label>
                                <input
                                    type="text"
                                    name="desconto"
                                    value={formData.desconto}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Nota Fiscal'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastroNotaFiscal;
