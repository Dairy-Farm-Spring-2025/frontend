import { ConfigProvider, Input } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import { Table } from 'antd';
import './index.scss';
import { useEffect, useState } from 'react';
export interface Column extends ColumnProps {
  title: string;
  dataIndex: string;
  key: string;
}

interface TableComponentProps extends TableProps {
  columns: Column[];
  dataSource: any;
}
const TableComponent = ({
  columns,
  dataSource,
  ...props
}: TableComponentProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<object[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = dataSource.filter((record: any) =>
      columns.some((column) =>
        record[column.dataIndex]?.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    if (dataSource) {
      setFilteredData(dataSource);
    }
  }, [dataSource]);

  return (
    <div className='table w-full overflow-auto'>
      <ConfigProvider
        input={{
          variant: 'outlined',
        }}
      >
        <Input.Search
          placeholder='Enter name...'
          value={searchText}
          onChange={handleSearch}
          style={{ marginBottom: 16 }}
          allowClear
          enterButton
          className='w-1/5 input-with-bold-outline'
        />
      </ConfigProvider>
      <ConfigProvider
        table={{
          className: 'shadow-lg !overflow-auto',
        }}
      >
        <Table
          bordered
          scroll={{ x: 1500 }}
          columns={columns}
          dataSource={filteredData}
          pagination={{ position: ['bottomCenter'] }}
          {...props}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableComponent;
