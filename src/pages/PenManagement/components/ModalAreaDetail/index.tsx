import { Alert, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import LabelForm from '../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../hooks/useFetcher';
import { Area } from '../../../../model/Area';

interface ModalAreaDetailsProps {
  modal: any;
  areaId: number | null;
}

const ModalAreaDetails = ({ modal, areaId }: ModalAreaDetailsProps) => {
  const { data, isLoading, error } = useFetcher<Area>(`areas/${areaId}`, 'GET');
  const { t } = useTranslation();

  const onClose = () => {
    modal.closeModal();
  };

  return (
    <ModalComponent
      open={modal.open}
      onCancel={onClose}
      title={t('Area Details')}
      footer={null}
      width={800}
    >
      {isLoading ? (
        <Spin tip="Loading area details..." />
      ) : error ? (
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      ) : (
        <div className="area-details">
          {data ? (
            <>
              <p>
                <LabelForm>Description:</LabelForm> {data.description}
              </p>
              <p>
                <LabelForm>Dimensions:</LabelForm> {data.length} x {data.width}{' '}
                cm
              </p>
              <p>
                <LabelForm>Type:</LabelForm> {data.areaType}
              </p>
            </>
          ) : (
            <p>{t('No details available for this area')}</p>
          )}
        </div>
      )}
    </ModalComponent>
  );
};

export default ModalAreaDetails;
