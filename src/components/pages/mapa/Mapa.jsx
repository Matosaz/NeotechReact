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
          src="https://www.google.com/maps/d/u/0/embed?mid=1aVenNdkwKjRCf3Ehd8mfpgrR2mJLlWU&ehbc=2E312F&noprof=1&output=embed&hl=pt"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-hidden="false"
          tabIndex="0"
        ></iframe>

      </div>
    </div>
  );
};

export default Mapa;
