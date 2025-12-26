import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  FileText,
  Filter,
  ExternalLink,
  CheckSquare,
  Square,
  MessageSquare,
  Send,
  Download,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import RiskBadge from '@/components/common/RiskBadge';
import TypologyBadge from '@/components/common/TypologyBadge';
import PriorityBadge from '@/components/common/PriorityBadge';
import { generateMuleCluster } from '@/components/simulator/TransactionSimulator';

// Generate sample AML cases
const generateCases = () => {
  const statuses = ['Open', 'In Progress', 'Pending Review', 'Filed SAR', 'Closed'];
  const reviewers = ['James Wilson', 'Maria Garcia', 'David Kim', 'Lisa Chen', 'Unassigned'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const typologies = ['Fan-out', 'Fan-in', 'Cycle', 'Layering'];

  return Array.from({ length: 15 }, (_, i) => {
    const cluster = generateMuleCluster(typologies[Math.floor(Math.random() * typologies.length)]);
    return {
      case_id: `AML-${(2000 + i).toString()}`,
      cluster_id: cluster.cluster_id,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      typology: cluster.typology,
      cluster_score: cluster.risk_score,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assigned_reviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
      narrative_notes: 'Initial review indicates potential money mule activity with rapid fund transfers through hub account.',
      evidence_checklist: [
        { item: 'Customer due diligence review', completed: Math.random() > 0.5 },
        { item: 'Transaction pattern analysis', completed: Math.random() > 0.5 },
        { item: 'Source of funds verification', completed: Math.random() > 0.3 },
        { item: 'Beneficial ownership check', completed: Math.random() > 0.6 },
        { item: 'Sanctions screening', completed: Math.random() > 0.4 },
      ],
      linked_accounts: cluster.hub_accounts || [],
      recommended_action: ['Continue Monitoring', 'Enhanced Due Diligence', 'File SAR', 'Close Case'][Math.floor(Math.random() * 4)],
      created_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

export default function AMLCases() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    setCases(generateCases());
  }, []);

  const filteredCases = cases.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterPriority !== 'all' && c.priority !== filterPriority) return false;
    return true;
  });

  const statusColors = {
    'Open': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    'Pending Review': 'bg-purple-100 text-purple-700',
    'Filed SAR': 'bg-emerald-100 text-emerald-700',
    'Closed': 'bg-slate-100 text-slate-700',
  };

  const toggleChecklistItem = (caseId, itemIndex) => {
    setCases(prev => prev.map(c => {
      if (c.case_id === caseId) {
        const updatedChecklist = [...c.evidence_checklist];
        updatedChecklist[itemIndex].completed = !updatedChecklist[itemIndex].completed;
        return { ...c, evidence_checklist: updatedChecklist };
      }
      return c;
    }));
    if (selectedCase?.case_id === caseId) {
      setSelectedCase(prev => {
        const updatedChecklist = [...prev.evidence_checklist];
        updatedChecklist[itemIndex].completed = !updatedChecklist[itemIndex].completed;
        return { ...prev, evidence_checklist: updatedChecklist };
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-100">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            AML Case Management
          </h1>
        </div>
        <p className="text-slate-500">
          Compliance workflow with documented evidence and recommended actions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-600">Filters:</span>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Filed SAR">Filed SAR</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-slate-500">
              {filteredCases.length} cases
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Case ID</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Typology</TableHead>
                <TableHead className="font-semibold text-center">Score</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Reviewer</TableHead>
                <TableHead className="font-semibold">Recommended Action</TableHead>
                <TableHead className="font-semibold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((amlCase, idx) => (
                <motion.tr
                  key={amlCase.case_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedCase(amlCase)}
                >
                  <TableCell className="font-mono text-sm font-medium">
                    {amlCase.case_id}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={amlCase.priority} />
                  </TableCell>
                  <TableCell>
                    <TypologyBadge typology={amlCase.typology} />
                  </TableCell>
                  <TableCell className="text-center">
                    <RiskBadge score={amlCase.cluster_score} size="sm" />
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[amlCase.status]}>
                      {amlCase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {amlCase.assigned_reviewer}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${
                      amlCase.recommended_action === 'File SAR' 
                        ? 'text-red-600' 
                        : 'text-slate-600'
                    }`}>
                      {amlCase.recommended_action}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Case Detail Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  AML Case: {selectedCase.case_id}
                  <PriorityBadge priority={selectedCase.priority} />
                  <Badge className={statusColors[selectedCase.status]}>
                    {selectedCase.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Typology</p>
                    <div className="mt-1">
                      <TypologyBadge typology={selectedCase.typology} />
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Cluster Score</p>
                    <div className="mt-1">
                      <RiskBadge score={selectedCase.cluster_score} size="sm" />
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Reviewer</p>
                    <p className="text-sm font-medium mt-1">{selectedCase.assigned_reviewer}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                    <p className="text-xs text-slate-500">Cluster ID</p>
                    <p className="text-sm font-mono mt-1">{selectedCase.cluster_id}</p>
                  </div>
                </div>

                {/* Narrative Notes */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Narrative Notes
                  </h4>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-sm text-slate-700">{selectedCase.narrative_notes}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Textarea 
                      placeholder="Add note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <Button size="icon" className="flex-shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Evidence Checklist */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Evidence Checklist
                  </h4>
                  <div className="space-y-2">
                    {selectedCase.evidence_checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          item.completed 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                        onClick={() => toggleChecklistItem(selectedCase.case_id, idx)}
                      >
                        <Checkbox checked={item.completed} />
                        <span className={`text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked Accounts */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Linked Accounts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.linked_accounts.map((acc) => (
                      <span key={acc} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-mono">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button variant="outline">Continue Monitoring</Button>
                  <Button variant="outline">Enhanced Due Diligence</Button>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Download className="w-4 h-4 mr-2" />
                    File SAR (Demo)
                  </Button>
                  <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                    Close Case
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}