import { SearchOutlined } from '@ant-design/icons';
import EmptyComponent from '@components/Error/EmptyComponent';
import { Button, ConfigProvider, DatePicker, Input, Select, Table } from 'antd';
import { ColumnProps, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface Column extends ColumnProps<any> {
  title: string;
  dataIndex: string;
  key: string;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: { text: string; value: any }[];
  filteredDate?: boolean;
  searchText?: boolean;
  objectKeyFilter?: string;
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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    let filtered = dataSource;

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]) {
        filtered = filtered.filter((item) => {
          let fieldValue = item[key];
          if (fieldValue && typeof fieldValue === 'object' && columns) {
            const column = columns.find((col) => col.key === key);
            if (column?.objectKeyFilter) {
              fieldValue = fieldValue[column.objectKeyFilter];
            }
          }
          return fieldValue === selectedFilters[key];
        });
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

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

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

  const getRowIndex = (index: number) => {
    return (pagination.current - 1) * pagination.pageSize + index + 1;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const indexColumn: Column = {
    dataIndex: 'index',
    key: 'index',
    title: '#',
    render: (_, __, index) => getRowIndex(index),
    width: 60,
  };

  const enhancedColumns = useMemo(() => {
    return [indexColumn, ...columns].map((col) => ({
      ...col,
      filterDropdown:
        col.searchable || col.searchText
          ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
              const handleReset = (clearFilters: () => void) => {
                clearFilters();
                setSelectedKeys([]);
                confirm();
                setSearchTextFilters({});
              };
              return (
                <div style={{ padding: 8 }}>
                  <Input
                    placeholder={`${t('Search')} ${col.title}`}
                    value={selectedKeys[0] || ``}
                    onChange={(e) => {
                      setSelectedKeys(e.target.value ? [e.target.value] : []);
                    }}
                    onPressEnter={() =>
                      handleSearchTextFilter(selectedKeys[0], col.dataIndex)
                    }
                    style={{ marginBottom: 8, display: 'block' }}
                  />
                  <Button
                    type="primary"
                    onClick={() => {
                      handleSearchTextFilter(selectedKeys[0], col.dataIndex);
                      confirm();
                    }}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                  >
                    {t('Search')}
                  </Button>
                  <Button
                    onClick={() => clearFilters && handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                  >
                    {t('Reset')}
                  </Button>
                </div>
              );
            }
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
    indexColumn,
    columns,
    handleSearchTextFilter,
    selectedFilters,
    handleSelectFilter,
    handleDateFilter,
  ]);

  return (
    <div className="table !w-full !max-w-full overflow-auto">
      <ConfigProvider table={{ className: 'shadow-lg !overflow-auto !w-full' }}>
        <Table
          bordered
          columns={enhancedColumns}
          onChange={handleTableChange} // Captures pagination updates
          dataSource={filteredData}
          pagination={{ position: ['bottomCenter'] }}
          title={() => (
            <p className="text-blue-600 text-base ">
              {t('Total result')}: {filteredData?.length} (
              {t(`result${filteredData?.length > 1 ? 's' : ''}`)})
            </p>
          )}
          locale={{
            emptyText: <EmptyComponent />,
          }}
          {...props}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableComponent;
