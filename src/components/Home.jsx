import React from 'react'
import './Home.css'
import Img1 from '../assets/Vetor1.avif'
import RecVideo from '../assets/RecVideo.mp4'
  const Home = () => {
  const counters = document.querySelectorAll(".counters span");
  const container = document.querySelector(".counters");

  let activated = false;

  window.addEventListener("scroll", () => {
    if (
      pageYOffset > container.offsetTop - container.offsetHeight - 400 &&
      activated === false
    ) {
      counters.forEach((counter) => {
        counter.innerText = 0;

        let count = 0;

        function updateCount() {
          const target = parseInt(counter.dataset.count);

          if (count < target) {
            count++;

            counter.innerText = count;
            setTimeout(updateCount, 10);
          } else {
            counter.innerText = target;
          }
        }
        updateCount();
      });
      activated = true;
    } else if (
      pageYOffset < container.offsetTop - container.offsetHeight - 500 ||
      (pageYOffset === 0 && activated === true)
    ) {
      counters.forEach((counter) => {
        counter.innerText = 0;
      });
      activated = false;
    }
  });

    
  return (
    
   <body>
        <section className='Hero'>
        <h2 className='TxtHero'> NeoTech</h2>
        <h3 className='TxtHero2'> The future is near</h3>
        <img className="Img1"src={Img1} />
        </section>

        {/* Início Serviços*/}
        <section className='Serviço' id='Serviço'>
        <h2 className='TxtServiço1'>
          Saiba mais
        </h2>
         <h2 className='TxtServiço2'>
          O que reciclamos?
         </h2>
         <h2 className='TxtServiço3'>
          Saiba os principais componentes que reciclamos!
        </h2>
         
          <div className="format-container">
  <div className="courses_box">
    <div className="courses_item">
      <a href="#" className="item_link">
        <div className="item_bg"></div>

        <div className="item_title">
          Componentes Eletroeletrônicos
        </div>

        <div className="item_date-box">
          Como: 
          <span className="item_date">
            Placas de circuito, baterias e mais!
          </span>
        </div>
      </a>
    </div>

    <div className="courses_item">
      <a href="#" className="item_link">
        <div className="item_bg"></div>

        <div className="item_title">
          Dispositivos Eletrônicos
        </div>

        <div className="item_date-box">
          Como:
          <span className="item_date">
            Celulares, Tablets, aparelhos de som e mais!
          </span>
        </div>
      </a>
    </div>

    <div className="courses_item">
      <a href="#" className="item_link">
        <div className="item_bg"></div>

        <div className="item_title">
          Qualquer um que você pensar!
        </div>

        <div className="item_date-box">
          Como:
          <span className="item_date">
            Computadores, impressoras e muito mais!
          </span>
        </div>
      </a>
    </div>
    </div>
    </div>

        {/* Início Contador*/}
          <div className="counters">
            <div>
              <div className="counter">
                <h1><span data-count="95">0</span></h1>
                <h3>Pontos de Coleta</h3>
              </div>

              <div className="counter">
                <h1><span data-count="227">0</span></h1>
                <h3>Toneladas de itens reciclados</h3>
              </div>

              <div className="counter">
                <h1><span data-count="70">0</span>+</h1>
                <h3>Empresas auxiliadas</h3>
              </div>
              <div className='Empresas ajudadas'></div>

            </div>
          </div>
        {/* Fim Contador*/}


        </section>
        {/* Fim Serviços*/}

        {/* Início Timeline*/}
     <section className="timeline">

     </section>
      {/* Fim Timeline*/}


      {/* Início Orçamento*/}
     <section className="Orçamento">
        <div className="coluna" id='orçamento'>
          <div className="video">
            <video src={RecVideo} className='videocontent' autoPlay loop muted ></video>
          </div>
          <div className="wrapconteudo">
            <div className="conteudo">
              <h2 className='TituloOrçamento'>Orçamento</h2>
              <p>orem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti quasi
                 ipsa,Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti quasi
                 ipsa, qui nobis nesciunt aliquam repellendus ea minima molestiae corrupti!</p>
              <a href='#' className='botao2'>Faça um orçamento</a>
            </div>
          </div>
        </div>
    </section>
    {/* Fim Orçamento*/}

   </body>
  )
}

export default Home
