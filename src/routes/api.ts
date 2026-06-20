import { Router } from "express";
import type { DbClient } from "../db/types";
import { createInputGradeController } from "../controllers/gradeController";
import { createGetStudentAcademicSummaryController } from "../controllers/studentController";
import { createGetTemporaryTranscriptController } from "../controllers/transcriptController";
import { mockAuthMiddleware } from "../middleware/auth";
import { requireRoles } from "../middleware/rbac";
import {
  requireStudentSelfOrAdvisorReadOnly,
  requireStudentSelfReadOnly,
} from "../middleware/studentOwnership";

export function createApiRouter(db: DbClient): Router {
  const router = Router();

  router.use(mockAuthMiddleware);

  // 1) Admin-only zones
  router.use("/master", requireRoles(["admin"]));
  router.use("/pembayaran", requireRoles(["admin"]));

  router.get("/master", (_req, res) => {
    res.status(200).json({ message: "Admin master endpoint" });
  });

  router.get("/pembayaran", (_req, res) => {
    res.status(200).json({ message: "Admin pembayaran endpoint" });
  });

  // 2) Lecturer-only grade input
  router.post("/nilai/input", requireRoles(["dosen"]), createInputGradeController(db));

  // 3) Student self-only, read-only routes
  router.get(
    "/mahasiswa/:studentId/akademik",
    requireStudentSelfReadOnly("studentId"),
    createGetStudentAcademicSummaryController(db),
  );

  router.get(
    "/mahasiswa/:studentId/transkrip",
    requireStudentSelfOrAdvisorReadOnly(db, "studentId"),
    createGetTemporaryTranscriptController(db),
  );

  return router;
}
