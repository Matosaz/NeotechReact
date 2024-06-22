import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
   <header className="header">

    <a href='/' className='logo'> NeoTech</a>

    <nav className ="navbar">
    <a href='/'>Saiba mais</a>
    <a href='Serviço'>Serviços</a>
    <a href='/'>Orçamento</a>
    <a href='/'>Contato</a>
    <a href='/'>Perfil</a>
    </nav>
   </header>
  )
}

export default Navbar
