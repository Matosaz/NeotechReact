import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import NaoEncontrada from './components/404/NaoEncontrada'
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


function App ()  {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}/>
          <Route path='*' element={<NaoEncontrada/>}/>
        </Routes>
      </BrowserRouter>
   
      
    

  )
}

export default App
