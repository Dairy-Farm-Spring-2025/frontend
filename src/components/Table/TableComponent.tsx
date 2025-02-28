import { ConfigProvider, DatePicker, Select, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import { useEffect, useState } from 'react';
import InputComponent from '../Input/InputComponent';
import dayjs from 'dayjs';

export interface Column extends ColumnProps {
  title: string;
  dataIndex: string | any;
  key: string;
  searchable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  filterable?: boolean;
  filterOptions?: { text: string; value: any }[];
  filteredDate?: boolean;
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
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );
  const [selectedDateFilters, setSelectedDateFilters] = useState<
    Record<string, any>
  >({});

  const [isSearching, setIsSearching] = useState<boolean>(false);
  useEffect(() => {
    let filtered = dataSource;

    // Apply text filters
    Object.keys(searchText).forEach((key: any) => {
      if (searchText[key]) {
        filtered = filtered.filter((item) =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(searchText[key].toLowerCase())
        );
      }
    });

    // Apply dropdown filters
    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]) {
        filtered = filtered.filter(
          (item) => item[key] === selectedFilters[key]
        );
      }
    });

    Object.keys(selectedDateFilters).forEach((key) => {
      if (selectedDateFilters[key]) {
        filtered = filtered.filter((item) =>
          dayjs(item[key]).isSame(selectedDateFilters[key], 'day')
        );
      }
    });

    setFilteredData(filtered);
  }, [searchText, selectedFilters, dataSource, selectedDateFilters]);

  const handleTextSearch = (value: string, key: string) => {
    setSearchText((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSelectFilter = (value: any, key: string) => {
    setSelectedFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleDateFilter = (date: any, key: string) => {
    setSelectedDateFilters((prev) => ({
      ...prev,
      [key]: date ? dayjs(date) : null,
    }));
  };

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

  const enhancedColumns = columns.map((col) => ({
    ...col,
    filterDropdown:
      col.searchable || col.filterable || col.filteredDate
        ? () => (
            <div style={{ padding: 8 }}>
              {col.searchable && (
                <InputComponent
                  placeholder={`Search ${col.title}`}
                  value={searchText[col.dataIndex] || ''}
                  onChange={(e) =>
                    handleTextSearch(e.target.value, col.dataIndex)
                  }
                  style={{ marginBottom: 8, display: 'block' }}
                />
              )}
              {col.filterable && col.filterOptions && (
                <Select
                  style={{ width: '100%' }}
                  placeholder={`Filter ${col.title}`}
                  value={selectedFilters[col.dataIndex] || undefined}
                  onChange={(value) => handleSelectFilter(value, col.dataIndex)}
                  allowClear
                >
                  {col.filterOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.text}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {col.filteredDate && (
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={(date) => handleDateFilter(date, col.dataIndex)}
                  placeholder={`Select ${col.title}`}
                  allowClear
                />
              )}
            </div>
          )
        : undefined,
  }));

  return (
    <div className="table !w-full !max-w-full overflow-auto">
      <div className="flex gap-2">
        <ConfigProvider
          input={{
            variant: 'outlined',
          }}
        >
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
      </div>
      <ConfigProvider table={{ className: 'shadow-lg !overflow-auto !w-full' }}>
        <Table
          bordered
          columns={enhancedColumns}
          dataSource={filteredData}
          pagination={{ position: ['bottomCenter'] }}
          expandable={!isSearching ? { defaultExpandAllRows: true } : undefined}
          {...props}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableComponent;
