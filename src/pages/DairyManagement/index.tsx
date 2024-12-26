import TableComponent, { Column } from "../../components/Table/TableComponent";

const DairyManagement = () => {
  const dataSource = [
    {
      id: 1,
      name: "asasasa",
      class: "123",
      email: "example@gmail.com",
    },
    {
      id: 2,
      name: "asasasa",
      class: "123",
      email: "example@gmail.com",
    },
    {
      id: 3,
      name: "asasasa",
      class: "123",
      email: "example@gmail.com",
    },
  ];
  const column: Column[] = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
  ];
  return (
    <div>
      <TableComponent dataSource={dataSource} columns={column} />
    </div>
  );
};

export default DairyManagement;
