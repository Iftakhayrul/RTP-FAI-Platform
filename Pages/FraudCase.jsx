import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  User,
  FileText,
  MessageSquare,
  Send,
  Flag,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RiskBadge from '@/components/common/RiskBadge';
import PriorityBadge from '@/components/common/PriorityBadge';
import DecisionBadge from '@/components/common/DecisionBadge';
import { generateTransaction } from '@/components/simulator/TransactionSimulator';

export default function FraudCase() {
  const [caseData, setCaseData] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const alertId = urlParams.get('alertId') || 'ALT-1001';
    
    const tx = generateTransaction(true);
    
    setCaseData({
      alert_id: alertId,
      tx_id: tx.tx_id,
      risk_score: tx.risk_score,
      amount: tx.amount,
      customer_id: tx.customer_id,
      decision: tx.decision,
      status: 'Investigating',
      priority: 'High',
      assigned_analyst: 'Sarah Chen',
      reason_codes: tx.reason_codes,
      timeline: [
        { event: 'Transaction flagged', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), icon: 'flag', details: 'Risk score 85 exceeded threshold' },
        { event: 'Challenge issued', timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), icon: 'alert', details: 'OTP sent to customer' },
        { event: 'OTP verification failed', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), icon: 'x', details: '3 incorrect attempts' },
        { event: 'Case opened', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: 'file', details: 'Auto-escalated due to failed challenge' },
        { event: 'Assigned to analyst', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), icon: 'user', details: 'Sarah Chen assigned' },
      ],
      related_transactions: [
        { tx_id: 'TX-PREV001', amount: 150.00, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'Approved' },
        { tx_id: 'TX-PREV002', amount: 89.99, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), status: 'Approved' },
        { tx_id: tx.tx_id, amount: tx.amount, timestamp: tx.timestamp, status: tx.decision },
      ],
      notes: [
        { text: 'Customer profile reviewed - account is 2 years old with good history', author: 'Sarah Chen', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
        { text: 'Device fingerprint shows new device not seen before', author: 'Sarah Chen', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      ],
    });
  }, []);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setCaseData(prev => ({
      ...prev,
      notes: [
        ...prev.notes,
        { text: newNote, author: 'Current User', timestamp: new Date().toISOString() },
      ],
    }));
    setNewNote('');
  };

  const getTimelineIcon = (type) => {
    const icons = {
      flag: <Flag className="w-4 h-4" />,
      alert: <AlertTriangle className="w-4 h-4" />,
      x: <XCircle className="w-4 h-4" />,
      file: <FileText className="w-4 h-4" />,
      user: <User className="w-4 h-4" />,
      check: <CheckCircle2 className="w-4 h-4" />,
    };
    return icons[type] || <Clock className="w-4 h-4" />;
  };

  if (!caseData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('FraudAlerts')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Fraud Case</h1>
              <PriorityBadge priority={caseData.priority} />
              <Badge className="bg-amber-100 text-amber-700">{caseData.status}</Badge>
            </div>
            <p className="text-slate-500 font-mono">{caseData.alert_id}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Select defaultValue={caseData.status}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Case Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Case Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <RiskBadge score={caseData.risk_score} size="lg" />
              <div>
                <p className="text-sm text-slate-500">Decision</p>
                <DecisionBadge decision={caseData.decision} />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Amount</span>
                <span className="font-semibold">${caseData.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Customer ID</span>
                <span className="font-mono text-sm">{caseData.customer_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Assigned To</span>
                <span className="text-sm">{caseData.assigned_analyst}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-2">Reason Codes</p>
              <div className="space-y-2">
                {caseData.reason_codes?.slice(0, 3).map((code, idx) => (
                  <div key={idx} className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Case Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caseData.timeline.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      {getTimelineIcon(event.icon)}
                    </div>
                    {idx < caseData.timeline.length - 1 && (
                      <div className="w-px h-full bg-slate-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-slate-900 text-sm">{event.event}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.details}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Analyst Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
              {caseData.notes.map((note, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-sm text-slate-700">{note.text}</p>
                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>{note.author}</span>
                    <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <Button onClick={handleAddNote} className="w-full mt-2">
              <Send className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Related Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Related Transactions (Last 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {caseData.related_transactions.map((tx) => (
              <div
                key={tx.tx_id}
                className={`p-4 rounded-xl border ${
                  tx.tx_id === caseData.tx_id
                    ? 'border-red-200 bg-red-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-mono text-sm">{tx.tx_id}</p>
                  <Badge variant={tx.status === 'Approved' ? 'outline' : 'destructive'}>
                    {tx.status}
                  </Badge>
                </div>
                <p className="text-xl font-bold mt-2">${tx.amount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resolution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Case Resolution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-red-600 hover:bg-red-700">
              <XCircle className="w-4 h-4 mr-2" />
              Confirmed Fraud
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              False Positive
            </Button>
            <Button variant="outline">
              Chargeback
            </Button>
            <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Recovered
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}