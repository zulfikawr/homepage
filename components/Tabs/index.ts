import Tabs from './component';
import React from 'react';

export interface TabItemProps {
  key: string;
  label?: string;
  icon?: string;
  link?: {
    internal?: string;
    external?: string;
  };
  className?: string;
  sectionLabel?: string;
  component?: React.ReactNode;
  hoverable?: boolean;
  color?: string;
  bgColor?: string;
  bgDark?: string;
  action?: () => void;
  hidden?: boolean;
}

export interface TabsProps {
  items: TabItemProps[];
  direction?: 'vertical';
  defaultHighlighted?: boolean;
  verticalListWrapper?: React.MutableRefObject<HTMLElement>;
}

export interface TabItemComponentProps extends TabItemProps {
  index?: number;
}

export default Tabs;
