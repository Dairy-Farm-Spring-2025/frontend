import React, { useState } from "react";
import useFetcher from "../../../hooks/useFetcher";
import useModal from "../../../hooks/useModal";
import TableComponent, { Column } from "../../../components/Table/TableComponent";
import AnimationAppear from "../../../components/UI/AnimationAppear";
import WhiteBackground from "../../../components/UI/WhiteBackground";
import { Divider } from "antd";
import { formatSTT } from "../../../utils/format";

import BanUnbanUser from "../../UserManagement/components/BanUnBanUser/BanUnBanUser";
import ModalCreateHuman from "../components/ModalCreateHuman/ModalCreateHuman";
import { useTranslation } from "react-i18next";



const ListVeterinarian = () => {
    const { data, isLoading, mutate } = useFetcher<any>("users/veterinarians", "GET");
    const modal = useModal();
    const defaultRole = 3;
    const { t } = useTranslation();

    const columns: Column[] = [
        {
            dataIndex: "id",
            key: "id",
            title: "#",
        },
        {
            dataIndex: "employeeNumber",
            key: "employeeNumber",
            title: t("Employee Number"),
        },
        {
            dataIndex: "name",
            key: "name",
            title: t("Name"),

        },
        {
            dataIndex: "email",
            key: "email",
            title: "Email",
        },
        {
            dataIndex: "roleId",
            key: "roleId",
            title: t("Role"),
            render: (role: any) => role?.name,
        },
        {
            dataIndex: "status",
            key: "status",
            title: t("Status"),
        },
        {
            dataIndex: "action",
            key: "action",
            title: t("Action"),
            render: (_, record) => (
                <BanUnbanUser
                    userId={record.id}
                    isActive={record.status === "active"}
                    onStatusChange={mutate}
                />
            ),
        },
    ];

    return (
        <AnimationAppear duration={0.5}>


            <WhiteBackground>
                <ModalCreateHuman
                    modal={modal}
                    mutate={mutate}
                    title={t("Create Veterinarian")}
                    defaultValues={{ roleId: defaultRole }}

                />
                <Divider className="my-4" />
                <TableComponent
                    columns={columns}
                    dataSource={data ? formatSTT(data) : []}
                    loading={isLoading} />
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default ListVeterinarian;
