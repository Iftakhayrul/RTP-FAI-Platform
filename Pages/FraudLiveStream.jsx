import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Zap,
  AlertTriangle,
  Activity,
  TrendingUp,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import RiskBadge from '@/components/common/RiskBadge';
import DecisionBadge from '@/components/common/DecisionBadge';
import MetricCard from '@/components/common/MetricCard';
import { generateTransaction } from '@/components/simulator/TransactionSimulator';

export default function FraudLiveStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [attackMode, setAttackMode] = useState(false);
  const [streamRate, setStreamRate] = useState([50]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    challenged: 0,
    declined: 0,
    avgRisk: 0,
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isStreaming) {
      const interval = 1000 / (streamRate[0] / 10);
      intervalRef.current = setInterval(() => {
        const newTx = generateTransaction(attackMode);
        setTransactions((prev) => [newTx, ...prev].slice(0, 100));
        setStats((prev) => {
          const newTotal = prev.total + 1;
          const newAvgRisk = ((prev.avgRisk * prev.total) + newTx.risk_score) / newTotal;
          return {
            total: newTotal,
            approved: prev.approved + (newTx.decision === 'Approve' ? 1 : 0),
            challenged: prev.challenged + (newTx.decision === 'Challenge' ? 1 : 0),
            declined: prev.declined + (newTx.decision === 'Decline' ? 1 : 0),
            avgRisk: Math.round(newAvgRisk),
          };
        });
      }, interval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isStreaming, streamRate, attackMode]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-rose-100">
              <Activity className="w-5 h-5 text-rose-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Live Transaction Stream
            </h1>
          </div>
          <p className="text-slate-500">
            Real-time fraud risk scoring with automated decisions
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            onClick={() => setIsStreaming(!isStreaming)}
            className={isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}
            size="lg"
          >
            {isStreaming ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Stop Stream
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Stream
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stream Controls Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Stream Rate: {streamRate[0]} tx/sec
              </Label>
              <Slider
                value={streamRate}
                onValueChange={setStreamRate}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-3">
                <Switch
                  id="attack-mode"
                  checked={attackMode}
                  onCheckedChange={setAttackMode}
                />
                <Label htmlFor="attack-mode" className="flex items-center gap-2 cursor-pointer">
                  <Zap className={`w-4 h-4 ${attackMode ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span className={attackMode ? 'text-orange-600 font-medium' : 'text-slate-600'}>
                    Attack Burst Mode
                  </span>
                </Label>
              </div>
            </div>
          </div>

          {attackMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200"
            >
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Simulating fraud attack burst - 60% of transactions will be fraudulent</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Processed"
          value={stats.total.toLocaleString()}
          icon={Activity}
        />
        <MetricCard
          title="Approved"
          value={stats.approved.toLocaleString()}
          icon={TrendingUp}
          variant="success"
        />
        <MetricCard
          title="Challenged"
          value={stats.challenged.toLocaleString()}
          variant="warning"
        />
        <MetricCard
          title="Declined"
          value={stats.declined.toLocaleString()}
          variant="danger"
        />
        <MetricCard
          title="Avg Risk Score"
          value={stats.avgRisk}
        />
      </div>

      {/* Transaction Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-slate-50 py-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            Transaction Feed
            {isStreaming && (
              <span className="text-sm font-normal text-slate-500">
                ({transactions.length} in buffer)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">TX ID</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Merchant</TableHead>
                <TableHead className="font-semibold">Channel</TableHead>
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold text-center">Risk</TableHead>
                <TableHead className="font-semibold">Decision</TableHead>
                <TableHead className="font-semibold">Top Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-slate-500">
                      Click "Start Stream" to begin processing transactions
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.slice(0, 20).map((tx, idx) => (
                    <motion.tr
                      key={tx.tx_id}
                      initial={{ opacity: 0, backgroundColor: tx.risk_score > 60 ? '#FEE2E2' : '#D1FAE5' }}
                      animate={{ opacity: 1, backgroundColor: 'transparent' }}
                      transition={{ duration: 0.5 }}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                      onClick={() => window.location.href = createPageUrl(`TransactionDetail?txId=${tx.tx_id}`)}
                    >
                      <TableCell className="font-mono text-sm">{tx.tx_id}</TableCell>
                      <TableCell className="text-sm text-slate-600">{formatTime(tx.timestamp)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell className="text-sm">{tx.merchant}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {tx.channel}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{tx.country}</TableCell>
                      <TableCell className="text-center">
                        <RiskBadge score={tx.risk_score} size="sm" />
                      </TableCell>
                      <TableCell>
                        <DecisionBadge decision={tx.decision} />
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-[200px] truncate">
                        {tx.reason_codes?.[0] || '-'}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}