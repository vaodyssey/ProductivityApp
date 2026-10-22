import { CompletionLog } from "@/models/completion-log";
import * as SQLite from "expo-sqlite";

interface CompletionLogRepository {
  /**
   * Retrieves all completion logs for a given capsule within a specified date range (a week).
   * @param capsuleId The ID of the capsule.
   * @param startDate The start date of the week (Date object or ISO string).
   * @param endDate The end date of the week (Date object or ISO string).
   * @returns Promise<CompletionLog[]> - List of logs found in the database.
   */
  getLogsForWeek(
    capsuleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CompletionLog[]>;
}

export default class CompletionLogRepositoryImpl implements CompletionLogRepository {
  db: SQLite.SQLiteDatabase;
  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }
  /**
   * Implements the complex SQL JOIN to fetch logs within a defined week.
   * @param capsuleId The ID of the capsule (e.g., CS_00001).
   * @param startDate Start Date object for filtering.
   * @param endDate End Date object for filtering.
   */
  async getLogsForWeek(
    capsuleId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CompletionLog[]> {
    // SQL Query using JOIN to link logs and capsules based on the capsule ID.
    // We use SQLite's standard parameter binding (?) for security.
    const query = `
      SELECT 
        cl.id AS logId, 
        cl.dateTime AS logDateTime, 
        cl.completed AS completedStatus, 
        c.badHabitName AS badHabitName, 
        c.imageUrl AS imageUrl 
      FROM completion_logs cl
      JOIN capsules c ON cl.capsuleId = c.id
      WHERE c.id = ? AND cl.dateTime BETWEEN ? AND ?;
    `;

    // The parameters array should map to the '?' placeholders in order:
    const params = [capsuleId, startDate.toISOString(), endDate.toISOString()];

    console.log("[DAL] Executing SQL Query:", query);

    try {
      const result = await this.db.getAllAsync<CompletionLog>(query, params);
      return result;
    } catch (e) {
      console.error("Error retrieving completion logs:", e);
      // In a real application, handle specific SQLite errors here.
      throw new Error(
        "Failed to retrieve completion logs due to a database error.",
      );
    }
  }
}
