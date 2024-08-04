import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import NaoEncontrada from './components/pages/404/NaoEncontrada'
import Mapa from './components/pages/mapa/Mapa'
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
           <Route path='/Mapa' element={<Mapa1/>}/>
          <Route path='/' element={<Layout />}/>
          <Route path='*' element={<NaoEncontrada/>}/>
        </Routes>
      </BrowserRouter>
   
      
    

  )
}

export default App
