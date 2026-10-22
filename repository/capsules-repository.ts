import { DATABASE_NAME } from "@/constants/database";
import { Capsule } from "@/models/capsule";
import * as SQLite from "expo-sqlite";

// Global DB Instance (Optional, initialized at startup)
let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * CRUD - Create: Inserts a new Capsule entity.
 */
export async function createCapsule(
  capsule: Capsule,
  db?: SQLite.SQLiteDatabase,
): Promise<number> {
  const targetDb = db || (await ensureOpenDatabase());

  const lastId = await targetDb.runAsync(
    "INSERT INTO capsules (goodHabitName, badAppPackageName, goodImageUrl) VALUES (?, ?, ?)",
    capsule.goodHabitName,
    capsule.badAppPackageName,
    capsule.goodImageUrl,
  );

  return lastId.lastInsertRowId as number;
}

/**
 * CRUD - Read Single: Retrieves a single Capsule by goodHabitName.
 */
export async function readCapsuleById(
  id: number,
  db?: SQLite.SQLiteDatabase,
): Promise<Capsule | null> {
  const targetDb = db || (await ensureOpenDatabase());

  const query =
    "SELECT id, goodHabitName, badAppPackageName, goodImageUrl FROM capsules WHERE id = ?";

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
    "SELECT id, goodHabitName, badAppPackageName, goodImageUrl FROM capsules ORDER BY id ASC";

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
    dbInstance = initialDb;
  }
  return dbInstance;
}

export async function updateCapsule(
  capsule: Capsule,
  db?: SQLite.SQLiteDatabase,
): Promise<number> {
  const targetDb = db || (await ensureOpenDatabase());
  if (!capsule.id) return 0;
  const result = await targetDb.runAsync(
    "UPDATE capsules SET goodHabitName = ?, badAppPackageName = ?, goodImageUrl = ? WHERE id = ?",
    capsule.goodHabitName,
    capsule.badAppPackageName,
    capsule.goodImageUrl,
    capsule.id,
  );
  return result.changes;
}
