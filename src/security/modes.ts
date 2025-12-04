export type ExecMode = "safe" | "power" | "root";

const SAFE_FORBIDDEN = [
  /\brestart\b/,
  /\bsystemctl\b\s+restart/,
  /\bdocker\b\s+(stop|start|restart)/,
  /\bkill\b/,
];

const POWER_FORBIDDEN = [/\bdd\b/, /\bmkfs\b/, /\brm\b.*\b-rf\b/];

export function isAllowedByMode(cmd: string, mode: ExecMode): boolean {
  if (mode === "root") return true;

  const patterns = mode === "safe" ? SAFE_FORBIDDEN : POWER_FORBIDDEN;

  for (const p of patterns) {
    if (p.test(cmd)) {
      return false;
    }
  }

  return true;
}
