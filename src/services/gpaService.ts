import type { DbClient } from "../db/types";

export interface CourseGradeRow {
  enrollment_id: string;
  course_code: string;
  course_name: string;
  credits: number;
  grade_point: number;
}

export interface GpaComputationResult {
  totalCredits: number;
  totalQualityPoints: number;
  gpa: number;
  isUnderperforming: boolean;
}

const UNDERPERFORMING_THRESHOLD = 2.0;

export async function getStudentGradeRows(db: DbClient, studentId: string): Promise<CourseGradeRow[]> {
  const sql = `
    SELECT
      e.id AS enrollment_id,
      c.code AS course_code,
      c.name AS course_name,
      c.credits,
      g.grade_point
    FROM enrollments e
    JOIN course_offerings co ON co.id = e.offering_id
    JOIN courses c ON c.id = co.course_id
    JOIN grades g ON g.enrollment_id = e.id
    WHERE e.student_id = $1
      AND e.status = 'completed'
    ORDER BY c.code;
  `;

  const result = await db.query<CourseGradeRow>(sql, [studentId]);
  return result.rows;
}

export function computeGpaFromRows(rows: CourseGradeRow[]): GpaComputationResult {
  const totalCredits = rows.reduce((sum, row) => sum + row.credits, 0);
  const totalQualityPoints = rows.reduce(
    (sum, row) => sum + row.credits * row.grade_point,
    0,
  );

  const gpa = totalCredits === 0 ? 0 : Number((totalQualityPoints / totalCredits).toFixed(2));

  return {
    totalCredits,
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    gpa,
    isUnderperforming: gpa < UNDERPERFORMING_THRESHOLD,
  };
}

export async function calculateStudentGpa(db: DbClient, studentId: string): Promise<GpaComputationResult> {
  const rows = await getStudentGradeRows(db, studentId);
  return computeGpaFromRows(rows);
}
