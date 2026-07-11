import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ClipboardCheck, 
  MessageSquare, 
  Wallet, 
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

const ParentDashboard: React.FC = () => {
  const { user, students, attendance, results } = useAppContext();
  
  // Find the child linked to the parent
  const child = students.find(s => s.id === user?.linkedId) || students[0];
  
  if (!child) return <div>Child data not found.</div>;

  const childAttendance = attendance.filter(a => a.studentId === child.id);
  const childResults = results.filter(r => r.studentId === child.id && r.status === 'approved');
  
  const today = new Date().toISOString().split('T')[0];
  const todayAtt = childAttendance.find(a => a.date === today);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
          <AvatarImage src={child.photo} />
          <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Parent / Guardian Portal</h1>
          <h2 className="text-xl font-medium text-primary mt-1">{child.name}</h2>
          <p className="text-muted-foreground">Class 4A | Student ID: {child.id}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/shared/messages" className="gap-2">
              <MessageSquare size={16} /> Contact Teacher
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Daily Attendance</CardTitle>
            <CardDescription>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${todayAtt?.status === 'present' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {todayAtt?.status === 'present' ? <Clock size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold">{todayAtt?.status === 'present' ? 'Marked Present' : 'Absent / Not Marked'}</h4>
                    <p className="text-sm text-muted-foreground">
                      {todayAtt?.checkInTime ? `Checked in at ${todayAtt.checkInTime}` : 'Register not yet marked'}
                    </p>
                  </div>
                </div>
                {todayAtt?.status === 'present' && <Badge className="bg-green-500">Safe in Class</Badge>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-blue-50/50 border-blue-100">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <MapPin className="text-blue-500 mb-2" />
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Pickup Alert</span>
                    <span className="font-medium mt-1">Normal: 2:30 PM</span>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50/50 border-orange-100">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Wallet className="text-orange-500 mb-2" />
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Fees Status</span>
                    <Badge variant="outline" className="mt-1">Fully Paid</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {childResults.length > 0 ? childResults.slice(0, 3).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-semibold">{result.subject}</p>
                    <p className="text-xs text-muted-foreground">Term 2 Exam</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{result.grade}</p>
                    <p className="text-[10px] text-muted-foreground">{result.total}/100</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 text-muted/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No approved results yet.</p>
                </div>
              )}
              <Button variant="ghost" className="w-full text-xs" disabled={childResults.length === 0}>
                View All Reports <ChevronRight size={12} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-red-100 bg-red-50/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-red-100 text-red-600 p-2 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-red-700">Medical Awareness</p>
              <p className="text-xs text-red-600/80">
                School is aware of Peanuts allergy. Emergency protocols are in place.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;
