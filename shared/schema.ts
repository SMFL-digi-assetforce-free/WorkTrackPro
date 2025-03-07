import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  clockIn: timestamp("clock_in").notNull(),
  clockOut: timestamp("clock_out"),
  isPresent: boolean("is_present").notNull().default(true),
});

export const insertAttendanceSchema = createInsertSchema(attendanceRecords)
  .pick({
    employeeId: true,
    clockIn: true,
    clockOut: true,
    isPresent: true,
  });

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendanceRecords.$inferSelect;
