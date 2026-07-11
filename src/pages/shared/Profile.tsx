import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Shield, Mail, Phone, Lock, Save, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { user, staff } = useAppContext();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  if (!user) return null;

  // Find linked staff info if teacher or principal
  const staffInfo = staff.find(s => s.id === user.linkedId || (user.role === 'principal' && s.name.includes('Principal')));

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.current !== '123456789') {
      toast.error('Incorrect current password');
      return;
    }
    
    toast.success('Password updated successfully (Demo Mode)');
    setIsChangingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/10">
              <AvatarImage src={staffInfo?.photo} />
              <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <Badge variant="secondary" className="mt-1 uppercase tracking-wider">{user.role}</Badge>
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} />
                <span>{staffInfo?.email || `${user.role}@school.com`}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} />
                <span>{staffInfo?.phone || '+234 800 000 0000'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Keep your account secure with a strong password.</CardDescription>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Lock size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-xs text-muted-foreground">Last changed 2 months ago</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                    Change Password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input 
                      id="current" 
                      type="password" 
                      required 
                      value={passwords.current}
                      onChange={e => setPasswords({...passwords, current: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input 
                        id="new" 
                        type="password" 
                        required 
                        value={passwords.new}
                        onChange={e => setPasswords({...passwords, new: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm New Password</Label>
                      <Input 
                        id="confirm" 
                        type="password" 
                        required 
                        value={passwords.confirm}
                        onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                    <Button type="submit" className="gap-2">
                      <Save size={16} /> Save New Password
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {user.role !== 'parent' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <KeyRound className="w-5 h-5 text-primary" />
                  Account Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="text-sm font-semibold">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-sm font-semibold">Login Alerts</p>
                    <p className="text-xs text-muted-foreground">Get notified whenever someone logs into your account.</p>
                  </div>
                  <Button variant="ghost" size="sm" disabled>Enabled</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
