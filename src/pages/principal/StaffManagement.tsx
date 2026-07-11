import React, { useState } from 'react';
import { useAppContext, Staff } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
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
  Edit2, 
  Trash2, 
  Mail, 
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

const StaffManagement: React.FC = () => {
  const { staff, setStaff, addAuditLog } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formData, setFormData] = useState<Partial<Staff>>({
    name: '',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    phone: '',
    email: '',
    qualification: '',
    subject: '',
    dateJoined: '',
    salary: 0,
    subjectsOfInterest: []
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      const s = staff.find(st => st.id === id);
      setStaff(prev => prev.filter(st => st.id !== id));
      addAuditLog('Staff Deleted', `Deleted staff: ${s?.name} (${id})`);
      toast.success('Staff deleted successfully');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required');
      return;
    }

    if (editingStaff) {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...s, ...formData } as Staff : s));
      addAuditLog('Staff Updated', `Updated staff: ${formData.name}`);
      toast.success('Staff updated successfully');
    } else {
      const newStaff: Staff = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Staff;
      setStaff(prev => [...prev, newStaff]);
      addAuditLog('Staff Added', `Added new staff: ${newStaff.name}`);
      toast.success('Staff added successfully');
    }

    setIsAddDialogOpen(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      phone: '',
      email: '',
      qualification: '',
      subject: '',
      dateJoined: '',
      salary: 0,
      subjectsOfInterest: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground text-sm">Manage teachers and other staff members.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setEditingStaff(null); setFormData({
              name: '',
              photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
              phone: '',
              email: '',
              qualification: '',
              subject: '',
              dateJoined: '',
              salary: 0,
              subjectsOfInterest: []
            }); }}>
              <Plus size={18} /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input id="photo" value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input id="qualification" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateJoined">Date Joined</Label>
                <Input id="dateJoined" type="date" value={formData.dateJoined} onChange={e => setFormData({...formData, dateJoined: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary (₦)</Label>
                <Input id="salary" type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: parseFloat(e.target.value)})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="subjectsOfInterest">Subjects of Interest (comma separated)</Label>
                <Input 
                  id="subjectsOfInterest" 
                  value={formData.subjectsOfInterest?.join(', ')} 
                  onChange={e => setFormData({...formData, subjectsOfInterest: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Staff</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search staff by name or subject..." 
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length > 0 ? filteredStaff.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={s.photo} />
                      <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.qualification}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span>{s.subject}</span>
                    {s.subjectsOfInterest && s.subjectsOfInterest.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {s.subjectsOfInterest.map(sub => (
                          <Badge key={sub} variant="outline" className="text-[10px] py-0 px-1">{sub}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs gap-1">
                    <div className="flex items-center gap-1"><Phone size={10} /> {s.phone}</div>
                    <div className="flex items-center gap-1 text-muted-foreground"><Mail size={10} /> {s.email}</div>
                  </div>
                </TableCell>
                <TableCell>{s.dateJoined}</TableCell>
                <TableCell>₦{s.salary.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingStaff(s);
                      setFormData(s);
                      setIsAddDialogOpen(true);
                    }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffManagement;
