import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { ShieldCheck, Search, Download } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const AuditLogPage: React.FC = () => {
  const { auditLogs } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Audit Logs</h1>
          <p className="text-muted-foreground text-sm">Monitor all critical actions and data access across the platform.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} /> Export Logs
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Filter by user, action, or date..." className="pl-10" />
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Security</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.length > 0 ? auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{log.userName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.action}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                <TableCell className="text-right">
                  <ShieldCheck className="w-4 h-4 text-green-500 inline" />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                  No system logs recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLogPage;
