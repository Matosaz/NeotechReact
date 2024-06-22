import React from 'react'
import './Navbar.css'
import User from '../assets/Userimg.png'
const Navbar = () => {

  function Exibirmenu(){
    const sidebar = document.querySelector('.sidebar');
     sidebar.style.display = 'flex';
  }
  function Fecharmenu(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
  }
  return (
    
   <header className="header">

    <a href='/' className='logo'> NeoTech</a>

    <nav className ="navbar">
      <div className="sidebar"> 
    <a href='#' onClick={Fecharmenu}><svg className='Fechar'xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#121212"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a>
    <a href='/'>Saiba mais</a>
    <a href='Serviço'>Serviços</a>
    <a href='/'>Orçamento</a>
    <a href='/'>Contato</a>
    <a href='/'>Perfil</a>
  </div>
    <a className="FecharMenu" href='/'>Saiba mais</a>
    <a className="FecharMenu" href='Serviço'>Serviços</a>
    <a className="FecharMenu" href='/'>Orçamento</a>
    <a className="FecharMenu" href='/'>Contato</a>
    <a className="FecharMenu" href='/'>Perfil</a>
    <a className="botaomenu"href='#' onClick={Exibirmenu}><svg className='Menu'xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a>
    
    </nav>
   </header>
  )
}

export default Navbar
