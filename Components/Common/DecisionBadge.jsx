import React from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertTriangle, X } from 'lucide-react';

export default function DecisionBadge({ decision }) {
  const config = {
    Approve: {
      icon: Check,
      className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    },
    Challenge: {
      icon: AlertTriangle,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    },
    Decline: {
      icon: X,
      className: 'bg-red-500/10 text-red-600 border-red-500/30',
    },
  };

  const { icon: Icon, className } = config[decision] || config.Approve;

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {decision}
    </div>
  );
}