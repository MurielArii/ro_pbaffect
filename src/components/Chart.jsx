import React from 'react';
import ReactFlow, { Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const defaultViewport = { x: 0, y: 0, zoom: 0.9 };

const Chart = ({ data }) => {
    const maj = data.map((element, index) => ({
        id: element.row,
        data: { label: element.row },
        position: { x: 100, y: 100 + (index * 100) }
    }));

    const minValue = data.map(element => (element.column))
    minValue.sort();

    const min = minValue.map((element, index) => ({
        id: element,
        data: { label: element },
        position: { x: 400, y: 100 + (index * 100) }
    }));

    const nodes = [...maj, ...min];

    const circularNodes = nodes.map(node => ({
        ...node,
        style: { width: 50, height: 50, borderRadius: '50%' }
    }));

    const edges = data.map(entry => ({
        id: `${entry.column}-${entry.row}`,
        source: entry.column,
        target: entry.row,
        label: entry.value,
        style: { stroke: '#000' },
        arrowHeadType: 'arrowclosed',
        labelStyle: { fontSize: 20 }
    }));

    return (
        <div className='w-full h-[80vh]'>
            <ReactFlow
                nodes={circularNodes}
                edges={edges}
                defaultViewport={defaultViewport}
                minZoom={0.2}
                maxZoom={2}
                attributionPosition="bottom-left"
            >
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default Chart;