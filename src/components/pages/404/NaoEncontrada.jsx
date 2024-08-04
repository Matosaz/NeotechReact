import React from 'react'
import './NaoEncontrada.css'
const NaoEncontrada = () => {

  const Voltar =() =>{
    window.history.back();
  }
  return (
    <div className='Error'>
      <h1 className='Errorh1'> Ops...</h1>
      <h3 className='Errorh3'>Aparentemente sua página não foi encontrada! Tente retornar para a página anterior</h3>
      <button onClick={Voltar} className='voltar'>Retornar</button>
    </div>
  )
}

export default NaoEncontrada
