import React from 'react';

interface MandalaPatternProps {
  type?: 'radial' | 'geometric' | 'kaleidoscope' | 'concentric';
  className?: string;
  opacity?: number;
}

export function MandalaPattern({ type = 'radial', className = '', opacity = 0.06 }: MandalaPatternProps) {
  const patterns = {
    // Clean radial pattern with geometric precision
    radial: (
      <svg className={className} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity={opacity}>
          {/* Center dot */}
          <circle cx="200" cy="200" r="4" fill="currentColor" />
          
          {/* Concentric circles */}
          <circle cx="200" cy="200" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="200" cy="200" r="160" stroke="currentColor" strokeWidth="0.5" fill="none" />
          
          {/* Radiating lines - 12 divisions like a clock */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <line
              key={angle}
              x1="200"
              y1="200"
              x2={200 + Math.cos((angle * Math.PI) / 180) * 160}
              y2={200 + Math.sin((angle * Math.PI) / 180) * 160}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Outer dots at intersection points */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <circle
              key={`dot-${angle}`}
              cx={200 + Math.cos((angle * Math.PI) / 180) * 160}
              cy={200 + Math.sin((angle * Math.PI) / 180) * 160}
              r="3"
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    ),
    
    // Geometric hexagonal pattern
    geometric: (
      <svg className={className} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity={opacity}>
          {/* Center hexagon */}
          <path
            d="M 200 170 L 226 185 L 226 215 L 200 230 L 174 215 L 174 185 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          
          {/* Middle hexagon ring */}
          <path
            d="M 200 120 L 246 145 L 246 195 L 200 220 L 154 195 L 154 145 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          
          {/* Outer hexagon */}
          <path
            d="M 200 70 L 266 105 L 266 175 L 200 210 L 134 175 L 134 105 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          
          {/* Connecting lines creating star pattern */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={angle}>
              <line
                x1="200"
                y1="200"
                x2={200 + Math.cos((angle * Math.PI) / 180) * 130}
                y2={200 + Math.sin((angle * Math.PI) / 180) * 130}
                stroke="currentColor"
                strokeWidth="0.5"
              />
              {/* Small circles at vertices */}
              <circle
                cx={200 + Math.cos((angle * Math.PI) / 180) * 130}
                cy={200 + Math.sin((angle * Math.PI) / 180) * 130}
                r="2"
                fill="currentColor"
              />
            </g>
          ))}
          
          {/* Triangular segments */}
          {[30, 90, 150, 210, 270, 330].map((angle) => (
            <path
              key={`tri-${angle}`}
              d={`M 200 200 L ${200 + Math.cos((angle * Math.PI) / 180) * 100} ${200 + Math.sin((angle * Math.PI) / 180) * 100} L ${200 + Math.cos(((angle + 60) * Math.PI) / 180) * 100} ${200 + Math.sin(((angle + 60) * Math.PI) / 180) * 100} Z`}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
          ))}
        </g>
      </svg>
    ),
    
    // Kaleidoscope pattern - repeating wedges
    kaleidoscope: (
      <svg className={className} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity={opacity}>
          {/* 8 wedges creating kaleidoscope effect */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 200 200)`}>
              {/* Outer arc */}
              <path
                d="M 200 200 L 200 50 A 150 150 0 0 1 235.36 64.64 Z"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
              />
              
              {/* Inner decorative arc */}
              <path
                d="M 200 200 L 200 100 A 100 100 0 0 1 223.57 109.76 Z"
                fill="currentColor"
                fillOpacity="0.3"
              />
              
              {/* Radial line */}
              <line
                x1="200"
                y1="200"
                x2="200"
                y2="50"
                stroke="currentColor"
                strokeWidth="1"
              />
              
              {/* Decorative dots along radius */}
              <circle cx="200" cy="80" r="2" fill="currentColor" />
              <circle cx="200" cy="120" r="2" fill="currentColor" />
              <circle cx="200" cy="160" r="2" fill="currentColor" />
            </g>
          ))}
          
          {/* Center circle */}
          <circle cx="200" cy="200" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="200" cy="200" r="5" fill="currentColor" />
        </g>
      </svg>
    ),
    
    // Concentric circles with data visualization feel
    concentric: (
      <svg className={className} width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity={opacity}>
          {/* Concentric rings */}
          {[20, 40, 60, 80, 100, 120, 140, 160].map((radius) => (
            <circle
              key={radius}
              cx="200"
              cy="200"
              r={radius}
              stroke="currentColor"
              strokeWidth={radius === 160 ? "1.5" : "0.5"}
              fill="none"
            />
          ))}
          
          {/* Cross axes */}
          <line x1="40" y1="200" x2="360" y2="200" stroke="currentColor" strokeWidth="0.5" />
          <line x1="200" y1="40" x2="200" y2="360" stroke="currentColor" strokeWidth="0.5" />
          
          {/* Diagonal axes */}
          <line x1="87" y1="87" x2="313" y2="313" stroke="currentColor" strokeWidth="0.5" />
          <line x1="313" y1="87" x2="87" y2="313" stroke="currentColor" strokeWidth="0.5" />
          
          {/* Data points on rings */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            return [60, 100, 140].map((radius) => (
              <circle
                key={`${angle}-${radius}`}
                cx={200 + Math.cos((angle * Math.PI) / 180) * radius}
                cy={200 + Math.sin((angle * Math.PI) / 180) * radius}
                r="2.5"
                fill="currentColor"
              />
            ));
          })}
          
          {/* Center point */}
          <circle cx="200" cy="200" r="6" fill="currentColor" />
        </g>
      </svg>
    ),
  };

  return patterns[type];
}
