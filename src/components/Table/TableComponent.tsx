import { ConfigProvider, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import InputComponent from '../Input/InputComponent';
import './index.scss';
import ButtonComponent from '../Button/ButtonComponent';
import { FilterOutlined } from '@ant-design/icons';
export interface Column extends ColumnProps {
  title: string;
  dataIndex: string;
  key: string;
  searchable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode; // Rendered value
}

interface TableComponentProps extends TableProps {
  columns: Column[];
  dataSource: any;
}

const TableComponent = ({ columns, dataSource, ...props }: TableComponentProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<object[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = dataSource.filter((record: any) =>
      columns
        .filter((column) => column.searchable !== false)
        .some((column) => {
          const rawValue = record[column.dataIndex]?.toString().toLowerCase() ?? '';
          const renderedValue =
            column.render?.(record[column.dataIndex], record, 0)?.toString().toLowerCase() ?? '';
          return rawValue.includes(value) || renderedValue.includes(value);
        })
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (dataSource) {
      setFilteredData(dataSource);
    }
  }, [dataSource]);

  return (
    <div className='table !w-full !max-w-full overflow-auto'>
      <div className='flex gap-2'>
        <ConfigProvider
          input={{
            variant: 'outlined',
          }}
        >
          <InputComponent.Search
            placeholder='Enter name...'
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16 }}
            allowClear
            enterButton
            className='w-2/5 input-with-bold-outline'
          />
        </ConfigProvider>
        <ButtonComponent className='!duration-150' type='primary'>
          <FilterOutlined />
        </ButtonComponent>
      </div>
      <ConfigProvider
        table={{
          className: 'shadow-lg !overflow-auto !w-full',
        }}
      >
        <Table
          bordered
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
