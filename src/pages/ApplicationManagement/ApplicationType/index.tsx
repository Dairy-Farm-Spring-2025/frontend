import { useTranslation } from "react-i18next";
import useFetcher from "../../../hooks/useFetcher";
import TableComponent, { Column } from "../../../components/Table/TableComponent";
import TextLink from "../../../components/UI/TextLink";
import WhiteBackground from "../../../components/UI/WhiteBackground";


const ApplicationType = () => {
    const { data, isLoading } = useFetcher<any>("application-type", "GET");
    console.log("check data: ", data);
    const { t } = useTranslation();
    const columns: Column[] = [
        {
            dataIndex: "applicationId",
            key: "applicationId",
            title: "#",
        },
        {
            dataIndex: "name",
            key: "name",
            title: t("Name"),
            // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
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

export default ApplicationType;
