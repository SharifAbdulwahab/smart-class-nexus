import React, { useState } from 'react';
import { useAppContext, Student, Result } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../../components/ui/card';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { 
  Plus, 
  Search, 
  FileText, 
  Download,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ResultsPage: React.FC = () => {
  const { students, results, setResults, addAuditLog, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState({
    subject: 'Mathematics',
    testScore: 0,
    examScore: 0
  });

  const calculateGrade = (total: number) => {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    if (total >= 40) return 'E';
    return 'F';
  };

  const handleSubmitScore = () => {
    if (!selectedStudent) return;
    
    const total = formData.testScore + formData.examScore;
    const grade = calculateGrade(total);
    
    const newResult: Result = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudent.id,
      subject: formData.subject,
      testScore: formData.testScore,
      examScore: formData.examScore,
      total,
      grade,
      position: 1, // Mock position logic
      status: 'submitted',
      teacherSignature: user?.name
    };

    setResults(prev => [...prev, newResult]);
    addAuditLog('Result Submitted', `Submitted ${formData.subject} score for ${selectedStudent.name}`);
    toast.success(`Result for ${selectedStudent.name} submitted for approval`);
    
    setIsAddDialogOpen(false);
    setSelectedStudent(null);
  };

  const generatePDF = (student: Student, result: Result) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('SCHOOLEASE ACADEMY', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('TERM 2 PROGRESS REPORT', 105, 30, { align: 'center' });
    
    // Student Info
    doc.setFontSize(10);
    doc.text(`Student Name: ${student.name}`, 20, 45);
    doc.text(`Student ID: ${student.id}`, 20, 50);
    doc.text(`Parent: ${student.parentName}`, 20, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 45);

    // Results Table
    (doc as any).autoTable({
      startY: 65,
      head: [['Subject', 'Test (30)', 'Exam (70)', 'Total (100)', 'Grade']],
      body: [
        [result.subject, result.testScore, result.examScore, result.total, result.grade]
      ],
      theme: 'striped',
      headStyles: { fillStyle: [41, 128, 185] }
    });

    // Signatures
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text('______________________', 20, finalY);
    doc.text('Teacher Signature', 20, finalY + 5);
    doc.text(result.teacherSignature || '', 20, finalY - 2);

    doc.text('______________________', 140, finalY);
    doc.text('Principal Signature', 140, finalY + 5);
    doc.text(result.principalSignature || 'PENDING', 140, finalY - 2);

    doc.save(`${student.name}_Report_${result.subject}.pdf`);
    toast.success('PDF Generated');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Results</h1>
          <p className="text-muted-foreground text-sm">Input scores and generate report sheets.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search students to input scores..." 
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => {
          const studentResults = results.filter(r => r.studentId === student.id);
          return (
            <Card key={student.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={student.photo} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{student.name}</CardTitle>
                    <CardDescription>Class 4A</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Recent Scores</h4>
                  {studentResults.length > 0 ? studentResults.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                      <span className="font-medium">{r.subject}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{r.grade} ({r.total})</span>
                        {r.status === 'approved' ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <Clock size={14} className="text-orange-500" />
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground italic">No scores recorded yet</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={isAddDialogOpen && selectedStudent?.id === student.id} onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (!open) setSelectedStudent(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => setSelectedStudent(student)}>
                        <Plus size={14} /> Add Score
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Input Score: {student.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <select 
                            className="w-full h-9 border rounded px-3"
                            value={formData.subject}
                            onChange={e => setFormData({...formData, subject: e.target.value})}
                          >
                            <option>Mathematics</option>
                            <option>English</option>
                            <option>Science</option>
                            <option>History</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Test Score (30)</Label>
                            <Input type="number" max={30} value={formData.testScore} onChange={e => setFormData({...formData, testScore: parseInt(e.target.value) || 0})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Exam Score (70)</Label>
                            <Input type="number" max={70} value={formData.examScore} onChange={e => setFormData({...formData, examScore: parseInt(e.target.value) || 0})} />
                          </div>
                        </div>
                        <div className="p-4 bg-primary/5 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground uppercase font-bold">Projected Total</p>
                          <p className="text-3xl font-bold text-primary">{formData.testScore + formData.examScore}/100</p>
                          <p className="text-sm font-medium">Grade: {calculateGrade(formData.testScore + formData.examScore)}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button className="gap-2" onClick={handleSubmitScore}>
                          <Send size={14} /> Submit for Approval
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm" className="gap-1" disabled={studentResults.length === 0} onClick={() => generatePDF(student, studentResults[0])}>
                    <Download size={14} /> PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
