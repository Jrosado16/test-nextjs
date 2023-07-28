import face from '../../assets/face/face1.svg';

function CircleChart() {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (70 / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="">
      <circle
        stroke="#acd1d5"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset: 0 }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#347342"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
       <image 
        href={face} 
        x={radius - stroke} 
        y={radius - stroke} 
        height={stroke * 2} 
        width={stroke * 2} 
      />
    </svg>
  );
}

export default CircleChart;
