-- Goldenity Campus MVP - Database schema + RBAC
-- Target: PostgreSQL 14+

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'dosen', 'mahasiswa');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registration_status') THEN
    CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status') THEN
    CREATE TYPE enrollment_status AS ENUM ('enrolled', 'completed', 'dropped');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grade_letter') THEN
    CREATE TYPE grade_letter AS ENUM ('A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'E');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role app_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30),
  high_school_name VARCHAR(200),
  graduation_year INT CHECK (graduation_year >= 1980 AND graduation_year <= 2100),
  chosen_program VARCHAR(120) NOT NULL,
  status registration_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lecturers (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  nidn VARCHAR(30) NOT NULL UNIQUE,
  department VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  nim VARCHAR(30) NOT NULL UNIQUE,
  cohort_year INT NOT NULL CHECK (cohort_year >= 1980 AND cohort_year <= 2100),
  program_study VARCHAR(120) NOT NULL,
  advisor_lecturer_id UUID REFERENCES lecturers(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  credits INT NOT NULL CHECK (credits >= 1 AND credits <= 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS course_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  lecturer_id UUID NOT NULL REFERENCES lecturers(user_id) ON DELETE RESTRICT,
  semester VARCHAR(10) NOT NULL CHECK (semester IN ('ganjil', 'genap', 'antara')),
  academic_year VARCHAR(9) NOT NULL,
  class_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, semester, academic_year, class_code)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
  offering_id UUID NOT NULL REFERENCES course_offerings(id) ON DELETE RESTRICT,
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, offering_id)
);

CREATE TABLE IF NOT EXISTS grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL UNIQUE REFERENCES enrollments(id) ON DELETE CASCADE,
  numeric_score NUMERIC(5,2) NOT NULL CHECK (numeric_score >= 0 AND numeric_score <= 100),
  letter_grade grade_letter NOT NULL,
  grade_point NUMERIC(3,2) NOT NULL CHECK (grade_point >= 0 AND grade_point <= 4),
  graded_by UUID NOT NULL REFERENCES lecturers(user_id),
  graded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_gpa (
  student_id UUID PRIMARY KEY REFERENCES students(user_id) ON DELETE CASCADE,
  total_credits INT NOT NULL DEFAULT 0,
  total_quality_points NUMERIC(10,2) NOT NULL DEFAULT 0,
  gpa NUMERIC(3,2) NOT NULL DEFAULT 0,
  warning_low_gpa BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_set_updated_at ON users;
CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_grades_set_updated_at ON grades;
CREATE TRIGGER trg_grades_set_updated_at
BEFORE UPDATE ON grades
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION recompute_student_gpa(p_student_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_credits INT;
  v_total_quality_points NUMERIC(10,2);
  v_gpa NUMERIC(3,2);
BEGIN
  SELECT
    COALESCE(SUM(c.credits), 0),
    COALESCE(SUM(c.credits * g.grade_point), 0)
  INTO v_total_credits, v_total_quality_points
  FROM enrollments e
  JOIN course_offerings co ON co.id = e.offering_id
  JOIN courses c ON c.id = co.course_id
  LEFT JOIN grades g ON g.enrollment_id = e.id
  WHERE e.student_id = p_student_id
    AND e.status = 'completed'
    AND g.id IS NOT NULL;

  IF v_total_credits = 0 THEN
    v_gpa = 0;
  ELSE
    v_gpa = ROUND(v_total_quality_points / v_total_credits, 2);
  END IF;

  INSERT INTO student_gpa (student_id, total_credits, total_quality_points, gpa, warning_low_gpa, updated_at)
  VALUES (p_student_id, v_total_credits, v_total_quality_points, v_gpa, (v_gpa < 2.00), NOW())
  ON CONFLICT (student_id)
  DO UPDATE SET
    total_credits = EXCLUDED.total_credits,
    total_quality_points = EXCLUDED.total_quality_points,
    gpa = EXCLUDED.gpa,
    warning_low_gpa = EXCLUDED.warning_low_gpa,
    updated_at = NOW();
END;
$$;

CREATE OR REPLACE FUNCTION trg_recompute_student_gpa_from_grades()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_student_id UUID;
BEGIN
  SELECT e.student_id INTO v_student_id
  FROM enrollments e
  WHERE e.id = COALESCE(NEW.enrollment_id, OLD.enrollment_id);

  IF v_student_id IS NOT NULL THEN
    PERFORM recompute_student_gpa(v_student_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_grades_recompute_student_gpa ON grades;
CREATE TRIGGER trg_grades_recompute_student_gpa
AFTER INSERT OR UPDATE OR DELETE ON grades
FOR EACH ROW
EXECUTE FUNCTION trg_recompute_student_gpa_from_grades();

CREATE OR REPLACE FUNCTION trg_recompute_student_gpa_from_enrollments()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM recompute_student_gpa(COALESCE(NEW.student_id, OLD.student_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_enrollments_recompute_student_gpa ON enrollments;
CREATE TRIGGER trg_enrollments_recompute_student_gpa
AFTER INSERT OR UPDATE OR DELETE ON enrollments
FOR EACH ROW
EXECUTE FUNCTION trg_recompute_student_gpa_from_enrollments();

-- DB roles for application RBAC
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'campus_admin') THEN
    CREATE ROLE campus_admin NOINHERIT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'campus_lecturer') THEN
    CREATE ROLE campus_lecturer NOINHERIT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'campus_student') THEN
    CREATE ROLE campus_student NOINHERIT;
  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO campus_admin, campus_lecturer, campus_student;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO campus_admin;

GRANT SELECT ON users, lecturers, students, courses, course_offerings, enrollments, grades, student_gpa TO campus_lecturer;
GRANT INSERT, UPDATE ON grades TO campus_lecturer;

GRANT SELECT ON users, students, courses, course_offerings, enrollments, grades, student_gpa TO campus_student;

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_gpa ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS enrollments_admin_all ON enrollments;
CREATE POLICY enrollments_admin_all ON enrollments
FOR ALL TO campus_admin
USING (TRUE)
WITH CHECK (TRUE);

DROP POLICY IF EXISTS enrollments_lecturer_read_own_class ON enrollments;
CREATE POLICY enrollments_lecturer_read_own_class ON enrollments
FOR SELECT TO campus_lecturer
USING (
  EXISTS (
    SELECT 1
    FROM course_offerings co
    WHERE co.id = enrollments.offering_id
      AND co.lecturer_id = current_setting('app.current_user_id', true)::UUID
  )
);

DROP POLICY IF EXISTS enrollments_student_read_self ON enrollments;
CREATE POLICY enrollments_student_read_self ON enrollments
FOR SELECT TO campus_student
USING (student_id = current_setting('app.current_user_id', true)::UUID);

DROP POLICY IF EXISTS grades_admin_all ON grades;
CREATE POLICY grades_admin_all ON grades
FOR ALL TO campus_admin
USING (TRUE)
WITH CHECK (TRUE);

DROP POLICY IF EXISTS grades_lecturer_read_own_class ON grades;
CREATE POLICY grades_lecturer_read_own_class ON grades
FOR SELECT TO campus_lecturer
USING (
  EXISTS (
    SELECT 1
    FROM enrollments e
    JOIN course_offerings co ON co.id = e.offering_id
    WHERE e.id = grades.enrollment_id
      AND co.lecturer_id = current_setting('app.current_user_id', true)::UUID
  )
);

DROP POLICY IF EXISTS grades_lecturer_write_own_class ON grades;
CREATE POLICY grades_lecturer_write_own_class ON grades
FOR INSERT TO campus_lecturer
WITH CHECK (
  graded_by = current_setting('app.current_user_id', true)::UUID
  AND EXISTS (
    SELECT 1
    FROM enrollments e
    JOIN course_offerings co ON co.id = e.offering_id
    WHERE e.id = grades.enrollment_id
      AND co.lecturer_id = current_setting('app.current_user_id', true)::UUID
  )
);

DROP POLICY IF EXISTS grades_lecturer_update_own_class ON grades;
CREATE POLICY grades_lecturer_update_own_class ON grades
FOR UPDATE TO campus_lecturer
USING (
  EXISTS (
    SELECT 1
    FROM enrollments e
    JOIN course_offerings co ON co.id = e.offering_id
    WHERE e.id = grades.enrollment_id
      AND co.lecturer_id = current_setting('app.current_user_id', true)::UUID
  )
)
WITH CHECK (
  graded_by = current_setting('app.current_user_id', true)::UUID
);

DROP POLICY IF EXISTS grades_student_read_self ON grades;
CREATE POLICY grades_student_read_self ON grades
FOR SELECT TO campus_student
USING (
  EXISTS (
    SELECT 1
    FROM enrollments e
    WHERE e.id = grades.enrollment_id
      AND e.student_id = current_setting('app.current_user_id', true)::UUID
  )
);

DROP POLICY IF EXISTS gpa_admin_all ON student_gpa;
CREATE POLICY gpa_admin_all ON student_gpa
FOR ALL TO campus_admin
USING (TRUE)
WITH CHECK (TRUE);

DROP POLICY IF EXISTS gpa_student_read_self ON student_gpa;
CREATE POLICY gpa_student_read_self ON student_gpa
FOR SELECT TO campus_student
USING (student_id = current_setting('app.current_user_id', true)::UUID);

DROP POLICY IF EXISTS gpa_lecturer_read_advisee ON student_gpa;
CREATE POLICY gpa_lecturer_read_advisee ON student_gpa
FOR SELECT TO campus_lecturer
USING (
  EXISTS (
    SELECT 1
    FROM students s
    WHERE s.user_id = student_gpa.student_id
      AND s.advisor_lecturer_id = current_setting('app.current_user_id', true)::UUID
  )
);

CREATE OR REPLACE FUNCTION set_app_context(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('app.current_user_id', p_user_id::TEXT, true);
END;
$$;
