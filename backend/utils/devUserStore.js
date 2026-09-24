import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const STORE_PATH = path.join(DATA_DIR, 'dev_users.json');

const ensureDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

export const loadDevUsers = () => {
  try {
    ensureDir();
    if (!fs.existsSync(STORE_PATH)) return [];
    const data = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.warn('[DevUserStore] Error reading dev users:', err.message);
    return [];
  }
};

export const saveDevUser = (userData) => {
  try {
    ensureDir();
    const users = loadDevUsers();
    const idx = users.findIndex(
      (u) => u.superheroName?.toLowerCase() === userData.superheroName?.toLowerCase()
    );
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...userData, updatedAt: new Date().toISOString() };
    } else {
      users.push({ ...userData, createdAt: new Date().toISOString() });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.warn('[DevUserStore] Error saving dev user:', err.message);
  }
};
