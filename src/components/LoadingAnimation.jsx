import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/loading-animation.json';

const LoadingAnimation = ({ size = 154, style = {} }) => {
  return (
    <Lottie
      animationData={loadingAnimation}
      loop={true}
      autoplay={true}
      style={{
        width: size,
        height: size,
        ...style
      }}
    />
  );
};

export default LoadingAnimation;