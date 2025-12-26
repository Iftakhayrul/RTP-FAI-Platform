import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Network,
  Filter,
  Eye,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NetworkGraph from '@/components/aml/NetworkGraph';
import TypologyBadge from '@/components/common/TypologyBadge';
import RiskBadge from '@/components/common/RiskBadge';
import { generateMuleCluster } from '@/components/simulator/TransactionSimulator';

export default function AMLNetwork() {
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [timeWindow, setTimeWindow] = useState('7d');
  const [highlightHubs, setHighlightHubs] = useState(true);
  const [fanInThreshold, setFanInThreshold] = useState([5]);
  const [fanOutThreshold, setFanOutThreshold] = useState([5]);

  useEffect(() => {
    // Generate sample clusters
    const typologies = ['Fan-out', 'Fan-in', 'Cycle', 'Layering', 'Fan-out', 'Fan-in'];
    const generatedClusters = typologies.map(t => generateMuleCluster(t));
    setClusters(generatedClusters);
  }, []);

  const topClusters = [...clusters]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  const hubAccounts = clusters
    .flatMap(c => c.hub_accounts || [])
    .reduce((acc, hub) => {
      acc[hub] = (acc[hub] || 0) + 1;
      return acc;
    }, {});

  const topHubs = Object.entries(hubAccounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-purple-100">
              <Network className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              AML Transaction Network
            </h1>
          </div>
          <p className="text-slate-500">
            Money mule detection through graph-based pattern analysis
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Time Window
              </Label>
              <Select value={timeWindow} onValueChange={setTimeWindow}>
                <SelectTrigger>
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Fan-In Threshold: {fanInThreshold[0]}
              </Label>
              <Slider
                value={fanInThreshold}
                onValueChange={setFanInThreshold}
                max={20}
                min={2}
                step={1}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Fan-Out Threshold: {fanOutThreshold[0]}
              </Label>
              <Slider
                value={fanOutThreshold}
                onValueChange={setFanOutThreshold}
                max={20}
                min={2}
                step={1}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="highlight-hubs"
                checked={highlightHubs}
                onCheckedChange={setHighlightHubs}
              />
              <Label htmlFor="highlight-hubs" className="cursor-pointer">
                <Eye className="w-4 h-4 inline mr-2" />
                Highlight Mule Hubs
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graph */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Network className="w-4 h-4" />
              Network Visualization
              <span className="text-sm font-normal text-slate-500 ml-2">
                {clusters.length} clusters detected
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px]">
              <NetworkGraph
                clusters={clusters}
                selectedCluster={selectedCluster}
                onSelectCluster={setSelectedCluster}
                highlightHubs={highlightHubs}
              />
            </div>
            <div className="p-4 border-t bg-slate-50">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-600">Hub Account</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-slate-600">Regular Account</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-slate-600">Selected Cluster</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Top Suspicious Clusters */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Top Suspicious Clusters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topClusters.map((cluster) => (
                <motion.div
                  key={cluster.cluster_id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedCluster?.cluster_id === cluster.cluster_id
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-slate-600">
                      {cluster.cluster_id}
                    </span>
                    <RiskBadge score={cluster.risk_score} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <TypologyBadge typology={cluster.typology} />
                    <span className="text-sm text-slate-500">
                      {cluster.account_count} accounts
                    </span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Top Hub Accounts */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                Top Hub Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topHubs.map(([account, count], idx) => (
                <div
                  key={account}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-sm">{account}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {count} cluster{count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Typology Tags */}
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Detected Typologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Fan-in', 'Fan-out', 'Cycle', 'Layering'].map((typ) => {
                  const count = clusters.filter(c => c.typology === typ).length;
                  if (count === 0) return null;
                  return (
                    <div key={typ} className="flex items-center gap-2">
                      <TypologyBadge typology={typ} />
                      <span className="text-sm text-slate-500">({count})</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Cluster Details */}
      {selectedCluster && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Cluster Details: {selectedCluster.cluster_id}
                </CardTitle>
                <Link to={createPageUrl(`AMLClusterDetail?clusterId=${selectedCluster.cluster_id}`)}>
                  <Button>
                    Investigate Cluster
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm text-slate-500">Risk Score</p>
                  <div className="mt-2">
                    <RiskBadge score={selectedCluster.risk_score} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm text-slate-500">Typology</p>
                  <div className="mt-2">
                    <TypologyBadge typology={selectedCluster.typology} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm text-slate-500">Total Flow</p>
                  <p className="text-2xl font-bold mt-1">
                    ${selectedCluster.total_flow_amount?.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm text-slate-500">Accounts</p>
                  <p className="text-2xl font-bold mt-1">
                    {selectedCluster.account_count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}