import { Navigate, Route, Routes } from "react-router-dom"
import LayoutLogin from "./components/layouts/LayoutLogin"
import RutaProtegida from "./components/guards/RutaProtegida"
import RutaPublica from "./components/guards/RutaPublica"
import FormularioLogin from "./modules/auth/components/FormularioLogin"
import FormularioRegistro from "./modules/auth/components/FormularioRegistro"
import PaginaCrearEmpresa from "./modules/empresa/components/PaginaCrearEmpresa"
import PaginaSuscripciones from "./modules/suscripciones/components/PaginaSuscripciones"
import PaginaDashboard from "./modules/dashboard/components/PaginaDashboard"
import PaginaDashboardTalleres from "./modules/dashboard/components/PaginaDashboardTalleres"

function App() {
  return (
    <Routes>
      <Route element={<RutaPublica />}>
        <Route element={<LayoutLogin />}>
          <Route path="/login" element={<FormularioLogin />} />
          <Route path="/registro" element={<FormularioRegistro />} />
        </Route>
      </Route>

      <Route element={<RutaProtegida />}>
        <Route path="/empresa/crear" element={<PaginaCrearEmpresa />} />
        <Route path="/suscripciones" element={<PaginaSuscripciones />} />
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/dashboard/talleres" element={<PaginaDashboardTalleres />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
