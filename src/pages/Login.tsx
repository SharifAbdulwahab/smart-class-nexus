import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, User } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { UserCircle, School, GraduationCap, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
const ROLE_IMAGES = {
  principal: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/e0fc5bd0-b262-4847-a925-8b5f3e0fec21/headmaster-icon-b6525f76-1782340365101.webp",
  teacher: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/e0fc5bd0-b262-4847-a925-8b5f3e0fec21/teacher-icon-eb77709f-1782340365166.webp",
  parent: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/e0fc5bd0-b262-4847-a925-8b5f3e0fec21/parent-icon-346ca706-1782340366013.webp"
};

const Login: React.FC = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'principal' | 'teacher' | 'parent' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: 'principal' | 'teacher' | 'parent' = selectedRole!) => {
    if (!email) {
      toast.error('Please enter your email or ID');
      return;
    }

    if (password !== '123456789' && role !== 'parent') {
      toast.error('Invalid password. Try 123456789');
      return;
    }

    let mockUser: User = { id: '1', name: '', role };
    
    if (role === 'principal') {
      mockUser = { id: 'p1', name: 'Dr. Principal', role: 'principal' };
    } else if (role === 'teacher') {
      mockUser = { id: 't1', name: 'Mrs. Sarah Adebayo', role: 'teacher', linkedId: 'stf1' };
    } else if (role === 'parent') {
      mockUser = { id: 'pa1', name: 'Musa Ibrahim', role: 'parent', linkedId: 'std1' };
    }

    setUser(mockUser);
    
    if (role === 'principal') navigate('/principal');
    else if (role === 'teacher') navigate('/teacher');
    else if (role === 'parent') navigate('/parent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://storage.googleapis.com/dala-prod-public-storage/generated-images/e0fc5bd0-b262-4847-a925-8b5f3e0fec21/school-building-ad421b90-1782340365385.webp")' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary text-primary-foreground rounded-2xl mb-4 shadow-lg">
            <School size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight uppercase text-white drop-shadow-md">SchoolEase</h1>
          <p className="text-white/80 mt-1 font-medium drop-shadow-sm">Digital School Management System</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{selectedRole ? `Logging in as ${selectedRole === 'principal' ? 'Headmaster' : selectedRole === 'teacher' ? 'Staff' : 'Guardian'}` : 'Select Your Position'}</CardTitle>
            <CardDescription className="text-center">
              {selectedRole ? 'Please enter your credentials to continue' : 'Select your role to access the portal'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-24 justify-start gap-4 text-lg border-2 hover:border-primary hover:bg-primary/5 group overflow-hidden"
                    onClick={() => setSelectedRole('principal')}
                  >
                    <img src={ROLE_IMAGES.principal} alt="Headmaster" className="w-20 h-full object-cover -ml-4 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start">
                      <span className="font-bold">Headmaster / Principal</span>
                      <span className="text-xs text-muted-foreground text-left italic">Full administrative access</span>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-24 justify-start gap-4 text-lg border-2 hover:border-primary hover:bg-primary/5 group overflow-hidden"
                    onClick={() => setSelectedRole('teacher')}
                  >
                    <img src={ROLE_IMAGES.teacher} alt="Staff" className="w-20 h-full object-cover -ml-4 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start">
                      <span className="font-bold">Teachers / Staffs</span>
                      <span className="text-xs text-muted-foreground text-left italic">Class & results management</span>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-24 justify-start gap-4 text-lg border-2 hover:border-primary hover:bg-primary/5 group overflow-hidden"
                    onClick={() => setSelectedRole('parent')}
                  >
                    <img src={ROLE_IMAGES.parent} alt="Guardian" className="w-20 h-full object-cover -ml-4 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col items-start">
                      <span className="font-bold">Parents / Guardian</span>
                      <span className="text-xs text-muted-foreground text-left italic">View child data & communication</span>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-2">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {selectedRole === 'parent' ? 'Child ID or Parent Email' : 'Email or Staff ID'}
                  </Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="text" 
                      placeholder="e.g. admin@school.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="•••••••••" 
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      autoFocus
                    />
                  </div>
                  {selectedRole !== 'parent' && (
                    <p className="text-[10px] text-muted-foreground">Default password for demo: <code className="bg-muted px-1 rounded">123456789</code></p>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button className="w-full h-11 text-lg font-bold" onClick={() => handleLogin()}>
                    Continue to Portal
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => { setSelectedRole(null); setPassword(''); setEmail(''); toast.info("Role selection reset"); }}>
                    <ArrowLeft size={14} /> Back to role selection
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-center justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground italic">
              {selectedRole 
                ? `Authorized personnel only. Data access is monitored.`
                : 'Use the mock accounts to test different roles.'
              }
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
