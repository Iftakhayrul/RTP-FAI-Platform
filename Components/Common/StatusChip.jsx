import React from 'react';
import { cn } from '@/lib/utils';

const statusStyles = {
  healthy: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  error: 'bg-red-500/10 text-red-600 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  neutral: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
};

export default function StatusChip({ label, status = 'neutral', pulse = false }) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border',
      statusStyles[status]
    )}>
      <span className={cn(
        'w-2 h-2 rounded-full',
        status === 'healthy' && 'bg-emerald-500',
        status === 'warning' && 'bg-amber-500',
        status === 'error' && 'bg-red-500',
        status === 'info' && 'bg-blue-500',
        status === 'neutral' && 'bg-slate-500',
        pulse && 'animate-pulse'
      )} />
      {label}
    </div>
  );
}