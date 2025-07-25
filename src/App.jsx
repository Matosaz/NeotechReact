import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
import NaoEncontrada from './components/pages/404/NaoEncontrada'
import Mapa from './components/pages/mapa/Mapa'
import Auth from './components/pages/LoginCadastro/Auth'
import NoPermission from './components/pages/NoPermission/NoPermission'
import UserManagement from './components/pages/Management/UserManagement/UserManagement'
import CategoriaManagement from './components/pages/Management/CategoriaManagement/CategoriaManagement'
import OrcamentoManagement from './components/pages/Management/OrcamentoManagement/OrcamentoManagement'
import Dashboard from './components/pages/Management/Dashboard/Dashboard'
import Politica from './components/pages/Politicas/Politica'
import Calculadora from './components/pages/Calculadora/Calculadora'
import ConfigPerfil from './components/pages/ProfileSettings/ConfigPerfil'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider } from './components/UserContext'
import Faq from './components/pages/FAQ/Faq'
import ResetPassword from './components/pages/LoginCadastro/ResetPassword'
const Layout = () => {

  return (
    <UserProvider>
      <Navbar />
      <Home />
      <Footer />
    </UserProvider>
  )
}

const Mapa1 = () => {
  return (
    <div>
      <Mapa />
      <Footer />
    </div>
  )
}



const FAQ1 = () => {
  return (
    <div>
      <Faq />
      <Footer />
    </div>
  )
}



function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes> {/*Anotação*/}
          <Route path='/ConfigPerfil' element={<ConfigPerfil />} />
          <Route path='/Calculadora' element={<Calculadora />} />
          <Route path='/Politica' element={<Politica />} />
          <Route path='/FAQ' element={<FAQ1 />} />
          <Route path='/Dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/UserManagement' element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path='/CategoriaManagement' element={<ProtectedRoute><CategoriaManagement /></ProtectedRoute>} />
          <Route path='/OrcamentoManagement' element={<ProtectedRoute><OrcamentoManagement /></ProtectedRoute>} />
          <Route path="/NoPermission" element={<NoPermission />} />
          <Route path='/Mapa' element={<Mapa1 />} />
          <Route path='/Auth' element={<Auth />} />
          <Route path='/ResetPassword' element={<ResetPassword />} />
          <Route path='/' element={<Layout />} />
          <Route path='*' element={<NaoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>

  );
}

export default App
