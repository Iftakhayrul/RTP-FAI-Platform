import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon,
  variant = 'default' 
}) {
  const variants = {
    default: 'bg-white border-slate-200',
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400',
    success: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-400',
    warning: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-400',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400',
  };

  const isColored = variant !== 'default';

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg',
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            isColored ? 'text-white/80' : 'text-slate-500'
          )}>
            {title}
          </p>
          <p className={cn(
            'text-3xl font-bold tracking-tight',
            isColored ? 'text-white' : 'text-slate-900'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              'text-sm',
              isColored ? 'text-white/70' : 'text-slate-400'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'p-3 rounded-xl',
            isColored ? 'bg-white/20' : 'bg-slate-100'
          )}>
            <Icon className={cn(
              'w-6 h-6',
              isColored ? 'text-white' : 'text-slate-600'
            )} />
          </div>
        )}
      </div>
      
      {trend && (
        <div className={cn(
          'flex items-center gap-1 mt-4 text-sm font-medium',
          trend === 'up' ? 'text-emerald-500' : 'text-red-500',
          isColored && 'text-white/90'
        )}>
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {trendValue}
        </div>
      )}
      
      {isColored && (
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
      )}
    </div>
  );
}