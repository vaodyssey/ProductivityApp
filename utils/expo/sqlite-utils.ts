import * as SQLite from "expo-sqlite";

// Configuration constant for your database name
const DB_NAME = "databaseName";
let dbInstance: SQLite.SQLiteDatabase;

/**
 * Initialize the database connection (call this once at app startup).
 * It enables WAL mode and creates the schema if it doesn't exist.
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // Enable Write-Ahead Logging for better concurrency
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // Create the table schema if it doesn't exist
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS test (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      value TEXT NOT NULL, 
      intValue INTEGER
    );
  `);

  return db;
}

/**
 * CRU - Create: Inserts a new row into the 'test' table.
 * Supports both string binding and object binding for named parameters.
 */
export async function createItem(
  value: string,
  intValue: number,
  db?: SQLite.SQLiteDatabase,
): Promise<number> {
  // If no specific DB instance is passed, assume global one exists or throw error
  if (!db) {
    // Optional: Try to get the open DB here, or require user to pass it after init()
    const tempDb = await SQLite.openDatabaseAsync(DB_NAME);
    db = tempDb;
  }

  const lastId = await db.runAsync(
    "INSERT INTO test (value, intValue) VALUES (?, ?)",
    value,
    intValue,
  );

  return lastId.lastInsertRowId as number; // Return the generated ID
}

/**
 * CRUD - Read Single: Retrieves a single row matching specific criteria.
 * Returns null if no row is found.
 */
export async function readSingleItem<T>(
  searchTerm: string,
  db?: SQLite.SQLiteDatabase,
): Promise<T | null> {
  const query = "SELECT id, value, intValue FROM test WHERE value = ?";

  const result =
    (await db?.getFirstAsync(query, searchTerm)) ||
    (await SQLite.openDatabaseAsync(DB_NAME).then((db) =>
      db.getFirstAsync(query, searchTerm),
    ));

  return result; // Returns null if empty
}

/**
 * CRUD - Read All: Retrieves all rows from the table.
 */
export async function readAllItems<T>(
  db?: SQLite.SQLiteDatabase,
): Promise<T[]> {
  const query = "SELECT id, value, intValue FROM test ORDER BY id ASC";

  // Handle undefined db instance gracefully
  if (!db) {
    return await SQLite.openDatabaseAsync(DB_NAME).then((d) =>
      d.getAllAsync(query),
    );
  }

  return db.getAllAsync(query);
}

/**
 * CRUD - Delete: Removes rows based on a value match.
 * Returns true if rows were affected, false otherwise.
 */
export async function deleteItemByValue(
  valueToDelete: string,
  db?: SQLite.SQLiteDatabase,
): Promise<void> {
  const query = "DELETE FROM test WHERE value = ?";

  if (!db) {
    await SQLite.openDatabaseAsync(DB_NAME).then((d) =>
      d.runAsync(query, valueToDelete),
    );
    return;
  }

  await db.runAsync(query, valueToDelete);
}
