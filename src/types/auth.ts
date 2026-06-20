export type AppRole = "admin" | "dosen" | "mahasiswa";

export interface AuthUser {
  id: string;
  role: AppRole;
}

export interface AuthenticatedRequest {
  user: AuthUser;
  params: Record<string, string>;
  body: Record<string, unknown>;
  method: string;
}
