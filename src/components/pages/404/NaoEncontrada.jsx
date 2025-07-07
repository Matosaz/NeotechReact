import React from 'react'
import './NaoEncontrada.css'
import { ArrowBack } from '@mui/icons-material';
import Lottie from 'lottie-react';
import animationData from '../../../assets/404-animation.json';

const NaoEncontrada = () => {

  const Voltar =() =>{
    window.history.back();
  }
  return ( 
    <div className='ErrorNotFound'>
      <div style={{ width: 600, height: 300 }} className='animation'>
                <Lottie animationData={animationData} loop={true} />

      </div>
      <h1 className='Errorh1'> Ooooooops...</h1>
      <h3 className='Errorh3'>Aparentemente sua página não foi encontrada! <br /> Tente retornar para a página anterior</h3>
      <button onClick={Voltar} className='voltar'>   
      <ArrowBack fontSize="small" className="icon" />Retornar</button>
      </div>

  )
}

export default NaoEncontrada
