import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CustomButton = ({ onClick, children, top = '35px', left = '35px', style = {} }) => {
  return (
    
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        position: 'absolute',
        top: top,
        left: left,
        backgroundColor: 'transparent',
        color: '#2f7c37',
        fontSize: '1.1rem',
        fontWeight: 600,
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 200ms ease-in-out',
        padding: '8px 12px',
        ...style,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#2f7c37';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = '#2f7c37';
      }}
    >
                          <ArrowBackIcon fontSize="small" />

      {children}
    </button>
  );
};

export default CustomButton;
