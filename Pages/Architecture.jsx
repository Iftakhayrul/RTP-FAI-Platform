import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Database,
  Cpu,
  Shield,
  Network,
  LayoutDashboard,
  GitBranch,
  Layers,
  Zap,
  Server,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const architectureBlocks = [
  {
    id: 1,
    title: 'Event Ingest',
    subtitle: 'Transactions Stream',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    description: 'Real-time ingestion of payment transactions from multiple channels',
  },
  {
    id: 2,
    title: 'Feature Engine',
    subtitle: 'Signal Extraction',
    icon: Cpu,
    color: 'from-violet-500 to-purple-500',
    description: 'Compute velocity, device, geo, merchant, and behavioral features',
  },
  {
    id: 3,
    title: 'Fraud Scoring Service',
    subtitle: 'Risk API',
    icon: Shield,
    color: 'from-rose-500 to-orange-500',
    description: 'ML-based risk scoring with explainable reason codes',
  },
  {
    id: 4,
    title: 'AML Graph Builder',
    subtitle: 'Network Construction',
    icon: Network,
    color: 'from-emerald-500 to-teal-500',
    description: 'Build transfer network graphs for pattern analysis',
  },
  {
    id: 5,
    title: 'Detection Engine',
    subtitle: 'Typology Detection',
    icon: Layers,
    color: 'from-amber-500 to-yellow-500',
    description: 'Identify fan-in/out, cycles, layering, and mule hubs',
  },
  {
    id: 6,
    title: 'Dashboard & Cases',
    subtitle: 'Investigation UI',
    icon: LayoutDashboard,
    color: 'from-indigo-500 to-blue-500',
    description: 'Unified case management and audit trail interface',
  },
];

const dataFlowSteps = [
  'Payment transactions ingested in real-time from Card, ACH, Wire, and Instant channels',
  'Feature engine extracts 50+ risk signals including velocity, device, geo, and merchant patterns',
  'Fraud scoring service returns risk score (0-100), decision, and top reason codes in <30ms',
  'Transaction graph builder constructs network of accounts and transfers',
  'Typology detection engine identifies money mule patterns: fan-in, fan-out, cycles, layering',
  'Dashboard presents unified view with case management, correlation, and audit capabilities',
];

export default function Architecture() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-slate-100">
            <GitBranch className="w-5 h-5 text-slate-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            End-to-End Architecture
          </h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          System architecture illustrating real-time scoring and graph-based AML pipeline 
          for comprehensive financial crime detection.
        </p>
      </div>

      {/* Architecture Diagram */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {architectureBlocks.map((block, idx) => {
              const Icon = block.icon;
              return (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 h-full hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${block.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Block {block.id}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                      {block.title}
                    </h3>
                    <p className="text-xs text-indigo-600 mt-1">{block.subtitle}</p>
                  </div>
                  
                  {idx < architectureBlocks.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Connection Lines */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                <Zap className="w-4 h-4" />
                Real-time Processing
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                <Server className="w-4 h-4" />
                Batch Analytics
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                <Network className="w-4 h-4" />
                Graph Processing
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataFlowSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                  {idx + 1}
                </div>
                <div className="pt-1">
                  <p className="text-slate-700 leading-relaxed">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fraud Detection Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Model', value: 'XGBoost / LightGBM ensemble' },
                { label: 'Features', value: '50+ engineered signals' },
                { label: 'Latency', value: '<30ms p99' },
                { label: 'Explainability', value: 'SHAP-based reason codes' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AML Detection Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Graph Engine', value: 'NetworkX / Neo4j compatible' },
                { label: 'Typologies', value: '6 pattern detectors' },
                { label: 'Window', value: '24h / 7d / 30d rolling' },
                { label: 'Scoring', value: 'Cluster + node risk scores' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}