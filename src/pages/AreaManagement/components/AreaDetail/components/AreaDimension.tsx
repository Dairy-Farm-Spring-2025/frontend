import { Area } from '@model/Area';
import { Pen } from '@model/Pen';

interface AreaDimensionProps {
  area: Area;
  pens: Pen[];
}

const AreaDimension = ({ area, pens }: AreaDimensionProps) => {
  const isValidNumber = (value: any) =>
    typeof value === 'number' && !isNaN(value) && value > 0;

  const widthValid = isValidNumber(area.width);
  const lengthValid = isValidNumber(area.length);
  const penWidthValid = isValidNumber(area.penWidth);
  const penLengthValid = isValidNumber(area.penLength);

  const numPensPerRow =
    widthValid && lengthValid && penWidthValid && penLengthValid
      ? Math.max(
          1,
          (Math.floor(area.width / area.penWidth) *
            Math.floor(area.length / area.penLength)) /
            2
        )
      : 4;

  const numPensX = Math.max(1, numPensPerRow);
  const maxWidth = 1000;
  const diagramWidth = Math.min(numPensX * 400, maxWidth);
  const cellWidth = diagramWidth / numPensX;
  const cellHeight = 180;
  const dividerSpace = 60;

  return (
    widthValid &&
    lengthValid &&
    penWidthValid &&
    penLengthValid && (
      <div className="flex">
        <svg
          width="100%"
          height="500"
          viewBox={`0 0 ${diagramWidth + 100} 550`}
        >
          {/* Area Border */}
          <rect
            x="50"
            y="50"
            width={diagramWidth}
            height="400"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />

          {/* Length Arrow */}
          <line
            x1="50"
            y1="90%"
            x2={50 + diagramWidth}
            y2="90%"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x={50 + diagramWidth / 2}
            y="520"
            textAnchor="middle"
            fontSize="20"
          >
            {area.width}m
          </text>

          {/* Width Arrow */}
          <line
            x1="30"
            y1="50"
            x2="30"
            y2="85%"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="10"
            y="250"
            textAnchor="middle"
            fontSize="20"
            transform="rotate(-90 10,250)"
          >
            {area.length}m
          </text>

          {/* Arrow Definition */}
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="10"
              refY="5"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10" fill="black" />
            </marker>
          </defs>

          {/* Grid of Pens in Two Rows */}
          {[...Array(2)].map((_, row) => (
            <g key={row}>
              {[...Array(numPensX)].map((_, col) => {
                const index = row * numPensX + col;
                const x = 50 + col * cellWidth;
                const y = 50 + row * (cellHeight + dividerSpace);
                const isOccupied = Array.isArray(pens) && pens[index] != null;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={x}
                    y={y}
                    width={cellWidth}
                    height={cellHeight}
                    fill={isOccupied ? '#34D399' : 'white'}
                    stroke="black"
                    strokeWidth="1"
                  />
                );
              })}
            </g>
          ))}

          {/* Entrance Divider Line */}
          <line
            x1="60"
            y1={80 + cellHeight}
            x2={(50 + diagramWidth) / 2.3}
            y2={80 + cellHeight}
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x={50 + diagramWidth / 2.2}
            y={57 + cellHeight + 30}
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
          >
            Entrance
          </text>
        </svg>
      </div>
    )
  );
};

export default AreaDimension;
