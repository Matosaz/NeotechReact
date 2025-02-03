import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  Stack,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import "./Faq.css";


const VoltarFAQ =() =>{
  window.history.back();
}
const faqs = [
  { id: "1", 
    title: "O que é reciclagem de eletroeletrônicos e por que ela é importante?",
    content: "A reciclagem de eletroeletrônicos consiste na coleta, triagem e reaproveitamento dos componentes dos dispositivos descartados. Esse processo evita a contaminação ambiental, reduz o acúmulo de lixo eletrônico em aterros e recupera materiais valiosos, contribuindo para a sustentabilidade e a economia circular." },
  {
    id: "2",
    title: "Quais tipos de eletroeletrônicos são aceitos para reciclagem?",
    content: "Em geral, aceitamos uma ampla variedade de dispositivos, como smartphones, tablets, computadores, impressoras, televisores, eletrodomésticos e outros aparelhos eletrônicos que estejam em desuso, obsoletos ou danificados.",
  },
  {
    id: "3",
    title: "Como funciona o processo de reciclagem de eletroeletrônicos no nosso empreendimento?",
    content: "O processo inicia-se com a coleta dos aparelhos, seguida de uma triagem para separar os itens passíveis de reparo, reutilização ou reciclagem. Em seguida, os equipamentos são desmontados, e seus componentes (metais, plásticos, vidros, etc.) são separados e enviados para os centros de reciclagem especializados, garantindo o descarte seguro e a recuperação de materiais.",
  },
  {
    id: "4",
    title: "Como posso descartar meus eletroeletrônicos de forma segura e sustentável?",
    content: "Você pode agendar uma coleta conosco ou entregar os aparelhos diretamente em nossos pontos de coleta autorizados. Nosso empreendimento segue todas as normas ambientais e de segurança, assegurando que seus dispositivos sejam tratados de forma correta e sustentável.",
  },
  {
    id: "5",
    title: "Quais são os benefícios ambientais e econômicos da reciclagem de eletroeletrônicos?",
    content: "Além de reduzir a quantidade de resíduos enviados a aterros e evitar a contaminação do solo e da água, a reciclagem de eletroeletrônicos permite a recuperação de materiais raros e valiosos. Isso diminui a necessidade de extração de novas matérias-primas, gera emprego e renda, e promove um ciclo de economia sustentável, preservando o meio-ambiente e assegurando um futuro ecológico.",
  },
];

function Faq() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const beneficios = [
    "Serviço de qualidade!",
    "Sustentabilidade atrelada à tecnologia"
  ];
  useEffect(() => {
    const createCircle = () => {
      const circle = document.createElement("div");
      circle.classList.add("circle");

      const size = Math.random() * 65 + 15; // Tamanho entre 20px e 80px
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;

      // Cores aleatórias
      const colors = ["#FF5733", "#33FF57", "#337BFF", "#FF33E4", "#FFC133"];
      const color = colors[Math.floor(Math.random() * colors.length)];

      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      circle.style.top = `${posY}px`;
      circle.style.left = `${posX}px`;
      circle.style.backgroundColor = color;

      document.querySelector(".BackgroundAnimation").appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 4000);
    };

    const interval = setInterval(createCircle, 700); // Criar um círculo a cada 0.8s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ContentFaq">
      <button onClick={VoltarFAQ} className='voltar-FAQ'> <ArrowBack fontSize="small" className="icon" />Retornar</button>
    
      {/* Fundo animado */}
      <div className="BackgroundAnimation"></div>

      <div className="HeroFaq">
        <h4 className="FaqSign" data-text="FAQ (Perguntas Frequentes">)</h4>
        <h1>Vamos produzir algo incrível juntos?</h1>
        <p>
        Nosso propósito é cuidar de você e do planeta. Estamos comprometidos em proporcionar um atendimento personalizado e de alta qualidade, transformando cada dúvida em uma possibilidade de estruturar um futuro mais sustentável, harmônico e seguro para todos.
        </p>
        <Stack direction="row" spacing={10} mt={5}>
      {beneficios.map((beneficios, index) => (
        <Stack direction="row" spacing={1} alignItems="center" key={index}>
          <CheckCircleIcon  /> 
            {beneficios}
        </Stack>
      ))}
    </Stack>
      </div>

      <div className="Accordion">
        {faqs.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expanded === faq.id}
            onChange={handleChange(faq.id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {faq.title}
            </AccordionSummary>
            {faq.content && <AccordionDetails>{faq.content}</AccordionDetails>}
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default Faq;
