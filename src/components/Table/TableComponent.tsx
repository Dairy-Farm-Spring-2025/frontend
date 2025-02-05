import { ConfigProvider, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import InputComponent from '../Input/InputComponent';
import ButtonComponent from '../Button/ButtonComponent';
import { FilterOutlined } from '@ant-design/icons';

export interface Column extends ColumnProps {
  title: string;
  dataIndex: string;
  key: string;
  searchable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface TableComponentProps extends TableProps {
  columns: Column[];
  dataSource: any[];
}

const TableComponent = ({
  columns,
  dataSource,
  ...props
}: TableComponentProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setIsSearching(!!value);

    if (!value) {
      setFilteredData(dataSource);
      return;
    }
    const flattenTree = (nodes: any[]): any[] => {
      const flatList: any[] = [];

      const searchAndFlatten = (node: any) => {
        const nodeMatches = columns
          .filter((column) => column.searchable !== false)
          .some((column) => {
            const rawValue =
              node[column.dataIndex]?.toString().toLowerCase() ?? '';
            const renderedValue =
              column
                .render?.(node[column.dataIndex], node, 0)
                ?.toString()
                .toLowerCase() ?? '';
            return rawValue.includes(value) || renderedValue.includes(value);
          });

        if (nodeMatches) {
          flatList.push({ ...node });
        }

        if (node.children) {
          node.children.forEach(searchAndFlatten);
        }
      };

      nodes.forEach(searchAndFlatten);
      return flatList;
    };

    setFilteredData(flattenTree(dataSource));
  };

  useEffect(() => {
    setFilteredData(dataSource);
  }, [dataSource]);

  return (
    <div className="table !w-full !max-w-full overflow-auto">
      <div className="flex gap-2">
        <ConfigProvider input={{ variant: 'outlined' }}>
          <InputComponent.Search
            placeholder="Enter name..."
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 16 }}
            allowClear
            enterButton
            className="w-2/5 input-with-bold-outline"
          />
        </ConfigProvider>
        <ButtonComponent className="!duration-150" type="primary">
          <FilterOutlined />
        </ButtonComponent>
      </div>
      <ConfigProvider table={{ className: 'shadow-lg !overflow-auto !w-full' }}>
        <Table
          bordered
          columns={columns}
          dataSource={filteredData}
          pagination={{ position: ['bottomCenter'] }}
          expandable={!isSearching ? { defaultExpandAllRows: true } : undefined} // Expand tree only when not searching
          {...props}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableComponent;
