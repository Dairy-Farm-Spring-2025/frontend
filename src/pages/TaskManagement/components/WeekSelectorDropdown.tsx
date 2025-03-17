import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import { Dropdown, Menu } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import React, { useMemo } from 'react';

interface WeekSelectorDropdownProps {
  selectedYear: number;
  currentWeekStart: dayjs.Dayjs;
  setCurrentWeekStart: (date: dayjs.Dayjs) => void;
}

const WeekSelectorDropdown: React.FC<WeekSelectorDropdownProps> = ({
  selectedYear,
  currentWeekStart,
  setCurrentWeekStart,
}) => {
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const startOfMonth = dayjs(`${selectedYear}-${i + 1}-01`);
      const weeks = new Map(); // Dùng Map để loại bỏ tuần trùng lặp
      let weekStart = startOfMonth.startOf('week');

      while (weekStart.month() === i || weekStart.add(6, 'day').month() === i) {
        const weekLabel = `${weekStart.format('DD/MM')} - ${weekStart
          .add(6, 'day')
          .format('DD/MM')}`;
        if (!weeks.has(weekLabel)) {
          weeks.set(weekLabel, weekStart);
        }
        weekStart = weekStart.add(1, 'week');
      }

      return {
        title: t(startOfMonth.format('MMMM')),
        weeks: Array.from(weeks, ([label, value]) => ({ label, value })),
      };
    }).filter((month) => month.weeks.length > 0); // Loại bỏ các tháng không có tuần hợp lệ
  }, [selectedYear]);

  const menu = (
    <Menu style={{ maxHeight: '500px', overflowY: 'auto' }}>
      {months.map((month, idx) => (
        <Menu.ItemGroup key={idx} title={month.title}>
          {month.weeks.map((week) => (
            <Menu.Item
              key={week.value.toISOString()}
              onClick={() => setCurrentWeekStart(week.value)}
              style={{
                fontWeight: currentWeekStart.isSame(week.value, 'day')
                  ? 'bold'
                  : 'normal',
              }}
            >
              {week.label}{' '}
              {currentWeekStart.isSame(week.value, 'day') && <CheckOutlined />}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <ButtonComponent className="shadow-md">
        {t('Select week')} <DownOutlined />
      </ButtonComponent>
    </Dropdown>
  );
};

export default WeekSelectorDropdown;
