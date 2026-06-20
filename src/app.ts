import express from "express";
import type { DbClient } from "./db/types";
import { createApiRouter } from "./routes/api";

interface PublicMabaRegistration {
  id: string;
  registrationNumber: string;
  fullName: string;
  schoolOrigin: string;
  studyProgram: string;
  certificateFileName?: string;
  status?: string;
  pipelineStatus?: string;
  statusPembayaran?: string;
  sudahBayar?: boolean;
  nim?: string | null;
  createdAt?: string;
}

const publicMabaRegistrations: PublicMabaRegistration[] = [];

export function createApp(db: DbClient) {
  const app = express();

  app.use(express.json());

  // Public demo endpoints (no auth) so registration/tracking can sync across browser sessions.
  app.get("/api/public/maba-registrations", (_req, res) => {
    res.status(200).json({ data: publicMabaRegistrations });
  });

  app.post("/api/public/maba-registrations", (req, res) => {
    const body = req.body as Partial<PublicMabaRegistration>;
    const normalizedId = String(body.id ?? "").trim();
    const normalizedRegistrationNumber = String(body.registrationNumber ?? "").trim();

    if (!normalizedId || !normalizedRegistrationNumber) {
      res.status(400).json({ message: "id and registrationNumber are required" });
      return;
    }

    const normalizedRecord: PublicMabaRegistration = {
      id: normalizedId,
      registrationNumber: normalizedRegistrationNumber,
      fullName: String(body.fullName ?? "Mahasiswa Baru"),
      schoolOrigin: String(body.schoolOrigin ?? "-"),
      studyProgram: String(body.studyProgram ?? "-"),
      certificateFileName: body.certificateFileName,
      status: body.status ?? "Menunggu Verifikasi",
      pipelineStatus: body.pipelineStatus ?? "pending",
      statusPembayaran: body.statusPembayaran,
      sudahBayar: body.sudahBayar ?? false,
      nim: body.nim ?? null,
      createdAt: body.createdAt ?? new Date().toISOString(),
    };

    const existingIndex = publicMabaRegistrations.findIndex((item) => item.id === normalizedRecord.id);
    if (existingIndex >= 0) {
      publicMabaRegistrations[existingIndex] = {
        ...publicMabaRegistrations[existingIndex],
        ...normalizedRecord,
      };
    } else {
      publicMabaRegistrations.push(normalizedRecord);
    }

    res.status(201).json({ data: normalizedRecord });
  });

  app.use("/api", createApiRouter(db));

  return app;
}
