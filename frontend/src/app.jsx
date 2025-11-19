import React, { Children } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ROUTES from "./routes";

// Lazy loading para melhorar performance
const Login = React.lazy(() => import("./components/login"));
const Register = React.lazy(() => import("./components/register"));
const NFSERegister = React.lazy(() => import("./components/nfseRegister"));
const NFSEConsult = React.lazy(() => import("./components/nfseConsultation"));
const Emitentes = React.lazy(() => import("./components/emitentes"));
const Destinatarios = React.lazy(() => import("./components/destinatarios"));
const NotFound = React.lazy(() => import("./components/notFound"));
const AccessibilityBtn = React.lazy(() => import("./components/ui/accessibility/accessibilityBtn"));

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    return children;
};

function App() {
    return (
        <Router>
            <React.Suspense fallback={<div></div>}>
                <AccessibilityBtn />
            </React.Suspense>

            <Routes>
                {/* ROtas públicas */}
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />

                {/* Rotas protegidas */}
                <Route path={ROUTES.NFSE_REGISTER} element={<ProtectedRoute><NFSERegister /></ProtectedRoute>} />
                <Route path={ROUTES.NFSE_CONSULT} element={<ProtectedRoute><NFSEConsult /></ProtectedRoute>} />
                <Route path={ROUTES.DESTINATARIOS} element={<ProtectedRoute><Destinatarios /></ProtectedRoute>} />
                <Route path={ROUTES.EMITENTES} element={<ProtectedRoute><Emitentes /></ProtectedRoute>} />

                {/* Rota Padrão */}
                <Route path="/" element={<Login />} />

                {/* Rota para páginas não encontradas */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
