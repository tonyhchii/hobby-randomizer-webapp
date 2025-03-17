interface WheelProps {
  hobbies: string[];
  rotation: number;
  size?: number; // Optional size prop to adjust the wheel size
}

function Wheel({ hobbies, rotation, size = 400 }: WheelProps) {
  const numSlices = hobbies.length;
  const sliceAngle = 360 / numSlices;

  return (
    <div className="relative flex items-center justify-center">
      {/* Wheel */}
      <div
        className="relative rounded-full overflow-hidden border-4 border-gray-500"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 2s ease-out",
          }}
        >
          {hobbies.map((hobby, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

            // Adjust text position for 1 or 2 slices
            let textX = (x1 + x2) / 2;
            let textY = (y1 + y2) / 2;
            let textRotation = startAngle + sliceAngle / 2;

            if (numSlices === 1) {
              textX = 50;
              textY = 50;
              textRotation = 0;
            } else if (numSlices === 2) {
              textX =
                50 +
                30 * Math.cos((Math.PI * (startAngle + sliceAngle / 2)) / 180);
              textY =
                50 +
                30 * Math.sin((Math.PI * (startAngle + sliceAngle / 2)) / 180);
              textRotation = startAngle + sliceAngle / 2;
            }

            return (
              <g key={index}>
                <path
                  d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`}
                  fill={`hsl(${(index * 137.5) % 360}, 80%, 60%)`}
                  stroke="white"
                  strokeWidth="0.5"
                />
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="4"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                >
                  {hobby}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Arrow on the right */}
      <div
        className="absolute -right-6 top-1/2 transform -translate-y-1/2"
        style={{ width: size * 0.1, height: size * 0.1, zIndex: 10 }} // zIndex to bring it in front
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Arrow pointing to the left */}
          <polygon
            points="0,50 100,0 100,100"
            fill="red"
            stroke="black" // Add a border
            strokeWidth="5" // Border thickness
          />
        </svg>
      </div>
    </div>
  );
}

export default Wheel;
