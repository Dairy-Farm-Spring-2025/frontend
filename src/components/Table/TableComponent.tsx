import { SearchOutlined } from '@ant-design/icons';
import { PRIMARY_COLORS } from '@common/colors';
import EmptyComponent from '@components/Error/EmptyComponent';
import { cowOriginFiltered } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
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
  editable?: boolean;
}

interface TableComponentProps extends TableProps<any> {
  columns: Column[];
  dataSource: any[];
  onDataChange?: (newData: any[]) => void; // Callback để thông báo dữ liệu thay đổi
}
// Component ô có thể chỉnh sửa
const EditableCell: React.FC<any> = ({
  editable,
  children,
  dataIndex,
  record,
  handleChange,
  render,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const initialValue = record && dataIndex in record ? record[dataIndex] : '';
  const [value, setValue] = useState(initialValue);
  const toggleEdit = () => {
    setEditing(!editing);
  };

  const save = (newValue: any) => {
    handleChange(newValue, record, dataIndex);
    setEditing(false);
  };

  let childNode = children;

  if (editable) {
    if (editing) {
      // Xử lý các kiểu dữ liệu khác nhau
      if (dataIndex === 'dateOfBirth' || dataIndex === 'dateOfEnter') {
        childNode = (
          <DatePicker
            format="YYYY-MM-DD"
            onChange={(_date, dateString) => {
              setValue(dateString);
              save(dateString);
            }}
            defaultValue={value ? dayjs(value) : undefined}
            style={{ width: '100%' }}
          />
        );
      } else if (dataIndex === 'gender') {
        childNode = (
          <Select
            defaultValue={value}
            onChange={(val) => {
              setValue(val);
              save(val);
            }}
            style={{ width: '100%' }}
          >
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        );
      } else if (dataIndex === 'cowOrigin') {
        childNode = (
          <Select
            defaultValue={value}
            onChange={(val) => {
              setValue(val);
              save(val);
            }}
            style={{ width: '100%' }}
          >
            {cowOriginFiltered().map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.text}
              </Select.Option>
            ))}
          </Select>
        );
      } else if (dataIndex === 'cowStatus') {
        childNode = (
          <Select
            defaultValue={value}
            onChange={(val) => {
              setValue(val);
              save(val);
            }}
            style={{ width: '100%' }}
          >
            {cowStatus().map((status) => (
              <Select.Option key={status.value} value={status.value}>
                {status.label}
              </Select.Option>
            ))}
          </Select>
        );
      } else {
        childNode = (
          <Input
            defaultValue={value}
            onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement; // Ép kiểu để đảm bảo target có thuộc tính value
              save(target.value);
            }}
            onBlur={(e) => save(e.target.value)}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      }
    } else {
      childNode = (
        <div onClick={toggleEdit} style={{ padding: '5px' }}>
          {render ? render(value) : value || '-'}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};
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
    align: 'center',
  };

  const enhancedColumns = useMemo(() => {
    return [indexColumn, ...columns].map(({ key, align, width, ...col }) => {
      let updatedAlign = align;
      let updatedWidth = width;
      if (/gender|inPen|unit/i.test(key) || /status|role|Status/.test(key)) {
        updatedAlign = 'center';
        updatedWidth = 200;
      } else if (
        /quantity|date|weight|created|Volume|volume/i.test(key) ||
        col.filteredDate
      ) {
        updatedAlign = 'right';
        updatedWidth = columns.length > 5 ? 'auto' : 200;
      }

      if (/action/i.test(key)) {
        updatedWidth = columns.length > 5 ? 'auto' : 300;
      }

      if (/role/i.test(key)) {
        updatedAlign = 'center';
        updatedWidth = 170;
      }

      if (/length/i.test(key)) {
        updatedAlign = 'right';
        updatedWidth = columns.length > 5 ? 'auto' : 200;
      }

      return {
        ...col,
        key, // Preserve the original key
        width: updatedWidth,
        align: key === 'action' ? 'left' : updatedAlign, // Auto-align "action" column
        filterDropdown:
          col.searchable || col.searchText
            ? ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
              }: any) => {
                const handleReset = (clearFilters: () => void) => {
                  clearFilters();
                  setSelectedKeys([]);
                  confirm();
                  setSearchTextFilters({});
                };
                return (
                  <div style={{ padding: 8, width: 250 }}>
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
                      className="!w-full"
                    />
                    <div className="flex items-center gap-1">
                      <Button
                        type="primary"
                        onClick={() => {
                          handleSearchTextFilter(
                            selectedKeys[0],
                            col.dataIndex
                          );
                          confirm();
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ marginRight: 8 }}
                        className="!w-1/2"
                      >
                        {t('Search')}
                      </Button>
                      <Button
                        onClick={() =>
                          clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        className="!w-1/2"
                      >
                        {t('Reset')}
                      </Button>
                    </div>
                  </div>
                );
              }
            : col.filterable
            ? () => (
                <div style={{ padding: 8, width: 250 }}>
                  <Select
                    placeholder={`Filter ${col.title}`}
                    value={selectedFilters[col.dataIndex] || undefined}
                    onChange={(value) =>
                      handleSelectFilter(value, col.dataIndex)
                    }
                    allowClear
                    className="!w-full"
                    showSearch={true}
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
      };
    });
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
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: PRIMARY_COLORS,
              headerColor: '#FFF',
              headerSortHoverBg: PRIMARY_COLORS,
              headerFilterHoverBg: PRIMARY_COLORS,
              headerSortActiveBg: PRIMARY_COLORS,
              colorIcon: 'red', // Default icon color
              colorIconHover: '#FFF', // Icon color on hover
              colorInfoActive: '#FFF', // Icon color when active (clicked)
              rowSelectedBg: 'rgba(22, 101, 52, 0.1)',
              rowSelectedHoverBg: 'rgba(22, 101, 52, 0.1)',
            },
          },
        }}
        table={{ className: '!overflow-auto !w-full' }}
      >
        <Table
          bordered
          columns={enhancedColumns}
          onChange={handleTableChange} // Captures pagination updates
          dataSource={
            filteredData
              ? filteredData.map((element, index) => ({
                  ...element,
                  key: element.key || index, // Đảm bảo có key
                }))
              : []
          }
          pagination={{ position: ['bottomCenter'] }}
          className="custom-table"
          title={() => (
            <p className="text-blue-600 text-base ">
              {t('Total result')}: {filteredData?.length} (
              {t(`result${filteredData?.length > 1 ? 's' : ''}`)})
            </p>
          )}
          locale={{
            emptyText: <EmptyComponent />,
          }}
          components={{
            body: {
              cell: EditableCell, // Sử dụng EditableCell cho các ô
            },
          }}
          {...props}
        />
      </ConfigProvider>
    </div>
  );
};

export default TableComponent;
