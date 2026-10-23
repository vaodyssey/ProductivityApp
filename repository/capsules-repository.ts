import { DATABASE_NAME } from "@/constants/database";
import { Capsule } from "@/models/capsule";
import * as SQLite from "expo-sqlite";

interface ICapsulesRepository {
  create(capsule: Capsule): Promise<number>;
  readById(id: number): Promise<Capsule | null>;
  readAll(): Promise<Capsule[]>;
  update(capsule: Capsule): Promise<number>;
  delete(id: number): Promise<void>;
}

export default class CapsulesRepository implements ICapsulesRepository {
  private db: SQLite.SQLiteDatabase;
  constructor(db: SQLite.SQLiteDatabase) {
    this.db = db;
  }
  async create(capsule: Capsule): Promise<number> {
    try {
      const lastId = await this.db.runAsync(
        "INSERT INTO capsules (goodHabitName, badAppPackageName, goodImageUrl) VALUES (?, ?, ?)",
        capsule.goodHabitName,
        capsule.badAppPackageName,
        capsule.goodImageUrl,
      );
      return lastId.lastInsertRowId as number;
    } catch (e) {
      console.error("Error creating capsule:", e);
      throw new Error("Failed to create capsule due to a database error.");
    }
  }
  async readById(id: number): Promise<Capsule | null> {
    try {
      const query =
        "SELECT id, goodHabitName, badAppPackageName, goodImageUrl FROM capsules WHERE id = ?";
      const result = await this.db.getFirstAsync<Capsule>(query, id);
      return result;
    } catch (e) {
      console.error("Error reading capsule:", e);
      throw new Error("Failed to read capsule due to a database error.");
    }
  }
  async readAll(): Promise<Capsule[]> {
    try {
      const query =
        "SELECT id, goodHabitName, badAppPackageName, goodImageUrl FROM capsules ORDER BY id ASC";
      const res = await this.db.getAllAsync<Capsule>(query);
      return res;
    } catch (e) {
      console.error("Error reading all capsules:", e);
      throw new Error("Failed to read capsules due to a database error.");
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await this.db.runAsync("DELETE FROM capsules WHERE id = ?", id);
    } catch (e) {
      console.error("Error deleting capsule:", e);
      throw new Error("Failed to delete capsule due to a database error.");
    }
  }
  async update(capsule: Capsule): Promise<number> {
    try {
      if (!capsule.id) return 0;
      const result = await this.db.runAsync(
        "UPDATE capsules SET goodHabitName = ?, badAppPackageName = ?, goodImageUrl = ? WHERE id = ?",
        capsule.goodHabitName,
        capsule.badAppPackageName,
        capsule.goodImageUrl,
        capsule.id,
      );
      return result.changes;
    } catch (e) {
      console.error("Error updating capsule:", e);
      throw new Error("Failed to update capsule due to a database error.");
    }
  }
}
