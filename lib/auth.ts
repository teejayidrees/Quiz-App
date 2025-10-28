export interface AuthToken {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
  name: string;
}

export const createToken = (payload: AuthToken): string => {
  // Simple token creation (in production, use proper JWT)
  return Buffer.from(JSON.stringify(payload)).toString("base64");
};

export const decodeToken = (token: string): AuthToken | null => {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString());
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  const decoded = decodeToken(token);
  return (
    decoded !== null && decoded.id !== undefined && decoded.email !== undefined
  );
};

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getStoredAdminToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const setStoredToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const setStoredAdminToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminToken", token);
  }
};

export const clearStoredToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const clearStoredAdminToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
  }
};
