import React from 'react'
import './Home.css'
import RecVideo from '../assets/RecVideo.mp4'
import ImgTL1 from '../assets/Teclado.jpg'
import ImgTL2 from '../assets/Comput.jpg'
import ImgTL3 from '../assets/Person.jpg'
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

  function qs(selector, all = false) {
    return all ? document.querySelectorAll(selector) : document.querySelector(selector);
  }
  
  const sections = qs('.sectionTL', true);
  const timeline = qs('.timelineCont');
  const linha = qs('.linha');
  
  if (linha && timeline && sections.length) {
    linha.style.bottom = `calc(100% - 20px)`;
    let up, down;
    let full = false;
    let set = 0;
    let prevScrollY = window.scrollY;
    const targetY = window.innerHeight * 0.8;
  
    function scrollHandler() {
      const { scrollY } = window;
      up = scrollY < prevScrollY;
      down = !up;
      const timelineRect = timeline.getBoundingClientRect();
  
      const dist = targetY - timelineRect.top;
      console.log(dist);
  
      if (down && !full) {
        set = Math.max(set, dist);
        linha.style.bottom = `calc(100% - ${set}px)`;
      }
  
      if (dist > timeline.offsetHeight + 50 && !full) {
        full = true;
        linha.style.bottom = `-50px`;
      }
  
      sections.forEach(item => {
        const rect = item.getBoundingClientRect();
        
        if (rect.top + item.offsetHeight / 5 < targetY) {
          item.classList.add('show-me');
        }
      });
  
      prevScrollY = window.scrollY;
    }
  
    linha.style.display = 'block';
    window.addEventListener('scroll', scrollHandler);
    scrollHandler();
  }

  return (
    
   <body>
        <section className='Hero'>
        <h2 className='TxtHero'> NeoTech</h2>
        <h3 className='TxtHero2'> The future is near</h3>

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
     <section className="timeline" id='Timeline'>
        <div className="containerTL">
            <div className="top-section">
              <h1 className='txtTL1'>Sobre nós</h1>
              <h1 className='txtTL2'>Conheça mais sobre nós e nossos serviços!</h1>

            </div>
            <div className="timelineCont">
              <div className="linha">
                <div className="sectionTL">
                  <div className="Area">
                    <div className="contentTL">
                      <h2 className='h2esquer'> Conheça a Neotech</h2>
                      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestiae reiciendis,
                       ligendigies unde perferendis saepe at non harum. Eligendi optio, dolorum a odit quae eum non fugit dolor.
                       Dicta,t dolor.
                         Dicta, magni sequi.</p>
                    </div>
                  </div>
                </div>

                <div className="sectionTL">
                  <div className="Area">
                    <div className="contentTL">
                      <h2>Importância</h2>
                      <p>olorum a odit quae eum non fugit di sequies unde perferendis saepe at non harum. Eligendi optio, dolorum a odit quae eum non fugit dolor.
                      Dictaes unde perferendis saepe at non harum. Eligendi optio, dolorum a odit quae eum non fugit dolor.
                      Dicta,, magni .</p>
                    </div>
                  </div>
                </div>

                <div className="sectionTL">
                  <div className="Area">
                    <div className="contentTL">
                      <h2 className='h2esquer'>Nossos Objetivos</h2>
                      <p>res unde perferendis saepe at non harum. Eligendi optio, dolorum a odit quae eum non fugit dolor.
                         Dicta,es unde perferendis saepe at non harum. Eligendi optio, dolorum a odit quae eum non fugit dolor.
                         Dicta, magni sequi.</p>
                    </div>
                  </div>
                </div>
                
                <div className="sectionTL">
                  <div className="Area">
                    <div className="contentTL">
                      <h2>Serviços</h2>
                      <p>olorum aes unde perferendis saepe at non harum. Eligendi optio, dolorum a odit quae eum non fugit dolor.
                      Dicta, odit quae eum non fugit di sequies unde perferendis saepe at non harum. Eligendi optio, dolorum a odit quae eum non fugit dolor.
                      Dicta, magni .</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div> 
    


     </section>

     
      {/* Fim Timeline*/}


      {/* Início Orçamento*/}
     <section className="Orçamento" id='Orçamento'>
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
