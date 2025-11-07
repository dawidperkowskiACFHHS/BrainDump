import { openDB } from 'idb';

const DB_NAME = 'knowledge-transfer-db';
const DB_VERSION = 1;

let dbInstance = null;

export async function initDB() {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
  
  return dbInstance;
}

export async function getAllUsers() {
  const db = await initDB();
  return db.getAll('users');
}

export async function getUser(id) {
  const db = await initDB();
  return db.get('users', id);
}

export async function addUser(user) {
  const db = await initDB();
  return db.add('users', user);
}

export async function updateUser(user) {
  const db = await initDB();
  return db.put('users', user);
}

export async function deleteUser(id) {
  const db = await initDB();
  return db.delete('users', id);
}

export async function getSettings() {
  const db = await initDB();
  const settings = await db.get('settings', 'config');
  return settings?.value || {
    apiEndpoint: '',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000
  };
}

export async function saveSettings(settings) {
  const db = await initDB();
  return db.put('settings', { key: 'config', value: settings });
}

export async function exportData() {
  const db = await initDB();
  const users = await db.getAll('users');
  const settings = await db.get('settings', 'config');
  return { users, settings: settings?.value };
}

export async function importData(data) {
  const db = await initDB();
  const tx = db.transaction(['users', 'settings'], 'readwrite');
  
  await tx.objectStore('users').clear();
  for (const user of data.users || []) {
    await tx.objectStore('users').add(user);
  }
  
  if (data.settings) {
    await tx.objectStore('settings').put({ key: 'config', value: data.settings });
  }
  
  await tx.done;
}
