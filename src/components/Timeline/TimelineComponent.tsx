import { Timeline, TimelineProps } from 'antd';
import { TimeLineItemProps } from 'antd/es/timeline/TimelineItem';
import React from 'react';
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

const TimelineComponent = ({ items, ...props }: TimelineComponentProps) => {
  return (
    <div className="w-full">
      <div className="time-line">
        <Timeline mode="left" items={items} {...props} />
      </div>
    </div>
  );
};

export default TimelineComponent;
