import { ConfigProvider, DatePicker, Select, Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnProps, TableProps } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { t } from 'i18next';

export interface Column extends ColumnProps<any> {
  title: string;
  dataIndex: string;
  key: string;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: { text: string; value: any }[];
  filteredDate?: boolean;
  searchText?: boolean;
}

interface TableComponentProps extends TableProps<any> {
  columns: Column[];
  dataSource: any[];
}

const TableComponent = ({
  columns,
  dataSource,
  ...props
}: TableComponentProps) => {
  const [filteredData, setFilteredData] = useState<any[]>(dataSource);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>(
    {}
  );
  const [selectedDateFilters, setSelectedDateFilters] = useState<
    Record<string, any>
  >({});
  const [searchTextFilters, setSearchTextFilters] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let filtered = dataSource;

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

    Object.keys(searchTextFilters).forEach((key) => {
      if (searchTextFilters[key]) {
        filtered = filtered.filter((item) =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(searchTextFilters[key].toLowerCase())
        );
      }
    });

    setFilteredData(filtered);
  }, [selectedFilters, selectedDateFilters, searchTextFilters, dataSource]);

  const handleSelectFilter = useCallback((value: any, key: string) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleDateFilter = useCallback((date: any, key: string) => {
    setSelectedDateFilters((prev) => ({
      ...prev,
      [key]: date ? dayjs(date) : null,
    }));
  }, []);

  const handleSearchTextFilter = useCallback((value: string, key: string) => {
    setSearchTextFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const enhancedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      filterDropdown:
        col.searchable || col.searchText
          ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
              <div style={{ padding: 8 }}>
                <Input
                  placeholder={`Search ${col.title}`}
                  value={selectedKeys[0]}
                  onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                    handleSearchTextFilter(e.target.value, col.dataIndex);
                  }}
                  onPressEnter={() => confirm()}
                  style={{ marginBottom: 8, display: 'block' }}
                />
                <Button
                  type="primary"
                  onClick={() => confirm()}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90, marginRight: 8 }}
                >
                  Search
                </Button>
                <Button
                  onClick={() => {
                    clearFilters();
                    handleSearchTextFilter('', col.dataIndex);
                  }}
                  size="small"
                  style={{ width: 90 }}
                >
                  Reset
                </Button>
              </div>
            )
          : col.filterable
          ? () => (
              <div style={{ padding: 8 }}>
                <Select
                  style={{ width: '100%' }}
                  placeholder={`Filter ${col.title}`}
                  value={selectedFilters[col.dataIndex] || undefined}
                  onChange={(value) => handleSelectFilter(value, col.dataIndex)}
                  allowClear
                >
                  {col.filterOptions?.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.text}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )
          : col.filteredDate
          ? () => (
              <div style={{ padding: 8 }}>
                <DatePicker
                  style={{ width: '100%' }}
                  onChange={(date) => handleDateFilter(date, col.dataIndex)}
                  placeholder={`Select ${col.title}`}
                  allowClear
                />
              </div>
            )
          : undefined,
      filterIcon:
        col.searchable || col.searchText
          ? (filtered: boolean) => (
              <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
              />
            )
          : undefined,
    }));
  }, [
    columns,
    selectedFilters,
    handleSelectFilter,
    handleDateFilter,
    handleSearchTextFilter,
  ]);

  return (
    <div className="table !w-full !max-w-full overflow-auto">
      <ConfigProvider table={{ className: 'shadow-lg !overflow-auto !w-full' }}>
        <Table
          bordered
          columns={enhancedColumns}
          dataSource={filteredData}
          pagination={{ position: ['bottomCenter'] }}
          title={() => (
            <p className="text-blue-600 text-base ">
              {t('Total result')}: {filteredData?.length} (
              {t(`result${filteredData?.length > 1 ? 's' : ''}`)})
            </p>
          )}
          {...props}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableComponent;
