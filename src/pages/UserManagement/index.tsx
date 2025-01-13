import React, { useState, useEffect } from "react";
import TableComponent, { Column } from "../../components/Table/TableComponent";
import TextLink from "../../components/UI/TextLink";
import WhiteBackground from "../../components/UI/WhiteBackground";
import { userApi } from "../../service/api/userApi";
import { User } from "../../model/User";

const ListUser = () => {
    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAllUsers = async () => {
        try {
            const response = await userApi.getAllUser();
            setUser(response.data);
        } catch (error: any) {
            console.error("Error fetching users:", error.message || error);
            setUser([]);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchAllUsers();
    }, []);

    const columns: Column[] = [
        {
            dataIndex: "id",
            key: "id",
            title: "#",
        },
        {
            dataIndex: "employeeNumber",
            key: "employeeNumber",
            title: "EmployeeNumber",
        },
        {
            dataIndex: "name",
            key: "name",
            title: "Name",
            render: (element: string) => <TextLink to="">{element}</TextLink>,
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
            render: (text) => text.name,
        },
        {
            dataIndex: "status",
            key: "status",
            title: "Status",
        },


    ];

    return (
        <WhiteBackground>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <TableComponent columns={columns} dataSource={user || []} />
            )}
        </WhiteBackground>
    );
};

export default ListUser;
