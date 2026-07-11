import React, { useState } from 'react';
import { useAppContext, Staff } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Users, 
  ClipboardCheck, 
  MessageSquare, 
  FileText,
  ChevronRight,
  UserCheck,
  UserX,
  BookMarked,
  Plus,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

const TeacherDashboard: React.FC = () => {
  const { students, attendance, user, staff, setStaff } = useAppContext();
  
  // In a real app, we would filter by teacher's class
  const classStudents = students; 
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length;

  const currentTeacher = staff.find(s => s.id === user?.linkedId);
  const [newSubject, setNewSubject] = useState('');

  const addSubjectOfInterest = () => {
    if (!newSubject.trim() || !currentTeacher) return;
    
    const updatedSubjects = [...(currentTeacher.subjectsOfInterest || []), newSubject.trim()];
    const updatedStaff = staff.map(s => 
      s.id === currentTeacher.id ? { ...s, subjectsOfInterest: updatedSubjects } : s
    );
    
    setStaff(updatedStaff);
    setNewSubject('');
    toast.success('Subject of interest added');
  };

  const removeSubjectOfInterest = (subject: string) => {
    if (!currentTeacher) return;
    
    const updatedSubjects = (currentTeacher.subjectsOfInterest || []).filter(s => s !== subject);
    const updatedStaff = staff.map(s => 
      s.id === currentTeacher.id ? { ...s, subjectsOfInterest: updatedSubjects } : s
    );
    
    setStaff(updatedStaff);
    toast.success('Subject removed');
  };

  const quickStats = [
    { title: 'My Students', value: classStudents.length, icon: Users, color: 'text-blue-600' },
    { title: 'Present Today', value: presentCount, icon: UserCheck, color: 'text-green-600' },
    { title: 'Absent Today', value: absentCount, icon: UserX, color: 'text-red-600' },
    { title: 'Pending Messages', value: '2', icon: MessageSquare, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teachers / Staffs Portal</h1>
        <p className="text-muted-foreground text-sm">Class 4A - Science Department</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-2 bg-muted rounded-lg`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Class Roster</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/teacher/attendance" className="gap-2">
                <ClipboardCheck size={14} /> Mark Attendance
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classStudents.slice(0, 5).map((student) => {
                const isPresent = todayAttendance.find(a => a.studentId === student.id)?.status === 'present';
                return (
                  <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{student.name}</span>
                    </div>
                    {todayAttendance.find(a => a.studentId === student.id) ? (
                      <Badge variant={isPresent ? "outline" : "destructive"}>
                        {isPresent ? "Present" : "Absent"}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Not marked</span>
                    )}
                  </div>
                );
              })}
              <Button variant="ghost" className="w-full text-xs gap-1" asChild>
                <Link to="/teacher/attendance">
                  View Full Roster <ChevronRight size={12} />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="h-16 justify-start gap-4" asChild>
              <Link to="/teacher/results">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">Input Grades</span>
                  <span className="text-xs text-muted-foreground">Term 2 Exam Scores</span>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-16 justify-start gap-4" asChild>
              <Link to="/shared/messages">
                <div className="p-2 bg-orange-500/10 text-orange-600 rounded-lg">
                  <MessageSquare size={20} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">Parent Messaging</span>
                  <span className="text-xs text-muted-foreground">3 unread from parents</span>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary" />
              My Subjects of Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentTeacher?.subjectsOfInterest?.map((subject) => (
                <Badge key={subject} variant="secondary" className="gap-2 py-1.5 px-3">
                  {subject}
                  <X 
                    size={14} 
                    className="cursor-pointer hover:text-destructive" 
                    onClick={() => removeSubjectOfInterest(subject)}
                  />
                </Badge>
              ))}
              {(!currentTeacher?.subjectsOfInterest || currentTeacher.subjectsOfInterest.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No subjects of interest added yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input 
                placeholder="Add a subject you're interested in (e.g. Quantum Physics)..." 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubjectOfInterest()}
              />
              <Button onClick={addSubjectOfInterest} className="gap-2 shrink-0">
                <Plus size={18} /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
