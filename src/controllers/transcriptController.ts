import type { Request, Response } from "express";
import type { DbClient } from "../db/types";
import type { RequestWithUser } from "../middleware/auth";
import { buildTemporaryTranscript } from "../services/transcriptService";

export function createGetTemporaryTranscriptController(db: DbClient) {
  return async (req: RequestWithUser & Request, res: Response): Promise<void> => {
    const studentId = String(req.params.studentId ?? "");
    if (!studentId) {
      res.status(400).json({ message: "studentId is required" });
      return;
    }

    const transcript = await buildTemporaryTranscript(db, studentId);

    if (!transcript) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    // JSON output is intentionally structured so frontend can generate PDF (jsPDF or similar).
    res.status(200).json({
      generatedAt: new Date().toISOString(),
      documentType: "temporary-transcript",
      transcript,
    });
  };
}
