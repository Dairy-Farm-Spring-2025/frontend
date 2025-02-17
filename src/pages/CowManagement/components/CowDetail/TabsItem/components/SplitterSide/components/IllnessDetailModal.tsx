import { Avatar } from 'antd';
import { useEffect, useState } from 'react';
import DescriptionComponent from '../../../../../../../../components/Description/DescriptionComponent';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import { IllnessDetail } from '../../../../../../../../model/Cow/IllnessDetail';
import { getAvatar } from '../../../../../../../../utils/getImage';
import { formatStatusWithCamel } from '../../../../../../../../utils/format';
import CardComponent from '../../../../../../../../components/Card/CardComponent';
import QuillRender from '../../../../../../../../components/UI/QuillRender';
import TagComponents from '../../../../../../../../components/UI/TagComponents';

interface IllnessDetailModalProps {
  data: IllnessDetail;
  modal: any;
}
const IllnessDetailModal = ({ data, modal }: IllnessDetailModalProps) => {
  const [detail, setDetail] = useState<IllnessDetail>();

  useEffect(() => {
    if (data && modal.open) {
      setDetail(data);
    }
    console.log(data);
  }, [data, modal.open]);

  const handleCancel = () => {
    setDetail(undefined);
    modal.closeModal();
  };
  return (
    <ModalComponent
      title="Illness Detail"
      open={modal.open}
      onCancel={handleCancel}
      footer={[]}
      width={1000}
    >
      <CardComponent
        title={
          <div className="flex gap-5">
            <TagComponents color="blue">{detail?.date}</TagComponents>
            <TagComponents color="gold">
              {formatStatusWithCamel(detail?.status as string)}
            </TagComponents>
          </div>
        }
        className="mb-5"
      >
        <QuillRender description={detail?.description as string} />
      </CardComponent>
      <div className="p-2 flex gap-5">
        <DescriptionComponent
          layout="horizontal"
          title={<p className="mx-4">Veterinarian</p>}
          className="w-1/2"
          items={[
            {
              label: 'Avatar',
              children: (
                <Avatar
                  size={32}
                  src={getAvatar(detail?.veterinarian?.profilePhoto as string)}
                />
              ),
              span: 3,
            },
            {
              label: 'Name',
              children: detail?.veterinarian?.name,
              span: 3,
            },
            {
              label: 'Phone number',
              children: detail?.veterinarian?.phoneNumber,
              span: 3,
            },
            {
              label: 'Date of birth',
              children: detail?.veterinarian?.dob,
              span: 3,
            },
            {
              label: 'Gender',
              children: detail?.veterinarian?.gender,
              span: 3,
            },
          ]}
        />
        <DescriptionComponent
          layout="horizontal"
          title={<p className="mx-4">Vaccine</p>}
          className="w-1/2"
          items={[
            {
              label: 'Name',
              children: detail?.vaccine?.name,
              span: 3,
            },
            {
              label: 'Unit',
              children: detail?.vaccine?.unit,
              span: 3,
            },
            {
              label: 'Status',
              children: formatStatusWithCamel(
                detail?.vaccine?.status as string
              ),
              span: 3,
            },
            {
              label: 'Warehouse',
              children: detail?.vaccine?.warehouseLocationEntity?.name,
              span: 3,
            },
            {
              label: 'Quantity',
              children: detail?.vaccine?.quantity,
              span: 3,
            },
          ]}
        />
      </div>
    </ModalComponent>
  );
};

export default IllnessDetailModal;
