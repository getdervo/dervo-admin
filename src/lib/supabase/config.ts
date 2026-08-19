export const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

/** Names of the required variables that are missing, in order. */
export function missingEnv() {
  return REQUIRED_ENV.filter((name) => !process.env[name]);
}

export function isConfigured() {
  return missingEnv().length === 0;
}
