import React from 'react';

/**
 * BotanicalAccent - Refined, elegant corner leaf decoration matching the Admission page design.
 * Standardized across the entire website for a cohesive, natural school aesthetic.
 */
const BotanicalAccent = ({ 
  variant = 'corner', 
  className = '', 
  flip = false,
  rotate = 0,
  style = {},
  ...props 
}) => {
  const transformStyle = {
    transform: `${flip ? 'scaleX(-1) ' : ''}${rotate ? `rotate(${rotate}deg)` : ''}`.trim(),
    ...style
  };

  // Gracefully cascading organic botanical branch with natural leaves (Admission page style)
  return (
    <svg
      viewBox="0 0 160 160"
      fill="currentColor"
      className={`pointer-events-none select-none ${className}`}
      style={transformStyle}
      aria-hidden="true"
      {...props}
    >
      {/* Main cascading stem */}
      <path
        d="M0 0 C40 15, 85 45, 115 90 C135 120, 145 145, 150 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
      {/* Secondary twig */}
      <path
        d="M60 27 C80 20, 110 30, 130 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.65"
      />
      {/* Organic leaves along main stem */}
      <path d="M22 6 C32 2, 44 8, 48 18 C42 22, 30 18, 22 6Z" />
      <path d="M42 28 C38 40, 26 46, 16 42 C18 30, 30 24, 42 28Z" />
      <path d="M58 24 C72 16, 86 22, 92 34 C82 38, 68 34, 58 24Z" />
      <path d="M78 48 C72 62, 58 68, 46 62 C50 48, 64 42, 78 48Z" />
      <path d="M96 58 C112 50, 126 58, 130 72 C120 76, 106 70, 96 58Z" />
      <path d="M108 82 C100 96, 86 100, 76 92 C82 78, 96 74, 108 82Z" />
      <path d="M124 104 C138 98, 150 108, 152 122 C142 124, 130 118, 124 104Z" />
      <path d="M132 126 C124 140, 110 142, 102 134 C108 120, 122 118, 132 126Z" />
      <path d="M146 142 C154 136, 162 144, 160 154 C152 156, 144 150, 146 142Z" />

      {/* Leaves on secondary twig */}
      <path d="M84 18 C94 10, 106 14, 110 24 C102 28, 90 26, 84 18Z" />
      <path d="M112 28 C124 22, 136 28, 138 38 C128 42, 118 38, 112 28Z" />
      <path d="M128 50 C138 46, 146 54, 144 64 C136 66, 128 60, 128 50Z" />
    </svg>
  );
};

export default BotanicalAccent;
