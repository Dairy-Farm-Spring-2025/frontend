import { Area } from '@model/Area';
import { Pen } from '@model/Pen';

interface AreaDimensionProps {
  area: Area;
  pens: Pen[];
}
const AreaDimension = ({ area, pens }: AreaDimensionProps) => {
  // Tính toán số lượng Pen theo hàng và cột
  const numPensX = Math.floor(area.width / area.penWidth);
  const numPensY = Math.floor(area.length / area.penLength);
  const isValidNumber = (value: any) =>
    typeof value === 'number' && !isNaN(value) && value > 0;

  // Kích thước từng ô trong lưới Pen
  const cellWidth = 600 / numPensX;
  const cellHeight = 400 / numPensY;
  return (
    isValidNumber(area.width) &&
    isValidNumber(area.length) &&
    isValidNumber(area.penWidth) &&
    isValidNumber(area.penLength) && (
      <div className=" flex justify-start w-1/2">
        <svg width="100%" height="300" viewBox="0 0 700 500">
          {/* Vẽ khung tổng thể của Area */}
          <rect
            x="50"
            y="50"
            width="600"
            height="400"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />

          {/* Mũi tên Chiều dài */}
          <line
            x1="50"
            y1="470"
            x2="650"
            y2="470"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text x="350" y="495" textAnchor="middle" fontSize="25">
            {area.width}m
          </text>

          {/* Mũi tên Chiều rộng */}
          <line
            x1="30"
            y1="50"
            x2="30"
            y2="450"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="10"
            y="250"
            textAnchor="middle"
            fontSize="25"
            transform="rotate(-90 10,250)"
          >
            {area.length}m
          </text>

          {/* Định nghĩa mũi tên SVG */}
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

          {/* Vẽ lưới Pen bên trong Area */}
          {Array.from({ length: numPensY }).map((_, row) =>
            Array.from({ length: numPensX }).map((_, col) => {
              const x = 50 + col * cellWidth;
              const y = 50 + row * cellHeight;

              const index = row * numPensX + col;
              const isOccupied = pens && index < pens.length; // Nếu index nhỏ hơn số pens thực tế, tô xanh

              return (
                <rect
                  key={`${row}-${col}`}
                  x={x}
                  y={y}
                  width={cellWidth}
                  height={cellHeight}
                  fill={isOccupied ? '#34D399' : 'white'} // Tô xanh nếu occupied
                  stroke="black"
                  strokeWidth="1"
                />
              );
            })
          )}
        </svg>
      </div>
    )
  );
};

export default AreaDimension;
