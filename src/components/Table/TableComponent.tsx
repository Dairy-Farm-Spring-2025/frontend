import { ConfigProvider, TabPaneProps } from "antd";
import { ColumnProps } from "antd/es/table";
import { Table } from "antd";
import "./index.css";
export interface Column extends ColumnProps {
  title: string;
  dataIndex: string;
  key: string;
}

interface TableComponentProps extends TabPaneProps {
  columns: Column[];
  dataSource: object[];
}
const TableComponent = ({ columns, dataSource }: TableComponentProps) => {
  return (
    <ConfigProvider
      table={{
        className: "shadow-lg",
      }}
    >
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={{ position: ["bottomCenter"] }}
      />
    </ConfigProvider>
  );
};

export default TableComponent;
