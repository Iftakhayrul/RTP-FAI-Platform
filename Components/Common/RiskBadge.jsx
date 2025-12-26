import React from 'react';
import { cn } from '@/lib/utils';

export default function RiskBadge({ score, size = 'md' }) {
  const getColor = (s) => {
    if (s >= 80) return 'bg-red-500 text-white';
    if (s >= 60) return 'bg-orange-500 text-white';
    if (s >= 40) return 'bg-amber-500 text-white';
    if (s >= 20) return 'bg-yellow-400 text-slate-900';
    return 'bg-emerald-500 text-white';
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-bold shadow-lg',
      getColor(score),
      sizes[size]
    )}>
      {score}
    </div>
  );
}