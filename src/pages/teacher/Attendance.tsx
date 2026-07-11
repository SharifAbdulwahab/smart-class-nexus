import React, { useState } from 'react';
import { useAppContext, Student, Attendance } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { 
  Check, 
  X, 
  Clock, 
  Search,
  Send,
  UserCheck,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

const AttendancePage: React.FC = () => {
  const { students, attendance, setAttendance, addAuditLog } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMark = (studentId: string, status: 'present' | 'absent') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setAttendance(prev => {
      // Remove existing record for today if it exists
      const filtered = prev.filter(a => !(a.studentId === studentId && a.date === today));
      const newRecord: Attendance = {
        studentId,
        date: today,
        status,
        checkInTime: status === 'present' ? time : undefined
      };
      
      // Simulate Notification
      const student = students.find(s => s.id === studentId);
      if (status === 'present') {
        toast.info(`Notification sent to ${student?.parentName}: ${student?.name} is PRESENT at ${time}`);
      } else {
        toast.error(`Notification sent to ${student?.parentName}: ${student?.name} is ABSENT today`);
      }
      
      return [...filtered, newRecord];
    });

    addAuditLog('Attendance Marked', `${status.toUpperCase()} marked for student ID: ${studentId}`);
  };

  const markAllPresent = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecords: Attendance[] = filteredStudents.map(s => ({
      studentId: s.id,
      date: today,
      status: 'present',
      checkInTime: time
    }));

    setAttendance(prev => {
      const filtered = prev.filter(a => !(a.date === today && filteredStudents.some(fs => fs.id === a.studentId)));
      return [...filtered, ...newRecords];
    });

    toast.success(`Marked all ${filteredStudents.length} students as present`);
    addAuditLog('Bulk Attendance', 'Marked all students as present');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Attendance</h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Button className="gap-2" onClick={markAllPresent}>
          <UserCheck size={18} /> Mark All Present
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search students..." 
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? filteredStudents.map((student) => {
              const record = attendance.find(a => a.studentId === student.id && a.date === today);
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {student.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record ? (
                      <Badge variant={record.status === 'present' ? "default" : "destructive"} className={record.status === 'present' ? "bg-green-500 hover:bg-green-600" : ""}>
                        {record.status === 'present' ? "Present" : "Absent"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground italic">Not Marked</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {record?.checkInTime ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock size={12} /> {record.checkInTime}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant={record?.status === 'present' ? "default" : "outline"} 
                        size="sm" 
                        className={`h-9 w-9 p-0 ${record?.status === 'present' ? "bg-green-500 hover:bg-green-600" : ""}`}
                        onClick={() => handleMark(student.id, 'present')}
                      >
                        <Check size={18} />
                      </Button>
                      <Button 
                        variant={record?.status === 'absent' ? "destructive" : "outline"} 
                        size="sm" 
                        className="h-9 w-9 p-0"
                        onClick={() => handleMark(student.id, 'absent')}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Send size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">Pickup Alerts Active</p>
              <p className="text-xs text-muted-foreground">Parents will be notified automatically when students leave.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => toast.success("Pickup notification system is online")}>
            Test System
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
