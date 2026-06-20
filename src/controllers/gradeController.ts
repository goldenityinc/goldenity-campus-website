import type { Request, Response } from "express";
import type { DbClient } from "../db/types";
import type { RequestWithUser } from "../middleware/auth";

interface InputGradeBody {
  enrollmentId: string;
  numericScore: number;
  letterGrade: "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D" | "E";
  gradePoint: number;
}

export function createInputGradeController(db: DbClient) {
  return async (req: RequestWithUser & Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const body = req.body as InputGradeBody;
    const sql = `
      INSERT INTO grades (enrollment_id, numeric_score, letter_grade, grade_point, graded_by)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (enrollment_id)
      DO UPDATE SET
        numeric_score = EXCLUDED.numeric_score,
        letter_grade = EXCLUDED.letter_grade,
        grade_point = EXCLUDED.grade_point,
        graded_by = EXCLUDED.graded_by,
        graded_at = NOW()
      RETURNING id;
    `;

    await db.query(sql, [
      body.enrollmentId,
      body.numericScore,
      body.letterGrade,
      body.gradePoint,
      req.user.id,
    ]);

    // DB trigger in schema.sql will recompute student GPA automatically.
    res.status(200).json({ message: "Grade saved" });
  };
}
