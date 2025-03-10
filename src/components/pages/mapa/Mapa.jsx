import React from 'react';
import { ArrowBack } from '@mui/icons-material';
import './Mapa.css';

const Voltarmapa = () => {
  window.history.back();
};

const Mapa = () => {
  return (
    <div className='botaotestediv'>
      <button onClick={Voltarmapa} className='voltarmapa'>
        <ArrowBack fontSize="small" className="icon" />
        Retornar
      </button>
      <div className='mapafundo'>
        <h3 className='encontre'>Encontre o ponto de coleta mais próximo à você!</h3>
        <iframe
          className="mapaview"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.560411723439!2d-46.89235592388534!3d-23.51233795979468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf03e63bc7a06d%3A0xc14462a7d6d04032!2sITB%20Bras%C3%ADlio%20Flores%20de%20Azevedo%20(FIEB)!5e0!3m2!1spt-BR!2sbr!4v1722785334462!5m2!1spt-BR!2sbr"
          frameBorder="1"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </div>
    </div>
  );
};

export default Mapa;
