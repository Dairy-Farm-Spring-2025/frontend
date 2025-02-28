import { ArrowRightOutlined } from '@ant-design/icons';
import CardComponent from '@components/Card/CardComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { Area } from '@model/Area';
import { Pen } from '@model/Pen';
import {
  penFilter,
  penStatus,
  penStatusFilter,
  penType,
} from '@service/data/pen';
import { formatDateHour, formatSTT } from '@utils/format';
import { Button, Divider, Spin, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LiaChartAreaSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import '../../index.scss';
import ModalCreateArea from '../ModalCreateArea/ModalCreateArea';
import ModalEditPens from '../ModalEditPen';

const AreaList = () => {
  const modalEdit = useModal();
  const modalCreate = useModal();
  const navigate = useNavigate();
  const { data, isLoading, mutate } = useFetcher<Pen[]>('pens', 'GET');
  const { data: dataArea } = useFetcher<Area[]>('areas', 'GET');
  const { t } = useTranslation();
  const [id, setId] = useState<number>(0);
  const [dataGroup, setDataGroup] = useState<any[]>([]);

  useEffect(() => {
    if (dataArea) {
      console.log(data);
      const groupedData = dataArea.map((area) => ({
        area,
        pens:
          data?.filter((pen) => pen.area?.areaId === area.areaId).slice(0, 5) ||
          [],
      }));

      setDataGroup(groupedData);
    }
  }, [data, dataArea]);
  const handleEdit = (id: number) => {
    setId(id);
    modalEdit.openModal();
  };

  const columns: Column[] = [
    {
      dataIndex: 'penId',
      key: 'penId',
      title: '#',
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: t('Created Date'),
      render: (data) => formatDateHour(data),
      filteredDate: true,
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Pen Name'),
      render: (element: string, data) => (
        <p
          onClick={() => handleEdit(data.penId)}
          className="text-blue-600 underline underline-offset-1 cursor-pointer"
        >
          {element}
        </p>
      ),
      searchable: true,
    },
    {
      dataIndex: 'penType',
      key: 'penType',
      title: t('Pen Type'),
      render: (typeValue: string) => {
        const type = penType.find((type) => type.value === typeValue);

        return type ? <Tag color="blue">{type.label}</Tag> : null;
      },
      filterable: true,
      filterOptions: penFilter,
    },
    {
      dataIndex: 'length',
      key: 'length',
      title: t('Dimensions'),
      render: (_: any, data) => (
        <Tooltip
          className="tooltip-content"
          placement="top"
          title={
            <div className="dimensions flex flex-col">
              <p>
                <strong>{t('Length')}: </strong> {data.area.penLength} m
              </p>{' '}
              <p>
                <strong> {t('Width')}: </strong>
                {data.area.penWidth} m{' '}
              </p>
            </div>
          }
        >
          <span>
            {data.area.penLength} x {data.area.penWidth} m
          </span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'penStatus',
      key: 'penStatus',
      title: t('Status'),
      render: (statusValue: string) => {
        // Find the label for the given statusValue
        const status = penStatus.find((status) => status.value === statusValue);
        // Return the Tag with the status label
        return status ? <Tag color="green">{status.label}</Tag> : null;
      },
      filterable: true,
      filterOptions: penStatusFilter,
    },
  ];

  if (isLoading) return <Spin />;

  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalCreateArea modal={modalCreate} mutate={mutate} />
        <ModalEditPens id={id} modal={modalEdit} mutate={mutate} />
        <Divider className="my-4" />
        <div>
          <div className="grid grid-cols-2 gap-10">
            {dataGroup.map((element) => (
              <CardComponent key={element.area?.areaId} className="!h-full">
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <LiaChartAreaSolid size={50} />
                        <div className="flex flex-col">
                          <Title>{element.area?.name}</Title>
                          <p className="text-gray-400">
                            {t('Created At')}:{' '}
                            {formatDateHour(element?.area?.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Tooltip title={t('Move to detail')}>
                        <Button
                          onClick={() => navigate(`${element?.area?.areaId}`)}
                          shape="circle"
                          type="primary"
                          icon={<ArrowRightOutlined />}
                          size="large"
                        />
                      </Tooltip>
                    </div>
                    <div className="grid grid-cols-3">
                      <TextTitle
                        title="Area Dimension"
                        description={
                          <p>
                            {element?.area?.width} (meter) x{' '}
                            {element?.area?.length} (meter)
                          </p>
                        }
                      />
                      <TextTitle
                        title="Pen Dimension"
                        description={
                          <p>
                            {element?.area?.penWidth} (meter) x{' '}
                            {element?.area?.penLength} (meter)
                          </p>
                        }
                      />
                    </div>
                  </div>
                  <Divider />
                  <TableComponent
                    className="!shadow-none"
                    columns={columns}
                    dataSource={element?.pens ? formatSTT(element?.pens) : []}
                    loading={isLoading}
                    pagination={{ pageSize: 5, position: ['bottomCenter'] }}
                  />
                </div>
              </CardComponent>
            ))}
          </div>
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default AreaList;
