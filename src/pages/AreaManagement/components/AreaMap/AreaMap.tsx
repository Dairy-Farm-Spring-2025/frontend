import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SiHappycow } from 'react-icons/si';
import { DataGroupAreaPen } from '../AreaList/AreaList';
import CardAreaMap from './components/CardAreaMap';
import CardPenMap from './components/CardPenMap';

interface AreaMapProps {
  dataGroup: DataGroupAreaPen[];
}

const AreaMap = ({ dataGroup }: AreaMapProps) => {
  const generateNodesAndEdges = (dataGroup: DataGroupAreaPen[]) => {
    let xOffset = 0; // 🟢 Vị trí x động, tránh đè lên nhau
    const nodeSpacing = 350; // 🟢 Khoảng cách tối thiểu giữa các node

    const nodes: Node[] = [
      {
        id: 'dairyFarm',
        data: {
          label: (
            <div
              className={`bg-white px-5 flex  gap-4 justify-center items-center`}
            >
              <SiHappycow className="text-green-900" size={52} />
              <p className="text-2xl font-bold text-black">Dairy Farm</p>
            </div>
          ),
        },
        position: { x: (dataGroup.length * nodeSpacing) / 2, y: 200 },
        style: { width: 'auto', minWidth: 'fit-content' }, // ✅ Set chiều rộng cho node
      },
    ];
    const edges: Edge[] = [];

    dataGroup?.map((data, index) => {
      const areaNodeId = `area-${data.area.areaId}`;
      const cardNodeId = `card-${data.area.areaId}`;
      const cardWidth = data.pens.length; // Kích thước card mở rộng theo số pen
      xOffset += index === 0 ? 0 : nodeSpacing + cardWidth;
      // 📌 Node cho Area
      nodes.push({
        id: areaNodeId,
        data: { label: <CardAreaMap element={data} /> },
        position: { x: xOffset, y: 500 },
        style: { width: 'auto', minWidth: 'fit-content' }, // ✅ Set chiều rộng cho node
      });

      // 📌 Edge nối từ Dairy Farm → Area
      edges.push({
        id: `edge-df-${areaNodeId}`,
        source: 'dairyFarm',
        target: areaNodeId,
      });

      // 📌 Node cho Card chứa danh sách Pen
      nodes.push({
        id: cardNodeId,
        data: {
          label: <CardPenMap data={data} />,
        },
        position: { x: xOffset + 75, y: 700 },
        style: { width: 'auto', minWidth: 'fit-content' }, // ✅ Set chiều rộng cho node
      });

      edges.push({
        id: `edge-${areaNodeId}-${cardNodeId}`,
        source: areaNodeId,
        target: cardNodeId,
      });
    });

    return { nodes, edges };
  };
  const { nodes, edges } = generateNodesAndEdges(dataGroup);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        zoomOnScroll={true}
        fitViewOptions={{ padding: 1 }}
        translateExtent={[
          [-1000, -500], // Góc trái trên (minX, minY)
          [dataGroup.length * 500, 2000], // Góc phải dưới (maxX, maxY) - Điều chỉnh theo layout của bạn
        ]}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default AreaMap;
