// import { useTranslation } from "react-i18next";
// import useFetcher from "../../../hooks/useFetcher";
// import TableComponent, { Column } from "../../../components/Table/TableComponent";
// import ButtonComponent from "../../../components/Button/ButtonComponent";
// import WhiteBackground from "../../../components/UI/WhiteBackground";
// import { formatAreaType } from "../../../utils/format";
// import useModal from "../../../hooks/useModal";
// import { useState, useMemo } from "react";
// import { Divider, Tag } from "antd";
// import ModalDetailMyApplication from "./components/ModalDetailMyApplication";
// import ModalRequestMyApplication from "./components/ModalRequestApplication";

// const MyApplication = () => {
//     const { t } = useTranslation();
//     const { data, isLoading, mutate } = useFetcher<any>("application/my-request", "GET");
//     console.log("check data my-application:",)
//     const [selectedId, setSelectedId] = useState<string | null>(null);
//     const modal = useModal();
//     const modalDetail = useModal();

//     const handleOpenModalRequest = () => modal.openModal();
//     const handleOpenModalDetail = (id: string) => {
//         setSelectedId(id);
//         modalDetail.openModal();
//     };

//     const statusColor = useMemo(() => ({
//         processing: 'orange',
//         complete: 'green',
//         rejected: 'red'
//     }), []);

//     const columns: Column[] = useMemo(() => [
//         { dataIndex: "applicationId", key: "applicationId", title: "#" },
//         {
//             dataIndex: "type", key: "type", title: t("Type"),
//             render: (type) => type?.name || "-"
//         },
//         {
//             dataIndex: "title", key: "title", title: t("Title"),
//             render: (title) => formatAreaType(title)
//         },
//         { dataIndex: "fromDate", key: "fromDate", title: t("From Date") },
//         { dataIndex: "toDate", key: "toDate", title: t("To Date") },
//         {
//             dataIndex: "status", key: "status", title: t("Status"),
//             render: (status: string) => (
//                 <Tag color={statusColor[status as keyof typeof statusColor] || "default"}>
//                     {t(status)}
//                 </Tag>
//             )
//         },
//         {
//             dataIndex: 'applicationId', key: 'action', title: t('Action'),
//             render: (id: string) => (
//                 <ButtonComponent type="primary" onClick={() => handleOpenModalDetail(id)}>
//                     {t("View Detail")}
//                 </ButtonComponent>
//             )
//         }
//     ], [t, statusColor]);

//     return (
//         <WhiteBackground>
//             <div>
//                 <ButtonComponent type="primary" onClick={handleOpenModalRequest}>
//                     {t("Create Application")}
//                 </ButtonComponent>
//             </div>
//             <Divider className="my-4" />
//             <TableComponent columns={columns} dataSource={data || []} loading={isLoading} />
//             <ModalRequestMyApplication modal={modal} mutate={mutate} />
//             {selectedId && <ModalDetailMyApplication id={selectedId} modal={modalDetail} mutate={mutate} />}
//         </WhiteBackground>
//     );
// };

// export default MyApplication;
import { useTranslation } from "react-i18next";
import useFetcher from "../../../hooks/useFetcher";
import TableComponent, { Column } from "../../../components/Table/TableComponent";
import ButtonComponent from "../../../components/Button/ButtonComponent";
import WhiteBackground from "../../../components/UI/WhiteBackground";
import { formatAreaType } from "../../../utils/format";
import useModal from "../../../hooks/useModal";
import { useState, useMemo } from "react";
import { Divider, Tag } from "antd";
import ModalDetailMyApplication from "./components/ModalDetailMyApplication";
import ModalRequestMyApplication from "./components/ModalRequestApplication";

const MyApplication = () => {
    const { t } = useTranslation();
    const { data, isLoading, mutate } = useFetcher<any>("application/my-request", "GET");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const modal = useModal();
    const modalDetail = useModal();

    const handleOpenModalRequest = () => modal.openModal();
    const handleOpenModalDetail = (id: string) => {
        setSelectedId(id);
        modalDetail.openModal();
    };

    const statusColor = useMemo(() => ({
        processing: 'orange',
        complete: 'green',
        rejected: 'red'
    }), []);

    const columns: Column[] = useMemo(() => [
        { dataIndex: "applicationId", key: "applicationId", title: "#" },
        {
            dataIndex: "type", key: "type", title: t("Type"),
            render: (type) => type?.name || "-"
        },
        {
            dataIndex: "title", key: "title", title: t("Title"),
            render: (title) => formatAreaType(title)
        },
        { dataIndex: "fromDate", key: "fromDate", title: t("From Date") },
        { dataIndex: "toDate", key: "toDate", title: t("To Date") },
        {
            dataIndex: "status", key: "status", title: t("Status"),
            render: (status: string) => (
                <Tag color={statusColor[status as keyof typeof statusColor] || "default"}>
                    {t(status)}
                </Tag>
            )
        },
        {
            dataIndex: 'applicationId', key: 'action', title: t('Action'),
            render: (id: string) => (
                <ButtonComponent type="primary" onClick={() => handleOpenModalDetail(id)}>
                    {t("View Detail")}
                </ButtonComponent>
            )
        }
    ], [t, statusColor]);

    return (
        <WhiteBackground>
            <div>
                <ButtonComponent type="primary" onClick={handleOpenModalRequest}>
                    {t("Create Application")}
                </ButtonComponent>
            </div>
            <Divider className="my-4" />
            <TableComponent columns={columns} dataSource={data || []} loading={isLoading} />
            <ModalRequestMyApplication modal={modal} mutate={mutate} />
            {selectedId && <ModalDetailMyApplication id={selectedId} modal={modalDetail} mutate={mutate} />}
        </WhiteBackground>
    );
};

export default MyApplication;
