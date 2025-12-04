import { DANGEROUS_PATTERNS } from "./commands/blacklist";

const normalize = (s: string) => {
  return s
    .replace(/[\u00A0\u200B\u200C\u200D]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export function isCommandSafe(cmd: string): boolean {
  const clean = normalize(cmd);

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(clean)) return false;
  }

  return true;
}
