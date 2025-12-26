import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Smartphone,
  Clock,
  Building2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RiskBadge from '@/components/common/RiskBadge';
import DecisionBadge from '@/components/common/DecisionBadge';
import { generateTransaction } from '@/components/simulator/TransactionSimulator';

export default function TransactionDetail() {
  const [transaction, setTransaction] = useState(null);
  
  useEffect(() => {
    // Generate a sample transaction for demo
    const urlParams = new URLSearchParams(window.location.search);
    const txId = urlParams.get('txId');
    
    // Simulate fetching transaction
    const tx = generateTransaction(Math.random() > 0.5);
    if (txId) tx.tx_id = txId;
    setTransaction(tx);
  }, []);

  if (!transaction) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const signals = [
    { label: 'Velocity (10 min)', value: transaction.velocity_10min, max: 10, risk: transaction.velocity_10min > 5 },
    { label: 'Avg Amount (30d)', value: `$${transaction.avg_amount_30d}`, max: 500, numValue: transaction.avg_amount_30d, risk: false },
    { label: 'Device Change', value: transaction.device_change_flag ? 'Yes' : 'No', risk: transaction.device_change_flag },
    { label: 'Geo Distance', value: `${transaction.geo_distance_km} km`, max: 2000, numValue: transaction.geo_distance_km, risk: transaction.geo_distance_km > 500 },
    { label: 'Merchant Risk', value: `${(transaction.merchant_risk * 100).toFixed(0)}%`, max: 100, numValue: transaction.merchant_risk * 100, risk: transaction.merchant_risk > 0.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('FraudLiveStream')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Transaction Details</h1>
            <p className="text-slate-500 font-mono">{transaction.tx_id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Open Case
          </Button>
          <Button variant="outline">
            Mark False Positive
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Escalate to AML
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Transaction Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: CreditCard, label: 'Amount', value: `$${transaction.amount.toLocaleString()}` },
              { icon: Building2, label: 'Merchant', value: transaction.merchant },
              { icon: MapPin, label: 'Location', value: `${transaction.country}${transaction.state ? `, ${transaction.state}` : ''}` },
              { icon: Smartphone, label: 'Device ID', value: transaction.device_id },
              { icon: Clock, label: 'Timestamp', value: new Date(transaction.timestamp).toLocaleString() },
              { icon: Shield, label: 'Channel', value: transaction.channel },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="font-medium text-slate-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Risk Result */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <RiskBadge score={transaction.risk_score} size="lg" />
              <div>
                <p className="text-sm text-slate-500">Decision</p>
                <div className="mt-1">
                  <DecisionBadge decision={transaction.decision} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Reason Codes</p>
              {transaction.reason_codes?.length > 0 ? (
                transaction.reason_codes.map((code, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-red-700">{code}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No risk factors identified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Signals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feature Signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {signals.map((signal) => (
              <div key={signal.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600">{signal.label}</span>
                  <span className={`text-sm font-semibold ${signal.risk ? 'text-red-600' : 'text-slate-900'}`}>
                    {signal.value}
                  </span>
                </div>
                {signal.max && (
                  <Progress 
                    value={(signal.numValue || signal.value) / signal.max * 100} 
                    className={`h-2 ${signal.risk ? '[&>div]:bg-red-500' : '[&>div]:bg-emerald-500'}`}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Customer Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Context</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">Customer ID</p>
              <p className="font-mono font-medium mt-1">{transaction.customer_id}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">Merchant Category</p>
              <p className="font-medium mt-1">{transaction.merchant_category}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">30-Day Avg Spend</p>
              <p className="font-medium mt-1">${transaction.avg_amount_30d}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">Current Amount vs Avg</p>
              <p className={`font-medium mt-1 ${transaction.amount > transaction.avg_amount_30d * 2 ? 'text-red-600' : 'text-emerald-600'}`}>
                {((transaction.amount / transaction.avg_amount_30d) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}