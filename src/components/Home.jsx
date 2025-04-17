
import './Home.css'
import RecVideo from '../assets/RecVideo.mp4'
import Phoneimg from '../assets/Mockup1.png'
import { UserContext } from './UserContext'
import { motion } from 'framer-motion';
import React, {useEffect, useState ,useContext,} from 'react';
  const Home = () => {
    const fadeIn = {
      hidden: {
        opacity: 0,
        y: 30,
        filter: 'blur(2px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 1.1,
          ease: [0.20, 1, 0.36, 1], // easeOutExpo
          delay: 0.1,
        },
      },
    };
    
    
    const { user } = useContext(UserContext);
const [firstName, setFirstName] = useState("Usuário");

useEffect(() => {
  if (user?.nome) {
    setFirstName(user.nome.split(' ')[0]);
  }
}, [user]); 

    useEffect(() => {
      
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
            setTimeout(updateCount, 0);
          } else {
            counter.innerText = target;
          }
        }
        updateCount();
      });
      activated = true;
    } else if (
      pageYOffset < container.offsetTop - container.offsetHeight - 400 ||
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

    return() =>{
      window.removeEventListener('scroll', scrollHandler);
    }
  }
},[]);

  return (
    
    
    <div className="home-container">
      <motion.section className='Hero' initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeIn}>
      <div className="txtimghero">
        <div className='AllTxtHero'> 
        <h2 className='TxtHero'> NeoTech</h2>
        <h3 className='TxtHero2'> The future is near</h3>
        <h3 className='TxtHeroBoasVindas'>Bem vindo(a), {firstName || +"!" }</h3>
        </div>
        <img src={Phoneimg} className='Phoneimg'/>
        </div>
        </motion.section>

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
                      <p>Somos uma empresa fundada para estabelecermos uma relação harmônica entre o meio ambiente
                         e o progresso tecnológico e industrial! Possuímos como principal objetivo promover um mundo
                         tecnologicamente sustentável com uma sociedade ecologicamente consciente por meio da reciclagem.
                         
                        
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sectionTL">
                  <div className="Area">
                    <div className="contentTL">
                      <h2>Importância</h2>
                      <p>A reciclagem de eletroeletrônicos é essencial para proteger o meio ambiente e evitar a poluição causada por substâncias tóxicas. Nosso empreendimento promove uma destinação segura e responsável dos resíduos, contribuindo para um planeta mais limpo e saudável.</p>
                    </div>
                  </div>
                </div>

                <div className="sectionTL">
                  <div className="Area">
                    <div className="contentTL">
                      <h2 className='h2esquer'>Nossos Objetivos</h2>
                      <p> Possuímos como nossos objetivos preservar o meio ambiente, disseminar a importância da reciclagem, implementar práticas sustentáveis e oferecer soluções econômicas para transformar resíduos em recursos valiosos e, deste modo, promovermos uma sociedade mais consciente e em harmonia com o planeta.</p>
                    </div>
                  </div>
                </div>
                
                <div className="sectionTL">
                  <div className="Area">
                    <div className="contentTL">
                      <h2>Serviços</h2>
                      <p> Nós prestamos serviços de reciclagem de descartes eletroeletrônicos, variando de dispositivos de pequeno
                          porte, como celulares e tablets, à dispositivos eletrônicos de grande porte, como geladeiras e televisões.
                          Nossos serviços são efetuados com o máximo cuidado e eficiência para lhe promover uma experiência
                          prática e confivável!
                          
                      </p>
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
            <video src={RecVideo} className='videocontent' autoPlay loop muted disablePictureInPicture ></video>
          </div>
          <div className="wrapconteudo">
            <div className="conteudo">
              <h2 className='TituloOrçamento'>Coleta sustentável</h2>
              <p>
              Recicle seus eletroeletrônicos e contribua para um planeta mais sustentável! Agende uma coleta conosco e descubra como podemos transformar seus resíduos em novas oportunidades. Com um atendimento rápido e eficiente, garantimos a destinação correta dos materiais. Entre em contato agora e colabore para um futuro sustentável!</p>
              <a href='/Calculadora' className='botao2'>Agenda uma coleta</a>
            </div>
          </div>
        </div>
    </section>
    {/* Fim Orçamento*/}


    </div>
  )
}

export default Home
