import { Timeline, TimelineProps } from 'antd';
import { TimeLineItemProps } from 'antd/es/timeline/TimelineItem';
import React, { useState } from 'react';
import ButtonComponent from '../Button/ButtonComponent';
import './index.scss';

export interface TimelineItems extends TimeLineItemProps {
  dot?: any;
  color?: string;
  children: React.ReactNode | string | any;
  label?: React.ReactNode;
}

export interface TimelineComponentProps extends TimelineProps {
  items: TimelineItems[];
  reverse?: boolean;
}

const TimelineComponent = ({
  items,
  reverse = false,
  ...props
}: TimelineComponentProps) => {
  const [sort, setSort] = useState(false);
  const handleClick = () => {
    setSort(!sort);
  };
  return (
    <div className="w-full">
      {reverse && (
        <ButtonComponent type="primary" onClick={handleClick}>
          Reverse
        </ButtonComponent>
      )}
      <div className="time-line mt-10">
        <Timeline mode="left" reverse={sort} items={items} {...props} />
      </div>
    </div>
  );
};

export default TimelineComponent;
