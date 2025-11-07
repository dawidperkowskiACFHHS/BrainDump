import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Trash2, FileText, Search, Plus, Brain } from 'lucide-react';

export function UserList({ onSelectUser }) {
  const { users, createUser, deleteUserById } = useStore();
  const [newUserName, setNewUserName] = useState('');
  const [search, setSearch] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    await createUser(newUserName.trim());
    setNewUserName('');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="gradient-border rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-500" />
          Digital Brains
        </h2>
        
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter name (e.g., Jillian)"
            aria-label="New brain name"
          />
          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Brain
          </Button>
        </form>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-4 w-5 h-5 text-gray-500" aria-hidden="true" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brains..."
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-label="Search brains"
        />
      </div>

      <div className="space-y-3" role="list" aria-label="Brain list">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No brains found</p>
          </div>
        ) : (
          filteredUsers.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              role="listitem"
              className="group relative bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer"
              onClick={() => onSelectUser(user)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    {user.documents.length} document{user.documents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUserById(user.id);
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                  aria-label={`Delete ${user.name}`}
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
