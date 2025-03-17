import { Hobby } from "../models/types";

interface WheelProps {
  hobbies: Hobby[];
  rotation: number;
  size?: number; // Optional size prop to adjust the wheel size
}

function Wheel({ hobbies, rotation, size = 500 }: WheelProps) {
  const totalWeight = hobbies.reduce((sum, hobby) => sum + hobby.weight, 0);

  const wrapText = (text: string, maxLineLength: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      if (currentLine.length + words[i].length + 1 <= maxLineLength) {
        currentLine += " " + words[i];
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
    return lines;
  };

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
          {hobbies.reduce<React.JSX.Element[]>((acc, hobby, index) => {
            const startAngle =
              (acc.reduce((sum, el) => sum + el.props["data-weight"], 0) /
                totalWeight) *
              360;
            const endAngle =
              ((acc.reduce((sum, el) => sum + el.props["data-weight"], 0) +
                hobby.weight) /
                totalWeight) *
              360;
            const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

            // Determine if the slice angle is greater than 180 degrees
            const isLargeArc = endAngle - startAngle > 180 ? 1 : 0;

            // Calculate the midpoint for text positioning
            const midAngle = (startAngle + endAngle) / 2;
            const textX = 50 + 30 * Math.cos((Math.PI * midAngle) / 180);
            const textY = 50 + 30 * Math.sin((Math.PI * midAngle) / 180);

            const wrappedText = wrapText(hobby.name, 10); // Adjust maxLineLength as needed
            const lineHeight = 4;

            // Create a JSX element for the slice
            const slice = (
              <g key={index} data-weight={hobby.weight}>
                <path
                  d={`M50,50 L${x1},${y1} A50,50 0 ${isLargeArc},1 ${x2},${y2} Z`}
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
                  transform={`rotate(${-rotation}, ${textX}, ${textY})`}
                >
                  {wrappedText.map((line, i) => (
                    <tspan
                      key={i}
                      x={textX}
                      dy={i === 0 ? 0 : lineHeight} // Adjust vertical spacing between lines
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );

            // Add the slice to the accumulator
            return [...acc, slice];
          }, [])}
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
