import { attendanceRecords, type Attendance, type InsertAttendance } from "@shared/schema";

export interface IStorage {
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceByEmployeeId(employeeId: string): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  getAllAttendance(): Promise<Attendance[]>;
}

export class MemStorage implements IStorage {
  private attendance: Map<number, Attendance>;
  currentId: number;

  constructor() {
    this.attendance = new Map();
    this.currentId = 1;
  }

  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendance.get(id);
  }

  async getAttendanceByEmployeeId(employeeId: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(
      (record) => record.employeeId === employeeId,
    );
  }

  async getAllAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.currentId++;
    const attendance: Attendance = { ...insertAttendance, id };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const existing = this.attendance.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...attendance };
    this.attendance.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
