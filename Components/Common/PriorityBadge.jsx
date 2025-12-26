import React from 'react';
import { cn } from '@/lib/utils';

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
  Medium: 'bg-blue-100 text-blue-700 border-blue-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
};

export default function PriorityBadge({ priority }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      priorityStyles[priority] || priorityStyles.Low
    )}>
      {priority}
    </span>
  );
}