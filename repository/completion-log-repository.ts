import {
  CAPSULES_TABLE_NAME,
  COMPLETION_LOGS_TABLE_NAME
} from "@/constants/database";
import { CompletionLog, CompletionLogWithImage } from "@/models/completion-log";
import * as SQLite from "expo-sqlite";

interface ICompletionLogRepository {
  /**
   * Retrieves all completion logs for a given capsule within a specified date range (a week).
   * @param capsuleId The ID of the capsule.
   * @param startDate The start date of the week (Date object or ISO string).
   * @param endDate The end date of the week (Date object or ISO string).
   * @returns Promise<CompletionLog[]> - List of logs found in the database.
   */
  getByDateRange(
    capsuleId: string,
    startDate: string,
    endDate: string,
  ): Promise<CompletionLogWithImage[]>;
}

export default class CompletionLogRepository implements ICompletionLogRepository {
  private db: SQLite.SQLiteDatabase;
  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }
  /**
   * Implements the complex SQL JOIN to fetch logs within a defined week.
   * @param capsuleId The ID of the capsule (e.g., CS_00001).
   * @param startDate Start Date object for filtering.
   * @param endDate End Date object for filtering.
   */
  async getByDateRange(
    capsuleId: string,
    startDate: string,
    endDate: string,
  ): Promise<CompletionLogWithImage[]> {
    // SQL Query using JOIN to link logs and capsules based on the capsule ID.
    // We use SQLite's standard parameter binding (?) for security.
    const query = `
      SELECT 
        cl.id AS id, 
        cl.dateTime AS dateTime, 
        cl.completed AS completed, 
        c.goodHabitName AS goodHabitName, 
        c.goodImageUrl AS goodImageUrl 
      FROM ${COMPLETION_LOGS_TABLE_NAME} cl
      JOIN ${CAPSULES_TABLE_NAME} c ON cl.capsuleId = c.id
      WHERE c.id = ? AND cl.dateTime BETWEEN ? AND ?;
    `;

    // The parameters array should map to the '?' placeholders in order:
    const params = [capsuleId, startDate, endDate];

    console.log("[DAL] Executing SQL Query:", query);
    console.log("Params: ", params);

    try {
      const result = await this.db.getAllAsync<CompletionLogWithImage>(
        query,
        params,
      );

      return result.map(completedToBoolean);
    } catch (e) {
      console.error("Error retrieving completion logs:", e);
      // In a real application, handle specific SQLite errors here.
      throw new Error(
        "Failed to retrieve completion logs due to a database error.",
      );
    }
  }
  async getAll(): Promise<CompletionLog[]> {
    try {
      const query = `SELECT  
        id,  
        dateTime,
        completed,        
        capsuleId
        FROM ${COMPLETION_LOGS_TABLE_NAME} ORDER BY id ASC`;
      const res = await this.db.getAllAsync<CompletionLog>(query);
      return res;
    } catch (e) {
      console.error("Error reading all capsules:", e);
      throw new Error("Failed to read capsules due to a database error.");
    }
  }
  async bulkCreate(completionLogs: CompletionLog[]): Promise<number> {
    const placeholders = completionLogs.map(() => "(?, ?, ?, ?)").join(", ");
    const query = `
      INSERT INTO ${COMPLETION_LOGS_TABLE_NAME} (id, capsuleId, dateTime, completed)
      VALUES ${placeholders};
    `;
    // Flatten the rows into one params array in the same order as the placeholders
    const params = completionLogs.flatMap((log) => [
      log.id,
      log.capsuleId,
      log.dateTime,
      log.completed ? 1 : 0,
    ]);

    console.log("[DAL] Executing SQL Query:", query);

    try {
      const result = await this.db.runAsync(query, params);
      // lastInsertRowId is the id of the new row
      return result.lastInsertRowId;
    } catch (e) {
      console.error("Error inserting completion log:", e);
      throw new Error(
        "Failed to insert completion log due to a database error.",
      );
    }
  }

  async bulkComplete(completionLogs: CompletionLog[]): Promise<number> {
    if (completionLogs.length === 0) return 0;

    const idPlaceholders = completionLogs.map(() => "?").join(", ");
    const casePlaceholders = completionLogs
      .map(() => "WHEN id = ? THEN ?")
      .join(" ");
    const query = `
      UPDATE ${COMPLETION_LOGS_TABLE_NAME}
      SET completed = CASE ${casePlaceholders} END
      WHERE id IN (${idPlaceholders});
    `;

    // Params follow placeholder order: CASE pairs first, then the IN list
    const params = [
      ...completionLogs.flatMap((log) => [log.id, log.completed ? 1 : 0]),
      ...completionLogs.map((log) => log.id),
    ];

    console.log("[DAL] Executing SQL Query:", query);

    try {
      const result = await this.db.runAsync(query, params);
      // changes is the number of rows updated
      return result.changes;
    } catch (e) {
      console.error("Error bulk updating completion logs:", e);
      throw new Error(
        "Failed to bulk update completion logs due to a database error.",
      );
    }
  }
  async getLatestId(): Promise<string> {
    const query = `
      SELECT MAX(id) AS latestId
      FROM ${COMPLETION_LOGS_TABLE_NAME};
    `;

    console.log("[DAL] Executing SQL Query:", query);

    try {
      // MAX() on an empty table returns one row with latestId = null
      const row = await this.db.getFirstAsync<{ latestId: string | null }>(
        query,
      );
      return row?.latestId ?? "";
    } catch (e) {
      console.error("Error retrieving latest completion log id:", e);
      throw new Error(
        "Failed to retrieve latest completion log id due to a database error.",
      );
    }
  }
}

const completedToBoolean = (
  value: CompletionLogWithImage,
): CompletionLogWithImage => ({
  ...value,
  completed: Number(value.completed) === 1,
});
