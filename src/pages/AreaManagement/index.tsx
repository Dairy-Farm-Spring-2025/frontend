import React from 'react';
import useFetcher from '../../hooks/useFetcher';
import useModal from '../../hooks/useModal';
import TableComponent, { Column } from '../../components/Table/TableComponent';
import WhiteBackground from '../../components/UI/WhiteBackground';
import { Divider } from 'antd';
import { formatSTT } from '../../utils/format';
import ModalCreateArea from './components/ModalCreateArea/ModalCreateArea';
import { AreaType } from '../../model/Area/AreaType';
import ModalAreaDetail from './components/ModalAreaDetail/ModalAreaDetail';
import ButtonComponent from '../../components/Button/ButtonComponent';
import { useTranslation } from 'react-i18next';

const areaTypes: { label: string; value: AreaType }[] = [
  { label: 'Cow Housing', value: 'cowHousing' },
  { label: 'Milking Parlor', value: 'milkingParlor' },
  { label: 'Warehouse', value: 'warehouse' },
];

const AreaManagement: React.FC = () => {
  const { data, isLoading, mutate } = useFetcher<any>('areas', 'GET');
  console.log(data);
  const [areaId, setAreaId] = React.useState<number>(0);
  const modalCreate = useModal();
  const modalViewDetail = useModal();
  const { t } = useTranslation();
  const handleOpenEdit = (record: any) => {
    setAreaId(record.areaId);
    modalViewDetail.openModal();
  };

  const columns: Column[] = [
    {
      dataIndex: 'areaId',
      key: 'areaId',
      title: '#',
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
    },
    {
      dataIndex: 'description',
      key: 'description',
      title: t('Description'),
    },
    {
      dataIndex: 'length',
      key: 'length',
      title: t('Length (m)'),
    },
    {
      dataIndex: 'width',
      key: 'width',
      title: t('Width (m)'),
    },
    {
      dataIndex: 'penLength',
      key: 'penLength',
      title: t('Pen Length (m)'),
    },
    {
      dataIndex: 'penWidth',
      key: 'penWidth',
      title: t('Pen Width (m)'),
    },
    {
      dataIndex: 'areaType',
      key: 'areaType',
      title: t('Area Type'),
      render: (value: AreaType) => {
        const type = areaTypes.find((type) => type.value === value);
        return type ? type.label : value;
      },
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: t('Action'),
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent onClick={() => handleOpenEdit(record)}>{t("View Detail")}</ButtonComponent>
        </div>
      ),
    },
  ];

  return (
    <WhiteBackground>
      <ModalCreateArea modal={modalCreate} mutate={mutate} />
      <ModalAreaDetail modal={modalViewDetail} areaId={areaId} mutate={mutate} />
      <Divider className='my-4' />
      <TableComponent
        columns={columns}
        dataSource={data ? formatSTT(data) : []}
        loading={isLoading}
      />
    </WhiteBackground>
  );
};

export default AreaManagement;
