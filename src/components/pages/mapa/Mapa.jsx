import React from 'react'
import './Mapa.css'

const Voltarmapa =() =>{
  window.history.back();
}

const Mapa = () => {
  return (
    
    <div className='mapafundo'>
      <button onClick={Voltarmapa} className='voltarmapa'> Retornar</button>
      <h3 className='encontre'>Encontre o ponto de coleta mais próximo à você!</h3>
      <iframe className="mapaview" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.560411723439!2d-46.89235592388534!3d-23.51233795979468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf03e63bc7a06d%3A0xc14462a7d6d04032!2sITB%20Bras%C3%ADlio%20Flores%20de%20Azevedo%20(FIEB)!5e0!3m2!1spt-BR!2sbr!4v1722785334462!5m2!1spt-BR!2sbr" frameborder="0"></iframe>
    </div>
  )
}



export default Mapa
