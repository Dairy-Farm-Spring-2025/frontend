import React, { useState } from "react";
import TableComponent, { Column } from "../../components/Table/TableComponent";
import TextLink from "../../components/UI/TextLink";
import WhiteBackground from "../../components/UI/WhiteBackground";
import useFetcher from "../../hooks/useFetcher";

import { Divider, Spin } from "antd";
import BanUnbanUser from "./components/BanUnBanUser/BanUnBanUser";
import ModalCreateUser from "./components/ModalCreateUser/ModalCreateUser";
import useModal from "../../hooks/useModal";
import { formatSTT } from "../../utils/format";


const ListUser = () => {
    const { data, isLoading, mutate } = useFetcher<any>("users/all", "GET");
    const modal = useModal();



    const columns: Column[] = [
        {
            dataIndex: "id",
            key: "id",
            title: "#",
        },
        {
            dataIndex: "employeeNumber",
            key: "employeeNumber",
            title: "Employee Number",
        },
        {
            dataIndex: "name",
            key: "name",
            title: "Name",

        },
        {
            dataIndex: "email",
            key: "email",
            title: "Email",
        },
        {
            dataIndex: "roleId",
            key: "roleId",
            title: "Role",
            render: (role: any) => role?.name,
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Action",
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
        <WhiteBackground>
            <ModalCreateUser modal={modal} mutate={mutate} />
            <Divider className="my-4" />
            <TableComponent
                columns={columns}
                dataSource={data ? formatSTT(data) : []}
                loading={isLoading} />
        </WhiteBackground>
    );
};

export default ListUser;
