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
import { t } from 'i18next';

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
      title={t('Illness Detail')}
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
              {t(formatStatusWithCamel(detail?.status as string))}
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
          title={<p className="mx-4">{t('Veterinarian')}</p>}
          className="w-1/2"
          items={[
            {
              label: t('Avatar'),
              children: (
                <Avatar
                  size={32}
                  src={getAvatar(detail?.veterinarian?.profilePhoto as string)}
                />
              ),
              span: 3,
            },
            {
              label: t('Name'),
              children: detail?.veterinarian?.name,
              span: 3,
            },
            {
              label: t('ww'),
              children: detail?.veterinarian?.phoneNumber,
              span: 3,
            },
            {
              label: t('Date Of Birth'),
              children: detail?.veterinarian?.dob,
              span: 3,
            },
            {
              label: t('Gender'),
              children: t(
                formatStatusWithCamel(detail?.veterinarian?.gender as string)
              ),
              span: 3,
            },
          ]}
        />
        <DescriptionComponent
          layout="horizontal"
          title={<p className="mx-4">{t('Vaccine')}</p>}
          className="w-1/2 !h-fit"
          items={[
            {
              label: t('Name'),
              children: detail?.vaccine?.name,
              span: 3,
            },
            {
              label: t('Unit'),
              children: t(
                formatStatusWithCamel(detail?.vaccine?.unit as string)
              ),
              span: 3,
            },
            {
              label: t('Status'),
              children: t(
                formatStatusWithCamel(detail?.vaccine?.status as string)
              ),
              span: 3,
            },
            {
              label: t('Storage'),
              children: detail?.vaccine?.warehouseLocationEntity?.name,
              span: 3,
            },
          ]}
        />
      </div>
    </ModalComponent>
  );
};

export default IllnessDetailModal;
