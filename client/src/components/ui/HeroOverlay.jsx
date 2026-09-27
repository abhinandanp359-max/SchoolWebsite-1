import React from 'react';

const HeroOverlay = ({ intensity = 'normal' }) => {
  const getGradient = () => {
    if (intensity === 'high') {
      return 'linear-gradient(90deg, rgba(55, 20, 15, 0.92) 0%, rgba(55, 20, 15, 0.80) 40%, rgba(55, 20, 15, 0.60) 70%, rgba(55, 20, 15, 0.35) 100%)';
    }
    return 'linear-gradient(90deg, rgba(55, 20, 15, 0.82) 0%, rgba(55, 20, 15, 0.58) 35%, rgba(55, 20, 15, 0.30) 65%, rgba(55, 20, 15, 0.15) 100%)';
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: getGradient()
      }}
    />
  );
};

export default HeroOverlay;
