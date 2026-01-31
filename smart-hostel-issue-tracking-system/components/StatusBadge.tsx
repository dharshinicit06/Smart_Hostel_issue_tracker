
import React from 'react';
import { IssueStatus, IssuePriority } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface BadgeProps {
  text: string;
  className: string;
}

const Badge: React.FC<BadgeProps> = ({ text, className }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}>
    {text}
  </span>
);

export const StatusBadge: React.FC<{ status: IssueStatus }> = ({ status }) => (
  <Badge text={status.replace('_', ' ')} className={STATUS_COLORS[status]} />
);

export const PriorityBadge: React.FC<{ priority: IssuePriority }> = ({ priority }) => (
  <Badge text={priority} className={PRIORITY_COLORS[priority]} />
);
