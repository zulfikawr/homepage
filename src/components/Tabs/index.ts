import Tabs from './component';
import React from 'react';

export interface TabItemProps {
  className?: string;
  label?: string;
  sectionLabel?: string;
  component?: React.ReactNode;
  hoverable?: boolean;
  color?: string;
  bgColor?: string;
  bgDark?: string;
  icon?: string;
  link?: {
    internal?: string;
    external?: string;
  };
  onClick?: () => void;
  action?: string;
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
