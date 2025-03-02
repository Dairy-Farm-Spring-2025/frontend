import { useState, useEffect } from 'react';
import { Modal, Select, Button, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import useFetcher from '@hooks/useFetcher';
import { Area } from '@model/Area';
import { PenEntity } from '@model/CowPen/CowPen';
import SelectComponent from '@components/Select/SelectComponent';
import ModalComponent from '@components/Modal/ModalComponent';

import { FC } from 'react';

interface MoveCowProps {
    isOpen: boolean;
    onClose: () => void;
}
const MoveCow: FC<MoveCowProps> = ({ isOpen, onClose }) => {
    const { id } = useParams();

    const [selectedPen, setSelectedPen] = useState(null);
    const { data: dataArea } = useFetcher<Area[]>('areas', 'GET');
    const [selectedArea, setSelectedArea] = useState<number | null>(null);
    const { data: allPensInArea, mutate } = useFetcher<PenEntity[]>(
        selectedArea ? `pens/area/${selectedArea}` : '',
        'GET'
    );
    const dataPenInArea = allPensInArea?.filter(pen => pen.penStatus === "empty") || [];
    const { trigger: moveCow, isLoading } = useFetcher('cow-pens/create', 'POST');
    useEffect(() => {
        if (selectedArea) {
            mutate();
        };
    }, [selectedArea]);

    const handleMoveCow = async () => {
        if (!selectedPen) return;
        await moveCow(selectedPen);
        onClose();
    };

    return (
        <ModalComponent title="Move Cow" open={isOpen} onCancel={onClose} onOk={handleMoveCow}>
            <SelectComponent
                style={{ width: 200 }}
                options={dataArea?.map(area => ({ value: area.areaId, label: area.name }))}
                onChange={(value) => setSelectedArea(value)}
                value={selectedArea}  // Đảm bảo rằng giá trị được reset
                placeholder="please select area"
            />
            <Divider className='my-4' />
            <SelectComponent
                style={{ width: '100%' }}
                placeholder="Select Pen"
                options={dataPenInArea?.map(pen => ({ value: pen.penId, label: pen.name }))}
                onChange={setSelectedPen}
                value={selectedPen}
                disabled={!selectedArea}
            />
        </ModalComponent>
    );
};

export default MoveCow; // Đảm bảo có dòng này