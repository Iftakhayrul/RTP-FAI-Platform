import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Layers, Network, Zap } from 'lucide-react';

const typologyConfig = {
  'Fan-in': { icon: ArrowDownLeft, color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
  'Fan-out': { icon: ArrowUpRight, color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' },
  'Cycle': { icon: RefreshCw, color: 'bg-orange-500/10 text-orange-600 border-orange-500/30' },
  'Layering': { icon: Layers, color: 'bg-red-500/10 text-red-600 border-red-500/30' },
  'Hub': { icon: Network, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30' },
  'Burst Chain': { icon: Zap, color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
};

export default function TypologyBadge({ typology }) {
  const config = typologyConfig[typology] || typologyConfig['Hub'];
  const Icon = config.icon;

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
      config.color
    )}>
      <Icon className="w-3.5 h-3.5" />
      {typology}
    </div>
  );
}