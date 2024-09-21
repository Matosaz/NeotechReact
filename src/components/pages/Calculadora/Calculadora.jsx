import React, { useState } from 'react';
import { Slider, Select, MenuItem, Button, Typography, Box, InputLabel } from '@mui/material';
import './Calculadora.css';

const Calculadora = () => {
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemType, setItemType] = useState('small');
  const [price, setPrice] = useState(60.99); // Preço inicial baseado em pequenos dispositivos

  const handleQuantityChange = (e, newValue) => {
    setItemQuantity(newValue);
    calculatePrice(newValue, itemType);
  };

  const handleTypeChange = (e) => {
    setItemType(e.target.value);
    calculatePrice(itemQuantity, e.target.value);
  };

  const calculatePrice = (quantity, type) => {
    let basePrice = 60.99; // Preço inicial para pequenos dispositivos
    if (type === 'medium') basePrice = 110.99;
    else if (type === 'large') basePrice = 200.99;

    const totalPrice = basePrice * quantity;
    setPrice(totalPrice.toFixed(2)); // Arredondar para 2 casas decimais
  };
  
const Voltarcalculadora=() =>{
  window.history.back();
}

  return (
    <Box className="CalculadoraBody" display="flex" justifyContent="center" alignItems="center">
       <button onClick={Voltarcalculadora} className='voltarcalculadora'> Retornar</button>
      <Box className="calculator-container" display="flex" justifyContent="space-between" p={5} borderRadius={2} boxShadow={3} maxWidth="1700px" margin="0 auto" bgcolor="#fff">
        
        {/* Área de Inputs */}
        <Box className="inputs-container" flex={1} pr={5}>
          <Typography  fontFamily='Poppins' variant="h3" gutterBottom>Calculadora de Reciclagem</Typography>
          
          {/* Controle de Quantidade */}
          <Box mb={2}>
            <InputLabel shrink>Quantidade de itens</InputLabel>
            <Slider  className="custom-slider"fontFamily='Poppins'
              value={itemQuantity}
              onChange={handleQuantityChange}
              aria-labelledby="quantidade-slider"
              valueLabelDisplay="auto"
              step={1}
              min={1}
              max={150}
            />
          </Box>

          {/* Controle de Tipo */}
          <Box mb={3}>
            <InputLabel shrink>Tipo de item</InputLabel>
            <Select
              value={itemType}
              onChange={handleTypeChange}
              fullWidth
              displayEmpty
            >
              <MenuItem fontFamily='Poppins'value="small">Pequenos dispositivos (Smartphones, Tablets)</MenuItem>
              <MenuItem fontFamily='Poppins'value="medium">Dispositivos médios (Notebooks, Monitores)</MenuItem>
              <MenuItem fontFamily='Poppins'value="large">Dispositivos grandes (Televisores, Geladeiras)</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Área de Resultado */}
        <Box className="result-container" flex={1}  display="flex" flexDirection="column" alignItems="center"  borderRadius={2} p={3.5}>
          <Typography fontWeight='700' fontFamily='Poppins'variant="h5">Preço Total</Typography>
          <Typography fontFamily='Poppins' variant="h3" color="primary" mb={1.5}>${price}</Typography>

          <Typography fontWeight='500' fontFamily='Poppins' variant="subtitle1" pt={1}>Quantidade de itens: {itemQuantity}</Typography>
          <Typography fontWeight='500' fontFamily='Poppins' variant="subtitle1"pt={0.5}>Preço unitário: ${(price / itemQuantity).toFixed(2)}</Typography>

          <Box mt={4}>
            <Button fontFamily='Poppins'variant="contained" color="" >Solicitar orçamento mais<br /> detalhado</Button>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Calculadora;
