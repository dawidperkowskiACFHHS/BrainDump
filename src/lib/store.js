import { create } from 'zustand';
import {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getSettings,
  saveSettings,
} from './db';

export const useStore = create((set, get) => ({
  users: [],
  settings: null,
  toast: null,
  error: null,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,

  loadUsers: async () => {
    const users = await getAllUsers();
    set({ users });
  },

  loadSettings: async () => {
    const settings = await getSettings();
    set({ settings });
  },

  createUser: async (name) => {
    const user = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      documents: [],
    };
    await addUser(user);
    await get().loadUsers();
    get().showToast('User created successfully', 'success');
    return user;
  },

  deleteUserById: async (id) => {
    await deleteUser(id);
    await get().loadUsers();
    get().showToast('User deleted successfully', 'success');
  },

  addDocument: async (userId, file, content) => {
    const user = await getUser(userId);
    const doc = {
      id: crypto.randomUUID(),
      filename: file.name,
      content,
      originalFile: file,
      fileType: file.type,
      uploadedAt: Date.now(),
    };
    user.documents.push(doc);
    await updateUser(user);
    await get().loadUsers();
    get().showToast('Document uploaded successfully', 'success');
  },

  deleteDocument: async (userId, docId) => {
    const user = await getUser(userId);
    user.documents = user.documents.filter((d) => d.id !== docId);
    await updateUser(user);
    await get().loadUsers();
    get().showToast('Document deleted successfully', 'success');
  },

  updateSettings: async (newSettings) => {
    await saveSettings(newSettings);
    set({ settings: newSettings });
    get().showToast('Settings saved successfully', 'success');
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  showError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  toggleDarkMode: () => {
    set({ darkMode: !get().darkMode });
  },
}));
