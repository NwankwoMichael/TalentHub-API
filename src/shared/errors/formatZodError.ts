import { z } from "zod";

export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.join(".") : "_root";

    if (!formattedErrors[field]) {
      formattedErrors[field] = [];
    }

    formattedErrors[field].push(issue.message);
  }

  return formattedErrors;
}
