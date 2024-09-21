import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import NaoEncontrada from './components/pages/404/NaoEncontrada'
import Mapa from './components/pages/mapa/Mapa'
import Auth from './components/pages/LoginCadastro/Auth'
import Management from './assets/Management'
import Dashboard from './assets/Management/Dashboard/Dashboard'
import Politica from './components/pages/Politicas/Politica'
import Calculadora from './components/pages/Calculadora/Calculadora'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Layout = () =>{
  return(
  <div>
    <Navbar/>
    <Home/>
    <Footer/>
  </div>
  )
}

const Mapa1 = () =>{
  return(
  <div>
    <Mapa/>
    <Footer/>
  </div>
  )
}


 
function App ()  {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/Calculadora' element={<Calculadora/>}/>
          <Route path='/Politica' element={<Politica/>}/>
          <Route path='/Dashboard' element={<Dashboard/>}/>
          <Route path='/Auth' element={<Auth/>}/>
          <Route path='/Management' element={<Management/>}/>
          <Route path='/Mapa' element={<Mapa1/>}/>
          <Route path='/' element={<Auth />}/>
          <Route path='/Home' element={<Layout/>}/>
          <Route path='*' element={<NaoEncontrada/>}/>
        </Routes>
      </BrowserRouter>
   
      
    

  )
}

export default App
