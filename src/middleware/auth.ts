import type { NextFunction, Request, Response } from "express";
import type { AppRole } from "../types/auth";

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: AppRole;
  };
}

const roleSet = new Set<AppRole>(["admin", "dosen", "mahasiswa"]);

// Demo-only auth middleware: in production parse JWT/session and verify signature.
export function mockAuthMiddleware(req: RequestWithUser, res: Response, next: NextFunction): void {
  const userId = req.header("x-user-id");
  const roleHeader = req.header("x-role") as AppRole | undefined;

  if (!userId || !roleHeader || !roleSet.has(roleHeader)) {
    res.status(401).json({
      message: "Unauthorized. Provide x-user-id and x-role headers.",
    });
    return;
  }

  req.user = { id: userId, role: roleHeader };
  next();
}
