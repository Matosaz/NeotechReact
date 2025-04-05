import React from 'react'
import './Footer.css'
import Politica from '../components/pages/Politicas/Politica'
import Logo from '../assets/Logo7.svg'
const Footer = () => {
  return (
   <footer className='Footer' id='Footer'>
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
      <li><a href='/Politica'>Política de Segurança e Privacidade</a></li>
      <li><a href='#'></a></li>

    </div>

    <div className="conteudofooter">
      <h4>Ajuda</h4>
      <li><a href='#'>Formas de pagamento</a></li>
      <li><a href='#'>Orientações</a></li>
      <li><a href='/FAQ'>Perguntas frequentes</a></li>
      <li><a href='#'>Atendimento ao cliente</a></li>
    </div>

    <div class="conteudofooter">
  <h4>Seja uma empresa parceira!</h4>
  <div class="Emailconteudofooter">
 
    <div class="input-containerfooter">
      <input type="email" id="emailfooter" required />
      <label for="emailfooter" class="labelfooter">Email</label>
      <div class="underlinefooter"></div>
    </div>

   
    <div class="input-containerfooter">
      <textarea id="messagefooter" rows="2" required></textarea>
      <label for="messagefooter" class="labelfooter">Mensagem</label>
      <div class="underlinefooter"></div>
    </div>

    
    <button class="botaofooter" type="submit">Enviar</button>
  </div>
</div>

   </footer>
  )
}

export default Footer
