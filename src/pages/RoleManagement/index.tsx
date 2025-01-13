import { useEffect, useState } from "react";
import TableComponent, {
    Column,
} from "../../components/Table/TableComponent";
import { roles } from "../../service/data/role";

import { Image } from "antd";
import TextLink from "../../components/UI/TextLink";
import WhiteBackground from "../../components/UI/WhiteBackground";
import React from "react";
import { Role } from "../../model/Role";
import { userApi } from "../../service/api/userApi";

const ListRole = () => {
    const [role, setRole] = useState<Role[]>(roles);


    const [loading, setLoading] = useState<boolean>(true);

    const fetchRole = async () => {
        try {
            const response = await userApi.getRole();
            setRole(response.data);
        } catch (error: any) {
            console.error("Error fetching users:", error.message || error);
            setRole([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRole();
    }, []);
    const columns: Column[] = [
        {
            dataIndex: "id",
            key: "id",
            title: "#",
        },


        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            render: (element: string) => <TextLink to={""}>{element}</TextLink>,
        },
    ];
    return (
        <WhiteBackground>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <TableComponent columns={columns} dataSource={role || []} />
            )}
        </WhiteBackground>
    );
};

export default ListRole;
