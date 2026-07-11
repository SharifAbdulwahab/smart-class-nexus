import React, { useState } from 'react';
import { useAppContext, Student } from '../../context/AppContext';
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
  AlertTriangle, 
  Eye,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';

const StudentManagement: React.FC = () => {
  const { students, setStudents, addAuditLog, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      const student = students.find(s => s.id === id);
      setStudents(prev => prev.filter(s => s.id !== id));
      addAuditLog('Student Deleted', `Deleted student: ${student?.name} (${id})`);
      toast.success('Student deleted successfully');
    }
  };

  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    gender: 'M',
    address: '',
    dob: '',
    photo: 'https://images.unsplash.com/photo-1544717297-fa15739a5447?w=400&h=400&fit=crop',
    parentName: '',
    parentWhatsApp: '',
    parentEmail: '',
    medicalData: {
      bloodGroup: '',
      illnesses: 'None',
      allergies: 'None',
      disabilities: 'None',
      emergencyContact: '',
      hospital: ''
    }
  });

  const handleSave = () => {
    if (!formData.name || !formData.parentName) {
      toast.error('Name and Parent Name are required');
      return;
    }

    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...formData } as Student : s));
      addAuditLog('Student Updated', `Updated student: ${formData.name}`);
      toast.success('Student updated successfully');
    } else {
      const newStudent: Student = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Student;
      setStudents(prev => [...prev, newStudent]);
      addAuditLog('Student Added', `Added new student: ${newStudent.name}`);
      toast.success('Student added successfully');
    }

    setIsAddDialogOpen(false);
    setEditingStudent(null);
    setFormData({
      name: '',
      gender: 'M',
      address: '',
      dob: '',
      photo: 'https://images.unsplash.com/photo-1544717297-fa15739a5447?w=400&h=400&fit=crop',
      parentName: '',
      parentWhatsApp: '',
      parentEmail: '',
      medicalData: {
        bloodGroup: '',
        illnesses: 'None',
        allergies: 'None',
        disabilities: 'None',
        emergencyContact: '',
        hospital: ''
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Database</h1>
          <p className="text-muted-foreground text-sm">Manage all students and their records.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { setEditingStudent(null); setFormData({
              name: '',
              gender: 'M',
              address: '',
              dob: '',
              photo: 'https://images.unsplash.com/photo-1544717297-fa15739a5447?w=400&h=400&fit=crop',
              parentName: '',
              parentWhatsApp: '',
              parentEmail: '',
              medicalData: {
                bloodGroup: '',
                illnesses: 'None',
                allergies: 'None',
                disabilities: 'None',
                emergencyContact: '',
                hospital: ''
              }
            }); }}>
              <Plus size={18} /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select 
                  id="gender" 
                  className="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value as 'M' | 'F'})}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input id="photo" value={formData.photo} onChange={e => setFormData({...formData, photo: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              
              <div className="md:col-span-2 pt-4 border-t">
                <h3 className="font-semibold mb-2">Parent Information</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent Name</Label>
                <Input id="parentName" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentWhatsApp">Parent WhatsApp</Label>
                <Input id="parentWhatsApp" value={formData.parentWhatsApp} onChange={e => setFormData({...formData, parentWhatsApp: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input id="parentEmail" type="email" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
              </div>

              <div className="md:col-span-2 pt-4 border-t">
                <h3 className="font-semibold mb-2">Medical Information</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input id="bloodGroup" value={formData.medicalData?.bloodGroup} onChange={e => setFormData({...formData, medicalData: {...formData.medicalData!, bloodGroup: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="illnesses">Known Illnesses</Label>
                <Input id="illnesses" value={formData.medicalData?.illnesses} onChange={e => setFormData({...formData, medicalData: {...formData.medicalData!, illnesses: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input id="allergies" value={formData.medicalData?.allergies} onChange={e => setFormData({...formData, medicalData: {...formData.medicalData!, allergies: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabilities">Disabilities</Label>
                <Input id="disabilities" value={formData.medicalData?.disabilities} onChange={e => setFormData({...formData, medicalData: {...formData.medicalData!, disabilities: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" value={formData.medicalData?.emergencyContact} onChange={e => setFormData({...formData, medicalData: {...formData.medicalData!, emergencyContact: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital</Label>
                <Input id="hospital" value={formData.medicalData?.hospital} onChange={e => setFormData({...formData, medicalData: {...formData.medicalData!, hospital: e.target.value}})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search students or parents..." 
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Medical Alert</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.photo} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-xs text-muted-foreground">DOB: {student.dob}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>{student.parentName}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span>{student.parentWhatsApp}</span>
                    <span className="text-muted-foreground">{student.parentEmail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {student.medicalData.illnesses !== 'None' || student.medicalData.allergies !== 'None' ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle size={12} /> Medical Alert
                    </Badge>
                  ) : (
                    <Badge variant="outline">Healthy</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="View Medical Data">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Medical Information: {student.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Blood Group</Label>
                            <p className="font-medium">{student.medicalData.bloodGroup}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Hospital</Label>
                            <p className="font-medium">{student.medicalData.hospital}</p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Illnesses</Label>
                            <p className="font-medium">{student.medicalData.illnesses}</p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Allergies</Label>
                            <p className="font-medium">{student.medicalData.allergies}</p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Emergency Contact</Label>
                            <p className="font-medium">{student.medicalData.emergencyContact}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingStudent(student);
                      setFormData(student);
                      setIsAddDialogOpen(true);
                    }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(student.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentManagement;
