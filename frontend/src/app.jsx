import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ROUTES from "./routes";

// Lazy loading para melhorar performance
const Login = React.lazy(() => import("./components/login"));
const Register = React.lazy(() => import("./components/register"));
const NFSERegister = React.lazy(() => import("./components/nfseRegister"));
const NFSEConsult = React.lazy(() => import("./components/nfseConsultation"));
const NotFound = React.lazy(() => import("./components/notFound"));


function App() {
    return (
        <Router>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.NFSE_REGISTER} element={<NFSERegister />}/>
                <Route path={ROUTES.NFSE_CONSULT} element={<NFSEConsult />}/>
                <Route path={ROUTES.NOTFOUND} element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;