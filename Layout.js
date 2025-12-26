import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Activity,
  Shield,
  AlertTriangle,
  FileText,
  Network,
  GitBranch,
  Link2,
  BarChart3,
  ClipboardList,
  Database,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Overview', page: 'Overview', icon: LayoutDashboard },
  { name: 'Architecture', page: 'Architecture', icon: GitBranch },
  { divider: true, label: 'FRAUD DETECTION' },
  { name: 'Live Stream', page: 'FraudLiveStream', icon: Activity },
  { name: 'Alert Queue', page: 'FraudAlerts', icon: AlertTriangle },
  { divider: true, label: 'AML DETECTION' },
  { name: 'Network Graph', page: 'AMLNetwork', icon: Network },
  { name: 'Cases', page: 'AMLCases', icon: FileText },
  { divider: true, label: 'INTELLIGENCE' },
  { name: 'Correlation', page: 'Correlation', icon: Link2 },
  { name: 'Model Performance', page: 'ModelPerformance', icon: BarChart3 },
  { name: 'Audit Logs', page: 'AuditLogs', icon: ClipboardList },
];

export default function Layout({ children, currentPageName }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-slate-900">RTP-FAI</span>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-50 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64',
        'hidden lg:block',
        mobileOpen && 'block lg:block'
      )}>
        {/* Logo */}
        <div className={cn(
          'h-16 flex items-center border-b border-slate-200',
          collapsed ? 'justify-center px-2' : 'px-6'
        )}>
          <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
          {!collapsed && (
            <div className="ml-3">
              <h1 className="font-bold text-slate-900 text-lg leading-tight">RTP-FAI</h1>
              <p className="text-[10px] text-slate-500 leading-tight">Financial Intelligence</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item, idx) => {
            if (item.divider) {
              return collapsed ? (
                <div key={idx} className="h-px bg-slate-200 my-3" />
              ) : (
                <div key={idx} className="pt-4 pb-2 px-3">
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                    {item.label}
                  </span>
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = currentPageName === item.page;

            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  collapsed && 'justify-center'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-indigo-600')} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 bg-white hidden lg:block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'transition-all duration-300 min-h-screen',
        collapsed ? 'lg:ml-20' : 'lg:ml-64',
        'pt-16 lg:pt-0'
      )}>
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}