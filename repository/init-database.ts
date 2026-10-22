import {
  CAPSULES_TABLE_NAME,
  COMPLETION_LOGS_TABLE_NAME,
} from "@/constants/database";
import * as SQLite from "expo-sqlite";

/**
 * Initialize the database connection (call this once at app startup).
 */
export async function initDatabaseIfApplicable(db: SQLite.SQLiteDatabase) {
  // Enable Write-Ahead Logging for better concurrency
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // Create the table schema specifically for the Capsule entity
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ${CAPSULES_TABLE_NAME} (
      id STRING PRIMARY KEY, 
      goodHabitName TEXT NOT NULL, 
      badAppPackageName TEXT NOT NULL, 
      goodImageUrl TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ${COMPLETION_LOGS_TABLE_NAME} (
      id STRING PRIMARY KEY, 
      dateTime TEXT NOT NULL, 
      completed TEXT NOT NULL, 
      capsuleId TEXT NOT NULL
    );
  `);
}
