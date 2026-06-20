import type { NextFunction, Response } from "express";
import type { RequestWithUser } from "./auth";
import type { DbClient } from "../db/types";

// Enforces: /api/mahasiswa/* is read-only and only for the student owner.
export function requireStudentSelfReadOnly(paramKey = "studentId") {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (req.user.role !== "mahasiswa") {
      res.status(403).json({ message: "Only mahasiswa can access this route" });
      return;
    }

    if (req.method !== "GET") {
      res.status(405).json({ message: "Mahasiswa routes are read-only" });
      return;
    }

    const requestedStudentId = req.params[paramKey];
    if (!requestedStudentId || requestedStudentId !== req.user.id) {
      res.status(403).json({ message: "Can only access own resource" });
      return;
    }

    next();
  };
}

// Enforces read-only transcript access by either the student owner or their advisor lecturer.
export function requireStudentSelfOrAdvisorReadOnly(db: DbClient, paramKey = "studentId") {
  return async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (req.method !== "GET") {
      res.status(405).json({ message: "Transcript route is read-only" });
      return;
    }

    const requestedStudentId = req.params[paramKey];
    if (!requestedStudentId) {
      res.status(400).json({ message: "studentId parameter is required" });
      return;
    }

    if (req.user.role === "mahasiswa") {
      if (requestedStudentId !== req.user.id) {
        res.status(403).json({ message: "Can only access own transcript" });
        return;
      }

      next();
      return;
    }

    if (req.user.role === "dosen") {
      const result = await db.query<{ is_advisor: boolean }>(
        `
          SELECT EXISTS (
            SELECT 1
            FROM students s
            WHERE s.user_id = $1
              AND s.advisor_lecturer_id = $2
          ) AS is_advisor;
        `,
        [requestedStudentId, req.user.id],
      );

      if (result.rows[0]?.is_advisor) {
        next();
        return;
      }

      res.status(403).json({ message: "Only advisor lecturer can access this transcript" });
      return;
    }

    res.status(403).json({ message: "Forbidden" });
  };
}
