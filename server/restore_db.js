/**
 * Restore script — restores the database from JSON backup files in db_backup/
 * Usage: node restore_db.js
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function restore() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for restoring backup…');

    const db = mongoose.connection.db;

    const usersPath = path.join(__dirname, 'db_backup', 'users.json');
    const appsPath = path.join(__dirname, 'db_backup', 'applications.json');

    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      await db.collection('users').deleteMany({});
      if (users.length > 0) {
        await db.collection('users').insertMany(users);
        console.log(`✅ Restored ${users.length} users into 'users' collection.`);
      }
    }

    if (fs.existsSync(appsPath)) {
      const apps = JSON.parse(fs.readFileSync(appsPath, 'utf8'));
      await db.collection('applications').deleteMany({});
      if (apps.length > 0) {
        await db.collection('applications').insertMany(apps);
        console.log(`✅ Restored ${apps.length} applications into 'applications' collection.`);
      }
    }

    console.log('🎉 Database restored successfully from backup.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Restore error:', err.message);
    process.exit(1);
  }
}

restore();
