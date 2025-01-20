
import { Button, Divider, Image, Popconfirm, Space, Tag, Tooltip } from "antd";

import useFetcher from "../../../hooks/useFetcher";


import TableComponent, { Column } from "../../../components/Table/TableComponent";


import AnimationAppear from "../../../components/UI/AnimationAppear";
import WhiteBackground from "../../../components/UI/WhiteBackground";



import { formatDateHour, formatSTT } from "../../../utils/format";
import { MilkBatch } from "../../../model/DailyMilk/MilkBatch";
import ButtonComponent from "../../../components/Button/ButtonComponent";
import React, { useState } from "react";
import useModal from "../../../hooks/useModal";
import ModalMilkBatchDetail from "./components/ModalMilkBatchDetail";

const MilkBatchManagement = () => {


    const { data, isLoading, mutate } = useFetcher<MilkBatch[]>("MilkBatch", "GET");
    console.log("check data: ", data)
    const modalViewDetail = useModal();

    const [milkBatchId, setMilkBatchId] = React.useState<number>(0);

    const handleOpenEdit = (record: any) => {
        setMilkBatchId(record.milkBatchId);
        modalViewDetail.openModal();
    };
    const columns: Column[] = [
        {
            dataIndex: "milkBatchId",
            key: "milkBatchId",
            title: "#",
        },
        {
            dataIndex: "totalVolume",
            key: "totalVolume",
            title: "Total Volume",
        },
        {
            dataIndex: "date",
            key: "date",
            title: "Date",
            render: (data) => formatDateHour(data),
        },
        {
            dataIndex: "expiryDate",
            key: "expiryDate",
            title: "Expiry Date",
            render: (data) => formatDateHour(data),
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
        },
        {
            dataIndex: 'action',
            key: 'action',
            title: 'Action',
            render: (_, record) => (
                <div >
                    <ButtonComponent onClick={() => handleOpenEdit(record)}>View Detail</ButtonComponent>
                </div>
            ),
        },


    ];

    return (
        <AnimationAppear duration={0.5}>
            <WhiteBackground>
                <ModalMilkBatchDetail modal={modalViewDetail} milkBatchId={milkBatchId} mutate={mutate} />
                <Divider className="my-4" />
                <TableComponent
                    columns={columns}
                    dataSource={data ? formatSTT(data) : []}
                    loading={isLoading}
                />
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default MilkBatchManagement;
