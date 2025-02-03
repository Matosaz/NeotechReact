import React from 'react'
import './NaoEncontrada.css'
import { ArrowBack } from '@mui/icons-material';

const NaoEncontrada = () => {

  const Voltar =() =>{
    window.history.back();
  }
  return ( 
    <div className='ErrorNotFound'>
      <button onClick={Voltar} className='voltar'>   
      <ArrowBack fontSize="small" className="icon" />Retornar</button>
      <h1 className='Errorh1'> Ops...</h1>
      <h3 className='Errorh3'>Aparentemente sua página não foi encontrada! Tente retornar para a página anterior</h3>
      </div>

  )
}

export default NaoEncontrada
