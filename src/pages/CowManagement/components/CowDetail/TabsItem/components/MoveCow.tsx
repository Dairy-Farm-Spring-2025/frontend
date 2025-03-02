import { useState, useEffect, FC } from 'react';
import { Divider } from 'antd';
import { useParams } from 'react-router-dom';
import useFetcher from '@hooks/useFetcher';
import { Area } from '@model/Area';
import { PenEntity } from '@model/CowPen/CowPen';
import SelectComponent from '@components/Select/SelectComponent';
import ModalComponent from '@components/Modal/ModalComponent';
import useToast from '@hooks/useToast';
import CardComponent from '@components/Card/CardComponent';
import { formatAreaType } from '@utils/format';
import { useTranslation } from 'react-i18next';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';

interface MoveCowProps {
    isOpen: boolean;
    onClose: () => void;
    mutateHistory: () => void;
}

const MoveCow: FC<MoveCowProps> = ({ isOpen, onClose, mutateHistory }) => {
    const { t } = useTranslation();
    const { id } = useParams();
    const toast = useToast();

    const [selectedPen, setSelectedPen] = useState<number | null>(null);
    const [selectedArea, setSelectedArea] = useState<number | null>(null);

    const { data: dataArea } = useFetcher<Area[]>('areas', 'GET');
    const { data: allPensInArea, mutate } = useFetcher<PenEntity[]>(selectedArea ? `pens/area/${selectedArea}` : '', 'GET');
    const { trigger: moveCow, isLoading } = useFetcher('cow-pens/create', 'POST');

    // Lọc danh sách các chuồng rỗng
    const dataPenInArea = allPensInArea?.filter(pen => pen.penStatus === "empty") || [];

    // Danh sách khu vực để hiển thị trong Select
    const areas = dataArea?.map(area => ({
        label: area.name,
        value: area.areaId,
    })) || [];

    // Tìm khu vực đã chọn
    const selectedAreaData = dataArea?.find(area => area.areaId === selectedArea);

    // Tìm chuồng được chọn
    const selectedPenData = dataPenInArea.find(pen => pen.penId === selectedPen);
    console.log("check selectedPenData ", selectedPenData)

    useEffect(() => {
        if (selectedArea) mutate();
    }, [selectedArea]);

    const handleMoveCow = async () => {
        if (!selectedPen || !id) return;

        await moveCow({ body: { cowId: id, penId: selectedPen } });
        mutateHistory();
        toast.showSuccess(t('Move cow successfully'));
        handleClose();
    };
    const handleClose = () => {
        setSelectedPen(null);
        setSelectedArea(null);
        onClose();
    };
    return (
        <ModalComponent
            title={t('Move Cow')}
            open={isOpen}
            onCancel={handleClose}
            onOk={handleMoveCow}
            width={1000}>
            <div className="grid grid-cols-2 gap-4">
                {/* Chọn khu vực */}
                <FormItemComponent
                    name="areaId"
                    label={<LabelForm>{t('Area')}</LabelForm>}
                    rules={[{ required: true }]}>
                    <SelectComponent
                        options={areas}
                        placeholder={t('Select area')}
                        onChange={setSelectedArea}
                        value={selectedArea} />
                </FormItemComponent>

                {/* Chọn chuồng */}
                <FormItemComponent
                    name="penId"
                    label={<LabelForm>{t('Pen')}</LabelForm>}
                    rules={[{ required: true }]}>
                    <SelectComponent
                        placeholder={t('Select Pen')}
                        options={dataPenInArea.map(pen => ({ value: pen.penId, label: pen.name }))}
                        onChange={setSelectedPen}
                        value={selectedPen}
                        disabled={!selectedArea}
                    />
                </FormItemComponent>
            </div>

            <Divider className="my-4" />

            {/* Chi tiết Area và Pen */}
            <div className="grid grid-cols-2 gap-4">
                {selectedAreaData && (
                    <CardComponent title={t('Area Details')} className="w-full">
                        <div className="flex flex-col gap-2">
                            <p><strong>{t('Dimensions')}:</strong> {selectedAreaData.length} x {selectedAreaData.width} m</p>
                            <p><strong>{t('Type')}:</strong> {formatAreaType(selectedAreaData.areaType)}</p>
                            <p><strong>{t('Description')}:</strong> {selectedAreaData.description}</p>
                        </div>
                    </CardComponent>
                )}

                {selectedPenData && (
                    <CardComponent title={t('Pen Details')} className="w-full">
                        <div className="flex flex-col gap-2">
                            <p><strong>{t('Name')}:</strong> {selectedPenData.name}</p>
                            <p><strong>{t('Status')}:</strong> {selectedPenData.penStatus}</p>
                            {selectedPenData.description && <p><strong>{t('Description')}:</strong> {selectedPenData.description.replace(/<[^>]+>/g, '')}</p>}
                        </div>
                    </CardComponent>
                )}
            </div>
        </ModalComponent>
    );
};

export default MoveCow;
