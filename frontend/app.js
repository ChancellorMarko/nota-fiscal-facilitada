const { useState, useEffect } = React;

// Serviço de API
const apiService = {
    baseURL: 'http://localhost:8000/api',

    async getNotasFiscais() {
        const response = await fetch(`${this.baseURL}/notas-fiscais`);
        return await response.json();
    },

    async emitirNotaFiscal(notaData) {
        const response = await fetch(`${this.baseURL}/notas-fiscais`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notaData)
        });
        return await response.json();
    }
};

// Componente do Formulário
function NotaFiscalForm({ onNotaEmitida }) {
    const [formData, setFormData] = useState({
        tomador: '',
        valor: '',
        servico: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiService.emitirNotaFiscal({
                ...formData,
                valor: parseFloat(formData.valor)
            });

            alert('Nota fiscal emitida com sucesso!');
            setFormData({ tomador: '', valor: '', servico: '' });
            if (onNotaEmitida) onNotaEmitida();
        } catch (error) {
            alert('Erro ao emitir nota fiscal: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="card">
            <h2>📝 Emitir Nota Fiscal</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tomador do Serviço:</label>
                    <input
                        type="text"
                        name="tomador"
                        value={formData.tomador}
                        onChange={handleChange}
                        required
                        placeholder="Nome da empresa ou pessoa"
                    />
                </div>

                <div className="form-group">
                    <label>Valor do Serviço (R$):</label>
                    <input
                        type="number"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group">
                    <label>Descrição do Serviço:</label>
                    <textarea
                        name="servico"
                        value={formData.servico}
                        onChange={handleChange}
                        required
                        rows="3"
                        placeholder="Descreva o serviço prestado..."
                    />
                </div>

                <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                >
                    {loading ? '⏳ Emitindo...' : '✅ Emitir Nota Fiscal'}
                </button>
            </form>
        </div>
    );
}

// Componente da Lista de Notas
function NotasFiscaisList({ notas, loading, onRefresh }) {
    if (loading) {
        return (
            <div className="card">
                <h2>📋 Notas Fiscais Emitidas</h2>
                <div className="loading">
                    <p>Carregando notas fiscais...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>📋 Notas Fiscais Emitidas</h2>
                <button
                    onClick={onRefresh}
                    style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    🔄 Atualizar
                </button>
            </div>

            {notas.length === 0 ? (
                <div className="empty-state">
                    <p>Nenhuma nota fiscal emitida ainda.</p>
                    <p>Use o formulário ao lado para emitir a primeira nota!</p>
                </div>
            ) : (
                <div>
                    {notas.map((nota) => (
                        <div key={nota.id} className="nota-item">
                            <div className="nota-header">
                                <div className="nota-tomador">{nota.tomador}</div>
                                <div className="nota-valor">
                                    R$ {parseFloat(nota.valor).toFixed(2)}
                                </div>
                            </div>
                            <div className="nota-servico">{nota.servico}</div>
                            <div className="nota-meta">
                                <span>
                                    <strong>N°:</strong> {nota.numero}
                                </span>
                                <span>
                                    <strong>Data:</strong> {new Date(nota.data_emissao).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="status status-emitida">
                                    {nota.situacao}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Componente Principal
function App() {
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregarNotas = async () => {
        try {
            setLoading(true);
            const response = await apiService.getNotasFiscais();
            setNotas(response.notas || []);
        } catch (error) {
            console.error('Erro ao carregar notas:', error);
            alert('Erro ao carregar notas fiscais. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarNotas();
    }, []);

    return (
        <div>
            <div className="header">
                <h1>🏢 Sistema NFSe - Maringá</h1>
                <p>Emissão e consulta de notas fiscais de serviço - Projeto Acadêmico</p>
            </div>

            <div className="container">
                <div className="grid">
                    <NotaFiscalForm onNotaEmitida={carregarNotas} />
                    <NotasFiscaisList
                        notas={notas}
                        loading={loading}
                        onRefresh={carregarNotas}
                    />
                </div>
            </div>
        </div>
    );
}

// Renderizar a aplicação
ReactDOM.render(<App />, document.getElementById('root'));