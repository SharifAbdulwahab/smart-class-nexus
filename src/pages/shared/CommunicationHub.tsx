import React, { useState } from 'react';
import { useAppContext, Message, Student, Role } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { 
  Send, 
  Image as ImageIcon, 
  User, 
  Clock, 
  CheckCheck, 
  AlertTriangle,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  ThumbsUp,
  HelpCircle,
  MessageCircle,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

const CommunicationHub: React.FC = () => {
  const { user, students, messages, setMessages, addAuditLog } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(() => {
    if (user?.role === 'parent') return user.linkedId || null;
    return students[0]?.id || null;
  });
  const [inputText, setInputText] = useState('');
  const [msgType, setMsgType] = useState<'question' | 'complaint' | 'compliment' | 'medical' | 'safety'>('question');

  const chatStudents = user?.role === 'parent' 
    ? students.filter(s => s.id === user.linkedId)
    : students;

  const filteredMessages = messages.filter(m => 
    m.studentId === selectedStudentId && 
    (activeTab === 'all' || m.type === activeTab)
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedStudentId) return;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudentId,
      senderRole: user!.role,
      text: inputText,
      timestamp: new Date().toISOString(),
      status: user?.role === 'teacher' ? 'pending' : 'approved',
      type: msgType,
      isResolved: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    if (user?.role === 'teacher') {
      toast.success('Reply submitted for Principal approval');
      addAuditLog('Message Drafted', `Teacher drafted a reply for student ID: ${selectedStudentId}`);
    } else {
      toast.success('Message sent successfully');
      addAuditLog('Message Sent', `Parent sent a message for student ID: ${selectedStudentId}`);
    }
  };

  const approveMessage = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'approved' } : m));
    toast.success('Message approved and sent to parent');
    addAuditLog('Message Approved', `Principal approved message ID: ${msgId}`);
  };

  const resolveMessage = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isResolved: true } : m));
    toast.success('Message marked as resolved');
  };

  const getMsgTypeIcon = (type: string) => {
    switch(type) {
      case 'complaint': return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'question': return <HelpCircle className="w-3 h-3 text-blue-500" />;
      case 'compliment': return <ThumbsUp className="w-3 h-3 text-green-500" />;
      case 'medical': return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      case 'safety': return <ShieldAlert className="w-3 h-3 text-red-600" />;
      default: return <MessageCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar - Student List */}
      <div className={`w-full md:w-80 flex flex-col gap-4 ${user?.role === 'parent' ? 'hidden' : 'flex'}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
        <ScrollArea className="flex-1 border rounded-lg bg-card">
          <div className="p-2 space-y-1">
            {chatStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedStudentId === student.id ? 'bg-primary/10 border-primary/20 border' : 'hover:bg-muted'}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={student.photo} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-semibold truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{student.parentName}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col min-w-0 shadow-lg">
        <CardHeader className="border-b py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={selectedStudent?.photo} />
                <AvatarFallback>{selectedStudent?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{selectedStudent?.name}</CardTitle>
                <p className="text-xs text-muted-foreground">Parent: {selectedStudent?.parentName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">{msgType.toUpperCase()}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0 relative">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 py-2 border-b bg-muted/20">
              <TabsList className="grid grid-cols-5 w-full max-w-md">
                <TabsTrigger value="all" className="text-[10px] sm:text-xs">All</TabsTrigger>
                <TabsTrigger value="question" className="text-[10px] sm:text-xs">Question</TabsTrigger>
                <TabsTrigger value="complaint" className="text-[10px] sm:text-xs">Complaint</TabsTrigger>
                <TabsTrigger value="medical" className="text-[10px] sm:text-xs">Medical</TabsTrigger>
                <TabsTrigger value="safety" className="text-[10px] sm:text-xs">Safety</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.senderRole === user?.role ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl shadow-sm ${
                      msg.senderRole === user?.role 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.senderRole === user?.role ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {msg.senderRole}
                        </span>
                        {getMsgTypeIcon(msg.type)}
                      </div>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-2 mt-2 text-[10px] ${msg.senderRole === user?.role ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.senderRole === user?.role && <CheckCheck size={12} />}
                      </div>
                    </div>

                    {user?.role === 'principal' && msg.status === 'pending' && (
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="text-[10px] h-7 bg-green-50 text-green-700 border-green-200" onClick={() => approveMessage(msg.id)}>
                          Approve & Send
                        </Button>
                        <Button size="sm" variant="outline" className="text-[10px] h-7 bg-red-50 text-red-700 border-red-200">
                          Decline
                        </Button>
                      </div>
                    )}

                    {msg.status === 'pending' && msg.senderRole === 'teacher' && user?.role === 'teacher' && (
                      <span className="text-[10px] text-orange-600 font-medium mt-1 flex items-center gap-1">
                        <Clock size={10} /> Waiting for Principal Approval
                      </span>
                    )}
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
                    <MessageSquare size={40} className="mb-4 opacity-20" />
                    <p>No messages yet in this category.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>

        <CardFooter className="border-t p-4 flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            {['question', 'complaint', 'compliment', 'medical', 'safety'].map(type => (
              <Button 
                key={type} 
                variant={msgType === type ? 'default' : 'outline'}
                size="sm" 
                className="text-[10px] capitalize h-7 rounded-full"
                onClick={() => setMsgType(type as any)}
              >
                {type}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" size="icon" className="shrink-0">
              <ImageIcon size={18} />
            </Button>
            <Input 
              placeholder={user?.role === 'teacher' ? "Draft a reply for Principal review..." : "Type your message..."}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button className="shrink-0 gap-2" onClick={handleSendMessage}>
              <span className="hidden sm:inline">{user?.role === 'teacher' ? 'Draft' : 'Send'}</span>
              <Send size={18} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CommunicationHub;
