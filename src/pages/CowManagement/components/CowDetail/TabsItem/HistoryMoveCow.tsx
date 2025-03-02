import ButtonComponent from "@components/Button/ButtonComponent";
import useFetcher from "@hooks/useFetcher";
import { Cow } from "@model/Cow/Cow";
import MoveCow from "./components/MoveCow";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useState } from "react";
import TableComponent, { Column } from "@components/Table/TableComponent";
import TextLink from "@components/UI/TextLink";
import WhiteBackground from "@components/UI/WhiteBackground";
import { Divider, Tag } from "antd";
import { getLabelByValue } from "@utils/getLabel";
import { cowStatus } from "@service/data/cowStatus";
import { penStatus, penType } from "@service/data/pen";
import { formatDateHour } from "@utils/format";
import { mutate } from "swr";

interface HistoryMoveCowProps {
  id: string;
  dataHistory: Cow;
  isLoadingHistory: boolean;
  mutateHistory: any;
}

const HistoryMoveCow = ({ id, dataHistory, isLoadingHistory, mutateHistory }: HistoryMoveCowProps) => {
  const { data, mutate } = useFetcher<any[]>(`cow-pens/cow/${id}`, 'GET');
  const { t } = useTranslation();
  // const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  if (isLoadingHistory) {
    return <p>Loading...</p>;
  }


  const columns: Column[] = [
    {
      title: t('#'),
      dataIndex: 'stt',
      key: 'stt',
      render: (_: any, __: any, index: number) => index + 1, // Tăng index từ 1
    },
    {
      title: t('In Pen Name'),
      dataIndex: 'penEntity',
      key: 'penName',
      render: (data) => data.name,
      searchable: true,
    },
    {
      title: t('Area'),
      dataIndex: 'penEntity',
      key: 'areaBelongto',
      render: (data) => data?.areaBelongto.name || 'N/A', // Thêm kiểm tra
      searchable: true,
    },
    {
      title: t('From Date'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (data) => formatDateHour(data)
    },
    {
      title: t('To Date'),
      dataIndex: 'toDate',
      key: 'toDate',
      render: (data) => data ? formatDateHour(data) : <Tag color="blue">Now</Tag>
    },


    // {
    //   title: t('Pen Status'),
    //   dataIndex: ['penEntity', 'penStatus'],
    //   key: 'penStatus',
    //   render: (status: string) => (
    //     <Tag color={status === 'occupied' ? 'red' : 'green'}>
    //       {getLabelByValue(status, penStatus)}
    //     </Tag>
    //   ),
    //   searchable: true,
    // },
    // {
    //   title: t('Action'),
    //   key: 'action',
    //   dataIndex: 'action',
    //   render: (_, record) => (
    //     <div style={{ display: 'flex', justifyContent: 'center' }}>
    //       <ButtonComponent onClick={() => handleOpenEdit(record)}>View Detail</ButtonComponent>
    //     </div>
    //   ),
    // },
  ];


  return (
    <WhiteBackground>
      <ButtonComponent colorButton="orange" style={{ color: 'white' }} onClick={() => setIsOpen(true)}>
        {t('Move Cow')}
      </ButtonComponent>
      <MoveCow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mutateHistory={mutate}
      />
      <Divider className="my-4" />
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoadingHistory}

      />

    </WhiteBackground>
  );

};

export default HistoryMoveCow;
