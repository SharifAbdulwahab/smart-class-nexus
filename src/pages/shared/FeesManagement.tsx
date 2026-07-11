import React, { useState } from 'react';
import { useAppContext, Student } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { 
  Wallet, 
  Download, 
  History, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Search,
  FileText,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import jsPDF from 'jspdf';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table';

const FeesManagement: React.FC = () => {
  const { user, students, addAuditLog } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock fee data - in a real app, this would be in Context
  const [payments, setPayments] = useState([
    { id: 'pay1', studentId: 'std1', amount: 50000, date: '2023-10-05', term: 'Term 1', status: 'paid' },
    { id: 'pay2', studentId: 'std1', amount: 25000, date: '2024-01-15', term: 'Term 2', status: 'paid' },
  ]);

  const currentChild = user?.role === 'parent' 
    ? students.find(s => s.id === user.linkedId) 
    : null;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateReceipt = (payment: any, student: Student) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text('SCHOOLEASE ACADEMY', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('OFFICIAL PAYMENT RECEIPT', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Receipt No: ${payment.id.toUpperCase()}`, 20, 45);
    doc.text(`Date: ${payment.date}`, 20, 50);
    doc.text(`Student: ${student.name}`, 20, 60);
    doc.text(`Parent: ${student.parentName}`, 20, 65);
    
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);
    
    doc.setFontSize(12);
    doc.text('Description', 20, 85);
    doc.text('Amount (₦)', 150, 85);
    
    doc.setFontSize(10);
    doc.text(`School Fees - ${payment.term}`, 20, 95);
    doc.text(`${payment.amount.toLocaleString()}`, 150, 95);
    
    doc.line(20, 105, 190, 105);
    doc.setFontSize(12);
    doc.text('TOTAL PAID', 20, 115);
    doc.text(`₦ ${payment.amount.toLocaleString()}`, 150, 115);
    
    doc.setFontSize(10);
    doc.text('Thank you for your payment.', 105, 140, { align: 'center' });
    doc.text('This is a computer generated receipt.', 105, 145, { align: 'center' });

    doc.save(`Receipt_${payment.id}.pdf`);
    toast.success('Receipt generated');
  };

  const recordPayment = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const amount = 50000;
    const newPayment = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      amount,
      date: new Date().toISOString().split('T')[0],
      term: 'Term 2',
      status: 'paid'
    };
    
    setPayments([newPayment, ...payments]);
    addAuditLog('Payment Recorded', `Recorded payment of ₦${amount} for ${student?.name}`);
    toast.success(`Payment recorded for ${student?.name}`);
  };

  if (user?.role === 'parent') {
    const childPayments = payments.filter(p => p.studentId === currentChild?.id);
    const totalPaid = childPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalOwed = 150000 - totalPaid;

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fees & Payments</h1>
          <p className="text-muted-foreground text-sm">Manage your child's school fees and download receipts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardDescription>Total Owed</CardDescription>
              <CardTitle className="text-3xl font-bold">₦{totalOwed.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Next deadline: June 15, 2024</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2">
                <CreditCard size={16} /> Pay Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {childPayments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="font-bold">{payment.term} Fees</p>
                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold">₦{payment.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-[10px] text-green-600 bg-green-50">Success</Badge>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => generateReceipt(payment, currentChild!)}>
                        <Download size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
        <p className="text-muted-foreground text-sm">Record payments and monitor school revenue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Wallet /></div>
          <div><p className="text-xs text-muted-foreground">Total Revenue</p><p className="text-xl font-bold">₦2.4M</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg text-red-600"><AlertCircle /></div>
          <div><p className="text-xs text-muted-foreground">Outstanding</p><p className="text-xl font-bold">₦450k</p></div>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search students to record payment..." 
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map(student => {
              const studentPayments = payments.filter(p => p.studentId === student.id);
              const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
              const isPaid = totalPaid >= 100000;
              
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.parentName}</TableCell>
                  <TableCell>
                    <Badge variant={isPaid ? "default" : "destructive"} className={isPaid ? "bg-green-500" : ""}>
                      {isPaid ? "Paid" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>₦{totalPaid.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => recordPayment(student.id)}>
                      <Plus size={14} /> Record Payment
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeesManagement;
