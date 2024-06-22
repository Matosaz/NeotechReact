import React from 'react'
import './Footer.css'
import Logo from '../assets/Logo.png'
const Footer = () => {
  return (
   <footer className='Footer'>
    <link rel="stylesheet" href="https://unpkg.com/boxicons@latest/css/boxicons.min.css" />
    <section className='conteudofooter'>
      <img className='LogoNeotech' src={Logo} alt='logo'/>
      <p>Inovação, tecnologia e sustentabilidade
      </p>
      <div className="icons">
        <a href='#'><i className='bx bxl-facebook-circle'></i></a>
        <a href='#'><i className='bx bxl-twitter'></i></a>
        <a href='#'><i className='bx bxl-instagram-alt'></i></a>
      </div>
    </section>
    <div className="conteudofooter">
      <h4>Institucional</h4>
      <li><a href='#'>Sobre nós</a></li>
      <li><a href='#'>Política de Segurança e Privacidade</a></li>
      <li><a href='#'></a></li>

    </div>

    <div className="conteudofooter">
      <h4>Ajuda</h4>
      <li><a href='#'>Formas de pagamento</a></li>
      <li><a href='#'>Orientações</a></li>
      <li><a href='#'>Perguntas frequentes</a></li>
      <li><a href='#'>Atendimento ao cliente</a></li>
    </div>

    <div className="conteudofooter">
      <h4>Seja uma empresa parceira!</h4>
        <div className="Emailconteudo">

            <div className="Email">
              <div className="text">Email</div>
              <input type="email" placeholder='Email' required/>
            </div>
            <div className="msg">
              <div className="text">Mensagem</div>
              <textarea rows={2} cols={25}  placeholder="Deixe uma mensagem"></textarea>
            </div>
         
              <button className='botao'type='submit'>Enviar</button>
            

        </div>
    </div>
   </footer>
  )
}

export default Footer
