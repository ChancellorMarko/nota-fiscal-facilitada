import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ROUTES from "./router/routes";

// Lazy loading para melhorar performance
const Login = React.lazy(() => import("./components/login"));
const Register = React.lazy(() => import("./components/register"));
const NotFound = React.lazy(() => import("./components/notFound"));


function App() {
    return (
        <Router>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.NOTFOUND} element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;