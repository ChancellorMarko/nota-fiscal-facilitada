import './notFoundStyle.css';

function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found__card">
                <h1 className="not-found__title">404 - Página não encontrada</h1>

                <p className="not-found__description">
                    A página que você está procurando não existe ou foi movida.
                </p>

                <div className="not-found__actions">
                    <button className="not-found__button" onClick={() => window.history.back()}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;