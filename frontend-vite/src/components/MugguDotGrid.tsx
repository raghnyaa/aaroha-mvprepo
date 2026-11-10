export function MugguDotGrid({ className = '' }: { className?: string }) {
  // Create a grid of dots in muggu/kolam style
  const gridSize = 20;
  const dots = [];
  
  for (let y = 0; y < 30; y++) {
    for (let x = 0; x < 30; x++) {
      dots.push({ x: x * gridSize, y: y * gridSize });
    }
  }

  return (
    <svg className={className} width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.05">
        {dots.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r="1.5"
            fill="#2D2D2D"
          />
        ))}
      </g>
    </svg>
  );
}
