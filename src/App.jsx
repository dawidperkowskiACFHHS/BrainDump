import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './lib/store';
import { UserList } from './components/UserList';
import { DocumentUpload } from './components/DocumentUpload';
import { ChatBox } from './components/ChatBox';
import { Settings } from './components/Settings';
import { Toast } from './components/ui/Toast';
import { ErrorModal } from './components/ui/ErrorModal';
import { Brain, MessageSquare, Settings as SettingsIcon, Sparkles } from 'lucide-react';

function App() {
  const { loadUsers, loadSettings } = useStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadUsers(), loadSettings()]);
      setLoading(false);
    };
    init();
  }, [loadUsers, loadSettings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center"
        >
          <div className="relative mb-6">
            <Brain className="w-20 h-20 text-blue-500 mx-auto animate-pulse" />
            <Sparkles className="w-8 h-8 text-purple-500 absolute top-0 right-1/3 animate-ping" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">BrainVault</h1>
          <p className="text-gray-400">Loading your knowledge base...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        <Header />

        <main id="main-content" className="relative pt-24 pb-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <HomePage selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
              } />
              <Route path="/chat" element={
                <ChatPage selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
              } />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Toast />
        <ErrorModal />
      </div>
    </HashRouter>
  );
}

function Header() {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
              <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-2xl font-bold gradient-text">BrainVault</span>
          </Link>
          
          <nav className="flex items-center gap-2">
            <NavLink to="/" active={location.pathname === '/'} icon={Brain} label="Brains" />
            <NavLink to="/chat" active={location.pathname === '/chat'} icon={MessageSquare} label="Chat" />
            <NavLink to="/settings" active={location.pathname === '/settings'} icon={SettingsIcon} label="Settings" />
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, active, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        active 
          ? 'bg-white/10 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

function HomePage({ selectedUser, setSelectedUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Preserve Knowledge Forever
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload documents, create digital minds, and chat with AI-powered knowledge bases
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <UserList onSelectUser={setSelectedUser} />
          </motion.div>
          
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DocumentUpload user={selectedUser} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ChatPage({ selectedUser, setSelectedUser }) {
  const { users } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <label htmlFor="user-select" className="block text-sm font-medium text-gray-400 mb-3">
            Select a brain to chat with
          </label>
          <select
            id="user-select"
            value={selectedUser?.id || ''}
            onChange={(e) => setSelectedUser(users.find(u => u.id === e.target.value))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="" className="bg-gray-900">-- Select a brain --</option>
            {users.map(user => (
              <option key={user.id} value={user.id} className="bg-gray-900">{user.name}</option>
            ))}
          </select>
        </div>

        {selectedUser ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gradient-border rounded-2xl p-1 glow"
          >
            <div className="bg-black rounded-xl p-6 h-[600px]">
              <ChatBox user={selectedUser} />
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-24">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Select a brain to start chatting</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default App;
