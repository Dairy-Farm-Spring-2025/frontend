import { useTranslation } from "react-i18next";
import useFetcher from "../../../hooks/useFetcher";
import TableComponent, { Column } from "../../../components/Table/TableComponent";
import TextLink from "../../../components/UI/TextLink";
import WhiteBackground from "../../../components/UI/WhiteBackground";
import { formatAreaType } from "../../../utils/format";
import ModalRequestApplication from "./components/ModalRequestApplication";
import ModalDetailApplication from "./components/ModalDetailApplication";
import useModal from "../../../hooks/useModal";
import { useState } from "react";
import ButtonComponent from "../../../components/Button/ButtonComponent";
import PopconfirmComponent from "../../../components/Popconfirm/PopconfirmComponent";
import { Divider, Tag } from "antd";


const Application = () => {
    const { data, isLoading, mutate } = useFetcher<any>("application", "GET");
    console.log("check data: ", data);
    const { t } = useTranslation();
    const [id, setId] = useState('');
    const modal = useModal();
    const modalDetail = useModal();
    const handleOpenModalRequest = () => {
        modal.openModal();
    };
    const handleOpenModalDetail = (id: string) => {
        setId(id);
        modalDetail.openModal();
    };

    const statusColor = {
        processing: 'orange',
        complete: 'green',
        rejected: 'red'
    };
    const columns: Column[] = [
        {
            dataIndex: "applicationId",
            key: "applicationId",
            title: "#",
        },
        {
            dataIndex: "type",
            key: "type",
            title: t("Type"),
            render: (data) => data.name,
        },
        {
            dataIndex: "title",
            key: "title",
            title: t("Title"),
            render: (data) => formatAreaType(data)
        },
        {
            dataIndex: "fromDate",
            key: "fromDate",
            title: t("From Date"),
            // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
        },
        {
            dataIndex: "toDate",
            key: "toDate",
            title: t("To Date"),
            // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
        },
        {
            dataIndex: "status",
            key: "status",
            title: t("Status"),
            render: (status: string) => (
                <Tag color={statusColor[status as keyof typeof statusColor] || "default"}>
                    {t(status)}
                </Tag>
            )

        },
        {
            dataIndex: 'applicationId',
            key: 'action',
            title: t('Action'),
            render: (data) => (
                <div className="flex gap-5">
                    <ButtonComponent
                        type="primary"
                        onClick={() => handleOpenModalDetail(data)}
                    >
                        {t("View Detail")}
                    </ButtonComponent>
                    {/* <PopconfirmComponent
                        title={'Delete?'}
                        onConfirm={() => onConfirm(data)}
                    >
                        <ButtonComponent type="primary" danger>
                            {t("Delete")}
                        </ButtonComponent>
                    </PopconfirmComponent> */}

                </div>
            ),
        },

    ];

    return (
        <WhiteBackground>

            <TableComponent
                columns={columns}
                dataSource={data || []}
                loading={isLoading}
            />
            <ModalRequestApplication modal={modal} mutate={mutate} />
            {id !== '' && (
                <ModalDetailApplication id={id} modal={modalDetail} mutate={mutate} />
            )}
        </WhiteBackground>
    );
};

export default Application;
