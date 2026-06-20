import type { NextFunction, Response } from "express";
import type { AppRole } from "../types/auth";
import type { RequestWithUser } from "./auth";

export function requireRoles(allowedRoles: AppRole[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
}
