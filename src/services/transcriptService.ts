import type { DbClient } from "../db/types";
import { calculateStudentGpa } from "./gpaService";

export interface TranscriptCourseRow {
  courseCode: string;
  courseName: string;
  credits: number;
  letterGrade: string;
}

export interface TemporaryTranscript {
  studentId: string;
  studentName: string;
  nim: string;
  courses: TranscriptCourseRow[];
  totalCredits: number;
  cumulativeGpa: number;
  isUnderperforming: boolean;
}

interface StudentIdentityRow {
  student_id: string;
  student_name: string;
  nim: string;
}

interface TranscriptDbRow {
  course_code: string;
  course_name: string;
  credits: number;
  letter_grade: string | null;
}

export async function buildTemporaryTranscript(
  db: DbClient,
  studentId: string,
): Promise<TemporaryTranscript | null> {
  const studentResult = await db.query<StudentIdentityRow>(
    `
      SELECT s.user_id AS student_id, u.full_name AS student_name, s.nim
      FROM students s
      JOIN users u ON u.id = s.user_id
      WHERE s.user_id = $1
      LIMIT 1;
    `,
    [studentId],
  );

  const student = studentResult.rows[0];
  if (!student) {
    return null;
  }

  const coursesResult = await db.query<TranscriptDbRow>(
    `
      SELECT
        c.code AS course_code,
        c.name AS course_name,
        c.credits,
        g.letter_grade::text AS letter_grade
      FROM enrollments e
      JOIN course_offerings co ON co.id = e.offering_id
      JOIN courses c ON c.id = co.course_id
      LEFT JOIN grades g ON g.enrollment_id = e.id
      WHERE e.student_id = $1
        AND e.status <> 'dropped'
      ORDER BY c.code;
    `,
    [studentId],
  );

  const courses: TranscriptCourseRow[] = coursesResult.rows.map((row) => ({
    courseCode: row.course_code,
    courseName: row.course_name,
    credits: row.credits,
    letterGrade: row.letter_grade ?? "-",
  }));

  const totalCredits = courses.reduce((sum, row) => sum + row.credits, 0);
  const gpa = await calculateStudentGpa(db, studentId);

  return {
    studentId: student.student_id,
    studentName: student.student_name,
    nim: student.nim,
    courses,
    totalCredits,
    cumulativeGpa: gpa.gpa,
    isUnderperforming: gpa.isUnderperforming,
  };
}
