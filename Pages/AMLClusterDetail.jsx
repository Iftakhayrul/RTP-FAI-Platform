import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Network,
  Download,
  AlertTriangle,
  FileText,
  Clock,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import RiskBadge from '@/components/common/RiskBadge';
import TypologyBadge from '@/components/common/TypologyBadge';
import { generateMuleCluster } from '@/components/simulator/TransactionSimulator';

export default function AMLClusterDetail() {
  const [cluster, setCluster] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clusterId = urlParams.get('clusterId');
    
    // Generate or load cluster
    const typologies = ['Fan-out', 'Fan-in', 'Cycle', 'Layering'];
    const randomTypology = typologies[Math.floor(Math.random() * typologies.length)];
    const generatedCluster = generateMuleCluster(randomTypology);
    if (clusterId) generatedCluster.cluster_id = clusterId;
    
    setCluster(generatedCluster);
  }, []);

  if (!cluster) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const evidenceMetrics = [
    { label: 'Fan-Out Count', value: cluster.fan_out_count, max: 20, icon: ArrowUpRight, color: 'blue' },
    { label: 'Fan-In Count', value: cluster.fan_in_count, max: 20, icon: ArrowDownLeft, color: 'purple' },
    { label: 'Cycle Indicator', value: cluster.cycle_indicator ? 'Detected' : 'None', icon: RefreshCw, color: cluster.cycle_indicator ? 'orange' : 'slate' },
    { label: 'Burst Velocity', value: `${cluster.burst_velocity} tx/hr`, max: 100, icon: Clock, color: 'amber' },
    { label: 'Layering Depth', value: cluster.layering_depth, max: 10, icon: Layers, color: 'red' },
  ];

  const handleExportSAR = () => {
    const sarSummary = `
SAR-READY SUMMARY (DEMO)
========================
Cluster ID: ${cluster.cluster_id}
Date Generated: ${new Date().toISOString()}

SUSPICIOUS ACTIVITY SUMMARY
---------------------------
Typology: ${cluster.typology}
Risk Score: ${cluster.risk_score}/100
Total Flow Amount: $${cluster.total_flow_amount?.toLocaleString()}
Number of Accounts Involved: ${cluster.account_count}

TYPOLOGY EVIDENCE
-----------------
Fan-Out Count: ${cluster.fan_out_count}
Fan-In Count: ${cluster.fan_in_count}
Cycle Detected: ${cluster.cycle_indicator ? 'Yes' : 'No'}
Layering Depth: ${cluster.layering_depth}
Burst Velocity: ${cluster.burst_velocity} transactions/hour

HUB ACCOUNTS
------------
${cluster.hub_accounts?.join('\n') || 'None identified'}

TRANSFER TIMELINE
-----------------
${cluster.transfers?.map(t => 
  `${t.from_account} -> ${t.to_account}: $${t.amount.toLocaleString()} at ${new Date(t.timestamp).toLocaleString()}`
).join('\n') || 'No transfers recorded'}

========================
END OF SAR SUMMARY
    `;

    const blob = new Blob([sarSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAR_${cluster.cluster_id}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AMLNetwork')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Cluster Investigation</h1>
              <TypologyBadge typology={cluster.typology} />
            </div>
            <p className="text-slate-500 font-mono">{cluster.cluster_id}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Open AML Case
          </Button>
          <Button onClick={handleExportSAR} className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export SAR Summary
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Cluster Risk</p>
                <div className="mt-2">
                  <RiskBadge score={cluster.risk_score} size="lg" />
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Total Flow</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${cluster.total_flow_amount?.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Accounts</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {cluster.account_count}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Typology</p>
            <div className="mt-2">
              <TypologyBadge typology={cluster.typology} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Evidence Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Typology Evidence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {evidenceMetrics.map((metric) => {
              const Icon = metric.icon;
              const isNumber = typeof metric.value === 'number';
              return (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${metric.color}-500`} />
                      <span className="text-sm text-slate-600">{metric.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {metric.value}
                    </span>
                  </div>
                  {isNumber && metric.max && (
                    <Progress 
                      value={(metric.value / metric.max) * 100} 
                      className="h-2"
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Hub Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              Hub Accounts (High Risk)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cluster.hub_accounts?.map((account, idx) => (
                <motion.div
                  key={account}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-mono font-medium">{account}</p>
                      <p className="text-sm text-red-600">Money Mule Hub</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Transfer Timeline
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">From Account</TableHead>
                <TableHead className="font-semibold"></TableHead>
                <TableHead className="font-semibold">To Account</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cluster.transfers?.map((transfer, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-slate-100"
                >
                  <TableCell>
                    <span className={`font-mono text-sm ${
                      cluster.hub_accounts?.includes(transfer.from_account) 
                        ? 'text-red-600 font-semibold' 
                        : 'text-slate-700'
                    }`}>
                      {transfer.from_account}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm ${
                      cluster.hub_accounts?.includes(transfer.to_account) 
                        ? 'text-red-600 font-semibold' 
                        : 'text-slate-700'
                    }`}>
                      {transfer.to_account}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${transfer.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(transfer.timestamp).toLocaleString()}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}