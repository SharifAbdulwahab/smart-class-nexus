import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'principal' | 'teacher' | 'parent';

export interface MedicalData {
  bloodGroup: string;
  illnesses: string;
  allergies: string;
  disabilities: string;
  emergencyContact: string;
  hospital: string;
}

export interface Student {
  id: string;
  name: string;
  gender: 'M' | 'F';
  address: string;
  dob: string;
  photo: string;
  parentName: string;
  parentWhatsApp: string;
  parentEmail: string;
  medicalData: MedicalData;
}

export interface Staff {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  qualification: string;
  subject: string;
  dateJoined: string;
  salary: number;
  subjectsOfInterest?: string[];
}

export interface Attendance {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Result {
  id: string;
  studentId: string;
  subject: string;
  testScore: number;
  examScore: number;
  total: number;
  grade: string;
  position: number;
  teacherSignature?: string;
  principalSignature?: string;
  principalRemark?: string;
  status: 'draft' | 'submitted' | 'approved';
}

export interface Message {
  id: string;
  studentId: string;
  senderRole: Role;
  text: string;
  timestamp: string;
  image?: string;
  status: 'pending' | 'approved';
  type: 'complaint' | 'question' | 'compliment' | 'medical' | 'safety';
  isResolved: boolean;
  replyToId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  linkedId?: string; // staffId for teacher, studentId for parent
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  attendance: Attendance[];
  setAttendance: React.Dispatch<React.SetStateAction<Attendance[]>>;
  results: Result[];
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('school_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : [
      {
        id: 'std1',
        name: 'Ahmed Musa',
        gender: 'M',
        address: '123 School Lane, Lagos',
        dob: '2015-05-15',
        photo: 'https://images.unsplash.com/photo-1544717297-fa15739a5447?w=400&h=400&fit=crop',
        parentName: 'Musa Ibrahim',
        parentWhatsApp: '+2348012345678',
        parentEmail: 'musa.ib@example.com',
        medicalData: {
          bloodGroup: 'O+',
          illnesses: 'None',
          allergies: 'Peanuts',
          disabilities: 'None',
          emergencyContact: '+2348098765432',
          hospital: 'City General'
        }
      },
      {
        id: 'std2',
        name: 'Fatima Yusuf',
        gender: 'F',
        address: '45 Green Garden, Lagos',
        dob: '2016-08-20',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        parentName: 'Yusuf Bello',
        parentWhatsApp: '+2348022223333',
        parentEmail: 'yusuf.b@example.com',
        medicalData: {
          bloodGroup: 'A+',
          illnesses: 'Asthma',
          allergies: 'Dust',
          disabilities: 'None',
          emergencyContact: '+2348033334444',
          hospital: 'Lagos Care'
        }
      }
    ];
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('school_staff');
    return saved ? JSON.parse(saved) : [
      {
        id: 'stf1',
        name: 'Sarah Adebayo',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        phone: '+2348055556666',
        email: 'sarah.a@school.com',
        qualification: 'M.Ed in Science',
        subject: 'Mathematics',
        dateJoined: '2020-01-10',
        salary: 150000,
        subjectsOfInterest: ['Quantum Physics', 'AI in Education']
      }
    ];
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('school_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [results, setResults] = useState<Result[]>(() => {
    const saved = localStorage.getItem('school_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('school_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('school_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('school_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('school_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('school_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('school_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('school_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (action: string, details: string) => {
    if (!user) return;
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      action,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      students, setStudents,
      staff, setStaff,
      attendance, setAttendance,
      results, setResults,
      messages, setMessages,
      auditLogs, addAuditLog,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
