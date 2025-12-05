export const DANGEROUS_PATTERNS: RegExp[] = [
  /\brm\b[\s\\'"`]*-[rR]+[fF]+/,

  /\brm\b.*\b\/(bin|boot|dev|etc|lib|lib64|proc|root|run|sbin|sys|usr|var)\b/,

  /\brm\b.*\b\/\s*$/,

  /\bshutdown\b/,
  /\breboot\b/,

  /\bdd\b.*(\/dev\/sda|\/dev\/nvme|\/dev\/mmcblk)/,

  /\bmkfs\./,

  /\bmount\b/,
  /\bumount\b/,

  /\biptables\b/,
  /\bufw\b/,

  /\bchmod\b.*\b777\b/,
  /\bchown\b.*\broot\b/,

  /\bkill\b\s+-9\s+1/,

  // fork bomb
  /:\(\)\s*\{\s*:\s*\|\s*:\s*;\s*\};/,

  // redirecionamento de destruição: > /etc/passwd
  />\s*\/etc\/\w+/,

  // tentativa de sobrescrever arquivos críticos
  /\b(>|>>)\s*\/(etc|boot|root|var|usr)\//,

  // scripts binários perigosos
  /\bwget\b.*\|\s*sh\b/,
  /\bcurl\b.*\|\s*sh\b/,
];
