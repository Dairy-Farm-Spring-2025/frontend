import React, { useState } from "react";
import TableComponent, { Column } from "../../components/Table/TableComponent";
import TextLink from "../../components/UI/TextLink";
import WhiteBackground from "../../components/UI/WhiteBackground";
import useFetcher from "../../hooks/useFetcher";

import { Divider, Button, Space, Select } from "antd";

import ModalCreateUser from "./components/ModalCreateUser/ModalCreateUser";
import useModal from "../../hooks/useModal";
import { formatAreaType, formatSTT } from "../../utils/format";
import BanUnbanUser from "./components/BanUnBanUser/BanUnBanUser";
import AnimationAppear from "../../components/UI/AnimationAppear";
import toast from "react-hot-toast";
import useToast from "../../hooks/useToast";
import SelectComponent from "../../components/Select/SelectComponent";
import { role } from "../../service/data/role";



const ListUser = () => {
    const { data, isLoading, mutate } = useFetcher<any>("users/all", "GET");
    const modalCreate = useModal();

    const toast = useToast();
    // Hook để gọi API thay đổi role
    const { trigger: updateRole } = useFetcher(`users/changerole`, "PUT");

    // Hàm cập nhật role khi chọn trong dropdown
    const handleChangeRole = async (id: string, roleId: string) => {
        console.log("check id role id: ", id, roleId);
        await updateRole({ url: `users/changerole/${id}/${roleId}` });
        toast.showSuccess('Update success');
        mutate(); // Cập nhật lại danh sách user
        toast
    };
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

            render: (_, record) => (
                <SelectComponent
                    value={record.roleId?.id?.toString()} // Lấy giá trị id thay vì object
                    options={role}
                    style={{ width: 130 }}
                    onChange={(value) => handleChangeRole(record.id, value)}
                />
            ),
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
            render: (data) => formatAreaType(data)
        },
        {
            dataIndex: "action",
            key: "action",
            title: "Action",
            render: (_, record) => (
                <Space>
                    <BanUnbanUser
                        userId={record.id}
                        isActive={record.status === "active"}
                        onStatusChange={mutate}
                    />
                </Space>
            ),
        },
    ];

    return (
        <AnimationAppear duration={0.5}>
            <WhiteBackground>
                <ModalCreateUser modal={modalCreate} mutate={mutate} />
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

export default ListUser;
