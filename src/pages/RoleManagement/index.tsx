import TableComponent, { Column } from "../../components/Table/TableComponent";
import TextLink from "../../components/UI/TextLink";
import WhiteBackground from "../../components/UI/WhiteBackground";
import useFetcher from "../../hooks/useFetcher";

const ListRole = () => {
    const { data, isLoading } = useFetcher<any>("users/roles", "GET");
    console.log("check data: ", data);
    const columns: Column[] = [
        {
            dataIndex: "id",
            key: "id",
            title: "#",
        },
        {
            dataIndex: "name",
            key: "name",
            title: "Role Name",
            render: (element: string) => <TextLink to={""}>{element}</TextLink>,
        },
    ];

    return (
        <WhiteBackground>
            <TableComponent
                columns={columns}
                dataSource={data || []}
                loading={isLoading}
            />

        </WhiteBackground>
    );
};

export default ListRole;
