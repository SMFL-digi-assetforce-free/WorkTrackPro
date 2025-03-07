import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAttendanceSchema } from "@shared/schema";
import AppurtenanceService from "./appurtenanceInformation";

export function registerRoutes(app: Express) {
  app.get("/api/attendance", async (_req, res) => {
    const records = await storage.getAllAttendance();
    res.json(records);
  });

  app.post("/api/attendance/clock-in", async (req, res) => {
    const result = insertAttendanceSchema.safeParse({
      employeeId: req.body.employeeId,
      clockIn: new Date(),
      isPresent: true
    });

    if (!result.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const clockInService = new AppurtenanceService("In", req.body.employeeId, req.body.token);
    const clockInResult = await clockInService.recordClock();
    const record = await storage.createAttendance(result.data);
    res.json(record);
  });

  app.post("/api/attendance/clock-out/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const record = await storage.updateAttendance(id, {
      clockOut: new Date()
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    const employeeId = id === 1? "user1" : "user2";
    const clockInService = new AppurtenanceService("Out", employeeId, req.body.token);
    const clockInResult = await clockInService.recordClock();
    res.json(record);
  });

  app.get("/api/attendance/:employeeId", async (req, res) => {
    const records = await storage.getAttendanceByEmployeeId(req.params.employeeId);
    res.json(records);
  });

  return createServer(app);
}
