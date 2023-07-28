function CircleLoader() {
  const radius = 40;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const circleStyle = {
    strokeDasharray: `${circumference}`,
    strokeDashoffset: `${circumference / 1.5}`,
    transformOrigin: '50% 50%',
  };

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
    >
      <circle
        stroke="#D1D5DB"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#347342"
        fill="transparent"
        strokeWidth={stroke}
        style={circleStyle}
        className="stroke-dashoffset transition-all ease-linear duration-1500 animate-spin"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

export default CircleLoader;
