import React, { useState } from "react";
import useFetcher from "../../../hooks/useFetcher";
import useModal from "../../../hooks/useModal";
import TableComponent, { Column } from "../../../components/Table/TableComponent";
import AnimationAppear from "../../../components/UI/AnimationAppear";
import WhiteBackground from "../../../components/UI/WhiteBackground";
import { Divider } from "antd";
import { formatSTT } from "../../../utils/format";
import ModalCreateHuman from "../components/ModalCreateHuman/ModalCreateHuman";
import BanUnbanUser from "../../UserManagement/components/BanUnBanUser/BanUnBanUser";



const ListVeterinarian = () => {
    const { data, isLoading, mutate } = useFetcher<any>("users/veterinarians", "GET");
    const modal = useModal();
    const defaultRole = 3;


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
        <AnimationAppear duration={0.5}>


            <WhiteBackground>
                <ModalCreateHuman
                    modal={modal}
                    mutate={mutate}
                    title="Create Veterinarian"
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
