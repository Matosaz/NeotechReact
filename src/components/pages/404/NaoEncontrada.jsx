import React from 'react'
import './NaoEncontrada.css'
import { ArrowBack } from '@mui/icons-material';
import cat404 from '../../../assets/error404-2.gif';
const NaoEncontrada = () => {

  const Voltar =() =>{
    window.history.back();
  }
  return ( 
    <div className='ErrorNotFound'>
   
      <img className="cat404"src={cat404} alt="" />
      <h1 className='Errorh1'> Ooooooops...</h1>
      <h3 className='Errorh3'>Aparentemente sua página não foi encontrada! Tente retornar para a página anterior</h3>
      <button onClick={Voltar} className='voltar'>   
      <ArrowBack fontSize="small" className="icon" />Retornar</button>
      </div>

  )
}

export default NaoEncontrada
