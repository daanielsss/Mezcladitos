 import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { app } from 'electron';

export async function getDB() {
  const dbPath = path.join(app.getPath('userData'), 'mezcladitos.db');

  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}
