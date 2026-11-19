import crypto from "node:crypto";

export function generateSlug(name: string): string {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(new RegExp("[^a-z0-9]+", "g"), "-")
    .replace(new RegExp("^-+|-+$", "g"), "");

  const suffix = crypto.randomBytes(2).toString("hex");
  return `${baseSlug}-${suffix}`;
}
