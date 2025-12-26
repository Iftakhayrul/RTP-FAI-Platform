import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Filter,
  Clock,
  DollarSign,
  User,
  ExternalLink,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RiskBadge from '@/components/common/RiskBadge';
import DecisionBadge from '@/components/common/DecisionBadge';
import PriorityBadge from '@/components/common/PriorityBadge';
import MetricCard from '@/components/common/MetricCard';
import { generateTransaction } from '@/components/simulator/TransactionSimulator';

// Generate sample alerts
const generateAlerts = () => {
  return Array.from({ length: 25 }, (_, i) => {
    const tx = generateTransaction(Math.random() > 0.3);
    const priority = tx.risk_score >= 80 ? 'Critical' : tx.risk_score >= 60 ? 'High' : tx.risk_score >= 40 ? 'Medium' : 'Low';
    const statuses = ['Open', 'Investigating', 'Resolved', 'Escalated'];
    const analysts = ['John Smith', 'Sarah Chen', 'Mike Johnson', 'Emily Davis', 'Unassigned'];
    
    return {
      alert_id: `ALT-${(1000 + i).toString()}`,
      tx_id: tx.tx_id,
      risk_score: tx.risk_score,
      amount: tx.amount,
      customer_id: tx.customer_id,
      decision: tx.decision,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assigned_analyst: analysts[Math.floor(Math.random() * analysts.length)],
      priority,
      sla_deadline: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      created_date: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
    };
  });
};

export default function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDecision, setFilterDecision] = useState('all');

  useEffect(() => {
    setAlerts(generateAlerts());
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterPriority !== 'all' && alert.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    if (filterDecision !== 'all' && alert.decision !== filterDecision) return false;
    return true;
  });

  const stats = {
    total: alerts.length,
    open: alerts.filter(a => a.status === 'Open').length,
    critical: alerts.filter(a => a.priority === 'Critical').length,
    prevented: alerts.filter(a => a.decision === 'Decline').reduce((sum, a) => sum + a.amount, 0),
  };

  const getTimeRemaining = (deadline) => {
    const diff = new Date(deadline) - new Date();
    if (diff < 0) return { text: 'Overdue', color: 'text-red-600' };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours < 2) return { text: `${hours}h ${mins}m`, color: 'text-orange-600' };
    return { text: `${hours}h ${mins}m`, color: 'text-slate-600' };
  };

  const statusColors = {
    Open: 'bg-blue-100 text-blue-700',
    Investigating: 'bg-amber-100 text-amber-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
    Escalated: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-100">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Fraud Alert Queue
          </h1>
        </div>
        <p className="text-slate-500">
          Triage and workflow management for flagged transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Alerts"
          value={stats.total}
          icon={AlertTriangle}
        />
        <MetricCard
          title="Open Cases"
          value={stats.open}
          variant="warning"
        />
        <MetricCard
          title="Critical Priority"
          value={stats.critical}
          variant="danger"
        />
        <MetricCard
          title="Prevented Loss"
          value={`$${stats.prevented.toLocaleString()}`}
          icon={TrendingDown}
          variant="success"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Filters:</span>
            </div>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Investigating">Investigating</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDecision} onValueChange={setFilterDecision}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="Approve">Approve</SelectItem>
                <SelectItem value="Challenge">Challenge</SelectItem>
                <SelectItem value="Decline">Decline</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-slate-500">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Alert ID</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold text-center">Risk</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Decision</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Analyst</TableHead>
                <TableHead className="font-semibold">SLA Timer</TableHead>
                <TableHead className="font-semibold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert, idx) => {
                const sla = getTimeRemaining(alert.sla_deadline);
                return (
                  <motion.tr
                    key={alert.alert_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {alert.alert_id}
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={alert.priority} />
                    </TableCell>
                    <TableCell className="text-center">
                      <RiskBadge score={alert.risk_score} size="sm" />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${alert.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {alert.customer_id}
                    </TableCell>
                    <TableCell>
                      <DecisionBadge decision={alert.decision} />
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[alert.status]}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {alert.assigned_analyst}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-4 h-4 ${sla.color}`} />
                        <span className={`text-sm font-medium ${sla.color}`}>
                          {sla.text}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={createPageUrl(`FraudCase?alertId=${alert.alert_id}`)}>
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}