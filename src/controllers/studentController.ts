import type { Request, Response } from "express";
import type { DbClient } from "../db/types";
import type { RequestWithUser } from "../middleware/auth";
import { calculateStudentGpa, getStudentGradeRows } from "../services/gpaService";

export function createGetStudentAcademicSummaryController(db: DbClient) {
  return async (req: RequestWithUser & Request, res: Response): Promise<void> => {
    const studentId = String(req.params.studentId ?? "");

    if (!studentId) {
      res.status(400).json({ message: "studentId is required" });
      return;
    }

    const [gradeRows, gpa] = await Promise.all([
      getStudentGradeRows(db, studentId),
      calculateStudentGpa(db, studentId),
    ]);

    res.status(200).json({
      studentId,
      grades: gradeRows,
      gpa,
    });
  };
}
