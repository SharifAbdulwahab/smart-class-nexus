import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Toaster } from './components/ui/sonner';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare, 
  UserCircle,
  ClipboardCheck, 
  MessageSquare, 
  Wallet, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { Button } from './components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from './components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const PrincipalDashboard = lazy(() => import('./pages/principal/Dashboard'));
const StudentManagement = lazy(() => import('./pages/principal/StudentManagement'));
const StaffManagement = lazy(() => import('./pages/principal/StaffManagement'));
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'));
const AttendancePage = lazy(() => import('./pages/teacher/Attendance'));
const ResultsPage = lazy(() => import('./pages/teacher/Results'));
const ParentDashboard = lazy(() => import('./pages/parent/Dashboard'));
const CommunicationHub = lazy(() => import('./pages/shared/CommunicationHub'));
const FeesManagement = lazy(() => import('./pages/shared/FeesManagement'));
const AuditLogPage = lazy(() => import('./pages/principal/AuditLog'));
const ProfilePage = lazy(() => import('./pages/shared/Profile'));

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const getNavItems = () => {
    switch (user.role) {
      case 'principal': // Headmaster
        return [
          { name: 'Principal Dashboard', icon: LayoutDashboard, path: '/principal' },
          { name: 'Students', icon: Users, path: '/principal/students' },
          { name: 'Staff', icon: UserSquare, path: '/principal/staff' },
          { name: 'Communications', icon: MessageSquare, path: '/shared/messages' },
          { name: 'Fees', icon: Wallet, path: '/shared/fees' },
          { name: 'Audit Logs', icon: ShieldCheck, path: '/principal/audit-logs' },
          { name: 'My Profile', icon: UserCircle, path: '/shared/profile' },
        ];
      case 'teacher': // Staff
        return [
          { name: 'Teacher Dashboard', icon: LayoutDashboard, path: '/teacher' },
          { name: 'Attendance', icon: ClipboardCheck, path: '/teacher/attendance' },
          { name: 'Results', icon: ClipboardCheck, path: '/teacher/results' },
          { name: 'Communications', icon: MessageSquare, path: '/shared/messages' },
          { name: 'My Profile', icon: UserCircle, path: '/shared/profile' },
        ];
      case 'parent': // Guardian
        return [
          { name: 'Parent Dashboard', icon: LayoutDashboard, path: '/parent' },
          { name: 'Messages', icon: MessageSquare, path: '/shared/messages' },
          { name: 'Fees', icon: Wallet, path: '/shared/fees' },
          { name: 'My Profile', icon: UserCircle, path: '/shared/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="bg-primary text-primary-foreground p-1 rounded">SE</div>
              <span>SchoolEase</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="py-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-md">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <Link to="/shared/profile" className="flex items-center gap-3 mb-4 hover:bg-accent p-2 rounded-lg transition-colors">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role === 'principal' ? 'Headmaster / Principal' : user.role === 'teacher' ? 'Teacher / Staff' : 'Parent / Guardian'}</span>
              </div>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { logout(); navigate('/login'); }}>
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-background overflow-auto">
          <header className="h-14 border-b flex items-center px-4 justify-between sticky top-0 bg-background/80 backdrop-blur z-10">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline-block">Welcome back, {user.name}</span>
            </div>
          </header>
          <main className="p-4 md:p-6 lg:p-8">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
              {children}
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>} />
          
          <Route path="/principal/*" element={
            <AppLayout>
              <Routes>
                <Route index element={<PrincipalDashboard />} />
                <Route path="students" element={<StudentManagement />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="audit-logs" element={<AuditLogPage />} />
                <Route path="*" element={<Navigate to="/principal" replace />} />
              </Routes>
            </AppLayout>
          } />

          <Route path="/teacher/*" element={
            <AppLayout>
              <Routes>
                <Route index element={<TeacherDashboard />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="*" element={<Navigate to="/teacher" replace />} />
              </Routes>
            </AppLayout>
          } />

          <Route path="/parent/*" element={
            <AppLayout>
              <Routes>
                <Route index element={<ParentDashboard />} />
                <Route path="*" element={<Navigate to="/parent" replace />} />
              </Routes>
            </AppLayout>
          } />

          <Route path="/shared/*" element={
            <AppLayout>
              <Routes>
                <Route path="messages" element={<CommunicationHub />} />
                <Route path="fees" element={<FeesManagement />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          } />

          <Route path="/" element={<RootRedirect />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AppProvider>
  );
}

const RootRedirect = () => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'principal') return <Navigate to="/principal" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
  if (user.role === 'parent') return <Navigate to="/parent" replace />;
  return <Navigate to="/login" replace />;
};

export default App;
