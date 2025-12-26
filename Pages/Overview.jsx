import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Shield,
  Activity,
  Network,
  FileText,
  ArrowRight,
  Database,
  Zap,
  Lock,
  Globe,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusChip from '@/components/common/StatusChip';

const modules = [
  {
    title: 'Real-Time Fraud Risk Scoring',
    description: 'Sub-second fraud detection on card, ACH, wire, and instant payments with explainable AI-driven risk scores.',
    icon: Activity,
    color: 'from-rose-500 to-orange-500',
    link: 'FraudLiveStream',
    features: ['Transaction velocity analysis', 'Device fingerprinting', 'Geo-anomaly detection', 'Merchant risk profiling'],
  },
  {
    title: 'AML / Money Mule Network Detection',
    description: 'Graph-based analytics to identify layering, fan-in/fan-out patterns, and money mule clusters in real-time.',
    icon: Network,
    color: 'from-violet-500 to-purple-500',
    link: 'AMLNetwork',
    features: ['Typology pattern matching', 'Cluster risk scoring', 'Hub account detection', 'Transfer chain analysis'],
  },
  {
    title: 'Unified Case Management',
    description: 'Integrated investigation workspace with audit trails, evidence collection, and SAR-ready documentation.',
    icon: FileText,
    color: 'from-emerald-500 to-teal-500',
    link: 'AMLCases',
    features: ['Cross-module correlation', 'Analyst workflow tools', 'Compliance audit logs', 'Evidence documentation'],
  },
];

const dataSources = [
  { name: 'PaySim', description: 'Synthetic mobile money transactions' },
  { name: 'IEEE-CIS', description: 'Fraud detection benchmark dataset' },
  { name: 'AMLSim', description: 'IBM synthetic AML network data' },
];

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                RTP-FAI Platform
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Real-Time Payments Fraud + AML Intelligence Platform
              </p>
            </div>
          </div>
          
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            Real-time fraud scoring + money-mule network detection for resilient payment infrastructure. 
            Protecting financial systems with advanced analytics and explainable AI.
          </p>

          {/* Status Chips */}
          <div className="flex flex-wrap gap-3 mt-8">
            <StatusChip label="Simulator ON" status="healthy" pulse />
            <StatusChip label="Risk API Healthy" status="healthy" />
            <StatusChip label="Graph Engine Healthy" status="healthy" />
            <StatusChip label="v2.1.0" status="info" />
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((module, idx) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {module.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    {module.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {module.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={createPageUrl(module.link)}>
                    <Button variant="outline" className="w-full group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      Explore Module
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Data Sources */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <Database className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Data Sources Used</h3>
              <p className="text-sm text-slate-500">Research-grade datasets for validation</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {dataSources.map((source) => (
              <div
                key={source.name}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <p className="font-medium text-slate-900">{source.name}</p>
                <p className="text-sm text-slate-500 mt-1">{source.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Latency', value: '23ms', icon: Zap },
          { label: 'Detection Rate', value: '94.7%', icon: Shield },
          { label: 'False Positive Rate', value: '2.1%', icon: Lock },
          { label: 'Coverage', value: '4 Channels', icon: Globe },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-white border border-slate-200"
            >
              <Icon className="w-5 h-5 text-slate-400 mb-3" />
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}