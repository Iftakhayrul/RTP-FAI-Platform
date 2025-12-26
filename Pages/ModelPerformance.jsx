import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Target,
  PieChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import MetricCard from '@/components/common/MetricCard';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

export default function ModelPerformance() {
  const [activeTab, setActiveTab] = useState('fraud');

  // Fraud model metrics
  const fraudMetrics = {
    auc: 0.947,
    precision: 0.892,
    recall: 0.867,
    f1: 0.879,
    fpr: 0.021,
    latency: 23,
  };

  // AML metrics
  const amlMetrics = {
    typologyAccuracy: 0.912,
    clusterHitRate: 0.876,
    timeToDetect: 4.2,
    falsePositiveRate: 0.034,
  };

  // Time series data for charts
  const performanceOverTime = [
    { date: 'Jan', auc: 0.92, fpr: 0.028, precision: 0.88 },
    { date: 'Feb', auc: 0.925, fpr: 0.026, precision: 0.885 },
    { date: 'Mar', auc: 0.93, fpr: 0.024, precision: 0.89 },
    { date: 'Apr', auc: 0.938, fpr: 0.023, precision: 0.89 },
    { date: 'May', auc: 0.942, fpr: 0.022, precision: 0.895 },
    { date: 'Jun', auc: 0.947, fpr: 0.021, precision: 0.892 },
  ];

  const latencyDistribution = [
    { bucket: '0-10ms', count: 1250 },
    { bucket: '10-20ms', count: 3420 },
    { bucket: '20-30ms', count: 4180 },
    { bucket: '30-40ms', count: 890 },
    { bucket: '40-50ms', count: 320 },
    { bucket: '50ms+', count: 40 },
  ];

  const typologyDetection = [
    { typology: 'Fan-in', accuracy: 94, detected: 127, total: 135 },
    { typology: 'Fan-out', accuracy: 91, detected: 98, total: 108 },
    { typology: 'Cycle', accuracy: 88, detected: 44, total: 50 },
    { typology: 'Layering', accuracy: 92, detected: 69, total: 75 },
    { typology: 'Hub', accuracy: 89, detected: 53, total: 60 },
  ];

  const driftAlerts = [
    { feature: 'merchant_distribution', severity: 'Medium', change: '+12.3%', status: 'Investigating' },
    { feature: 'velocity_distribution', severity: 'Low', change: '-4.5%', status: 'Monitoring' },
    { feature: 'geo_distribution', severity: 'Low', change: '+2.1%', status: 'Normal' },
  ];

  const radarData = [
    { metric: 'Precision', value: 89.2 },
    { metric: 'Recall', value: 86.7 },
    { metric: 'AUC', value: 94.7 },
    { metric: 'Speed', value: 95 },
    { metric: 'Stability', value: 92 },
    { metric: 'Coverage', value: 88 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-100">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Model Performance & Monitoring
          </h1>
        </div>
        <p className="text-slate-500">
          Evaluation metrics demonstrating accuracy, low-latency scoring, and model monitoring
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Model AUC"
          value={`${(fraudMetrics.auc * 100).toFixed(1)}%`}
          icon={Target}
          variant="primary"
          trend="up"
          trendValue="+2.7% vs last month"
        />
        <MetricCard
          title="Avg Latency"
          value={`${fraudMetrics.latency}ms`}
          icon={Clock}
          variant="success"
        />
        <MetricCard
          title="False Positive Rate"
          value={`${(fraudMetrics.fpr * 100).toFixed(1)}%`}
          icon={XCircle}
        />
        <MetricCard
          title="Precision"
          value={`${(fraudMetrics.precision * 100).toFixed(1)}%`}
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="fraud">Fraud Model</TabsTrigger>
          <TabsTrigger value="aml">AML Detection</TabsTrigger>
          <TabsTrigger value="drift">Drift Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="fraud" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Performance Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={[0.85, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                      <Legend />
                      <Area type="monotone" dataKey="auc" name="AUC" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="precision" name="Precision" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Latency Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Latency Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={latencyDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="bucket" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" name="Transactions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overall Model Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={12} />
                    <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'AUC-ROC', value: fraudMetrics.auc, target: 0.95 },
                  { label: 'Precision', value: fraudMetrics.precision, target: 0.90 },
                  { label: 'Recall', value: fraudMetrics.recall, target: 0.90 },
                  { label: 'F1 Score', value: fraudMetrics.f1, target: 0.88 },
                  { label: 'False Positive Rate', value: fraudMetrics.fpr, target: 0.03, inverse: true },
                  { label: 'P99 Latency', value: fraudMetrics.latency / 50, target: 50, unit: 'ms', rawValue: fraudMetrics.latency },
                ].map((metric) => (
                  <div key={metric.label} className="p-4 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">{metric.label}</span>
                      <span className="text-lg font-bold text-slate-900">
                        {metric.rawValue !== undefined 
                          ? `${metric.rawValue}${metric.unit}` 
                          : `${(metric.value * 100).toFixed(1)}%`}
                      </span>
                    </div>
                    <Progress 
                      value={metric.inverse ? (1 - metric.value / metric.target) * 100 : (metric.value / metric.target) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Target: {metric.unit ? `<${metric.target}${metric.unit}` : `${(metric.target * 100).toFixed(0)}%`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aml" className="space-y-6 mt-6">
          {/* AML Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Typology Accuracy"
              value={`${(amlMetrics.typologyAccuracy * 100).toFixed(1)}%`}
              variant="primary"
            />
            <MetricCard
              title="Cluster Hit Rate"
              value={`${(amlMetrics.clusterHitRate * 100).toFixed(1)}%`}
              variant="success"
            />
            <MetricCard
              title="Time to Detect"
              value={`${amlMetrics.timeToDetect}h`}
              icon={Clock}
            />
            <MetricCard
              title="False Positive Rate"
              value={`${(amlMetrics.falsePositiveRate * 100).toFixed(1)}%`}
            />
          </div>

          {/* Typology Detection Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Typology Detection Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typologyDetection.map((typ) => (
                  <div key={typ.typology} className="p-4 rounded-xl bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-900">{typ.typology}</span>
                        <span className="text-sm text-slate-500">
                          {typ.detected}/{typ.total} detected
                        </span>
                      </div>
                      <span className={`font-bold ${typ.accuracy >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {typ.accuracy}%
                      </span>
                    </div>
                    <Progress value={typ.accuracy} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drift" className="space-y-6 mt-6">
          {/* Drift Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Feature Drift Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driftAlerts.map((alert) => (
                  <motion.div
                    key={alert.feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border ${
                      alert.severity === 'Medium' 
                        ? 'bg-amber-50 border-amber-200' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-sm font-medium">{alert.feature}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          Distribution change: {alert.change}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.severity === 'Medium' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.status === 'Normal' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Model Monitoring Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-emerald-700">Model Stable</p>
                  <p className="text-sm text-emerald-600 mt-1">No significant drift detected</p>
                </div>
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                  <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-blue-700">Last Retrained</p>
                  <p className="text-sm text-blue-600 mt-1">14 days ago</p>
                </div>
                <div className="p-5 rounded-xl bg-purple-50 border border-purple-200 text-center">
                  <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-semibold text-purple-700">Next Review</p>
                  <p className="text-sm text-purple-600 mt-1">In 7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}