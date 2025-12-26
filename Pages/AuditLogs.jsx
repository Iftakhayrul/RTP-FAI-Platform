import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Filter,
  Download,
  Search,
  Database,
  Shield,
  Network,
  FileText,
  Clock,
  User,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { generateTransaction } from '@/components/simulator/TransactionSimulator';

// Generate sample audit logs
const generateAuditLogs = () => {
  const actions = [
    'Risk Score Generated',
    'Transaction Declined',
    'Challenge Issued',
    'Alert Created',
    'Case Opened',
    'Case Resolved',
    'AML Cluster Detected',
    'SAR Filed',
    'Model Prediction',
    'Escalation Triggered',
  ];
  
  const actors = ['System', 'Risk API v2.1', 'AML Engine v1.5', 'Sarah Chen', 'James Wilson', 'Auto-Escalation'];
  const modelVersions = ['fraud-v2.1.0', 'aml-v1.5.2', 'fraud-v2.0.8', 'aml-v1.5.0'];
  const entityTypes = ['Transaction', 'FraudAlert', 'AMLCluster', 'AMLCase', 'Model'];

  return Array.from({ length: 50 }, (_, i) => {
    const tx = generateTransaction(Math.random() > 0.5);
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      log_id: `LOG-${(10000 + i).toString()}`,
      timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
      actor: actors[Math.floor(Math.random() * actors.length)],
      action,
      entity_type: entityTypes[Math.floor(Math.random() * entityTypes.length)],
      entity_id: tx.tx_id,
      model_version: modelVersions[Math.floor(Math.random() * modelVersions.length)],
      decision: tx.decision,
      reason_codes: tx.reason_codes?.slice(0, 3) || [],
      details: `${action} for entity ${tx.tx_id}`,
    };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const datasets = [
  {
    name: 'PaySim',
    purpose: 'Fraud detection training & validation',
    license: 'CC BY-SA 4.0',
    source: 'Kaggle',
    records: '6.3M transactions',
    preprocessing: 'Normalized amounts, encoded categorical features',
  },
  {
    name: 'IEEE-CIS Fraud Detection',
    purpose: 'Large-scale fraud classification benchmark',
    license: 'Competition Dataset',
    source: 'Kaggle/IEEE',
    records: '590K transactions',
    preprocessing: 'Feature engineering, missing value imputation',
  },
  {
    name: 'AMLSim',
    purpose: 'AML network pattern simulation',
    license: 'Apache 2.0',
    source: 'IBM Research',
    records: '100K accounts, 500K transfers',
    preprocessing: 'Graph construction, typology labeling',
  },
  {
    name: 'Elliptic',
    purpose: 'Cryptocurrency AML benchmark',
    license: 'MIT',
    source: 'Elliptic/Kaggle',
    records: '203K nodes, 234K edges',
    preprocessing: 'Node feature extraction, temporal ordering',
  },
];

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');
  const [filterActor, setFilterActor] = useState('all');
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => {
    setLogs(generateAuditLogs());
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filterEntity !== 'all' && log.entity_type !== filterEntity) return false;
    if (filterActor !== 'all' && log.actor !== filterActor) return false;
    if (searchTerm && !log.entity_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.action.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const uniqueActors = [...new Set(logs.map(l => l.actor))];

  const entityIcons = {
    Transaction: Shield,
    FraudAlert: Shield,
    AMLCluster: Network,
    AMLCase: FileText,
    Model: Database,
  };

  const handleExportLogs = () => {
    const exportData = filteredLogs.map(log => ({
      log_id: log.log_id,
      timestamp: log.timestamp,
      actor: log.actor,
      action: log.action,
      entity_type: log.entity_type,
      entity_id: log.entity_id,
      model_version: log.model_version,
      decision: log.decision,
      reason_codes: log.reason_codes.join('; '),
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <ClipboardList className="w-5 h-5 text-slate-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Audit Trail & Data Governance
            </h1>
          </div>
          <p className="text-slate-500">
            Audit trail and dataset registry supporting transparency and reproducibility
          </p>
        </div>

        <Button onClick={handleExportLogs} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="datasets">Dataset Registry</TabsTrigger>
          <TabsTrigger value="reproducibility">Reproducibility</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6 mt-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search by entity ID or action..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterEntity} onValueChange={setFilterEntity}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Entity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="Transaction">Transaction</SelectItem>
                    <SelectItem value="FraudAlert">Fraud Alert</SelectItem>
                    <SelectItem value="AMLCluster">AML Cluster</SelectItem>
                    <SelectItem value="AMLCase">AML Case</SelectItem>
                    <SelectItem value="Model">Model</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterActor} onValueChange={setFilterActor}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Actor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actors</SelectItem>
                    {uniqueActors.map(actor => (
                      <SelectItem key={actor} value={actor}>{actor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-sm text-slate-500">
                  {filteredLogs.length} entries
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Timestamp</TableHead>
                    <TableHead className="font-semibold">Actor</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                    <TableHead className="font-semibold">Entity</TableHead>
                    <TableHead className="font-semibold">Model Version</TableHead>
                    <TableHead className="font-semibold">Decision</TableHead>
                    <TableHead className="font-semibold">Reason Codes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.slice(0, 30).map((log, idx) => {
                    const EntityIcon = entityIcons[log.entity_type] || FileText;
                    return (
                      <motion.tr
                        key={log.log_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-slate-100"
                      >
                        <TableCell className="text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-sm">{log.actor}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {log.action}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <EntityIcon className="w-3.5 h-3.5 text-slate-400" />
                            <div>
                              <span className="text-xs text-slate-500">{log.entity_type}</span>
                              <p className="font-mono text-xs">{log.entity_id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.model_version}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.decision && (
                            <Badge className={
                              log.decision === 'Approve' ? 'bg-emerald-100 text-emerald-700' :
                              log.decision === 'Decline' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }>
                              {log.decision}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {log.reason_codes.slice(0, 2).map((code, i) => (
                              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded truncate max-w-[180px]">
                                {code}
                              </span>
                            ))}
                            {log.reason_codes.length > 2 && (
                              <span className="text-xs text-slate-400">+{log.reason_codes.length - 2}</span>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="w-4 h-4" />
                Dataset Registry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {datasets.map((dataset) => (
                  <motion.div
                    key={dataset.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{dataset.name}</h3>
                        <p className="text-sm text-slate-500">{dataset.source}</p>
                      </div>
                      <Badge variant="outline">{dataset.license}</Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">{dataset.purpose}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Records:</span>
                        <span className="font-medium">{dataset.records}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Preprocessing:</span>
                        <span className="text-xs text-slate-600 max-w-[200px] text-right">
                          {dataset.preprocessing}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reproducibility" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reproducibility Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">How to Rerun Demo</h4>
                <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
                  <li>Initialize the transaction simulator with seed 42</li>
                  <li>Generate 1000 transactions in normal mode</li>
                  <li>Enable attack burst mode for 200 transactions</li>
                  <li>Run AML graph builder on transfer history</li>
                  <li>Execute typology detection with default thresholds</li>
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Random Seed</h4>
                  <code className="text-sm font-mono text-blue-700">SEED = 42</code>
                </div>
                <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Model Version</h4>
                  <code className="text-sm font-mono text-purple-700">fraud-v2.1.0 / aml-v1.5.2</code>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-3">Scenario Files</h4>
                <ul className="space-y-2 text-sm text-emerald-700">
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <code>scenarios/fraud_burst.json</code> - Attack simulation config
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <code>scenarios/aml_typologies.json</code> - Mule pattern definitions
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <code>scenarios/correlation_rules.json</code> - Cross-module linking rules
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}