import dotenv from "dotenv";
import type { StringValue } from "ms";

dotenv.config();

function checkEnvVariables(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing env variable for ${key}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5005),

  isProduction: (process.env.NODE_ENV ?? "development") === "production",

  nodeEnv: checkEnvVariables("NODE_ENV"),

  logLevel: checkEnvVariables("LOG_LEVEL"),

  databaseUrl: checkEnvVariables("DATABASE_URL"),

  jwtAccessSecret: checkEnvVariables("JWT_ACCESS_SECRET"),

  jwtAccessExpiresIn: checkEnvVariables("JWT_EXPIRES_IN") as StringValue,
} as const;
