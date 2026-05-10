import { CAPSULE_TABLE_NAME, DATABASE_NAME } from "@/constants/database";
import { Capsule } from "@/models/Capsule";
import * as SQLite from "expo-sqlite";

// Global DB Instance (Optional, initialized at startup)
let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database connection (call this once at app startup).
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME, {
    useNewConnection: true,
  });

  // Enable Write-Ahead Logging for better concurrency
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // Create the table schema specifically for the Capsule entity
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${CAPSULE_TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      badHabitName TEXT NOT NULL, 
      appPackageName TEXT NOT NULL, 
      imageUrl TEXT NOT NULL
    );
  `);

  return db;
}

/**
 * CRUD - Create: Inserts a new Capsule entity.
 */
export async function createCapsule(
  capsule: Capsule,
  db?: SQLite.SQLiteDatabase,
): Promise<number> {
  const targetDb = db || (await ensureOpenDatabase());

  const lastId = await targetDb.runAsync(
    "INSERT INTO capsules (badHabitName, appPackageName, imageUrl) VALUES (?, ?, ?)",
    capsule.badHabitName,
    capsule.appPackageName,
    capsule.imageUrl,
  );

  return lastId.lastInsertRowId as number;
}

/**
 * CRUD - Read Single: Retrieves a single Capsule by badHabitName.
 */
export async function readCapsuleById(
  id: number,
  db?: SQLite.SQLiteDatabase,
): Promise<Capsule | null> {
  const targetDb = db || (await ensureOpenDatabase());

  const query =
    "SELECT id, badHabitName, appPackageName, imageUrl FROM capsules WHERE id = ?";

  const result = await targetDb.getFirstAsync<Capsule>(query, id);
  return result;
}

/**
 * CRUD - Read All: Retrieves all Capsules.
 */
export async function readAllCapsules(
  db?: SQLite.SQLiteDatabase,
): Promise<Capsule[]> {
  const targetDb = db || (await ensureOpenDatabase());

  const query =
    "SELECT id, badHabitName, appPackageName, imageUrl FROM capsules ORDER BY id ASC";

  const res = await targetDb.getAllAsync<Capsule>(query);
  return res;
}

/**
 * CRUD - Delete: Removes a Capsule by ID.
 */
export async function deleteCapsule(
  id: number,
  db?: SQLite.SQLiteDatabase,
): Promise<void> {
  const targetDb = db || (await ensureOpenDatabase());

  await targetDb.runAsync("DELETE FROM capsules WHERE id = ?", id);
}

/**
 * Helper to ensure the database is open.
 */
async function ensureOpenDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    const initialDb = await SQLite.openDatabaseAsync(DATABASE_NAME, {
      useNewConnection: true,
    });
    // Re-run schema creation just in case, though init() usually handles it
    try {
      await initialDb.execAsync(`PRAGMA journal_mode = WAL;`);
      await initialDb.execAsync(`
          CREATE TABLE IF NOT EXISTS capsules (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            badHabitName TEXT NOT NULL, 
            appPackageName TEXT NOT NULL, 
            imageUrl TEXT NOT NULL
          );
        `);
    } catch (e) {
      // Schema already exists, ignore error
    }
    dbInstance = initialDb;
  }
  return dbInstance;
}
