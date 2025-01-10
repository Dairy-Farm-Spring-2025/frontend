import { useState } from "react";
import TableComponent, {
    Column,
} from "../../components/Table/TableComponent";
import { roles } from "../../service/data/role";

import { Image } from "antd";
import TextLink from "../../components/UI/TextLink";
import WhiteBackground from "../../components/UI/WhiteBackground";
import React from "react";
import { Role } from "../../model/Role";

const ListRole = () => {
    const [role, setRole] = useState<Role[]>(roles);
    const columns: Column[] = [
        {
            dataIndex: "id",
            key: "id",
            title: "#",
        },


        {
            dataIndex: "role",
            key: "role",
            title: "Role",
            render: (element: string) => <TextLink to={""}>{element}</TextLink>,
        },
    ];
    return (
        <WhiteBackground>
            <TableComponent columns={columns} dataSource={role} />
        </WhiteBackground>
    );
};

export default ListRole;
