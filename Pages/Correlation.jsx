import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Link2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Network,
  Zap,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RiskBadge from '@/components/common/RiskBadge';
import DecisionBadge from '@/components/common/DecisionBadge';
import TypologyBadge from '@/components/common/TypologyBadge';
import MetricCard from '@/components/common/MetricCard';
import { generateTransaction, generateMuleCluster } from '@/components/simulator/TransactionSimulator';

export default function Correlation() {
  const [correlations, setCorrelations] = useState([]);
  const [flowData, setFlowData] = useState([]);

  useEffect(() => {
    // Generate correlated entities
    const sharedDevices = ['DEV-ABC123', 'DEV-XYZ789', 'DEV-QWE456'];
    const sharedAccounts = ['ACC-0001', 'ACC-0005', 'ACC-0012'];
    const sharedIPs = ['192.168.1.100', '10.0.0.55', '172.16.0.88'];

    const correlatedEntities = [
      {
        id: 'COR-001',
        entity_type: 'Device',
        entity_id: sharedDevices[0],
        fraud_score: 78,
        aml_score: 85,
        fraud_events: 12,
        aml_clusters: 2,
        escalation_status: 'Critical',
        last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'COR-002',
        entity_type: 'Account',
        entity_id: sharedAccounts[0],
        fraud_score: 65,
        aml_score: 92,
        fraud_events: 5,
        aml_clusters: 3,
        escalation_status: 'High',
        last_seen: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'COR-003',
        entity_type: 'IP Address',
        entity_id: sharedIPs[0],
        fraud_score: 82,
        aml_score: 71,
        fraud_events: 8,
        aml_clusters: 1,
        escalation_status: 'Critical',
        last_seen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'COR-004',
        entity_type: 'Account',
        entity_id: sharedAccounts[1],
        fraud_score: 45,
        aml_score: 88,
        fraud_events: 3,
        aml_clusters: 4,
        escalation_status: 'Medium',
        last_seen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setCorrelations(correlatedEntities);

    // Generate flow data
    setFlowData([
      { stage: 'Fraud Detection', count: 1250, flagged: 87 },
      { stage: 'Transaction Declined', count: 45 },
      { stage: 'Mule Account Transfer', count: 42 },
      { stage: 'AML Pattern Match', count: 38 },
      { stage: 'High Priority Case', count: 12 },
    ]);
  }, []);

  const escalationColors = {
    Critical: 'bg-red-500 text-white',
    High: 'bg-orange-500 text-white',
    Medium: 'bg-amber-500 text-white',
    Low: 'bg-blue-500 text-white',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-100">
            <Link2 className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Unified Financial Crime Correlation
          </h1>
        </div>
        <p className="text-slate-500">
          Cross-module correlation linking real-time fraud events to money-mule laundering networks
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Correlated Entities"
          value={correlations.length}
          icon={Link2}
          variant="primary"
        />
        <MetricCard
          title="Critical Escalations"
          value={correlations.filter(c => c.escalation_status === 'Critical').length}
          variant="danger"
        />
        <MetricCard
          title="Fraud ↔ AML Links"
          value={correlations.reduce((sum, c) => sum + c.aml_clusters, 0)}
          icon={Network}
        />
        <MetricCard
          title="Avg Combined Score"
          value={Math.round(correlations.reduce((sum, c) => sum + (c.fraud_score + c.aml_score) / 2, 0) / correlations.length)}
          icon={Shield}
        />
      </div>

      {/* Correlation Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Fraud → AML Escalation Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 py-8">
            {flowData.map((stage, idx) => (
              <React.Fragment key={stage.stage}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className={`p-6 rounded-2xl border-2 ${
                    idx === flowData.length - 1 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white'
                  } min-w-[140px] text-center`}>
                    <p className="text-2xl font-bold text-slate-900">{stage.count}</p>
                    <p className="text-sm text-slate-500 mt-1">{stage.stage}</p>
                    {stage.flagged && (
                      <p className="text-xs text-orange-600 mt-2">
                        {stage.flagged} flagged
                      </p>
                    )}
                  </div>
                </motion.div>
                {idx < flowData.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                Escalation Logic: Fraud high-risk + transfer chain → AML escalation
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Entities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Linked Entities (Fraud ↔ AML)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {correlations.map((entity, idx) => (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Entity Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{entity.entity_type}</Badge>
                      <span className="font-mono text-sm font-medium">{entity.entity_id}</span>
                      <Badge className={escalationColors[entity.escalation_status]}>
                        {entity.escalation_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      Last seen: {new Date(entity.last_seen).toLocaleString()}
                    </p>
                  </div>

                  {/* Fraud Module */}
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 min-w-[160px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-rose-600" />
                      <span className="text-sm font-medium text-rose-700">Fraud Module</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <RiskBadge score={entity.fraud_score} size="sm" />
                      <span className="text-sm text-slate-600">{entity.fraud_events} events</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex items-center">
                    <Zap className="w-6 h-6 text-indigo-400" />
                  </div>

                  {/* AML Module */}
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 min-w-[160px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Network className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">AML Module</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <RiskBadge score={entity.aml_score} size="sm" />
                      <span className="text-sm text-slate-600">{entity.aml_clusters} clusters</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Scenario */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Demo Scenario: End-to-End Financial Crime Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-xl bg-rose-50 border border-rose-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">1</div>
                <h4 className="font-semibold text-rose-800">Fraud Burst Detected</h4>
              </div>
              <p className="text-sm text-rose-700">
                200 rapid micro-transactions detected in 5 minutes. Fraud engine flags + challenges all transactions.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <RiskBadge score={85} size="sm" />
                <span className="text-sm text-rose-600">87% declined</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-xl bg-purple-50 border border-purple-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
                <h4 className="font-semibold text-purple-800">Mule Network Identified</h4>
              </div>
              <p className="text-sm text-purple-700">
                Funds traced to mule accounts. AML graph detects fan-out pattern + cycle through 6 accounts.
              </p>
              <div className="mt-3 flex gap-2">
                <TypologyBadge typology="Fan-out" />
                <TypologyBadge typology="Cycle" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-xl bg-red-50 border border-red-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">3</div>
                <h4 className="font-semibold text-red-800">High Priority Case Created</h4>
              </div>
              <p className="text-sm text-red-700">
                System correlates fraud + AML evidence. Escalated to "High Priority Financial Crime Case" for investigation.
              </p>
              <div className="mt-3">
                <Badge className="bg-red-500 text-white">CRITICAL ESCALATION</Badge>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">
                End-to-end detection: From fraud burst to mule network in under 30 seconds
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}