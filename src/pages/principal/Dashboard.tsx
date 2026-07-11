import React, { useState } from 'react';
import { useAppContext, Result } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  Users, 
  UserSquare, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Signature,
  MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';

const PrincipalDashboard: React.FC = () => {
  const { students, staff, results, setResults, messages, setMessages, auditLogs, addAuditLog } = useAppContext();
  const [remark, setRemark] = useState('');

  const pendingResults = results.filter(r => r.status === 'submitted');
  const pendingMessages = messages.filter(m => m.status === 'pending');

  const stats = [
    { title: 'Total Students', value: students.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Staff', value: staff.length, icon: UserSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Attendance Rate', value: '94%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Pending Reports', value: '3', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const chartData = [
    { name: 'Mon', attendance: 92 },
    { name: 'Tue', attendance: 95 },
    { name: 'Wed', attendance: 94 },
    { name: 'Thu', attendance: 96 },
    { name: 'Fri', attendance: 93 },
  ];

  const recentLogs = auditLogs.slice(0, 5);

  const approveResult = (resultId: string) => {
    setResults(prev => prev.map(r => r.id === resultId ? { 
      ...r, 
      status: 'approved', 
      principalSignature: 'Dr. Principal', 
      principalRemark: remark || 'Well done.' 
    } : r));
    addAuditLog('Result Approved', `Approved result ID: ${resultId}`);
    toast.success('Result approved and signed');
    setRemark('');
  };

  const approveMessage = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'approved' } : m));
    toast.success('Message approved for parent');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Headmaster / Principal Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Signature className="w-5 h-5 text-primary" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="results">
              <TabsList className="mb-4">
                <TabsTrigger value="results" className="gap-2">
                  Results <Badge variant="secondary" className="h-5 px-1.5">{pendingResults.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="messages" className="gap-2">
                  Teacher Replies <Badge variant="secondary" className="h-5 px-1.5">{pendingMessages.length}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-4">
                {pendingResults.length > 0 ? pendingResults.map(r => {
                  const student = students.find(s => s.id === r.studentId);
                  return (
                    <div key={r.id} className="p-4 border rounded-xl space-y-3 bg-muted/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">{student?.name}</p>
                          <p className="text-xs text-muted-foreground">{r.subject}: {r.total}/100 ({r.grade})</p>
                        </div>
                        <Badge>Teacher: {r.teacherSignature}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add principal remark..." 
                          className="h-8 text-sm"
                          value={remark}
                          onChange={e => setRemark(e.target.value)}
                        />
                        <Button size="sm" className="h-8 gap-1" onClick={() => approveResult(r.id)}>
                          <CheckCircle2 size={14} /> Approve
                        </Button>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-muted-foreground py-8 text-center italic">No results pending approval.</p>
                )}
              </TabsContent>

              <TabsContent value="messages" className="space-y-4">
                {pendingMessages.length > 0 ? pendingMessages.map(m => {
                  const student = students.find(s => s.id === m.studentId);
                  return (
                    <div key={m.id} className="p-4 border rounded-xl space-y-2 bg-muted/20">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold uppercase text-primary">To: {student?.parentName}</p>
                        <Badge variant="outline">{m.type}</Badge>
                      </div>
                      <p className="text-sm italic text-muted-foreground">"{m.text}"</p>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm" className="h-7 text-red-600 border-red-200" onClick={() => toast.error("Reply declined")}>
                          <XCircle size={14} className="mr-1" /> Decline
                        </Button>
                        <Button size="sm" className="h-7" onClick={() => approveMessage(m.id)}>
                          <CheckCircle2 size={14} className="mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-muted-foreground py-8 text-center italic">No teacher replies pending approval.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Audit Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="font-bold">{log.action}</p>
                    <p className="text-muted-foreground">{log.details}</p>
                    <p className="text-[10px] mt-1 opacity-50 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Weekly Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="attendance" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentLogs.length > 0 ? recentLogs.map((log) => (
                <div key={log.id} className="flex gap-4 relative pb-6 last:pb-0">
                  <div className="absolute left-2 top-8 bottom-0 w-[1px] bg-border last:hidden"></div>
                  <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full border-2 border-primary bg-background z-10"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{log.action}</span>
                    <span className="text-xs text-muted-foreground">{log.details}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
