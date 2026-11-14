import bcrypt from "bcryptjs";
import { SALTROUNDS } from "../constants/constants.js";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALTROUNDS);
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, storedHash);
}
